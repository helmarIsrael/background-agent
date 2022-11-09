CREATE OR REPLACE FUNCTION public.getvirtualroomid(
	par_section text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
     loc_virtualroomid text;
   begin
      select into loc_virtualroomid virtualroomid from
      adviser where section = upper(par_section);

      if loc_virtualroomid isnull then
          return 'NONE';
      end if;

      return loc_virtualroomid;
   end;
$BODY$;

ALTER FUNCTION public.getvirtualroomid(text)
    OWNER TO admin;
