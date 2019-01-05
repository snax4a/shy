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
  throw new UserError('Not the correct password.', 'password', 403);
}

function userPasswordMismatchError() {
  throw new UserError('Passwords must match.', 'passwordNew', 403);
}

function userEmailTakenError() {
  throw new UserError('Email address already in use', 'email', 403);
}

function userGoogleChangeError() {
  throw new UserError('Please visit https://myaccount.google.com/security if you forgot your password.', 'email', 403);
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
    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const defaultDigest = 'sha256';
    // TODO: remove Buffer.from(salt, 'base64') then reset all passwords
    crypto.pbkdf2(password, Buffer.from(salt, 'base64'), defaultIterations, defaultKeyLength, defaultDigest, (err, key) => {
      if(err) {
        reject('Error encrypting password');
      }
      resolve(key.toString('base64'));
    });
  });
}

// Gets list of users with balances using filter (teacher or admin-only)
export async function index(req, res) {
  const sql = `
    SELECT _id,
      INITCAP("lastName") AS "lastName",
      INITCAP("firstName") AS "firstName",
      email,
      "optOut",
      phone,
      role,
      provider,
      (COALESCE(purchase.purchases, 0) - COALESCE(attendance.attendances, 0))::int AS balance
    FROM "Users" "user" LEFT OUTER JOIN
      (SELECT "Purchases"."UserId", SUM("Purchases".quantity) AS purchases FROM "Purchases" GROUP BY "Purchases"."UserId") purchase
      ON "user"._id = purchase."UserId"
      LEFT OUTER JOIN
        (SELECT "Attendances"."UserId", COUNT("Attendances"._id) AS attendances FROM "Attendances" GROUP BY "Attendances"."UserId") attendance
        ON "user"._id = attendance."UserId"
    WHERE "user"."firstName" ILIKE $1 || '%' OR "user"."lastName" ILIKE $1 || '%' OR "user"."email" ILIKE $1 || '%'
    ORDER BY "user"."lastName", "user"."firstName";`;
  const { rows } = await db.query(sql, [req.query.filter]);
  return res.status(200).send(rows);
}

// Gets attributes for logged-in user
export async function me(req, res) {
  const { _id } = req.user;
  const sql = `
    SELECT _id, "firstName", "lastName", email, role, phone,
      "optOut", provider
    FROM "Users"
    WHERE _id = $1;`;
  const { rows } = await db.query(sql, [_id]);
  if(rows.length === 0) userMissingError();
  return res.status(200).send(rows[0]);
}

// Creates new user and logs them in (using Google provider takes different path)
export async function create(req, res) {
  const { firstName, lastName, email, phone, optOut, passwordNew, passwordConfirm } = req.body;

  // Should work even if both are undefined
  if(passwordNew !== passwordConfirm) userPasswordMismatchError();

  // Generate salt and encrypt supplied password
  const salt = await generateRandomBytes(16);
  const encryptedPassword = await encryptPassword(passwordNew, salt);

  // If someone with the same email exists, global error handler will take it
  const sql = `
    INSERT INTO "Users"
      ("firstName", "lastName", email, phone, "optOut", salt, password, provider, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'local', 'student') RETURNING _id;`;
  const { rows } = await db.query(sql, [firstName, lastName, email, phone, optOut, salt, encryptedPassword]);
  const _id = rows[0]._id;
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
    htmlContent
  };
  await mail.send(message);

  // Tell the user new password was sent
  return res.status(200).send('New password sent.');
}

// Updates attributes for authenticated user (Profile page)
export async function update(req, res) {
  const { _id } = req.user; // limit the update to this _id as current user may not be an admin
  const { email, firstName, lastName, phone, optOut, password, passwordNew, passwordConfirm } = req.body;

  // Check for match when changing passwords (ignore when both are undefined)
  if(passwordNew !== passwordConfirm) throw new UserError('Passwords must match.', 'passwordNew');

  // Check if user exists
  let sql = 'SELECT password, salt, provider FROM "Users" WHERE _id = $1;';
  const { rows } = await db.query(sql, [_id]);

  // Check to see if user exists
  if(rows.length === 0) userMissingError();

  // Get salt and provider
  const { salt, provider } = rows[0];
  const encryptedStoredPassword = rows[0].password;

  // Start with a limited set of parameters for the update (add as needed)
  let arrParams = [_id, firstName, lastName, phone, optOut];
  let sqlEmailUpdate = '';
  let sqlPasswordUpdate = '';

  // Users with local providers can change email and password
  if(provider === 'local') {
    // Password provided matches the stored one?
    const encryptedProvidedPassword = await encryptPassword(password, salt);
    if(encryptedProvidedPassword !== encryptedStoredPassword) userUnauthorizedError();

    // Enable change to email address
    arrParams.push(email);
    sqlEmailUpdate = ', email = $6';

    // New password was provided (already checked against passwordConfirm above)
    if(passwordNew) {
      const newSalt = await generateRandomBytes(16); // regenerate - never reuse
      const newEncryptedPassword = await encryptPassword(passwordNew, newSalt);
      arrParams.push(newEncryptedPassword);
      arrParams.push(newSalt);
      sqlPasswordUpdate = ', password = $7, salt = $8';
    }
  }

  sql = `UPDATE "Users" SET "firstName" = $2, "lastName" = $3, phone = $4, "optOut" = $5${sqlEmailUpdate}${sqlPasswordUpdate} WHERE _id = $1;`;

  try {
    await db.query(sql, arrParams);
    return res.status(200).send({ _id });
  } catch(err) {
    if(err.constraint === 'Users_email_key') userEmailTakenError();
    console.error('Unanticipated error', err);
    throw err;
  }
}

// Updates or creates user (teachers or admins)
export async function upsert(req, res) {
  const { _id, email, firstName, lastName, phone, optOut, provider, role, passwordConfirm } = req.body;
  let passwordNew = req.body.passwordNew; // variable as we may have to override

  // Check for match when changing passwords (ignore when both are undefined)
  if(passwordNew !== passwordConfirm) userPasswordMismatchError();

  let arrParams = [email, firstName, lastName, phone, optOut, provider, role];
  let sql;
  let sqlPasswordUpdate = ' WHERE _id = $8'; // default when NOT changing password
  const isNew = _id === 0;

  // If teacher/admin did not create a password, generate a random one automatically
  if(isNew && !passwordNew) passwordNew = await generateRandomBytes(16);

  // If new password, generate salt and encrypted password and add params to array
  if(passwordNew) {
    const newSalt = await generateRandomBytes(16); // regenerate - never reuse
    const newEncryptedPassword = await encryptPassword(passwordNew, newSalt);
    arrParams.push(newSalt);
    arrParams.push(newEncryptedPassword);
    sqlPasswordUpdate = ', salt = $8, password = $9 WHERE _id = $10';
  }

  if(isNew) {
    sql = `INSERT INTO "Users"
      (email, "firstName", "lastName", phone, "optOut", provider, role, salt, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING _id, email, "firstName", "lastName", phone, "optOut", provider, role;`;
  } else {
    arrParams.push(_id);
    sql = `
      UPDATE "Users"
      SET email = $1, "firstName" = $2, "lastName" = $3, phone = $4, "optOut" = $5, provider = $6, role = $7${sqlPasswordUpdate}
      RETURNING _id, email, "firstName", "lastName", phone, "optOut", provider, role;`;
  }

  try {
    const { rows } = await db.query(sql, arrParams);
    return res.status(200).send(rows[0]);
  } catch(err) {
    if(err.constraint === 'Users_email_key') userEmailTakenError();
    console.error('Unanticipated error', err);
    throw err;
  }
}

// Deletes user (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM "Users" WHERE _id = $1;';
  await db.query(sql, [_id]);
  return res.status(204).send({ message: `User ${_id} deleted.`});
}

// Called by order.controller.js and message.controller.js
export async function contactUpsert(user, overrideName) {
  // OverrideName == true replaces existing first and last name
  const overrideNameSql = overrideName ? '"firstName" = $2, "lastName" = $3, ' : '';
  const overridePhoneSql = user.phone ? 'phone = $4, ' : '';
  const sql = `INSERT INTO "Users"
  (email, "firstName", "lastName", phone, "optOut")
  VALUES ($1, $2, $3, $4, $5)
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
  // Send response before database and email operations
  res.status(200).send('Thanks for subscribing to our newsletter.');

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
  return true;
}

// Upsert subscriber to opt out (unsubscribe)
export async function unsubscribe(req, res) {
  // Send response before database and email operations
  res.status(200).send(`Unsubscribed ${req.params.email} from the newsletter.`);

  const unsubscribeSQL = 'UPDATE "Users" SET "optOut" = true WHERE email = $1 RETURNING _id, email, "optOut";';
  await Promise.all([
    db.query(unsubscribeSQL, [req.params.email]),
    sibOptOut(req.params.email)
  ]);
  return true;
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
