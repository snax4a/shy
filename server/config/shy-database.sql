-- Create user if not already there
DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT -- SELECT list can stay empty for this
    FROM   pg_catalog.pg_roles
    WHERE  rolname = 'postgres')
  THEN
    CREATE ROLE postgres;
  END IF;
END
$do$;

-- Forcefully disconnect anyone
SELECT pid, pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'shy' AND pid <> pg_backend_pid();

--DROP DATABASE IF EXISTS shy;
CREATE DATABASE shy WITH 
  OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1;

COMMENT ON DATABASE shy IS 'Schoolhouse Yoga Database';

-- Connect to shy database
\connect shy

-- Support for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP FUNCTION IF EXISTS updated_at();
CREATE FUNCTION updated_at()
  RETURNS trigger
  LANGUAGE 'plpgsql'
  COST 100
  VOLATILE NOT LEAKPROOF 
AS $BODY$
BEGIN
  NEW."updatedAt" := NOW();
  RETURN NEW;
END;
$BODY$;

-- DROP TYPE IF EXISTS providers;
DO $$ BEGIN
  CREATE TYPE providers AS ENUM
    ('google', 'local');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- DROP TYPE IF EXISTS roles;
DO $$ BEGIN
  CREATE TYPE roles AS ENUM
    ('student', 'teacher', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- DROP SEQUENCE IF EXISTS files_seq;
CREATE SEQUENCE IF NOT EXISTS files_seq;

-- DROP TABLE IF EXISTS files;
CREATE TABLE IF NOT EXISTS files (
  _id integer PRIMARY KEY DEFAULT nextval('files_seq'::regclass),
  name character varying(512) NOT NULL,
  type character varying(20) NOT NULL,
  data bytea
);

DROP INDEX IF EXISTS users_first_name;
CREATE INDEX files_name ON files USING btree (name);

-- DROP SEQUENCE IF EXISTS users_seq;
CREATE SEQUENCE IF NOT EXISTS users_seq;

-- DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  _id integer PRIMARY KEY DEFAULT nextval('users_seq'::regclass),
  role roles NOT NULL DEFAULT 'student'::roles,
  "lastName" character varying(20) NOT NULL,
  "firstName" character varying(20) NOT NULL,
  email character varying(80) NOT NULL UNIQUE,
  "optOut" boolean NOT NULL DEFAULT false,
  phone character varying(23),
  provider providers NOT NULL DEFAULT 'local'::providers,
  google json,
  -- Remaining columns for Teacher's page
  "displayOrder" integer, 
  bio character varying(1500),
  url character varying(1024),
  imageId integer REFERENCES files(_id) ON UPDATE CASCADE ON DELETE CASCADE,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
  password character varying(88),
  salt character varying(24)
);

DROP INDEX IF EXISTS users_first_name;
CREATE INDEX users_first_name ON users USING btree ("firstName");

DROP INDEX IF EXISTS users_last_name;
CREATE INDEX users_last_name ON users USING btree ("lastName");

DROP INDEX IF EXISTS users_role;
CREATE INDEX users_role ON users USING btree (role);

DROP INDEX IF EXISTS users_teachers_display;
CREATE INDEX users_teachers_display ON users USING btree ("displayOrder");

DROP TRIGGER IF EXISTS updated_at ON users;
CREATE TRIGGER updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- DROP SEQUENCE IF EXISTS products_seq;
CREATE SEQUENCE IF NOT EXISTS products_seq;

-- DROP TABLE products;
CREATE TABLE IF NOT EXISTS products (
  _id integer PRIMARY KEY DEFAULT nextval('products_seq'),
  name character varying(256) NOT NULL UNIQUE,
  price numeric(10,2) NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS products_active;
CREATE INDEX products_active ON products USING btree ("active");

DROP TRIGGER IF EXISTS updated_at ON products;
CREATE TRIGGER updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- DROP SEQUENCE IF EXISTS classes_seq;
CREATE SEQUENCE IF NOT EXISTS classes_seq;

-- DROP TABLE IF EXISTS classes;
CREATE TABLE IF NOT EXISTS classes (
  _id integer PRIMARY KEY DEFAULT nextval('classes_seq'),
  name character varying(256) NOT NULL UNIQUE,
  description character varying(1024) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS classes_active;
CREATE INDEX classes_active ON classes USING btree ("active");

DROP TRIGGER IF EXISTS updated_at ON classes;
CREATE TRIGGER updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- DROP SEQUENCE IF EXISTS workshops_seq;
CREATE SEQUENCE IF NOT EXISTS workshops_seq;

-- DROP TABLE IF EXISTS workshops;
CREATE TABLE IF NOT EXISTS workshops (
  _id integer PRIMARY KEY DEFAULT nextval('workshops_seq'),
  title character varying(256) NOT NULL UNIQUE,
  description character varying(1024) NOT NULL,
  "imageId" integer REFERENCES files(_id) ON UPDATE CASCADE ON DELETE CASCADE,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS updated_at ON workshops;
CREATE TRIGGER updated_at BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- DROP SEQUENCE IF EXISTS sections_seq;
CREATE SEQUENCE IF NOT EXISTS sections_seq;

-- DROP TABLE IF EXISTS sections;
CREATE TABLE IF NOT EXISTS sections (
  _id integer PRIMARY KEY DEFAULT nextval('sections_seq'),
  "workshopId" integer NOT NULL REFERENCES workshops(_id) ON UPDATE CASCADE ON DELETE CASCADE,
  title character varying(256),
  description character varying(1024),
  "hideDate" boolean DEFAULT false,
  starts timestamp(0) with time zone NOT NULL,
  ends timestamp(0) with time zone NOT NULL,
  "productId" integer REFERENCES products(_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  "locationId" integer REFERENCES locations(_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS updated_at ON sections;
CREATE TRIGGER updated_at BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

DROP INDEX IF EXISTS sections_starts;
CREATE INDEX sections_starts ON sections USING btree (starts);

DROP INDEX IF EXISTS sections_title;
CREATE INDEX sections_title ON sections USING btree (title);

-- DROP SEQUENCE IF EXISTS locations_seq;
CREATE SEQUENCE IF NOT EXISTS locations_seq;

-- DROP TABLE IF EXISTS locations;
CREATE TABLE IF NOT EXISTS locations (
  _id integer PRIMARY KEY DEFAULT nextval('locations_seq'),
  name character varying(256) NOT NULL UNIQUE,
  address character varying(256) NOT NULL,
  city character varying(120) NOT NULL DEFAULT 'Pittsburgh',
  state char(2) NOT NULL DEFAULT 'PA',
  "zipCode" character varying(10) NOT NULL DEFAULT '15217',
  map character varying(1024) NOT NULL,
  street character varying(1024) NOT NULL,
  directions character varying(1024) NOT NULL,
  review character varying(1024),
  note1 character varying(256),
  note2 character varying(256),
  active boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS locations_active;
CREATE INDEX locations_active ON locations USING btree ("active");

DROP TRIGGER IF EXISTS updated_at ON locations;
CREATE TRIGGER updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

--DROP SEQUENCE IF EXISTS announcements_seq;
CREATE SEQUENCE IF NOT EXISTS announcements_seq;

-- DROP TABLE IF EXISTS announcements;
CREATE TABLE IF NOT EXISTS announcements (
  _id integer PRIMARY KEY DEFAULT nextval('announcements_seq'::regclass),
  section character varying(100) NOT NULL,
  title character varying(100) NOT NULL,
  description character varying(512) NOT NULL,
  expires timestamp(0) with time zone NOT NULL DEFAULT CURRENT_DATE + INTERVAL '1' MONTH,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
);

DROP INDEX IF EXISTS announcements_expires;
CREATE INDEX announcements_expires
  ON announcements USING btree (expires);

DROP INDEX IF EXISTS announcements_section;
CREATE INDEX announcements_section
  ON announcements USING btree (section);

DROP INDEX IF EXISTS announcements_title;
CREATE INDEX announcements_title
  ON announcements USING btree (title);

DROP TRIGGER IF EXISTS updated_at ON announcements;
CREATE TRIGGER updated_at
  BEFORE UPDATE 
  ON announcements
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at();

-- DROP SEQUENCE IF EXISTS attendances_seq;
CREATE SEQUENCE IF NOT EXISTS attendances_seq;

-- DROP TABLE IF EXISTS attendances;
CREATE TABLE IF NOT EXISTS attendances (
  _id integer PRIMARY KEY DEFAULT nextval('attendances_seq'::regclass),
  attended date NOT NULL DEFAULT now(),
  user_id integer NOT NULL REFERENCES users(_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  location_id integer NOT NULL REFERENCES locations(_id) ON UPDATE RESTRICT ON DELETE RESTRICT
  class_id integer NOT NULL REFERENCES classes(_id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  teacher_id integer NOT NULL REFERENCES users(_id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS attendances_attended;
CREATE INDEX attendances_attended
  ON attendances USING btree (attended);

DROP INDEX IF EXISTS attendances_user;
CREATE INDEX attendances_user
  ON attendances USING btree (user_id);

DROP INDEX IF EXISTS attendances_location;
CREATE INDEX attendances_location
  ON attendances USING btree (location_id);

DROP INDEX IF EXISTS attendances_teacher;
CREATE INDEX attendances_teacher
  ON attendances USING btree (teacher_id);

DROP INDEX IF EXISTS attendances_class;
CREATE INDEX attendances_class
  ON attendances USING btree (class_id);

DROP TRIGGER IF EXISTS updated_at ON attendances;
CREATE TRIGGER updated_at BEFORE UPDATE ON attendances FOR EACH ROW
  EXECUTE PROCEDURE updated_at();

-- DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders (
  "orderNumber" character varying(12) PRIMARY KEY,
  amount numeric(10,2) NOT NULL,
  gift boolean NOT NULL,
  instructions character varying(255),
  "sendVia" character varying(5) NOT NULL,
  "purchaserFirstName" character varying(20) NOT NULL,
  "purchaserLastName" character varying(20) NOT NULL,
  "purchaserZipCode" character varying(10),
  "purchaserEmail" character varying(80) NOT NULL,
  "purchaserPhone" character varying(23),
  last4 character varying(4),
  "recipientFirstName" character varying(20),
  "recipientLastName" character varying(20),
  "recipientAddress" character varying(255),
  "recipientCity" character varying(20),
  "recipientState" character varying(2),
  "recipientZipCode" character varying(10),
  "recipientEmail" character varying(80) NOT NULL,
  "recipientPhone" character varying(23),
  "itemsOrdered" json NOT NULL,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS orders_order_number;
CREATE INDEX orders_order_number
  ON orders USING btree ("orderNumber");

DROP INDEX IF EXISTS orders_purchaser_email;
CREATE INDEX orders_purchaser_email
  ON orders USING btree ("purchaserEmail");

DROP INDEX IF EXISTS orders_recipient_email;
CREATE INDEX orders_recipient_email
  ON orders USING btree ("recipientEmail");

DROP TRIGGER IF EXISTS updated_at ON orders;
CREATE TRIGGER updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- DROP SEQUENCE IF EXISTS purchases_seq;
CREATE SEQUENCE IF NOT EXISTS purchases_seq;

-- DROP TABLE IF EXISTS purchases;
CREATE TABLE IF NOT EXISTS purchases (
  _id integer PRIMARY KEY DEFAULT nextval('purchases_seq'::regclass),
  user_id integer NOT NULL REFERENCES users(_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  quantity integer NOT NULL,
  method character varying(16) NOT NULL,
  notes character varying(256),
  purchased date DEFAULT now(),
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS purchases_user;
CREATE INDEX purchases_user ON purchases USING btree (user_id);

DROP INDEX IF EXISTS purchases_purchased;
CREATE INDEX purchases_purchased ON purchases USING btree (purchased);

DROP TRIGGER IF EXISTS updated_at ON purchases;
CREATE TRIGGER updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

-- DROP SEQUENCE IF EXISTS schedules_seq;
CREATE SEQUENCE IF NOT EXISTS schedules_seq;

-- DROP TABLE IF EXISTS schedules;
CREATE TABLE IF NOT EXISTS schedules (
  _id integer PRIMARY KEY DEFAULT nextval('schedules_seq'::regclass),
  location_id integer NOT NULL REFERENCES locations(_id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  day integer NOT NULL,
  class_id integer NOT NULL REFERENCES locations(_id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  teacher_id integer NOT NULL REFERENCES locations(_id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  "startTime" time(0) without time zone NOT NULL,
  "endTime" time(0) without time zone NOT NULL,
  canceled boolean NOT NULL DEFAULT false,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS schedules_location;
CREATE INDEX schedules_location ON schedules USING btree (location_id);

DROP INDEX IF EXISTS schedules_location_day_start_time;
CREATE INDEX schedules_day ON schedules USING btree (day);

DROP INDEX IF EXISTS schedules_start_time;
CREATE INDEX schedules_start_time ON schedules USING btree ("startTime");

DROP TRIGGER IF EXISTS updated_at ON schedules;
CREATE TRIGGER updated_at BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

DROP VIEW IF EXISTS schedules_index;
CREATE VIEW schedules_index AS
 SELECT schedules._id,
    schedules.location_id AS "locationId",
    locations.name AS location,
    schedules.day,
    schedules.class_id AS "classId",
    classes.name AS title,
    schedules.teacher_id AS "teacherId",
    users."firstName" as "teacherFirstName",
    users."lastName" as "teacherLastName",
    users.bio as "teacherBio",
    users."imageId" as "teacherImageId",
    users.url as "teacherUrl",
    schedules."startTime",
    schedules."endTime",
    schedules.canceled,
    classes.description
   FROM schedules
     LEFT JOIN locations ON schedules.location_id = locations._id
     LEFT JOIN users ON schedules.teacher_id = users._id
     LEFT JOIN classes ON schedules.class_id = classes._id
  ORDER BY locations.name, schedules.day, schedules."startTime";

-- DROP TABLE IF EXISTS sessions
CREATE TABLE IF NOT EXISTS sessions (
  sid character varying PRIMARY KEY,
  sess json NOT NULL,
  expire timestamp(6) without time zone NOT NULL
);

DROP VIEW IF EXISTS attendances_full_info;
CREATE VIEW attendances_full_info AS
  SELECT attendances.teacher,
    attendances."className",
    attendances.location,
    attendances.attended,
    (users."lastName"::text || ', '::text) || users."firstName"::text AS student
  FROM attendances
    JOIN users ON attendances.user_id = users._id;

DROP VIEW IF EXISTS attendees_nh_pq;
CREATE VIEW attendees_nh_pq AS
  SELECT count(*) AS count
  FROM attendances
  WHERE attendances.location::text = 'North Hills'::text AND attendances.attended >= date_trunc('quarter'::text, (date_trunc('quarter'::text, 'now'::text::date::timestamp with time zone)::date - 1)::timestamp with time zone)::date AND attendances.attended < date_trunc('quarter'::text, 'now'::text::date::timestamp with time zone)::date;

DROP VIEW IF EXISTS attendees_per_class;
CREATE VIEW attendees_per_class AS
  SELECT attendances.location,
    attendances."className",
    attendances.teacher,
    attendances.attended,
    count(attendances.user_id) AS students
  FROM attendances
  GROUP BY attendances.location, attendances."className", attendances.teacher, attendances.attended
  ORDER BY attendances.location, attendances.attended;

DROP VIEW IF EXISTS student_balances;
CREATE VIEW student_balances AS
  SELECT users._id,
    (users."lastName"::text || ', '::text) || users."firstName"::text AS student,
    (( SELECT COALESCE(sum(purchases.quantity), 0::bigint) AS purchases
           FROM purchases
          WHERE purchases.user_id = users._id)) + (( SELECT - count(*) AS attendances
           FROM attendances
          WHERE attendances.user_id = users._id)) AS balance,
    ( SELECT max(attendances.attended) AS max_class_date
           FROM attendances
          WHERE attendances.user_id = users._id) AS last_attended,
    ( SELECT max(purchases."createdAt") AS max_purchased_on
           FROM purchases
          WHERE purchases.user_id = users._id) AS last_purchase,
    users.email,
    users."optOut"
  FROM users
  ORDER BY users."lastName", users."firstName";

DROP VIEW IF EXISTS students_who_owe;
CREATE VIEW students_who_owe AS
  SELECT student_balances._id,
    student_balances.student,
    student_balances.balance,
    student_balances.last_attended,
    student_balances.last_purchase,
    student_balances.email,
    student_balances."optOut"
  FROM student_balances
  WHERE student_balances.balance < 0;

DROP VIEW IF EXISTS studio_analysis_pycy;
CREATE VIEW studio_analysis_pycy AS
  SELECT attendances.location,
    to_char(attendances.attended::timestamp with time zone, 'YYYY-MM'::text) AS year_month,
    count(*) AS attendances
  FROM attendances
  WHERE attendances.attended >= '2017-01-01'::date
  GROUP BY attendances.location, (to_char(attendances.attended::timestamp with time zone, 'YYYY-MM'::text))
  ORDER BY attendances.location, (to_char(attendances.attended::timestamp with time zone, 'YYYY-MM'::text));

DROP VIEW IF EXISTS workshop_sections;
CREATE VIEW workshop_sections AS
  SELECT array_to_json(array_agg(row_to_json(w))) AS workshops FROM (
    SELECT workshops._id, title, description, "imageId", (SELECT MAX(sections.ends) FROM sections WHERE sections."workshopId" = workshops._id) AS ends,
      (
        SELECT array_to_json(array_agg(row_to_json(s))) FROM (
          SELECT sections._id, title, description, "hideDate" , starts, ends,
            "productId", products.price, "locationId", locations.name AS location,
            locations.address AS "streetAddress",
            locations.city AS "addressLocality", locations.state AS "addressRegion",
            locations."zipCode" AS "postalCode",
            'US' AS "addressCountry"
          FROM sections
            INNER JOIN products ON sections."productId" = products._id
            INNER JOIN locations on sections."locationId" = locations._id
          WHERE
            sections."workshopId" = workshops._id AND
            ends > CURRENT_TIMESTAMP - interval '12 hours'
          ORDER BY starts
        ) s
      ) AS sections
    FROM workshops
  ) w;

-- Insert workshop record or update if one exists
DROP FUNCTION IF EXISTS workshop_upsert(integer, character varying, character varying, integer)
CREATE FUNCTION workshop_upsert(
	integer,
	character varying,
	character varying,
	integer,
	OUT workshop_id integer)
  RETURNS integer
  LANGUAGE 'plpgsql'
  COST 100
  VOLATILE 
AS $BODY$
  BEGIN
    IF $1 = 0 THEN
      INSERT INTO workshops(title, description, "imageId") VALUES ($2, $3, $4) RETURNING _id INTO workshop_id;
    ELSE
      UPDATE workshops SET title = $2, description = $3, "imageId" = $4 WHERE _id = $1 RETURNING _id INTO workshop_id;
    END IF;
  END;
$BODY$;

-- Upsert workshop in JSON format
DROP FUNCTION IF EXISTS workshop_upsert_json(json);
CREATE FUNCTION workshop_upsert_json(input json, OUT id integer)
  RETURNS integer
  LANGUAGE 'plpgsql'

  COST 100
  VOLATILE 
AS $BODY$
  BEGIN
    id := workshop_upsert(
      (input->>'_id')::integer,
      (input->>'title')::varchar(256),
      (input->>'description')::varchar(1024),
      (input->>'imageId')::integer
    );
    -- Delete records related to existing workshop (overwrite)
    DELETE FROM sections WHERE "workshopId" = id;
    -- Add sections
    IF (input->'sections')::text <> 'null' THEN
      WITH s AS (
        SELECT
          id AS "workshopId",
          (value->>'title')::varchar(256) AS title,
          (value->>'description')::varchar(1024) AS description,
          (value->>'hideDate')::boolean AS "hideDate",
          (value->>'starts')::timestamptz(0) AS starts,
          (value->>'ends')::timestamptz(0) AS ends,
          (value->>'productId')::integer AS "productId",
          (value->>'locationId')::integer AS "locationId"
        FROM json_array_elements(input->'sections')
      )
      INSERT INTO sections("workshopId", "hideDate", title, description, starts, ends, "productId", "locationId")
        SELECT "workshopId", "hideDate", title, description, starts, ends, "productId", "locationId" FROM s;
    END IF;
  END;
$BODY$;

DROP FUNCTION IF EXISTS zero_old_passes();
CREATE FUNCTION zero_old_passes() RETURNS void
  LANGUAGE 'plpgsql'
  COST 100
  VOLATILE 
AS $BODY$
  DECLARE
    cutoff timestamp := CURRENT_TIMESTAMP - INTERVAL '12 months';
  BEGIN
    -- Create temp table of active students with their balance
    CREATE TEMPORARY TABLE IF NOT EXISTS student_balances_temp AS
      SELECT
        _id, balance
      FROM
        student_balances WHERE balance > 0;
    
    -- Eliminate students who bought a card within the last 12 months
    DELETE FROM student_balances_temp WHERE _id IN (SELECT DISTINCT user_id FROM purchases WHERE "createdAt" >= cutoff);

    -- Insert negative purchase to expire class cards
    INSERT INTO purchases (user_id, quantity, method, notes, "createdAt", "updatedAt")
    SELECT
      _id,
      - balance,
      'Expiration',
      'After 12 months',
      CURRENT_DATE, CURRENT_DATE
    FROM
      student_balances_temp;
    DROP TABLE student_balances_temp;
  END;
$BODY$;

DROP FUNCTION IF EXISTS history_attendees(date, integer, integer, integer);
CREATE FUNCTION history_attendees(
	attended date,
	"locationId" integer,
	"teacherId" integer,
	"classId" integer)
    RETURNS TABLE(_id integer, "userId" integer, "userNameFull" character varying) 
    LANGUAGE 'sql'
    COST 100
    VOLATILE 
    ROWS 100
AS $BODY$
  SELECT
    attendances._id,
    attendances.user_id AS "userId",
    INITCAP(users."lastName" || ', ' || users."firstName") AS "userNameFull"
  FROM
    attendances INNER JOIN users ON attendances.user_id = users._id
  WHERE
    attendances.attended = $1::DATE AND
    attendances.location_id = $2 AND
    attendances.teacher_id = $3 AND
    attendances.class_id = $4
  ORDER BY users."lastName", users."firstName";
$BODY$;

DROP FUNCTION IF EXISTS history_index(integer);
CREATE FUNCTION history_index("userId" integer)
  RETURNS TABLE(_id integer, type character, "when" date, "locationId" integer, "classId" integer, "teacherId" integer, "paymentMethod" character varying, notes character varying, what character varying, quantity integer, balance integer) 
  LANGUAGE 'sql'
  COST 100
  VOLATILE 
  ROWS 5000
AS $BODY$
SELECT
    history._id,
    history.type,
    history."when",
    history."locationId",
    history."classId",
    history."teacherId",
    history."paymentMethod",
    history.notes,
    history.what,
    history.quantity,
    (SUM(history.quantity) OVER (PARTITION BY history."userId" ORDER BY history."when"))::integer AS balance
  FROM (
    SELECT
      attendances._id,
	  attendances.user_id AS "userId",
      'A'::text AS type,
      attendances.attended AS "when",
      attendances.location_id AS "locationId",
      attendances.class_id AS "classId",
      attendances.teacher_id AS "teacherId",
      NULL AS "paymentMethod",
      NULL AS notes,
      ((((('Attended '::text || classes.name::text) || ' in '::text) || locations.name::text) || ' ('::text) || users."lastName" || ', ' || users."firstName") || ')'::text AS what,
      '-1'::integer AS quantity
    FROM attendances
      INNER JOIN locations ON attendances.location_id = locations._id
      INNER JOIN classes ON attendances.class_id = classes._id
      INNER JOIN users ON attendances.teacher_id = users._id
    WHERE attendances.user_id = $1
    UNION
    SELECT purchases._id,
	  purchases.user_id AS "userId",
      'P'::text AS type,
      purchases.purchased AS "when",
      NULL AS "locationId",
      NULL AS "classId",
      NULL AS "teacherId",
      purchases.method AS "paymentMethod",
      purchases.notes,
      'Purchased '::text || purchases.quantity::text || ' class pass ('::text || purchases.method::text || ') - '::text || purchases.notes::text AS what,
      purchases.quantity
    FROM purchases
    WHERE purchases.user_id = $1
  ) history
  ORDER BY history."when" DESC;
$BODY$;

DROP VIEW IF EXISTS report_teachers_csv;
CREATE VIEW report_teachers_csv AS
  SELECT locations.name AS location, classes.name AS class, users."lastName" || ', ' || users."firstName" AS teacher, attended, COUNT(*) AS students,
    CASE
      WHEN COUNT(*) < 5 THEN 25
      ELSE COUNT(*) * 5
    END as amount
  FROM attendances
    INNER JOIN locations ON attendances.location_id = locations._id
    INNER JOIN classes ON attendances.class_id = classes._id
    INNER JOIN users ON attendances.teacher_id = users._id
  WHERE
    attended >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AND attended < date_trunc('month', CURRENT_DATE)
  GROUP BY locations.name, users._id, classes.name, attended
  ORDER BY locations.name, attended;

DROP VIEW IF EXISTS report_top_10_classes;
CREATE VIEW report_top_10_classes AS
  SELECT
    locations.name AS location, classes.name AS "className", users."lastName" || ', ' || users."firstName" AS teacher, count(*)
  FROM attendances
    INNER JOIN locations ON attendances.location_id = locations._id
    INNER JOIN classes ON attendances.class_id = classes._id
    INNER JOIN users ON attendances.teacher_id = users._id
  WHERE attended > CURRENT_DATE - INTERVAL '90 days'
  GROUP BY classes.name, locations.name, users._id
  ORDER by count(*) DESC
  LIMIT 10;

DROP VIEW IF EXISTS report_attendance_by_location;
CREATE VIEW report_attendance_by_location AS
  SELECT locations.name as location, count(*)
  FROM attendances
    INNER JOIN locations ON attendances.location_id = locations._id
  WHERE attended > CURRENT_DATE - INTERVAL '90 days'
  GROUP BY locations.name
  ORDER by count(*) DESC;

DROP VIEW IF EXISTS report_top_10_students;
CREATE VIEW report_top_10_students AS
  SELECT users."lastName", users."firstName", COUNT(*)
  FROM attendances
    INNER JOIN users ON attendances.user_id = users._id
  WHERE attended > CURRENT_DATE - INTERVAL '90 days'
  GROUP BY users."lastName", users."firstName"
  ORDER BY COUNT(*) DESC
  LIMIT 10;

DROP VIEW IF EXISTS report_attendance_by_location_last18m;
CREATE VIEW report_attendance_by_location_last18m AS
  SELECT locations.name as location, date_trunc('month', attended)::date AS month, COUNT(*)
  FROM attendances INNER JOIN locations ON attendances.location_id = locations._id
  WHERE attended >= date_trunc('month', CURRENT_DATE) - INTERVAL '18 months' AND attended < date_trunc('month', CURRENT_DATE)
  GROUP BY locations.name, month
  ORDER BY locations.name, month;

DROP VIEW IF EXISTS report_teacher_reimbursement_lastm;
CREATE VIEW report_teacher_reimbursement_lastm AS
  SELECT teacher, SUM(count) AS count, SUM(amount) AS amount FROM
    ( SELECT users."lastName" || ', ' || users."firstName" AS teacher, classes.name AS "className", attended, COUNT(*) AS count,
        CASE
          WHEN COUNT(*) < 5 THEN 25
          ELSE COUNT(*) * 5
        END as amount
      FROM attendances
        INNER JOIN users ON attendances.teacher_id = users._id
        INNER JOIN classes ON attendances.class_id = classes._id
      WHERE
        attended >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AND attended < date_trunc('month', CURRENT_DATE)
      GROUP BY classes.name, users."lastName", users."firstName", attended
    ) a
  GROUP by teacher
  ORDER BY teacher;

DROP VIEW IF EXISTS report_poorly_attended_classes;
CREATE VIEW report_poorly_attended_classes AS
  SELECT locations.name AS location, classes.name AS "className", count(*) from attendances
    INNER JOIN locations ON attendances.location_id = locations._id
    INNER JOIN classes ON attendances.class_id = classes._id
  WHERE attended > CURRENT_DATE - INTERVAL '90 days'
  GROUP BY locations.name, classes.name
  ORDER by count(*) ASC
  LIMIT 10;

-- Update attendances with foreign keys
UPDATE attendances SET location_id = (SELECT _id FROM locations WHERE locations.name = attendances.location) WHERE location_id IS NULL;
UPDATE attendances SET teacher_id = (SELECT _id FROM users WHERE attendances.teacher = users."lastName" || ', ' || users."firstName") WHERE teacher_id IS NULL;
UPDATE attendances SET class_id = (SELECT _id FROM classes WHERE classes.name = attendances."className") WHERE class_id IS NULL;