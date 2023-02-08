-- FUNCTION: public.updatephone(text, text)

-- DROP FUNCTION IF EXISTS public.updatephone(text, text);

CREATE OR REPLACE FUNCTION public.updatephone(
	par_personid text,
	par_phonenum text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
    begin
         update phone_numbers set phone_num = par_phonenum where personid = par_personid;
		 
		 
		 return (select json_build_object('status', 'OK'));
    END;
	
	
  
$BODY$;

ALTER FUNCTION public.updatephone(text, text)
    OWNER TO admin;
