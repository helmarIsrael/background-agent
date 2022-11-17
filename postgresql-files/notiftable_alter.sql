ALTER TABLE public.notifications
    ALTER COLUMN notif_id TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN notif TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN notif_type TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN username TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN user_type TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN channel TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN initiatorid TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN receiverid TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN timeline_ts TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN duedate TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN startdate TYPE text;

ALTER TABLE public.notifications
    ALTER COLUMN poster TYPE text;