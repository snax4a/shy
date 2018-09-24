'use strict';
import Sequelize from 'sequelize';
import { Attendance, Purchase } from '../../sqldb';
import config from '../../config/environment';

const sequelize = new Sequelize(config.sequelize.uri, config.sequelize.options);

// Passes JSON back so that UI fields can be flagged for validation issues
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
}

export function attendees(req, res) {
  console.log(req.query);
  const sql = `
    SELECT
      "Attendances"._id,
      "Attendances"."UserId",
      "Users"."lastName" || ', ' || "Users"."firstName" AS name
    FROM
      "Attendances" INNER JOIN "Users" ON "Attendances"."UserId" = "Users"._id
    WHERE
      "Attendances".attended = :attended AND
      "Attendances".location = :location AND
      "Attendances".teacher = :teacher AND
      "Attendances"."classTitle" = :classTitle
    ORDER BY "Users"."lastName", "Users"."firstName";`;
  sequelize.query(
    sql,
    {
      replacements: req.query,
      type: sequelize.QueryTypes.SELECT
    })
    .then(attendeeList => {
      console.log(attendeeList);
      return res.status(200).json(attendeeList);
    })
    .catch(handleError(res));
}

// Get a list of history items for a particular user with a running balance
export function index(req, res, next) {
  const sql = `
    SELECT history._id,
      history."UserId",
      history.type,
      history."when",
      history.location,
      history."classTitle",
      history.teacher,
      history."paymentMethod",
      history.notes,
      history.what,
      history.quantity,
      (sum(history.quantity) OVER (PARTITION BY history."UserId" ORDER BY history."when"))::integer AS balance
    FROM (
      SELECT "Attendances"._id,
        "Attendances"."UserId",
        'A'::text AS type,
        "Attendances".attended AS when,
        "Attendances".location,
        "Attendances"."classTitle",
        "Attendances".teacher,
        NULL AS "paymentMethod",
        NULL AS notes,
        ((((('Attended '::text || "Attendances"."classTitle"::text) || ' in '::text) || "Attendances".location::text) || ' ('::text) || "Attendances".teacher::text) || ')'::text AS what,
        '-1'::integer AS quantity
      FROM "Attendances"
      WHERE "Attendances"."UserId" = :UserId
      UNION
      SELECT "Purchases"._id,
        "Purchases"."UserId",
        'P'::text AS type,
        "Purchases"."createdAt" AS "when",
        NULL AS location,
        NULL AS "classTitle",
        NULL AS teacher,
        "Purchases".method AS "paymentMethod",
        "Purchases".notes,
        'Purchased '::text || "Purchases".quantity::text || ' class pass ('::text || "Purchases".method::text || ') - '::text || "Purchases".notes::text AS what,
        "Purchases".quantity
      FROM "Purchases"
      WHERE "Purchases"."UserId" = :UserId) history
    ORDER BY history."UserId", history."when" DESC;`;
  sequelize.query(sql,
    { replacements: { UserId: `${req.params.id}` }, type: sequelize.QueryTypes.SELECT })
    .then(historyItems => res.status(200).json(historyItems))
    .catch(err => next(err));
}

// Create history item (Attendance or Purhase) for a user
export function create(req, res) {
  console.log('Create HISTORY', req.body);
  if(req.body.type == 'P') {
    let purchaseToAdd = Purchase.build(req.body);
    return purchaseToAdd.save()
      .then(purchase => res.status(200).json({ _id: purchase._id }))
      .catch(validationError(res));
  } else {
    let attendanceToAdd = Attendance.build(req.body);
    return attendanceToAdd.save()
      .then(attendance => res.status(200).json({ _id: attendance._id }))
      .catch(validationError(res));
  }
}

// Update history item based on its _id and type
export function update(req, res) {
  const model = req.body.type == 'P' ? Purchase : Attendance;
  let historyItemToUpdate = model.build(req.body);
  historyItemToUpdate.isNewRecord = false;
  return historyItemToUpdate.save()
    .then(() => res.status(200).end())
    .catch(validationError(res));
}

// Delete history item based on its _id and type
export function destroy(req, res) {
  const model = req.query.type == 'P' ? Purchase : Attendance;
  return model.destroy({ where: { _id: req.params.id } })
    .then(() => res.status(204).end())
    .catch(handleError(res));
}

// Authentication callback
export function authCallback(req, res) {
  return res.redirect('/');
}
