-- Table: public.notifications

-- DROP TABLE IF EXISTS public.notifications;

CREATE TABLE IF NOT EXISTS public.notifications
(
    notif_id text COLLATE pg_catalog."default" NOT NULL,
    notif text COLLATE pg_catalog."default" NOT NULL,
    notif_type text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    user_type text COLLATE pg_catalog."default" NOT NULL,
    channel text COLLATE pg_catalog."default" NOT NULL,
    initiatorid text COLLATE pg_catalog."default" NOT NULL,
    receiverid text COLLATE pg_catalog."default" NOT NULL,
    timeline_ts text COLLATE pg_catalog."default" NOT NULL,
    duedate text COLLATE pg_catalog."default",
    startdate text COLLATE pg_catalog."default",
    is_new boolean NOT NULL DEFAULT true,
    is_read boolean NOT NULL DEFAULT false,
    poster text COLLATE pg_catalog."default" NOT NULL,
    notif_ts text COLLATE pg_catalog."default" NOT NULL,
    action_initiator text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (notif_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;

REVOKE ALL ON TABLE public.notifications FROM students;

GRANT SELECT, INSERT, UPDATE ON TABLE public.notifications TO admin;

GRANT SELECT, UPDATE, INSERT ON TABLE public.notifications TO faculty;

GRANT UPDATE, INSERT, SELECT ON TABLE public.notifications TO parents;

GRANT ALL ON TABLE public.notifications TO postgres;

GRANT SELECT, INSERT, UPDATE ON TABLE public.notifications TO students;



----------------------- ######################### ---------------------

-- Table: public.notif_seen

-- DROP TABLE IF EXISTS public.notif_seen;

CREATE TABLE IF NOT EXISTS public.notif_seen
(
    notif_id text COLLATE pg_catalog."default" NOT NULL,
    reader_id text COLLATE pg_catalog."default" NOT NULL,
    ts timestamp without time zone NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notif_seen
    OWNER to postgres;

REVOKE ALL ON TABLE public.notif_seen FROM students;

GRANT SELECT, INSERT, UPDATE ON TABLE public.notif_seen TO admin;

GRANT SELECT, UPDATE, INSERT ON TABLE public.notif_seen TO faculty;

GRANT UPDATE, INSERT, SELECT ON TABLE public.notif_seen TO parents;

GRANT ALL ON TABLE public.notif_seen TO postgres;

GRANT SELECT, INSERT, UPDATE ON TABLE public.notif_seen TO students;


----------------------------- ###################### --------------------------


-- Table: public.notif_read

-- DROP TABLE IF EXISTS public.notif_read;

CREATE TABLE IF NOT EXISTS public.notif_read
(
    notif_id text COLLATE pg_catalog."default" NOT NULL,
    reader_id text COLLATE pg_catalog."default" NOT NULL,
    ts time without time zone NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notif_read
    OWNER to postgres;

REVOKE ALL ON TABLE public.notif_read FROM students;

GRANT SELECT, INSERT, UPDATE ON TABLE public.notif_read TO admin;

GRANT SELECT, UPDATE, INSERT ON TABLE public.notif_read TO faculty;

GRANT UPDATE, INSERT, SELECT ON TABLE public.notif_read TO parents;

GRANT ALL ON TABLE public.notif_read TO postgres;

GRANT SELECT, INSERT, UPDATE ON TABLE public.notif_read TO students;