-- Table: public.notifications

-- DROP TABLE IF EXISTS public.notifications;

CREATE TABLE IF NOT EXISTS public.notifications
(
    notif_id "char" NOT NULL,
    notif "char",
    notif_type "char",
    username "char",
    user_type "char",
    channel "char",
    initiatorid "char",
    receiverid "char",
    "timestamp" "char",
    duedate "char",
    startdate "char"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;