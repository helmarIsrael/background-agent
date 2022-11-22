ALTER TABLE IF EXISTS public.notifications
    ADD COLUMN action_initiator text NOT NULL;