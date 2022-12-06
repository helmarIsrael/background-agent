-- FUNCTION: public.publishgrades(text, text, text, text, text, boolean)

-- DROP FUNCTION IF EXISTS public.publishgrades(text, text, text, text, text, boolean);

CREATE OR REPLACE FUNCTION public.publishgrades(
	par_offeringid text,
	par_quarter_ text,
	par_username text,
	par_group text,
	par_token text,
	par_lockval boolean)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
    loc_usergroup text;
    loc_sectiondetails record;
    loc_studentnames record;
    loc_stamping text;
    loc_publishstatus record;
    loc_res text;
    loc_facultyid text;
	
	loc_initiatorid text;
	loc_studentid text;
	loc_subdetails text;
	loc_studentsect text;
	loc_nowts timestamp without time zone default now();
  begin

    if verifyquery(par_username, par_token) = 'KO' THEN
      raise exception 'Something went wrong!';
    END IF;

    loc_usergroup = getuser_group(par_username);

    if loc_usergroup <> 'faculty' THEN
      raise exception 'Invalid Transaction!';
    END IF;

    if loc_usergroup <> par_group then
      raise exception 'Inconsistencies detected!';
    END IF;

    select
           into loc_sectiondetails  *
    from
         offering
    where
        offeringid = par_offeringid;

    if loc_sectiondetails isnull then
      raise exception 'Undefined section!';
    end if;

    select into loc_publishstatus * from  summativequartergrade
    where removenumandspace(subject) = removenumandspace(loc_sectiondetails.subjectid)  and -- 'HLT'
      upper(section) = upper(loc_sectiondetails.section) and
      level = loc_sectiondetails.level  and
      schoolid = loc_sectiondetails.schoolid and
      quarter_ = par_quarter_ and
      semid = loc_sectiondetails.semid;

    if loc_publishstatus isnull then
      raise exception 'No grades were ecoded.';
    end if;

    if not loc_publishstatus.issubmitted then
      raise exception 'You have to lock the grades before publishing!';
    end if;

    if loc_publishstatus.published then
      return (select
                json_build_object(
                                        'status', 'ok',
                                        'message', 'This is already published!'
                  )
         );
    end if;

    for loc_studentnames in select * from summativequartergrade  where removenumandspace(subject) = removenumandspace(loc_sectiondetails.subjectid)  and -- 'HLT'
      upper(section) = upper(loc_sectiondetails.section) and
      level = loc_sectiondetails.level  and
      schoolid = loc_sectiondetails.schoolid and
      quarter_ = par_quarter_ and
      semid = loc_sectiondetails.semid loop
	  
	  loc_studentsect = getvirtualroomidbysection(loc_sectiondetails.section);
	  loc_initiatorid = getpersonidbyusername(par_username);
	  loc_studentid = getpersonidbyidnum(loc_studentnames.studentid);
	  loc_subdetails = loc_studentnames.subject;
	  
      loc_stamping =  stampevent(par_username, loc_studentnames.studentid,
                                 'Recorded Grade Entry ' || loc_studentnames.grade::text ||
                                 ' for subject ' || loc_studentnames.subject, 'grade',
                                  2, loc_studentnames.semid, loc_studentnames.schoolid
                      );
  end loop;

    update summativequartergrade set
                                     published = par_lockval,
                                     datepublished = now()::date
    where removenumandspace(subject) = removenumandspace(loc_sectiondetails.subjectid)  and -- 'HLT'
      upper(section) = upper(loc_sectiondetails.section) and
      level = loc_sectiondetails.level  and
      schoolid = loc_sectiondetails.schoolid and
      quarter_ = par_quarter_ and
      semid = loc_sectiondetails.semid;
   loc_facultyid = getpersonnumidbyuser(sha1(par_username));
   loc_res =  computelopteacher(
                        loc_facultyid,
                        par_offeringid,
                        par_quarter_,
                        true);

    loc_res = incsubmit(loc_facultyid || par_quarter_ || loc_sectiondetails.schoolid || loc_sectiondetails.semid);
    -- personnumid quarter schoolid semid
    --increportload(loc_facultyid, par_semid, par_quarter_, par_offeringid, par_transfer boolean) RETURNS text

    if par_quarter_ = '4' and par_lockval then -- if teachers publish grades for 4th quarter, publish also the summative grade
      update summativequartergrade set published = true,
                                       datepublished = now()::date
          where removenumandspace(subject) = removenumandspace(loc_sectiondetails.subjectid) and
            upper(section) = upper(loc_sectiondetails.section) and
            level = loc_sectiondetails.level  and
            schoolid = loc_sectiondetails.schoolid and
            quarter_ = '5' and
            semid = loc_sectiondetails.semid;
            loc_res = incsubmit(loc_facultyid || par_quarter_ || loc_sectiondetails.schoolid || loc_sectiondetails.semid);
            loc_res =  computelopteacher(
                        getpersonnumidbyuser(sha1(par_username)),
                        par_offeringid,
                        '5',
                        true);
    end if;

    return (select
                json_build_object(
                                        'status', 'ok',
                                        'message', 'Publish operation successful! Students and Parents can now see the grades.',
										'initiatorid', loc_initiatorid,
										'studentid', loc_studentid,
										'subdetails', loc_subdetails,
										'studentvroomid', loc_studentsect,
										'ts', loc_nowts
                  )
         );
  END;
$BODY$;

ALTER FUNCTION public.publishgrades(text, text, text, text, text, boolean)
    OWNER TO postgre;
