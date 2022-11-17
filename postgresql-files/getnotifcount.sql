-- FUNCTION: public.getnewnotifcount(boolean, text[])

-- DROP FUNCTION IF EXISTS public.getnewnotifcount(boolean, text[]);

CREATE OR REPLACE FUNCTION public.getnewnotifcount(
	par_status boolean,
	par_channels record)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
     loc_count text;
	 loc_channels text[];
	 
   begin
   		
      select into loc_count count(*) from
      notifications where is_new = par_status;

      if loc_count isnull then
          return 'NONE';
      end if;

      return ARRAY[par_channels]::text;
   end;
$BODY$;

ALTER FUNCTION public.getnewnotifcount(boolean,record)
    OWNER TO admin;
