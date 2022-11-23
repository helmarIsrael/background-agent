CREATE TABLE public.notif_seen
(
    notif_id text NOT NULL,
    reader_id text NOT NULL,
    ts timestamp without time zone NOT NULL
);

ALTER TABLE IF EXISTS public.notif_seen
    OWNER to postgres;