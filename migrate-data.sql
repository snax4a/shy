SET TIME ZONE 'America/New_York';

-- Next line should return zero records
INSERT INTO "Users" (email, "firstName", "lastName", "optOut", "createdAt", "updatedAt")
SELECT email, firstname, lastname, "optOut", CURRENT_DATE, CURRENT_DATE FROM old_students WHERE email NOT IN (SELECT email from "Users" WHERE email IS NOT NULL);

-- Attendances
DELETE FROM "Attendances";
INSERT INTO "Attendances" ("UserId", attended, location, "classTitle", teacher, "createdAt", "updatedAt")
SELECT
	"Users"._id AS "UserId",
	--"Users"."firstName",
	--"Users"."lastName",
	--old_students.email,
	old_attendances.class_date AS attended,
	old_locations.name AS location,
	old_classes.name AS "classTitle",
	old_instructors.lastname || ', ' || old_instructors.firstname AS teacher,
	old_attendances.class_date AS createdAt,
	old_attendances.class_date AS updatedAt
FROM old_attendances
	INNER JOIN old_instructors ON old_attendances.instructor_id = old_instructors.id
	INNER JOIN old_classes ON old_attendances.class_id = old_classes.id
	INNER JOIN old_locations on old_attendances.location_id = old_locations.id
	INNER JOIN old_students on old_attendances.student_id = old_students.id
	INNER JOIN "Users" ON old_students.email ="Users".email
ORDER BY attended;

-- Purchases
DELETE FROM "Purchases";
INSERT INTO "Purchases" ("UserId", quantity, method, notes, "createdAt", "updatedAt")
SELECT
	"Users"._id AS "UserId",
	old_purchases.quantity,
	old_payment_types.name AS method,
	'' AS notes,
	old_purchases.purchased_on AS "createdAt",
	old_purchases.purchased_on AS "updatedAt"
FROM old_purchases
	INNER JOIN old_payment_types ON old_purchases.payment_type_id = old_payment_types.id
	INNER JOIN old_students on old_purchases.student_id = old_students.id
	INNER JOIN "Users" ON old_students.email ="Users".email
ORDER BY "createdAt";
