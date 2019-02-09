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

-- DROP TYPE public."enum_Users_provider";
DO $$ BEGIN
  CREATE TYPE public."enum_Users_provider" AS ENUM
    ('twitter', 'facebook', 'google', 'local');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- DROP TYPE public."enum_Users_role";
DO $$ BEGIN
  CREATE TYPE public."enum_Users_role" AS ENUM
    ('student', 'teacher', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- DROP SEQUENCE public."Users__id_seq1";
CREATE SEQUENCE IF NOT EXISTS public."Users__id_seq1";

-- DROP TABLE public."Users";
CREATE TABLE IF NOT EXISTS public."Users" (
  _id integer PRIMARY KEY DEFAULT nextval('"Users__id_seq1"'::regclass),
  role "enum_Users_role" NOT NULL DEFAULT 'student'::"enum_Users_role",
  "lastName" character varying(20) NOT NULL,
  "firstName" character varying(20) NOT NULL,
  email character varying(80) NOT NULL UNIQUE,
  "optOut" boolean NOT NULL DEFAULT false,
  phone character varying(23),
  provider "enum_Users_provider" NOT NULL DEFAULT 'local'::"enum_Users_provider",
  google json,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
  password character varying(88),
  salt character varying(24)
);

-- DROP INDEX public.users_first_name;
CREATE INDEX users_first_name ON public."Users" USING btree ("firstName");

-- DROP INDEX public.users_last_name;
CREATE INDEX users_last_name ON public."Users" USING btree ("lastName");

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

CREATE SEQUENCE IF NOT EXISTS public."Announcements__id_seq";

-- DROP TABLE public."Announcements";
CREATE TABLE IF NOT EXISTS public."Announcements" (
  _id integer PRIMARY KEY DEFAULT nextval('"Announcements__id_seq"'::regclass),
  section character varying(100) NOT NULL,
  title character varying(100) NOT NULL,
  description character varying(512) NOT NULL,
  expires timestamp with time zone NOT NULL DEFAULT CURRENT_DATE + INTERVAL '1' MONTH,
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

CREATE SEQUENCE IF NOT EXISTS public."Attendances__id_seq";

-- DROP TABLE public."Attendances";
CREATE TABLE IF NOT EXISTS public."Attendances" (
  _id integer PRIMARY KEY DEFAULT nextval('"Attendances__id_seq"'::regclass),
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

-- DROP SEQUENCE public."Purchases__id_seq";
CREATE SEQUENCE IF NOT EXISTS public."Purchases__id_seq";

-- DROP TABLE public."Purchases";
CREATE TABLE public."Purchases" (
  _id integer PRIMARY KEY DEFAULT nextval('"Purchases__id_seq"'::regclass),
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

-- DROP SEQUENCE public."Schedules__id_seq";
CREATE SEQUENCE IF NOT EXISTS public."Schedules__id_seq";

-- DROP TABLE public."Schedules";
CREATE TABLE IF NOT EXISTS public."Schedules" (
  _id integer PRIMARY KEY DEFAULT nextval('"Schedules__id_seq"'::regclass),
  location character varying(20) NOT NULL,
  day integer NOT NULL,
  title character varying(100) NOT NULL,
  teacher character varying(40) NOT NULL,
  "startTime" time without time zone NOT NULL,
  "endTime" time without time zone NOT NULL,
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
