CREATE OR REPLACE FUNCTION public.getPhoneNumberbyPersonid(
	par_personid text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
     loc_phoneNumber text;
   begin
      select into loc_phoneNumber phone_num from
      phone_numbers where personid = par_personid;

      if loc_phoneNumber isnull then
          return 'NONE';
      end if;

      return loc_phoneNumber;
   end;
$BODY$;

ALTER FUNCTION public.getPhoneNumberbyPersonid(text)
    OWNER TO admin;
