
CREATE OR REPLACE FUNCTION public.checknewnotif(
	par_notifid text,
	par_personid text
	)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
   loc_notifid text;
   begin
   
   		select into loc_notifid notif_id from notif_new
		where notif_id = par_notifid and reader_id = par_personid;
		
		if loc_notifid isnull then
			return 'None';
		end if;

      return loc_notifid::text;
   end;
$BODY$;

ALTER FUNCTION public.checknewnotif(text, text)
    OWNER TO admin;
