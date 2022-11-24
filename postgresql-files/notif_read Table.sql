CREATE TABLE public.notif_read
(
    notif_id text NOT NULL,
    reader_id text NOT NULL,
    ts time without time zone NOT NULL
);

ALTER TABLE IF EXISTS public.notif_read
    OWNER to postgres;