import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../../utils/db';
import mail from '../../utils/mail';
import { sibContactUpsert, sibOptOut } from '../../utils/sendinblue';
import config from '../../config/environment'; // secrets and email

class UserError extends Error {
  constructor(message, path, status) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = 'UserError';
    this.errors = [{message, path}];
    Error.captureStackTrace(this, this.constructor);
  }
}

function userMissingError() {
  throw new UserError('No user with that email address was found.', 'email', 404);
}

// Only use for update and upsert - logins must fire a 401
function userUnauthorizedError() {
  throw new UserError('Incorrect password', 'password', 403);
}

function userPasswordMismatchError() {
  throw new UserError('Passwords must match', 'passwordNew', 403);
}

function userEmailTakenError() {
  throw new UserError('Email address already in use', 'email', 403);
}

function userGoogleChangeError() {
  throw new UserError('Please visit https://myaccount.google.com/security if you forgot your password.', 'email', 403);
}

function userBadParameterError() {
  throw new UserError('Unrecognized parameter for deletion', 'email', 500);
}

// Promisify crypto.randomBytes()
function generateRandomBytes(bytes) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(bytes, (err, result) => {
      if(err) {
        reject('Error generating random bytes');
      }
      resolve(result.toString('base64'));
    });
  });
}

// Promisify password encryption
function encryptPassword(password, salt) {
  return new Promise((resolve, reject) => {
    if(!password || !salt) return reject('User has a null password. Use "Forgot Password" or ask an admin to fix it.');
    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const defaultDigest = 'sha256';
    crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, defaultDigest, (err, key) => {
      if(err) {
        reject('Error encrypting password');
      }
      resolve(key.toString('base64'));
    });
  });
}

// Used by passport (could be used elsewhere in this controller) - returns false or an authenticated user
export async function authenticateLocal(email, unencryptedPassword) {
  if(!unencryptedPassword || !email) return false; // Missing parameter
  const sql = 'SELECT _id, role, email, "firstName", "lastName", phone, "optOut", provider, google, password, salt FROM "Users" WHERE LOWER(email) = LOWER($1);';
  const { rows } = await db.query(sql, [email]);
  if(rows.length === 0) return false; // User not found
  const user = rows[0];
  const { password, salt } = user;
  const encryptedPassword = await encryptPassword(unencryptedPassword, salt);
  if(encryptedPassword !== password) return false; // Bad password
  Reflect.deleteProperty(user, 'password'); // Strip encrypted password
  Reflect.deleteProperty(user, 'salt'); // Strip salt
  return user;
}

// Called by server/auth/index.js
export async function googleUserFind(googleId) {
  if(!googleId) return false; // Missing parameter
  const sql = `
    SELECT _id, role, email, "firstName", "lastName", phone, "optOut", provider, google ->> 'id' AS "googleId" FROM "Users" WHERE provider = 'google' AND google ->> 'id' = $1;`;
  const { rows } = await db.query(sql, [googleId]);
  if(rows.length === 0) return false; // User not found
  const user = rows[0];
  return user;
}

// Gets list of users with balances using filter (teacher or admin-only)
export async function index(req, res) {
  const sqlForAdmins = req.user.role == 'admin' ? 'email, phone, provider, google, bio, url, "displayOrder", "imageId",' : '';
  const sql = `
    SELECT _id,
      role,
      INITCAP("lastName") AS "lastName",
      INITCAP("firstName") AS "firstName",
      "optOut",
      ${sqlForAdmins}
      (COALESCE(purchase.purchases, 0) - COALESCE(attendance.attendances, 0))::int AS balance
    FROM "Users" "user" LEFT OUTER JOIN
      (SELECT "Purchases"."UserId", SUM("Purchases".quantity) AS purchases FROM "Purchases" GROUP BY "Purchases"."UserId") purchase
      ON "user"._id = purchase."UserId"
      LEFT OUTER JOIN
        (SELECT attendances."UserId", COUNT(attendances._id) AS attendances FROM attendances GROUP BY attendances."UserId") attendance
        ON "user"._id = attendance."UserId"
    WHERE "user"."firstName" ILIKE $1 || '%' OR "user"."lastName" ILIKE $1 || '%' OR "user"."email" ILIKE $1 || '%'
    ORDER BY "user"."lastName", "user"."firstName";`;
  const { rows } = await db.query(sql, [req.query.filter]);
  return res.status(200).send(rows);
}

export async function getUser(field, fieldValue) {
  const sqlStatements = {
    _id: 'SELECT _id, role, email, "firstName", "lastName", phone, "optOut", provider, google FROM "Users" WHERE _id = $1;',
    email: 'SELECT _id, role, email, "firstName", "lastName", phone, "optOut", provider, google FROM "Users" WHERE email = $1;'
  };
  const sql = sqlStatements[field];
  if(!sql) userBadParameterError();
  const { rows } = await db.query(sql, [fieldValue]);
  return rows[0];
}

export async function getTeachers(req, res) {
  const sql = `SELECT _id, "displayOrder", "firstName", "lastName", bio, url, "imageId"
    FROM "Users" WHERE role IN ('admin', 'teacher') ORDER BY "displayOrder", "lastName", "firstName";`;
  const { rows } = await db.query(sql, []);
  return res.status(200).send(rows);
}

// Gets attributes for logged-in user
export async function me(req, res) {
  const { _id } = req.user;
  const user = await getUser('_id', _id);
  return res.status(200).send(user);
}

// Used by user.controller.js:create() and /server/auth/index.js
export async function createUser(user) {
  // Anything undefined gets treated as a NULL in parameterized query below (which is great)
  const { firstName, lastName, email, phone, optOut, passwordNew,
    passwordConfirm, role, provider, google, displayOrder, bio, url, imageId } = user;

  // Check to make sure passwordNew and Confirm match (or are both undefined)
  if(passwordNew !== passwordConfirm) userPasswordMismatchError();

  // Use passwordNew or, if undefined, generate a random 16-character password
  let unencryptedPassword = passwordNew || await generateRandomBytes(16);

  // Only convert to JSON if provider is Google and value was supplied; otherwise null
  let googleParam = google && provider == 'google' ? JSON.stringify(google) : null;

  // Generate salt and encrypt supplied password
  const salt = await generateRandomBytes(16);
  const encryptedPassword = await encryptPassword(unencryptedPassword, salt);

  // If someone with the same email exists, global error handler will take it
  const sql = `
    INSERT INTO "Users"
      ("firstName", "lastName", email, phone, "optOut", salt, password, role, provider, google, "displayOrder", bio, url, "imageId")
      VALUES ($1, $2, LOWER($3), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING _id, role, email,
      "firstName", "lastName", phone, "optOut", provider, google, "displayOrder", bio, url, "imageId";`;

  try {
    const { rows } = await db.query(sql, [firstName, lastName, email, phone, optOut, salt, encryptedPassword,
      role || 'student', provider || 'local', googleParam, displayOrder, bio, url, imageId]);
    const createdUser = rows[0];
    return createdUser;
  } catch(err) {
    if(err.constraint === 'Users_email_key') userEmailTakenError();
    console.error('Unanticipated error', err);
    throw err;
  }
}

// Creates new user and logs them in (using Google provider takes different path)
export async function create(req, res) {
  req.body.role = 'student'; // override for security
  const user = await createUser(req.body);
  const _id = user._id;
  const token = jwt.sign({ _id }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });

  // send the authentication token
  return res.status(200).send({ token });
}

// Resets password for user and emails it to them (add security question in future)
export async function forgotPassword(req, res) {
  const { email } = req.body;

  // Check whether user exists and what provider (as we can only do forgot password for local)
  let sql = 'SELECT provider FROM "Users" WHERE email = $1;';
  const { rows } = await db.query(sql, [email]);
  if(rows.length === 0) userMissingError();
  if(rows[0].provider !== 'local') userGoogleChangeError();

  // Generate a new random password and salt (could do these in parallel to speed it up)
  const newPassword = await generateRandomBytes(8);
  const salt = await generateRandomBytes(16);
  const encryptedPassword = await encryptPassword(newPassword, salt);

  // Update the user record
  sql = 'UPDATE "Users" SET password = $1, salt = $2 WHERE email = $3;';
  await db.query(sql, [encryptedPassword, salt, email]);

  // Build and send email
  const htmlContent = `Your new Schoolhouse Yoga website temporary password for ${email} is <b>${newPassword}</b>.
  Please login and change it at <a href="https://www.schoolhouseyoga.com/profile">https://www.schoolhouseyoga.com/profile</a>.`;
  const message = {
    sender: config.mail.sender,
    to: [{ email: req.body.email }],
    subject: 'Schoolhouse Yoga website login',
    tags: ['password'],
    htmlContent
  };
  await mail.send(message);

  // Tell the user new password was sent
  return res.status(200).send('New password sent.');
}

async function updateUser(user) {
  const { _id, role, email, firstName, lastName, phone, optOut, provider, google, passwordNew, passwordConfirm,
    displayOrder, bio, url, imageId } = user;

  // Start with a limited set of parameters for the update (add as needed)
  let arrParams = [_id, role, email, firstName, lastName, phone, optOut, provider, google, displayOrder, bio, url, imageId];
  let sqlPasswordUpdate = '';

  // Password can be changed if local
  if(provider === 'local' && passwordNew) {
    // Check for match when changing passwords (ignore when both are undefined)
    if(passwordNew !== passwordConfirm) throw new UserError('Passwords must match.', 'passwordNew');
    const newSalt = await generateRandomBytes(16); // regenerate - never reuse
    const newEncryptedPassword = await encryptPassword(passwordNew, newSalt);
    arrParams.push(newEncryptedPassword);
    arrParams.push(newSalt);
    sqlPasswordUpdate = ', password = $14, salt = $15';
  }

  const sql = `UPDATE "Users" SET role = $2, email = LOWER($3), "firstName" = $4, "lastName" = $5, phone = $6,
    "optOut" = $7, provider = $8, google = $9, "displayOrder" = $10, bio = $11, url = $12, "imageId" =$13${sqlPasswordUpdate}
    WHERE _id = $1
    RETURNING _id, email, role, "firstName", "lastName", phone, "optOut", provider, google, "displayOrder", bio, url, "imageId";`;

  let result;
  try {
    result = await db.query(sql, arrParams);
  } catch(err) {
    if(err.constraint === 'Users_email_key') userEmailTakenError();
    console.error('Unanticipated error', err);
    throw err;
  }

  if(result.rows.length === 0) userMissingError(); // Only happens if there's a hack attempt
  return result.rows[0];
}

// Updates attributes for authenticated user (Profile page)
export async function update(req, res) {
  // Get attributes of authenticated user
  const { _id, email, role, provider, google } = req.user;

  // If provider is 'local', authenticate or call userUnauthorizedError()
  if(provider === 'local') {
    const { password } = req.body; // Get password from profile form
    const authenticatedUser = await authenticateLocal(email, password);
    if(!authenticatedUser) userUnauthorizedError();
    Reflect.deleteProperty(req.body, 'password'); // No longer needed
  }

  // These are the attributes an authenticated user may not override
  req.body._id = _id;
  req.body.provider = provider;
  req.body.role = role;
  req.body.google = google;

  const userUpdated = await updateUser(req.body);
  return res.status(200).send(userUpdated);
}

// Updates or creates user (teachers or admins)
export async function upsert(req, res) {
  const _id = parseInt(req.params.id, 10);
  const isNew = _id === 0;
  if(req.user.role === 'teacher') {
    // Remove properties teachers cannot modify
    Reflect.deleteProperty(req.body, 'bio');
    Reflect.deleteProperty(req.body, 'displayOrder');
    Reflect.deleteProperty(req.body, 'google');
    Reflect.deleteProperty(req.body, 'imageId');
    Reflect.deleteProperty(req.body, 'passwordNew');
    Reflect.deleteProperty(req.body, 'passwordConfirm');
    Reflect.deleteProperty(req.body, 'provider');
    Reflect.deleteProperty(req.body, 'role');
    Reflect.deleteProperty(req.body, 'url');
  }

  if(isNew) {
    const createdUser = await createUser(req.body);
    return res.status(200).send(createdUser);
  }

  // From this point, it's an existing user to be updated

  // Attach the _id
  req.body._id = _id;

  if(req.user.role === 'teacher') {
    // Override teacher attempts to change restricted fields (makes updateUser() simpler)
    const existingUser = await getUser('_id', _id);
    req.body.role = existingUser.role;
    req.body.provider = existingUser.provider;
    req.body.google = existingUser.google;
  }

  // Update and return the modified user
  const userUpdated = await updateUser(req.body);
  return res.status(200).send(userUpdated);
}

// Called by destroy and integration tests
export async function destroyUser(field, fieldValue) {
  // Do it the long way to prevent SQL injection
  const sqlStatements = {
    _id: 'DELETE FROM "Users" WHERE _id = $1;',
    email: 'DELETE FROM "Users" WHERE email = $1;'
  };
  const sql = sqlStatements[field];
  if(!sql) userBadParameterError();
  await db.query(sql, [fieldValue]);
  return true;
}

// Deletes user (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  await destroyUser('_id', _id);
  return res.status(204).send({ message: `User ${_id} deleted.`});
}

// Called by order.controller.js and message.controller.js
export async function contactUpsert(user, overrideName) {
  // OverrideName == true replaces existing first and last name
  const overrideNameSql = overrideName ? '"firstName" = $2, "lastName" = $3, ' : '';
  const overridePhoneSql = user.phone ? 'phone = $4, ' : '';
  const sql = `INSERT INTO "Users"
  (email, "firstName", "lastName", phone, "optOut")
  VALUES (LOWER($1), $2, $3, $4, $5)
  ON CONFLICT (email) DO UPDATE
     SET ${overrideNameSql}${overridePhoneSql}"optOut" = $5;`;
  const sibContact = {
    email: user.email,
    updateEnabled: true,
    emailBlacklisted: user.optOut,
    attributes: {
      NAME: user.firstName,
      SURNAME: user.lastName
    }
  };
  await Promise.all([
    db.query(sql, [user.email, user.firstName, user.lastName, user.phone, user.optOut]),
    sibContactUpsert(sibContact)
  ]);
  return true;
}

// Upserts user to newsletter list then emails admins
export async function subscribe(req, res) {
  const message = {
    sender: config.mail.sender,
    to: [{ email: config.mail.admins, name: 'SHY Admins' }],
    subject: 'Subscriber from Workshops page',
    htmlContent: `Email: ${req.body.email}`,
    tags: ['subscription']
  };

  await Promise.all([
    contactUpsert({
      email: req.body.email,
      firstName: 'Student',
      lastName: null,
      phone: null,
      optOut: false
    }, false),
    mail.send(message)
  ]);

  // Can speed up the operation by moving the next line to the top
  return res.status(200).send('Thanks for subscribing to our newsletter.');
}

// Upsert subscriber to opt out (unsubscribe)
export async function unsubscribe(req, res) {
  const sql = 'UPDATE "Users" SET "optOut" = true WHERE email = $1;';
  await Promise.all([
    db.query(sql, [req.params.email]),
    sibOptOut(req.params.email)
  ]);

  return res.status(200).send(`Unsubscribed ${req.params.email} from the newsletter.`);
}

// Upsert user (including optOut attribute) to newsletter list then emails admins
export async function messageSend(req, res) {
  // Send response before the email goes out
  res.status(200).send('Thanks for submitting your question or comment. We will respond shortly.');

  const { email, firstName, lastName, optOut, question } = req.body;

  const message = {
    sender: config.mail.sender,
    to: [{ email: config.mail.admins, name: 'SHY Admins' }],
    subject: 'Question/comment from website',
    tags: ['question'],
    textContent: `Name: ${firstName} ${lastName}
Email: ${email}
    
Question/comment:
${question}
    
${(optOut ? 'Does not want to s' : 'S')}ubscribe to newsletter`
  };

  await Promise.all([
    contactUpsert(req.body, true),
    mail.send(message)
  ]);
  return true;
}

// Called by integration test
export async function roleSet(email, role) {
  const sql = 'UPDATE "Users" SET role = $2 WHERE email = $1 RETURNING _id, "firstName", "lastName", email, phone, "optOut", provider, google, provider, bio, url, "displayOrder", "imageId";';
  const { rows } = await db.query(sql, [email, role]);
  if(rows.length === 0) userMissingError();
  return rows[0];
}
