-- FUNCTION: public.updated_at()

-- DROP FUNCTION public.updated_at();

CREATE FUNCTION public.updated_at()
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

-- Type: enum_Users_provider

-- DROP TYPE public."enum_Users_provider";

CREATE TYPE public."enum_Users_provider" AS ENUM
    ('twitter', 'facebook', 'google', 'local');

-- Type: enum_Users_role

-- DROP TYPE public."enum_Users_role";

CREATE TYPE public."enum_Users_role" AS ENUM
    ('student', 'teacher', 'admin');


-- Table: public."Announcements"

-- DROP TABLE public."Announcements";

CREATE TABLE public."Announcements"
(
    _id integer NOT NULL DEFAULT nextval('"Announcements__id_seq"'::regclass),
    section character varying(100) COLLATE pg_catalog."default",
    title character varying(100) COLLATE pg_catalog."default",
    description character varying(512) COLLATE pg_catalog."default",
    expires timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "Announcements_pkey" PRIMARY KEY (_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Announcements"
    OWNER to yzhjqzyprabhjl;

-- Index: announcements_expires

-- DROP INDEX public.announcements_expires;

CREATE INDEX announcements_expires
    ON public."Announcements" USING btree
    (expires)
    TABLESPACE pg_default;

-- Index: announcements_section_title

-- DROP INDEX public.announcements_section_title;

CREATE INDEX announcements_section_title
    ON public."Announcements" USING btree
    (section COLLATE pg_catalog."default", title COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Trigger: updated_at

-- DROP TRIGGER updated_at ON public."Announcements";

CREATE TRIGGER updated_at
    BEFORE UPDATE 
    ON public."Announcements"
    FOR EACH ROW
    EXECUTE PROCEDURE public.updated_at();

-- Table: public."Attendances"

-- DROP TABLE public."Attendances";

CREATE TABLE public."Attendances"
(
    _id integer NOT NULL DEFAULT nextval('"Attendances__id_seq"'::regclass),
    "UserId" integer NOT NULL,
    attended date NOT NULL,
    location character varying(20) COLLATE pg_catalog."default" NOT NULL,
    "classTitle" character varying(80) COLLATE pg_catalog."default" NOT NULL,
    teacher character varying(40) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "Attendances_pkey" PRIMARY KEY (_id),
    CONSTRAINT "Attendances_UserId_fkey" FOREIGN KEY ("UserId")
        REFERENCES public."Users" (_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Attendances"
    OWNER to yzhjqzyprabhjl;

-- Index: attendances__user_id

-- DROP INDEX public.attendances__user_id;

CREATE INDEX attendances__user_id
    ON public."Attendances" USING btree
    ("UserId")
    TABLESPACE pg_default;

-- Index: attendances_attended

-- DROP INDEX public.attendances_attended;

CREATE INDEX attendances_attended
    ON public."Attendances" USING btree
    (attended)
    TABLESPACE pg_default;

-- Index: attendances_class_title

-- DROP INDEX public.attendances_class_title;

CREATE INDEX attendances_class_title
    ON public."Attendances" USING btree
    ("classTitle" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: attendances_location

-- DROP INDEX public.attendances_location;

CREATE INDEX attendances_location
    ON public."Attendances" USING btree
    (location COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: attendances_teacher

-- DROP INDEX public.attendances_teacher;

CREATE INDEX attendances_teacher
    ON public."Attendances" USING btree
    (teacher COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Trigger: updated_at

-- DROP TRIGGER updated_at ON public."Attendances";

CREATE TRIGGER updated_at
    BEFORE UPDATE 
    ON public."Attendances"
    FOR EACH ROW
    EXECUTE PROCEDURE public.updated_at();


-- Table: public."Orders"

-- DROP TABLE public."Orders";

CREATE TABLE public."Orders"
(
    "orderNumber" character varying(12) COLLATE pg_catalog."default" NOT NULL,
    amount numeric(10,2) NOT NULL,
    gift boolean NOT NULL,
    instructions character varying(255) COLLATE pg_catalog."default",
    "sendVia" character varying(5) COLLATE pg_catalog."default" NOT NULL,
    "purchaserFirstName" character varying(20) COLLATE pg_catalog."default",
    "purchaserLastName" character varying(20) COLLATE pg_catalog."default",
    "purchaserZipCode" character varying(10) COLLATE pg_catalog."default",
    "purchaserEmail" character varying(80) COLLATE pg_catalog."default",
    "purchaserPhone" character varying(23) COLLATE pg_catalog."default",
    last4 character varying(4) COLLATE pg_catalog."default",
    "recipientFirstName" character varying(20) COLLATE pg_catalog."default",
    "recipientLastName" character varying(20) COLLATE pg_catalog."default",
    "recipientAddress" character varying(255) COLLATE pg_catalog."default",
    "recipientCity" character varying(20) COLLATE pg_catalog."default",
    "recipientState" character varying(2) COLLATE pg_catalog."default",
    "recipientZipCode" character varying(10) COLLATE pg_catalog."default",
    "recipientEmail" character varying(80) COLLATE pg_catalog."default",
    "recipientPhone" character varying(23) COLLATE pg_catalog."default",
    "itemsOrdered" json NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderNumber")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Orders"
    OWNER to yzhjqzyprabhjl;

-- Index: orders_last4

-- DROP INDEX public.orders_last4;

CREATE INDEX orders_last4
    ON public."Orders" USING btree
    (last4 COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: orders_order_number

-- DROP INDEX public.orders_order_number;

CREATE INDEX orders_order_number
    ON public."Orders" USING btree
    ("orderNumber" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: orders_purchaser_email

-- DROP INDEX public.orders_purchaser_email;

CREATE INDEX orders_purchaser_email
    ON public."Orders" USING btree
    ("purchaserEmail" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: orders_purchaser_first_name

-- DROP INDEX public.orders_purchaser_first_name;

CREATE INDEX orders_purchaser_first_name
    ON public."Orders" USING btree
    ("purchaserFirstName" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: orders_purchaser_last_name

-- DROP INDEX public.orders_purchaser_last_name;

CREATE INDEX orders_purchaser_last_name
    ON public."Orders" USING btree
    ("purchaserLastName" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: orders_recipient_email

-- DROP INDEX public.orders_recipient_email;

CREATE INDEX orders_recipient_email
    ON public."Orders" USING btree
    ("recipientEmail" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: orders_recipient_first_name

-- DROP INDEX public.orders_recipient_first_name;

CREATE INDEX orders_recipient_first_name
    ON public."Orders" USING btree
    ("recipientFirstName" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: orders_recipient_last_name

-- DROP INDEX public.orders_recipient_last_name;

CREATE INDEX orders_recipient_last_name
    ON public."Orders" USING btree
    ("recipientLastName" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Trigger: updated_at

-- DROP TRIGGER updated_at ON public."Orders";

CREATE TRIGGER updated_at
    BEFORE UPDATE 
    ON public."Orders"
    FOR EACH ROW
    EXECUTE PROCEDURE public.updated_at();


-- Table: public."Purchases"

-- DROP TABLE public."Purchases";

CREATE TABLE public."Purchases"
(
    _id integer NOT NULL DEFAULT nextval('"Purchases__id_seq"'::regclass),
    "UserId" integer,
    quantity integer,
    method character varying(16) COLLATE pg_catalog."default",
    notes character varying(256) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    purchased date DEFAULT ('now'::text)::date,
    CONSTRAINT "Purchases_pkey" PRIMARY KEY (_id),
    CONSTRAINT "Purchases_UserId_fkey" FOREIGN KEY ("UserId")
        REFERENCES public."Users" (_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Purchases"
    OWNER to yzhjqzyprabhjl;

-- Index: purchases__user_id

-- DROP INDEX public.purchases__user_id;

CREATE INDEX purchases__user_id
    ON public."Purchases" USING btree
    ("UserId")
    TABLESPACE pg_default;

-- Index: purchases_created_at

-- DROP INDEX public.purchases_created_at;

CREATE INDEX purchases_created_at
    ON public."Purchases" USING btree
    ("createdAt")
    TABLESPACE pg_default;

-- Index: purchases_purchased

-- DROP INDEX public.purchases_purchased;

CREATE INDEX purchases_purchased
    ON public."Purchases" USING btree
    (purchased)
    TABLESPACE pg_default;

-- Trigger: updated_at

-- DROP TRIGGER updated_at ON public."Purchases";

CREATE TRIGGER updated_at
    BEFORE UPDATE 
    ON public."Purchases"
    FOR EACH ROW
    EXECUTE PROCEDURE public.updated_at();

-- Table: public."Schedules"

-- DROP TABLE public."Schedules";

CREATE TABLE public."Schedules"
(
    _id integer NOT NULL DEFAULT nextval('"Schedules__id_seq"'::regclass),
    location character varying(20) COLLATE pg_catalog."default" NOT NULL,
    day integer NOT NULL,
    title character varying(100) COLLATE pg_catalog."default" NOT NULL,
    teacher character varying(40) COLLATE pg_catalog."default" NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL,
    canceled boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "Schedules_pkey" PRIMARY KEY (_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Schedules"
    OWNER to yzhjqzyprabhjl;

-- Index: schedules_location_day_start_time

-- DROP INDEX public.schedules_location_day_start_time;

CREATE INDEX schedules_location_day_start_time
    ON public."Schedules" USING btree
    (location COLLATE pg_catalog."default", day, "startTime")
    TABLESPACE pg_default;

-- Trigger: updated_at

-- DROP TRIGGER updated_at ON public."Schedules";

CREATE TRIGGER updated_at
    BEFORE UPDATE 
    ON public."Schedules"
    FOR EACH ROW
    EXECUTE PROCEDURE public.updated_at();

-- Table: public."Users"

-- DROP TABLE public."Users";

CREATE TABLE public."Users"
(
    _id integer NOT NULL DEFAULT nextval('"Users__id_seq1"'::regclass),
    role "enum_Users_role" DEFAULT 'student'::"enum_Users_role",
    "lastName" character varying(20) COLLATE pg_catalog."default",
    "firstName" character varying(20) COLLATE pg_catalog."default",
    email character varying(80) COLLATE pg_catalog."default",
    "optOut" boolean DEFAULT false,
    phone character varying(23) COLLATE pg_catalog."default",
    provider "enum_Users_provider" DEFAULT 'local'::"enum_Users_provider",
    google json,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    password character varying(88) COLLATE pg_catalog."default",
    salt character varying(24) COLLATE pg_catalog."default",
    CONSTRAINT "Users_pkey" PRIMARY KEY (_id),
    CONSTRAINT "Users_email_key" UNIQUE (email)

)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Users"
    OWNER to yzhjqzyprabhjl;

-- Index: users_first_name

-- DROP INDEX public.users_first_name;

CREATE INDEX users_first_name
    ON public."Users" USING btree
    ("firstName" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: users_last_name

-- DROP INDEX public.users_last_name;

CREATE INDEX users_last_name
    ON public."Users" USING btree
    ("lastName" COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Trigger: updated_at

-- DROP TRIGGER updated_at ON public."Users";

CREATE TRIGGER updated_at
    BEFORE UPDATE 
    ON public."Users"
    FOR EACH ROW
    EXECUTE PROCEDURE public.updated_at();



CREATE TABLE sessions (
    sid character varying COLLATE pg_catalog."default" NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
) WITH (OIDS = FALSE);

-- View: public.attendances_full_info

-- DROP VIEW public.attendances_full_info;

CREATE OR REPLACE VIEW public.attendances_full_info AS
 SELECT "Attendances".teacher,
    "Attendances"."classTitle",
    "Attendances".location,
    "Attendances".attended,
    ("Users"."lastName"::text || ', '::text) || "Users"."firstName"::text AS student
   FROM "Attendances"
     JOIN "Users" ON "Attendances"."UserId" = "Users"._id;

-- View: public.attendees_nh_pq

-- DROP VIEW public.attendees_nh_pq;

CREATE OR REPLACE VIEW public.attendees_nh_pq AS
 SELECT count(*) AS count
   FROM "Attendances"
  WHERE "Attendances".location::text = 'North Hills'::text AND "Attendances".attended >= date_trunc('quarter'::text, (date_trunc('quarter'::text, 'now'::text::date::timestamp with time zone)::date - 1)::timestamp with time zone)::date AND "Attendances".attended < date_trunc('quarter'::text, 'now'::text::date::timestamp with time zone)::date;

-- View: public.attendees_per_class

-- DROP VIEW public.attendees_per_class;

CREATE OR REPLACE VIEW public.attendees_per_class AS
 SELECT "Attendances".location,
    "Attendances"."classTitle",
    "Attendances".teacher,
    "Attendances".attended,
    count("Attendances"."UserId") AS students
   FROM "Attendances"
  GROUP BY "Attendances".location, "Attendances"."classTitle", "Attendances".teacher, "Attendances".attended
  ORDER BY "Attendances".location, "Attendances".attended;


-- View: public.student_balances

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

  -- View: public.students_who_owe

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

  -- View: public.studio_analysis_pycy

-- DROP VIEW public.studio_analysis_pycy;

CREATE OR REPLACE VIEW public.studio_analysis_pycy AS
 SELECT "Attendances".location,
    to_char("Attendances".attended::timestamp with time zone, 'YYYY-MM'::text) AS year_month,
    count(*) AS attendances
   FROM "Attendances"
  WHERE "Attendances".attended >= '2017-01-01'::date
  GROUP BY "Attendances".location, (to_char("Attendances".attended::timestamp with time zone, 'YYYY-MM'::text))
  ORDER BY "Attendances".location, (to_char("Attendances".attended::timestamp with time zone, 'YYYY-MM'::text));

-- FUNCTION: public.zero_old_passes()

-- DROP FUNCTION public.zero_old_passes();

CREATE OR REPLACE FUNCTION public.zero_old_passes(
	)
    RETURNS void
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

