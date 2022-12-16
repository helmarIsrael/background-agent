-- FUNCTION: public.sendreminder(text, text, text, text, text, text, text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.sendreminder(text, text, text, text, text, text, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.sendreminder2(
	par_username text,
	par_token text,
	par_group text,
	par_quarter text,
	par_semid text,
	par_schoolid text,
	par_facultyid text,
	par_subject text,
	par_section text,
	par_title text,
	par_type text)
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
                                  getpersonidbyusername(par_username),
                                  getpersonidbyidnum(par_facultyid),
                                  'Gentle Reminder for the submission of ' || par_type || ' for ' ||
                                  par_subject || ' ' || par_title || ', section ' || par_section || ', quarter ' || par_quarter || '. <br /> ' ||
                                  'The deadline was set to ' || getdeadline(
                                                par_semid,
                                                par_schoolid,
                                                par_quarter,
                                                par_type
                                              ),
                                   'memo',
                                    2,
                                    now()::timestamp with time zone,
                                  par_semid,
                                  par_schoolid
                              );
  loc_result = inpm(loc_personid, 'Send reminder for ' || par_type || ' Subject '|| par_subject || ' ' || par_section);

  return (select
         json_build_object(
             'status', 'OK',
			 'ts', now()::timestamp without time zone
             ));
end;
$BODY$;

ALTER FUNCTION public.sendreminder2(text, text, text, text, text, text, text, text, text, text, text)
    OWNER TO postgre;
