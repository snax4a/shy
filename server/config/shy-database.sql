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

-- Dangerous!
DROP DATABASE IF EXISTS shy;

-- Create database
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

-- DROP FUNCTION public.updated_at();
CREATE OR REPLACE FUNCTION public.updated_at()
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

-- DROP TYPE public.providers;
DO $$ BEGIN
  CREATE TYPE public.providers AS ENUM
    ('google', 'local');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- DROP TYPE public.roles;
DO $$ BEGIN
  CREATE TYPE public.roles AS ENUM
    ('student', 'teacher', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- DROP SEQUENCE public.files_seq;
CREATE SEQUENCE IF NOT EXISTS public.files_seq;

-- DROP TABLE public.files;
CREATE TABLE IF NOT EXISTS public.files (
  _id integer PRIMARY KEY DEFAULT nextval('files_seq'::regclass),
  name character varying(512) NOT NULL,
  type character varying(20) NOT NULL,
  data bytea
);

-- DROP INDEX public.users_first_name;
CREATE INDEX files_name ON public.files USING btree (name);

-- DROP SEQUENCE public.users_seq;
CREATE SEQUENCE IF NOT EXISTS public.users_seq;

-- DROP TABLE public."Users";
CREATE TABLE IF NOT EXISTS public."Users" (
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

-- DROP INDEX public.users_first_name;
CREATE INDEX users_first_name ON public."Users" USING btree ("firstName");

-- DROP INDEX public.users_last_name;
CREATE INDEX users_last_name ON public."Users" USING btree ("lastName");

-- DROP INDEX public.users_teachers_display;
CREATE INDEX users_teachers_display ON public."Users" USING btree ("displayOrder", role);

-- DROP TRIGGER updated_at ON public."Users";
CREATE TRIGGER updated_at BEFORE UPDATE ON public."Users"
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

-- DROP SEQUENCE public.products_seq;
CREATE SEQUENCE IF NOT EXISTS public.products_seq;

-- DROP TABLE public.products;
CREATE TABLE IF NOT EXISTS public.products (
  _id integer PRIMARY KEY DEFAULT nextval('products_seq'),
  name character varying(256) NOT NULL UNIQUE,
  price numeric(10,2) NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

-- DROP INDEX public.products_active;
CREATE INDEX products_active ON public.products USING btree ("active");

-- DROP TRIGGER updated_at ON public.products;
CREATE TRIGGER updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

-- DROP SEQUENCE public.classes_seq;
CREATE SEQUENCE IF NOT EXISTS public.classes_seq;

-- DROP TABLE public.classes;
CREATE TABLE IF NOT EXISTS public.classes (
  _id integer PRIMARY KEY DEFAULT nextval('classes_seq'),
  name character varying(256) NOT NULL UNIQUE,
  description character varying(1024) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

-- DROP INDEX public.classes_active;
CREATE INDEX classes_active ON public.classes USING btree ("active");

-- DROP TRIGGER updated_at ON public.classes;
CREATE TRIGGER updated_at BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

-- DROP SEQUENCE public.workshops_seq;
CREATE SEQUENCE IF NOT EXISTS public.workshops_seq;

-- DROP TABLE public.workshops;
CREATE TABLE IF NOT EXISTS public.workshops (
  _id integer PRIMARY KEY DEFAULT nextval('workshops_seq'),
  title character varying(256) NOT NULL UNIQUE,
  description character varying(1024) NOT NULL,
  "imageId" integer REFERENCES files(_id) ON UPDATE CASCADE ON DELETE CASCADE,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

-- DROP TRIGGER updated_at ON public.workshops;
CREATE TRIGGER updated_at BEFORE UPDATE ON public.workshops
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

-- DROP SEQUENCE public.sections_seq;
CREATE SEQUENCE IF NOT EXISTS public.sections_seq;

-- DROP TABLE public.sections;
CREATE TABLE IF NOT EXISTS public.sections (
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

-- DROP TRIGGER updated_at ON public.sections;
CREATE TRIGGER updated_at BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

-- DROP INDEX public.sections_active;
CREATE INDEX sections_active ON public.sections USING btree (starts, title);

-- DROP SEQUENCE public.locations_seq;
CREATE SEQUENCE IF NOT EXISTS public.locations_seq;

-- DROP TABLE public.locations;
CREATE TABLE IF NOT EXISTS public.locations (
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

-- DROP INDEX public.locations_active;
CREATE INDEX locations_active ON public.locations USING btree ("active");

-- DROP TRIGGER updated_at ON public.locations;
CREATE TRIGGER updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

--DROP SEQUENCE public.announcements_seq;
CREATE SEQUENCE IF NOT EXISTS public.announcements_seq;

-- DROP TABLE public."Announcements";
CREATE TABLE IF NOT EXISTS public."Announcements" (
  _id integer PRIMARY KEY DEFAULT nextval('announcements_seq'::regclass),
  section character varying(100) NOT NULL,
  title character varying(100) NOT NULL,
  description character varying(512) NOT NULL,
  expires timestamp(0) with time zone NOT NULL DEFAULT CURRENT_DATE + INTERVAL '1' MONTH,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
);

-- DROP INDEX public.announcements_expires;
CREATE INDEX IF NOT EXISTS announcements_expires
  ON public."Announcements" USING btree (expires);

-- DROP INDEX public.announcements_section_title;
CREATE INDEX IF NOT EXISTS announcements_section_title
  ON public."Announcements" USING btree (section, title);

-- DROP TRIGGER updated_at ON public."Announcements";
CREATE TRIGGER updated_at
  BEFORE UPDATE 
  ON public."Announcements"
  FOR EACH ROW
  EXECUTE PROCEDURE public.updated_at();

-- DROP SEQUENCE public.attendances_seq;
CREATE SEQUENCE IF NOT EXISTS public.attendances_seq;

-- DROP TABLE public."Attendances";
CREATE TABLE IF NOT EXISTS public."Attendances" (
  _id integer PRIMARY KEY DEFAULT nextval('attendances_seq'::regclass),
  "UserId" integer NOT NULL REFERENCES "Users"(_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  attended date NOT NULL DEFAULT now(),
  location character varying(20) NOT NULL,
  "className" character varying(80) NOT NULL,
  teacher character varying(40) NOT NULL,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

-- DROP INDEX public.attendances__user_id;
CREATE INDEX attendances_user_id
  ON public."Attendances" USING btree ("UserId");

-- DROP INDEX public.attendances_attended;
CREATE INDEX attendances_class
  ON public."Attendances" USING btree (location, teacher, "className", attended);

-- DROP INDEX public.attendances_attended;
CREATE INDEX attendances_student_history
  ON public."Attendances" USING btree ("UserId", attended);

-- DROP INDEX public.attendances_attended;
CREATE INDEX attendances_teacher_history
  ON public."Attendances" USING btree (teacher, attended);

-- DROP TRIGGER updated_at ON public."Attendances";
CREATE TRIGGER updated_at BEFORE UPDATE ON public."Attendances" FOR EACH ROW
  EXECUTE PROCEDURE public.updated_at();

-- DROP TABLE public."Orders";
CREATE TABLE IF NOT EXISTS public."Orders" (
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

-- DROP INDEX public.orders_order_number;
CREATE INDEX orders_order_number
  ON public."Orders" USING btree ("orderNumber");

-- DROP INDEX public.orders_purchaser_email;
CREATE INDEX orders_purchaser_email
  ON public."Orders" USING btree ("purchaserEmail");

-- DROP INDEX public.orders_recipient_email;
CREATE INDEX orders_recipient_email
  ON public."Orders" USING btree ("recipientEmail");

-- DROP TRIGGER updated_at ON public."Orders";
CREATE TRIGGER updated_at BEFORE UPDATE ON public."Orders"
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

-- DROP SEQUENCE public.purchases_seq;
CREATE SEQUENCE IF NOT EXISTS public.purchases_seq;

-- DROP TABLE public."Purchases";
CREATE TABLE public."Purchases" (
  _id integer PRIMARY KEY DEFAULT nextval('purchases_seq'::regclass),
  "UserId" integer NOT NULL REFERENCES "Users"(_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  quantity integer NOT NULL,
  method character varying(16) NOT NULL,
  notes character varying(256),
  purchased date DEFAULT now(),
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

-- DROP INDEX public.purchases__user_id;
CREATE INDEX purchases_user_id ON public."Purchases" USING btree ("UserId");

-- DROP INDEX public.purchases_purchased;
CREATE INDEX purchases_purchased ON public."Purchases" USING btree (purchased, "UserId");

-- DROP TRIGGER updated_at ON public."Purchases";
CREATE TRIGGER updated_at BEFORE UPDATE ON public."Purchases"
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

-- DROP SEQUENCE public.schedules_seq;
CREATE SEQUENCE IF NOT EXISTS public.schedules_seq;

-- DROP TABLE public."Schedules";
CREATE TABLE IF NOT EXISTS public."Schedules" (
  _id integer PRIMARY KEY DEFAULT nextval('schedules_seq'::regclass),
  location character varying(20) NOT NULL,
  day integer NOT NULL,
  title character varying(100) NOT NULL,
  teacher character varying(40) NOT NULL,
  "startTime" time(0) without time zone NOT NULL,
  "endTime" time(0) without time zone NOT NULL,
  canceled boolean NOT NULL DEFAULT false,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now()
);

-- DROP INDEX public.schedules_location_day_start_time;
CREATE INDEX schedules_location_day_start_time ON public."Schedules" USING btree (location, day, "startTime");

-- DROP TRIGGER updated_at ON public."Schedules";
CREATE TRIGGER updated_at BEFORE UPDATE ON public."Schedules"
  FOR EACH ROW EXECUTE PROCEDURE public.updated_at();

-- DROP TABLE public.sessions
CREATE TABLE sessions (
  sid character varying PRIMARY KEY,
  sess json NOT NULL,
  expire timestamp(6) without time zone NOT NULL
);

-- DROP VIEW public.attendances_full_info;
CREATE OR REPLACE VIEW public.attendances_full_info AS
  SELECT "Attendances".teacher,
    "Attendances"."className",
    "Attendances".location,
    "Attendances".attended,
    ("Users"."lastName"::text || ', '::text) || "Users"."firstName"::text AS student
  FROM "Attendances"
    JOIN "Users" ON "Attendances"."UserId" = "Users"._id;

-- DROP VIEW public.attendees_nh_pq;
CREATE OR REPLACE VIEW public.attendees_nh_pq AS
  SELECT count(*) AS count
  FROM "Attendances"
  WHERE "Attendances".location::text = 'North Hills'::text AND "Attendances".attended >= date_trunc('quarter'::text, (date_trunc('quarter'::text, 'now'::text::date::timestamp with time zone)::date - 1)::timestamp with time zone)::date AND "Attendances".attended < date_trunc('quarter'::text, 'now'::text::date::timestamp with time zone)::date;

-- DROP VIEW public.attendees_per_class;
CREATE OR REPLACE VIEW public.attendees_per_class AS
  SELECT "Attendances".location,
    "Attendances"."className",
    "Attendances".teacher,
    "Attendances".attended,
    count("Attendances"."UserId") AS students
  FROM "Attendances"
  GROUP BY "Attendances".location, "Attendances"."className", "Attendances".teacher, "Attendances".attended
  ORDER BY "Attendances".location, "Attendances".attended;

-- DROP VIEW public.student_balances;
CREATE OR REPLACE VIEW public.student_balances AS
  SELECT "Users"._id,
    ("Users"."lastName"::text || ', '::text) || "Users"."firstName"::text AS student,
    (( SELECT COALESCE(sum("Purchases".quantity), 0::bigint) AS purchases
           FROM "Purchases"
          WHERE "Purchases"."UserId" = "Users"._id)) + (( SELECT - count(*) AS attendances
           FROM "Attendances"
          WHERE "Attendances"."UserId" = "Users"._id)) AS balance,
    ( SELECT max("Attendances".attended) AS max_class_date
           FROM "Attendances"
          WHERE "Attendances"."UserId" = "Users"._id) AS last_attended,
    ( SELECT max("Purchases"."createdAt") AS max_purchased_on
           FROM "Purchases"
          WHERE "Purchases"."UserId" = "Users"._id) AS last_purchase,
    "Users".email,
    "Users"."optOut"
  FROM "Users"
  ORDER BY "Users"."lastName", "Users"."firstName";

-- DROP VIEW public.students_who_owe;
CREATE OR REPLACE VIEW public.students_who_owe AS
  SELECT student_balances._id,
    student_balances.student,
    student_balances.balance,
    student_balances.last_attended,
    student_balances.last_purchase,
    student_balances.email,
    student_balances."optOut"
  FROM student_balances
  WHERE student_balances.balance < 0;

-- DROP VIEW public.studio_analysis_pycy;
CREATE OR REPLACE VIEW public.studio_analysis_pycy AS
  SELECT "Attendances".location,
    to_char("Attendances".attended::timestamp with time zone, 'YYYY-MM'::text) AS year_month,
    count(*) AS attendances
  FROM "Attendances"
  WHERE "Attendances".attended >= '2017-01-01'::date
  GROUP BY "Attendances".location, (to_char("Attendances".attended::timestamp with time zone, 'YYYY-MM'::text))
  ORDER BY "Attendances".location, (to_char("Attendances".attended::timestamp with time zone, 'YYYY-MM'::text));

DROP VIEW IF EXISTS public.workshop_sections;
CREATE OR REPLACE VIEW public.workshop_sections AS
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
CREATE OR REPLACE FUNCTION public.workshop_upsert(
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
DROP FUNCTION public.workshop_upsert_json(json);
CREATE OR REPLACE FUNCTION public.workshop_upsert_json(
	input json, OUT id integer)
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

-- DROP FUNCTION public.zero_old_passes();
CREATE OR REPLACE FUNCTION public.zero_old_passes() RETURNS void
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
  DELETE FROM student_balances_temp WHERE _id IN (SELECT DISTINCT "UserId" FROM "Purchases" WHERE "createdAt" >= cutoff);

  -- Insert negative purchase to expire class cards
	INSERT INTO "Purchases" ("UserId", quantity, method, notes, "createdAt", "updatedAt")
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
