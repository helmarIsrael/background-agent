CREATE TABLE public.notifications
(
    notif_id "char" NOT NULL,
    action_id "char" NOT NULL,
    action_type "char" NOT NULL,
    "timestamp" "char" NOT NULL,
    channel "char"[] NOT NULL,
    notif_content "char" NOT NULL,
    initiator_id "char",
    receiver_id "char",
    PRIMARY KEY (notif_id, action_id)
);

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;