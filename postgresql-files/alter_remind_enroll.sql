-- FUNCTION: public.sendreminderenrollment(text, text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.sendreminderenrollment(text, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.sendreminderenrollment2(
	par_username text,
	par_token text,
	par_group text,
	par_semid text,
	par_schoolid text,
	par_facultyid text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
  loc_result text;
  loc_personid text;
begin
loc_result = verifyuser(par_username, par_token, par_group);
loc_personid = getpersonidbyusername(par_username);
loc_result = insert2timeline(
                                  loc_personid,
                                  getpersonidbyidnum(par_facultyid),
                                  'Gentle Reminder for the enrollment of your students under your ' ||
                                  ' advisory section',
                                   'memo',
                                    2,
                                    now()::timestamp with time zone,
                                  par_semid,
                                  par_schoolid
                              );
  loc_result = inpm(loc_personid, 'Send reminder for enrollment of student in advisory.');

  return (select
         json_build_object(
             'status', 'OK',
			 'ts', now()::timestamp without time zone 
             ));
end;
$BODY$;

ALTER FUNCTION public.sendreminderenrollment2(text, text, text, text, text, text)
    OWNER TO postgre;
