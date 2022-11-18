-- FUNCTION: public.readnewnotification(text[], text)

-- DROP FUNCTION IF EXISTS public.readnewnotification(text[], text);

CREATE OR REPLACE FUNCTION public.readnewnotification(
	par_channels text[],
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
   			
      
      UPDATE notifications SET is_new = False
	  where channel = ANY(par_channels) and receiverid == par_initiatorid;

      return 'OK';
	  
   end;
$BODY$;

ALTER FUNCTION public.readnewnotification(text[], text)
    OWNER TO admin;
