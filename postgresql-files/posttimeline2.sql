-- FUNCTION: public.post_timeline2(text, text, text, date, text, text, text, boolean, integer, text, text)

-- DROP FUNCTION IF EXISTS public.post_timeline2(text, text, text, date, text, text, text, boolean, integer, text, text);

CREATE OR REPLACE FUNCTION public.post_timeline2(
	par_username text,
	par_token text,
	par_section text,
	par_duedate date,
	par_message text,
	par_group text,
	par_tltype text,
	par_isdefault boolean,
	par_publicity integer,
	par_semid text DEFAULT ''::text,
	par_schoolid text DEFAULT ''::text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

  DECLARE
    loc_offeringdetails RECORD;
    loc_student record;
    loc_initiatorid text;
    loc_responses json[];
    loc_usergroup text;
    loc_message text;
    loc_default text;
    loc_teacher record;
    loc_principals record;
    loc_region record;
    loc_lrn text;
    loc_adviser text;
    loc_level int;
    loc_section text;
    loc_levelsection record;
    loc_i int DEFAULT 0;
    kids record;
    loc_parents record;
  BEGIN

    if getcurrsem() <> par_semid then
        raise exception 'Posting for this semester:% is not allowed!', par_semid;
    END IF;

    if verifyquery(par_username, par_token) = 'KO' THEN
        raise exception 'Something went wrong!';
    END IF;

    loc_usergroup = getuser_group(par_username);

    if loc_usergroup = 'principal' then
      loc_usergroup = 'admin';
    end if;

    if loc_usergroup <> par_group then
        raise exception 'Inconsistencies detected!';
    END IF;

    if par_tltype = 'assignment' THEN
          select into loc_offeringdetails * from getofferingdetails(par_section);
          if loc_offeringdetails isnull then
            raise exception 'Unexpected error occured.';
          END IF;
    end if;

    loc_initiatorid = getpersonidbyusername(par_username);

    if par_isdefault then
      loc_default = getdefault();
    else
      loc_default = '';
    END IF;

    if loc_usergroup = 'faculty' then
            if par_tltype = 'assignment' then
              loc_message = ' on ' || loc_offeringdetails.subjectid || ' '
                            || loc_offeringdetails.level::TEXT || '  ' ||
                            par_message ||  '@due:' || par_duedate::TEXT;
              for loc_student in select * from getclasslist(
                                                            loc_offeringdetails.section,
                                                            loc_offeringdetails.level::INT,
                                                            loc_offeringdetails.schoolid,
                                                            loc_offeringdetails.semid
                                                        ) LOOP
                        loc_responses = loc_responses ||
                                      json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                        loc_initiatorid,
                                                        loc_student.personid,
                                                        loc_message,
                                                        par_tltype, --
                                                        par_publicity,
                                                        now(),
                                                        loc_offeringdetails.semid,
                                                        loc_offeringdetails.schoolid
                                              ),
										 'receiverid', loc_student.personid,
										 'ts', now()::timestamp without time zone
                                        );
              END LOOP;

            ELSE
               loc_responses = loc_responses ||
                                      json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                        loc_initiatorid,
                                                        loc_default,
                                                        par_message,
                                                        par_tltype,
                                                        par_publicity,
                                                        now(),
                                                        par_semid,
                                                        par_schoolid
                                              ),
										 'receiverid', loc_default,
										  'ts', now()::timestamp without time zone
                                        );
            END IF;
      elsif loc_usergroup = 'admin' or loc_usergroup = 'subadmin' then
          for loc_teacher in
          select personnum.personid, personnum.personid
          from personschool, personnum
          where personschool.personnumid = personnum.personnumid and
                personnum.persontype = 'faculty' and
                iscurrent and
                personschool.schoolid = par_schoolid loop

            loc_responses = loc_responses ||
                                      json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                        loc_initiatorid,
                                                        loc_teacher.personid,
                                                        par_message,
                                                        par_tltype,
                                                        par_publicity,
                                                        now(),
                                                        par_semid,
                                                        par_schoolid
                                              ),
										 'receiverid', loc_teacher.personid,
										  'ts', now()::timestamp without time zone
                                        );

          end loop;
      elsif loc_usergroup = 'ispeval' then

          select into loc_region region, division, district from persondivision where personid = loc_initiatorid;
          if loc_region isnull then
            raise exception 'Something went wrong!';
          end if;

         for loc_principals in select personschool.personnumid, school.schoolid, personnum.personid from personschool, personnum, school where
              personschool.schoolid = school.schoolid and
              personschool.personnumid = personnum.personnumid and
              personnum.persontype = 'admin' and
              school.region = loc_region.region and
              school.division = loc_region.division and
              school.district = loc_region.district AND
              personschool.iscurrent
              loop

                loc_responses =  loc_responses ||
                                json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                                loc_initiatorid,
                                                                loc_principals.personid,
                                                                par_message,
                                                                par_tltype,
                                                                par_publicity,
                                                                now(),
                                                                par_semid,
                                                                loc_principals.schoolid
                                                            ),
										'receiverid', loc_principals.personid,
										'ts', now()::timestamp without time zone
                                );

          end loop;
      elsif loc_usergroup = 'super10' or loc_usergroup = 'mande' THEN

          select into loc_region region, division from persondivision where personid = loc_initiatorid;
          if loc_region isnull then
            raise exception 'Something went wrong!';
          end if;

         for loc_principals in
         select person.personid as personid from persondivision, personnum, person
         where
              person.personid = personnum.personid and
              persondivision.division = loc_region.division and
              persondivision.personid = personnum.personid and
              personnum.persontype = 'ispeval' and
              persondivision.current
          loop
             loc_i = loc_i + 1;
             loc_responses =  loc_responses ||
                                json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                                loc_initiatorid,
                                                                loc_principals.personid,
                                                                par_message,
                                                                par_tltype,
                                                                par_publicity,
                                                                now(), --now() + interval '10 second',
                                                                par_semid,
                                                                null
                                                            ),
										'receiverid', loc_principals.personid,
										'ts', now()::timestamp without time zone
                                );
           end loop;

      elsif  loc_usergroup = 'bisor' then
         select into loc_region region, division from persondivision where personid = loc_initiatorid;
          if loc_region isnull then
            raise exception 'Something went wrong!';
          end if;

         for loc_principals in select personschool.personnumid, school.schoolid from personschool, personnum, school where
              personschool.schoolid = school.schoolid and
              personschool.personnumid = personnum.personnumid and
              personnum.persontype = 'admin' and
              school.region = loc_region.region and
              school.division = loc_region.division
              loop

             loc_responses =  loc_responses ||
                                json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                                loc_initiatorid,
                                                                getpersonidbyidnum(loc_principals.personnumid),
                                                                par_message,
                                                                par_tltype,
                                                                par_publicity,
                                                                now(),
                                                                par_semid,
                                                                loc_principals.schoolid
                                                            ),
										'receiverid', getpersonidbyidnum(loc_principals.personnumid),
										'ts', now()::timestamp without time zone
                                );

          end loop;
      elsif loc_usergroup = 'students' then
         -- this will enable informal student interactions
        loc_lrn = getpersonnumidbyuser(sha1(par_username));
        select into loc_levelsection * from personlevel where studentid = loc_lrn  and semid = par_semid;

        if loc_levelsection isnull then
          raise exception 'You can only post when you are enrolled.';
          /*
           loc_adviser = 'NONE';
           loc_level = 0;
           loc_section = '';
           */

         end if;

        loc_adviser = loc_levelsection.adviserid;
         loc_level = loc_levelsection.yearlevel;
         loc_section = loc_levelsection.section;

        loc_responses = loc_responses ||  json_build_object(
                                        'status', 'ok',
                                        'item', insert2timelinestudents(
                                                                loc_initiatorid,
                                                                getdefault(),
                                                                par_message,
                                                                par_tltype,
                                                                par_publicity,
                                                                now(),
                                                                par_semid,
                                                                loc_levelsection.schoolid,
                                                                loc_level::text || loc_section || par_semid
                                                            ),
										'receiverid', getdefault(),
										'ts', now()::timestamp without time zone
                                );
      elsif loc_usergroup = 'parents' then
         
        for kids in select * from getmykids(loc_initiatorid, 'students') loop
                --if kids.lrnnum = par_lrn then
               select into loc_levelsection * from personlevel where studentid = kids.lrnnum and semid = par_semid;           
               if loc_levelsection isnull then
                    loc_adviser = 'NONE';
                    loc_level = 0;
                    loc_section = '';
               else
                    loc_adviser = loc_levelsection.adviserid;
                    loc_level = loc_levelsection.yearlevel;
                    loc_section = loc_levelsection.section;
              end if;
              
              if not loc_levelsection isnull THEN
                   for loc_parents in select * from person where personid IN
                      (
                        select personid from getclasslist(
                        loc_section, loc_level, loc_levelsection.schoolid, par_semid)
                        
                        ) and 
                            (
                                father <> loc_initiatorid or 
                                mother <> loc_initiatorid or 
                                guardian <> loc_initiatorid
                            ) loop
                  
                        if not loc_parents.father isnull and not (
                                                                    loc_parents.father = 'NO' OR
                                                                    loc_parents.father = ''
                                                                  )   
                                                                     then
                          loc_responses = loc_responses || json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                                loc_initiatorid,
                                                                loc_parents.father,
                                                                par_message,
                                                                par_tltype,
                                                                par_publicity,
                                                                now(),
                                                                par_semid,
                                                                loc_levelsection.schoolid
                                                            ),
							  			'receiverid', loc_parents.father,
							  			'ts', now()::timestamp without time zone
                                     );
                         end if;       
         

                        if not loc_parents.mother isnull and not (
                                                                    loc_parents.mother = 'NO' OR
                                                                    loc_parents.mother = '' or
                                                                    loc_parents.father = loc_parents.mother
                                                                  )then
                          loc_responses = loc_responses || json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                                loc_initiatorid,
                                                                loc_parents.mother,
                                                                par_message,
                                                                par_tltype,
                                                                par_publicity,
                                                                now(),
                                                                par_semid,
                                                                loc_levelsection.schoolid
                                                            ),
							  			'receiverid', loc_parents.mother,
							  			'ts', now()::timestamp without time zone
                                     );
                         end if;  

                         if not loc_parents.guardian isnull and not (
                                                                    loc_parents.guardian = 'NO' OR
                                                                    loc_parents.guardian = ''
                                                                  ) then
                          loc_responses = loc_responses || json_build_object(
                                        'status', 'ok',
                                        'item', insert2timeline(
                                                                loc_initiatorid,
                                                                loc_parents.guardian,
                                                                par_message,
                                                                par_tltype,
                                                                par_publicity,
                                                                now(),
                                                                par_semid,
                                                                loc_levelsection.schoolid
                                                            ),
							  			'receiverid', loc_parents.guardian,
							  			'ts', now()::timestamp without time zone
                                     );
                         end if;  

                   end loop;
              end if;
        
        end loop;
    
         
      end if;

    return (SELECT
              json_build_object(
                'status', 'ok',
                'responses', loc_responses,
				'initiatorid', loc_initiatorid
              )
        );

  END;
  

$BODY$;

ALTER FUNCTION public.post_timeline2(text, text, text, date, text, text, text, boolean, integer, text, text)
    OWNER TO admin;
