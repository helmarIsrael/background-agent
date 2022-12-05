-- FUNCTION: public.login_credentials(text)

-- DROP FUNCTION IF EXISTS public.login_credentials(text);

CREATE OR REPLACE FUNCTION public.login_credentials(
	par_username text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

  -- bug fix on subject teacher load not seen on login.
  declare
     loc_digusername text;
     loc_semid text;
     loc_group text;
     loc_userschool text;
     loc_userschoolarr text[];
     loc_school text;
     loc_idnumbyuser text;
     loc_idnumbyuserarr text[];
     loc_lrn text;
     loc_parentid text;
     loc_kids record;
	 loc_kids_section text;
	 loc_kids_vroomid text;
     loc_expired text;
     loc_autoid text;
     loc_advisee record;
     loc_kidstext text;
     loc_adviseetext text;
     loc_salt text;
     loc_advsection text;
     loc_advgrade int;
     loc_facload record;
     loc_religions record;
     loc_religionstext text;
     loc_facloadtext text;
     loc_nutritional_status record;
     loc_nutritional_statustext text;
     loc_quarter text;
     loc_personid text;
     loc_section text;
     loc_levelsection record;
     loc_grade text;
     loc_gradeall text;
     loc_load record;
     loc_loadtext text;
     loc_personnumid text;
     loc_coteacher record;
     loc_coteachertext text;
     loc_isadviser text;
	 loc_vroomid text;
	
  begin
     loc_digusername = sha1(par_username);
     loc_semid = getcurrsem();
     if not isuser(par_username) THEN
        raise exception 'Invalid User!';
     end if;
     loc_group = getuser_group(par_username);
     loc_userschool = getuserschool(loc_digusername);
     loc_userschoolarr = regexp_split_to_array(loc_userschool, E'\\*');
     loc_school = loc_userschoolarr[1];
     loc_lrn = 'none';
     loc_section = 'none';
     loc_grade = 'none';
     loc_expired = 'none';  -- loc_expired if none then it does not matter
     loc_gradeall = '-';
     loc_loadtext = 'none';
     loc_adviseetext = 'none';
     if loc_group = 'students' then
         loc_expired = isexpired(loc_digusername, loc_semid);
         loc_idnumbyuser = getidnumbyuser(loc_digusername, loc_group);
         --loc_idnumbyuserarr = regexp_split_to_array(loc_idnumbyuser, E'\\*');
         loc_lrn = loc_idnumbyuser;--loc_idnumbyuserarr[0];
         --getpersonlevel(in par_lrn text, in par_semid text, in par_schoolid text,
         select into loc_levelsection * from getlevelsection(loc_lrn, loc_school, loc_semid);
         --raise exception 'loc_lev=% lrn=% semid=% school=%', loc_levelsection, loc_lrn, loc_semid, loc_school;
         --out yearlevel text, out section text
         loc_grade = loc_levelsection.yearlevel;
         loc_section = loc_levelsection.section;
         loc_gradeall = loc_grade;

         if loc_gradeall isnull THEN
            loc_gradeall = '0';
         END IF;

         if loc_section isnull then
           loc_section = '-';
         END IF;

         if loc_school isnull THEN
           loc_school = '-';
         END IF;

         loc_adviseetext =  loc_grade || '*' ||
                                 loc_section || '*' ||
                                 loc_school || ',';

         if loc_adviseetext isnull then
           loc_adviseetext = '0*-*-';
         END IF;
     end if;

     loc_parentid = 'none';
     loc_kidstext = 'none';
     loc_personid = getpersonidbyusername(par_username);
     loc_parentid = loc_personid;

     if loc_group = 'parents' then
        loc_kidstext = '';
        for  loc_kids in select * from getmykids(loc_parentid, 'students') loop
			select into loc_kids_section section from personlevel WHERE studentid = loc_kids.personid;	
			loc_kids_vroomid = getvirtualroomidbysection(loc_kids_section);
             loc_kidstext = loc_kidstext || loc_kids.lrnnum || '*' ||
                            loc_kids.personid || '*' ||
                            loc_kids.fullname || '*' ||
                            loc_kids.gender || '*' || loc_kids.kidschool || '*' || loc_kids_vroomid || '$';
        end loop;
     end if;

     loc_autoid = '';

     loc_advgrade = 0;
     loc_advsection = 'none';
     loc_religionstext = 'none';
     loc_facloadtext = 'none';
     loc_nutritional_statustext = 'none';

     if loc_group = 'faculty' then
          loc_adviseetext = 'none';
          for loc_advisee in select * from getadvisee(loc_digusername,
                                  loc_school, loc_semid) loop
               loc_advsection = loc_advisee.section;
               loc_advgrade = loc_advisee.grade_level;
               loc_adviseetext = loc_adviseetext || loc_advisee.grade_level || '*' ||
                                 loc_advisee.section || '*' ||
                                 loc_advisee.schoolid || ',';
                loc_school = loc_advisee.schoolid;
          end loop;

          loc_religionstext = '';
          for loc_religions in select * from getreligion() loop
             loc_religionstext = loc_religionstext || loc_religions.relname || ',';
          end loop;

          loc_nutritional_statustext = '';

          for loc_nutritional_status in select nstatus from get_nstatus() loop
               loc_nutritional_statustext = loc_nutritional_statustext ||
                             upper(loc_nutritional_status.nstatus) || ',';
          end loop;
          loc_section = loc_advsection;
          loc_gradeall = loc_advgrade;
          loc_autoid = idgenerator('students', par_username);
          --      getload(in par_personnum text,
          --      in par_schoolid text,
          --      in par_quarter text, in par_semid text, in par_curriculumid text,
          --      out subjectid text, out description text, out color text,
          --      out icon text, out offeringid text, out section TEXT, out level TEXT)

     end if;
     loc_salt = get_salt(loc_digusername);
     --par_section text, par_level int, par_semid text, par_schoolid text
     loc_personnumid = getpersonnumidbyuser(loc_digusername);
     loc_quarter = '1';
     if loc_section != 'none' THEN
            loc_quarter = getactivequarter(loc_section, loc_gradeall::int, loc_semid, loc_school);
     end if;

    if loc_group = 'faculty' THEN
                loc_loadtext = 'none';
                for loc_load in select * from getpersonload2(
                                                    loc_personnumid,
                                                    loc_semid)
                                                /*getload(loc_personnumid,
                                                    loc_school,
                                                    loc_quarter,
                                                    loc_semid,
                                                    getactivecurriculum())*/ loop
                    loc_loadtext = loc_loadtext ||loc_load.subjectid || '*' ||
                                loc_load.description || '*' ||
                                loc_load.color || '*' ||
                                loc_load.icon || '*' ||
                                loc_load.offeringid || '*' ||
                                loc_load.section || '*' ||
                                loc_load.level || '*';
                    loc_coteachertext = '';

                    for loc_coteacher in select * from getcoteacher(loc_personnumid,
                                                                    loc_load.offeringid) loop
                        loc_coteachertext = loc_coteachertext || loc_coteacher.userpic || '-' ||
                                            replace(loc_coteacher.fullname, ',', '^') || '-'|| loc_coteacher.personnumid || '@';
                    end loop;

                    loc_loadtext = loc_loadtext || loc_coteachertext || ',';
                end loop;
      end if;
     
      if loc_group = 'students' THEN
          loc_loadtext = '';
                for loc_load in select * from getpersonload2(loc_personnumid,
                                                    loc_semid) loop
                    loc_loadtext = loc_loadtext ||loc_load.subjectid || '*' ||
                                loc_load.description || '*' ||
                                loc_load.color || '*' ||
                                loc_load.icon || '*' ||
                                loc_load.offeringid || '*' ||
                                '' || '*' ||
                                loc_load.level || '*';
                    loc_loadtext = loc_loadtext ||  ',';
                end loop;

                if length(loc_loadtext) = 0 THEN
                  loc_loadtext = 'none';
                end if; 
          
      end if;

    if loc_group = 'ispeval' then
      loc_userschool = 'NOT SET**NOT SET*NOT SET*NOT SET';
    end if;

    if loc_group = 'principal' then
      loc_group = 'admin';
    end if;

    if loc_group = 'super10' then
         loc_quarter = getcurrentquartersem(loc_semid);
    end if;
-- 	######################################3
	select into loc_vroomid virtualroomid from
      adviser where section = loc_section;

      if loc_vroomid isnull then
          loc_vroomid = 'NONE';
      end if;
	  
--- ####################################3

     RETURN (SELECT json_build_object(
                'status', 'ok',
		        'usertype', loc_group,
		        'userdetails', getuserdetails(loc_digusername),
		        'userschool', loc_userschool,
		        'semid', loc_semid,
		        'isexpired', loc_expired,
                'level', loc_gradeall,
                'prentid', loc_parentid,
                'kids', loc_kidstext,
                'freeid', loc_autoid,
                'designated',loc_adviseetext,
                'token', sha1(par_username || loc_group || loc_salt),
                'advsection', loc_advsection,
                'advgrade', loc_advgrade,
                'quarter', loc_quarter,
                'religions', loc_religionstext,
                'imgsrc', getcloudinaryurl(loc_personid),
                'nstatus', loc_nutritional_statustext,
                'lrn', loc_lrn,
                'mystu', loc_kidstext,
                'section', loc_section,
                'grade', loc_grade,
                'load', loc_loadtext,
		 		'personnumid', loc_personnumid,
		 		'vroomid', loc_vroomid
               )
      );
  end;

$BODY$;

ALTER FUNCTION public.login_credentials(text)
    OWNER TO admin;
