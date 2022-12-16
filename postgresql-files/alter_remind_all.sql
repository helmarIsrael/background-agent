-- FUNCTION: public.sendreminderall(text, text, text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.sendreminderall(text, text, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.sendreminderall2(
	par_username text,
	par_token text,
	par_group text,
	par_facultyid text,
	par_semid text,
	par_schoolid text,
	par_quarter text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
  loc_result text;
  loc_faculty_load record;
  loc_remindall text default 'Gentle reminder for the following <br />';
  loc_countgrades int default 0;
  loc_countia int default 0;
  loc_gradesubjects json[];
  loc_iasubjects json[];
  loc_userpersonid text;
  loc_facultypersonid text;
  loc_now timestamp without time zone;
  loc_i int default 0;
begin
  loc_result = verifyuser(par_username, par_token, par_group);
  loc_userpersonid = getpersonidbyusername(par_username);
  loc_facultypersonid = getpersonidbyidnum(par_facultyid);
  loc_now = now()::timestamp without time zone;
  for loc_faculty_load in
          select personload.offeringid, subject.subjectid, offering.level, subject.description, offering.section
          from personload, offering, subject
          where
              personload.offeringid = offering.offeringid and
              subject.subjectid = offering.subjectid and
              offering.schoolid = par_schoolid and
              personnumid = par_facultyid and
              personload.semid = par_semid loop

              loc_result = submissiondate(loc_faculty_load.subjectid || ' ' || loc_faculty_load.level,
                              loc_faculty_load.section,
                              par_semid,
                              par_schoolid,
                              par_quarter,
                              loc_faculty_load.level);

              if  loc_result = '' then
                  loc_countgrades = loc_countgrades + 1;
                  loc_gradesubjects = loc_gradesubjects || json_build_object('subject', loc_faculty_load.subjectid || ' ' || loc_faculty_load.level::text,
                                                        'description', loc_faculty_load.description,
                                                        'section', loc_faculty_load.section);
                  loc_i = loc_i + 1;
                  loc_remindall = loc_remindall || '&nbsp;&nbsp;&nbsp; '|| loc_i::text  || '. Grade for ' || loc_faculty_load.subjectid || ' ' || loc_faculty_load.level::text || ' ' ||
                                  loc_faculty_load.description || ' section ' || loc_faculty_load.section || '<br />';

              end if;

              loc_result = iampssubmissiondate(loc_faculty_load.offeringid,
                                   par_quarter,
                                   par_facultyid);

              if loc_result = '' then
                    loc_countia = loc_countia + 1;
                    loc_i = loc_i + 1;
                    loc_iasubjects = loc_iasubjects || json_build_object('subject', loc_faculty_load.subjectid || ' ' || loc_faculty_load.level::text,
                                                        'description', loc_faculty_load.description,
                                                        'section', loc_faculty_load.section);

                    loc_remindall = loc_remindall || '&nbsp;&nbsp;&nbsp; ' || loc_i::text || '. Item Analysis for ' || loc_faculty_load.subjectid || ' ' || loc_faculty_load.level::text || ' ' ||
                                  loc_faculty_load.description || ' section ' || loc_faculty_load.section || '<br />';
                  end if;
  end loop;

  loc_result = insert2timeline(
                                            loc_userpersonid,
                                            loc_facultypersonid,
                                            loc_remindall,
                                             'memo',
                                              2,
                                            loc_now,
                                            par_semid,
                                            par_schoolid
                                        );

  loc_result = inpm(loc_userpersonid, 'Send reminder all');

  return (select json_build_object(
                'status', 'OK',
                'gradescount', loc_countgrades,
                'iacount', loc_countia,
                'gradesubjects', loc_gradesubjects,
                'iasubjects', loc_iasubjects,
	  			'ts', now()::timestamp without time zone
                     ));
end;
$BODY$;

ALTER FUNCTION public.sendreminderall2(text, text, text, text, text, text, text)
    OWNER TO postgre;
