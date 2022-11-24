CREATE OR REPLACE FUNCTION public.read_notif(
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
   			
      
      INSERT INTO notif_read
	  VALUES (par_notifid, par_initiatorid, now());
      return 'OK';
	  
   end;
$BODY$;

ALTER FUNCTION public.read_notif(text, text)
    OWNER TO admin;
