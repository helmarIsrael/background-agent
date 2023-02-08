
CREATE OR REPLACE FUNCTION public.insertphonenumber(
	par_phoneNum text,
	par_personid text,
	par_schoolid text,
	par_usertype text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
	begin
	
		if par_usertype = 'faculty' then
		insert into phone_numbers(personid, 
								  phone_num,
								  schoolid,
								  user_type) values (par_personid,
													 par_phoneNum, 
													 par_schoolid,
													 par_usertype
													);
		end if;
		


			return (select json_build_object('status', 'OK'));
	END;
	

$BODY$;

ALTER FUNCTION public.insertphonenumber(text, text, text, text)
    OWNER TO admin;
