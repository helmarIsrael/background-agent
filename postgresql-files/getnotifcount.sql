

CREATE OR REPLACE FUNCTION public.getnewnotifcount(
	par_status boolean,
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
   		
-- 		for item in par_channels loop
-- 			loc_channels := array_append(loc_channels, item);
-- 		end loop;
			
      select into loc_count count(*) from
      notifications where is_new = par_status and channel = ANY(par_channels) and initiatorid != par_initiatorid;

      if loc_count isnull then
          return 'NONE';
      end if;

      return loc_count::text;
   end;
$BODY$;

ALTER FUNCTION public.getnewnotifcount(boolean, text[], text)
    OWNER TO admin;
