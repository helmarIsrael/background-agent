CREATE OR REPLACE FUNCTION public.see_newnotif(
	par_notifid text,
	par_initiatorid text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
     loc_count text;
	 loc_channels text[];
	 
   begin
   			
      
      INSERT INTO notif_seen
	  VALUES (par_notifid, par_initiatorid, now());
      return 'OK';
	  
   end;
$BODY$;

ALTER FUNCTION public.see_newnotif(text, text)
    OWNER TO admin;
