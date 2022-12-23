-- FUNCTION: public.getnewnotifcount(boolean, text[], text, text, text[])

-- DROP FUNCTION IF EXISTS public.getnewnotifcount(boolean, text[], text, text, text[]);

CREATE OR REPLACE FUNCTION public.getnewnotifcount(
	par_status boolean,
	par_channels text[],
	par_initiatorid text,
	par_usertype text,
	par_kidid text[])
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
   	notif record;
     loc_count text;
	 loc_channels text[];
	 notif_count int;
   begin
		notif_count = 0;
--       select into loc_count count(*) from
--       notifications where is_new = par_status and channel = ANY(par_channels) and action_initiator != par_initiatorid;
		if par_usertype = 'faculty' then
			for notif in select * from notifications where channel = ANY(par_channels) 
			and action_initiator != par_initiatorid
			and (user_type != 'students' or ((notif_type = 'comment' or  notif_type = 'reaction') and initiatorid = par_initiatorid))
			loop
				if notif.notif_id != checknewnotif(notif.notif_id, par_initiatorid) then
					if notif.notif_type != 'assignment' then
						notif_count = notif_count + 1;
					end if;

					if notif.notif_type = 'assignment' then
						if notif.receiverid = par_initiatorid then
							notif_count = notif_count + 1;
						end if;
					end if;
				end if;
			end loop;
		elsif par_usertype = 'parents' then
			for notif in select * from notifications where channel = ANY(par_channels) 
				and action_initiator != par_initiatorid 
				and (user_type = 'faculty' OR (action_initiator = ANY(par_kidid) or receiverid = ANY(par_kidid)))  
			loop
				if notif.notif_id != checknewnotif(notif.notif_id, par_initiatorid) then
					if notif.notif_type != 'assignment' then
						notif_count = notif_count + 1;
				
					elsif notif.notif_type = 'assignment' then						
						if notif.receiverid = ANY(par_kidid) then
							notif_count = notif_count + 1;
						end if;
					end if;
					
				end if;
			end loop;
		
		else
			for notif in select * from notifications where channel = ANY(par_channels) 
			and action_initiator != par_initiatorid
			loop
				if notif.notif_id != checknewnotif(notif.notif_id, par_initiatorid) then
					if notif.notif_type != 'assignment' then
						notif_count = notif_count + 1;
					end if;

					if notif.notif_type = 'assignment' then
						if notif.receiverid = par_initiatorid then
							notif_count = notif_count + 1;
						end if;
					end if;
				end if;
			end loop;
		end if;

      return notif_count::text;
   end;
$BODY$;

ALTER FUNCTION public.getnewnotifcount(boolean, text[], text, text, text[])
    OWNER TO admin;

--------------------------############################--------------------------------

-- FUNCTION: public.getvirtualroomidbysection(text)

-- DROP FUNCTION IF EXISTS public.getvirtualroomidbysection(text);

CREATE OR REPLACE FUNCTION public.getvirtualroomidbysection(
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

ALTER FUNCTION public.getvirtualroomidbysection(text)
    OWNER TO admin;
	
--------------------------######################---------------------------------
-- FUNCTION: public.getnotification(text[], text, text, text[])

-- DROP FUNCTION IF EXISTS public.getnotification(text[], text, text, text[]);

CREATE OR REPLACE FUNCTION public.getnotification(
	par_channels text[],
	par_initiatorid text,
	par_usertype text,
	par_kidid text[])
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
	 notif record;
	 notif_array json[];
	 notif_content text;
	 notif_ts text;
	 notif_tlts text;
	 notif_readablets text;
	 notif_initiatorid text;
	 notif_receiverid text;
	 notif_read boolean;
	 notif_count int;
	 loc_notif_type text;
	 notif_id text;
   begin
	 notif_count = 0;
     if par_usertype = 'faculty' then
	 	for notif in select * from
      		notifications where channel = ANY(par_channels) 
	  		and action_initiator != par_initiatorid
			and (user_type != 'students' or ((notif_type = 'comment' or  notif_type = 'reaction') and initiatorid = par_initiatorid))
			order by notif_ts DESC
		loop
			notif_content = notif.notif;
			notif_initiatorid = notif.initiatorid;
			notif_receiverid = notif.receiverid;
			notif_tlts = notif.timeline_ts;
			notif_ts = notif.notif_ts;
			notif_readablets = to_char(notif.notif_ts::date, 'Day, Month DD, yyyy');
			
			loc_notif_type = notif.notif_type;
			notif_id = notif.notif_id;
			
			if notif.notif_id != checkreadnotif(notif.notif_id, par_initiatorid) then
				notif_read = false ;
			else
				notif_read = true ;
			end if;
			
			notif_array = 
				notif_array || 
				json_build_object (
					'body', notif_content,
					'initiatorid', notif_initiatorid,
					'receiverid', notif_receiverid,
					'timeline_timestamp', notif_tlts,
					'is_read', notif_read,
					'ts', notif_ts,
					'notif_readablets', notif_readablets,
					'notif_type', loc_notif_type,
					'notif_id', notif_id
				);
			notif_count = notif_count + 1;
		end loop;
	 elsif par_usertype = 'parents' then
	 	for notif in select * from 
		notifications where channel = ANY(par_channels) 
		and action_initiator != par_initiatorid and (user_type = 'faculty' 
		OR (action_initiator = ANY(par_kidid) or receiverid = ANY(par_kidid)))  
		order by notif_ts DESC
		
		loop
			notif_content = notif.notif;
			notif_initiatorid = notif.initiatorid;
			notif_receiverid = notif.receiverid;
			notif_tlts = notif.timeline_ts;
			notif_ts = notif.notif_ts;
			notif_readablets = to_char(notif.notif_ts::date, 'Day, Month DD, yyyy');
			
			loc_notif_type = notif.notif_type;
			notif_id = notif.notif_id;
			
			if notif.notif_id != checkreadnotif(notif.notif_id, par_initiatorid) then
				notif_read = false ;
			else
				notif_read = true ;
			end if;
			
			notif_array = 
				notif_array || 
				json_build_object (
					'body', notif_content,
					'initiatorid', notif_initiatorid,
					'receiverid', notif_receiverid,
					'timeline_timestamp', notif_tlts,
					'is_read', notif_read,
					'ts', notif_ts,
					'notif_readablets', notif_readablets,
					'notif_type', loc_notif_type,
					'notif_id', notif_id
				);
			notif_count = notif_count + 1;
		end loop;
	 
	 else
	 		for notif in select * from
      		notifications where channel = ANY(par_channels) 
	  		and action_initiator != par_initiatorid order by notif_ts DESC
		loop
			notif_content = notif.notif;
			notif_initiatorid = notif.initiatorid;
			notif_receiverid = notif.receiverid;
			notif_tlts = notif.timeline_ts;
			notif_ts = notif.notif_ts;
			notif_readablets = to_char(notif.notif_ts::date, 'Day, Month DD, yyyy');
			
			loc_notif_type = notif.notif_type;
			notif_id = notif.notif_id;
			
			if notif.notif_id != checkreadnotif(notif.notif_id, par_initiatorid) then
				notif_read = false ;
			else
				notif_read = true ;
			end if;
			
			notif_array = 
				notif_array || 
				json_build_object (
					'body', notif_content,
					'initiatorid', notif_initiatorid,
					'receiverid', notif_receiverid,
					'timeline_timestamp', notif_tlts,
					'is_read', notif_read,
					'ts', notif_ts,
					'notif_readablets', notif_readablets,
					'notif_type', loc_notif_type,
					'notif_id', notif_id
				);
			notif_count = notif_count + 1;
		end loop;
	 end if;
			
			
			
		 return (SELECT
              json_build_object(
                'status', 'ok',
                'size', notif_count,
                'notifs', notif_array
              )
        );
			

      
	  
	  
   end;
$BODY$;

ALTER FUNCTION public.getnotification(text[], text, text, text[])
    OWNER TO admin;
-------------------------- ########################----------------------

-- FUNCTION: public.insert2notification(text, text, text, text, text, text, text, text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.insert2notification(text, text, text, text, text, text, text, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.insert2notification(
	par_notif text,
	par_notiftype text,
	par_username text,
	par_usertype text,
	par_channel text,
	par_initiatorid text,
	par_receiverid text,
	par_timelinets text,
	par_duedate text,
	par_startdate text,
	par_poster text,
	par_action_initiator text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
	declare
		loc_notifid text;
		loc_receiverid text;
		loc_poster text;
		loc_nowts timestamp without time zone default now();
	
	begin
		if substr(par_receiverid, 1, 3) = '750' then
			 loc_receiverid = lower(par_receiverid);
		else
			 loc_receiverid = par_receiverid;
		end if;
		
		loc_poster =  REPLACE(par_poster, ' ', '');
		
		loc_notifid = 'notif' || par_initiatorid || loc_receiverid || par_timelineTS || loc_poster || loc_nowts;

		insert into notifications(notif_id, 
								  notif, 
								  notif_type, 
								  username, 
								  user_type, 
								  channel, 
								  initiatorid, 
								  receiverid,
								  timeline_ts, 
								  duedate, 
								  startdate, 
								  poster,
								  notif_ts,
								  action_initiator
			)values(
				loc_notifid,
				par_notif,
				par_notifType,
				par_username,
				par_userType,
				par_channel,
				par_initiatorid,
				loc_receiverid,
				par_timelineTS,
				par_duedate,
				par_startdate,
				par_poster,
				loc_nowts::text,
				par_action_initiator
			);

			return (select json_build_object('status', 'OK'));
	END;
	

$BODY$;

ALTER FUNCTION public.insert2notification(text, text, text, text, text, text, text, text, text, text, text, text)
    OWNER TO admin;

---------------------------- #################### -------------------

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


------------------------------#######################---------------------

-- FUNCTION: public.notif_getinterpretedpost(text, text, text, text)

-- DROP FUNCTION IF EXISTS public.notif_getinterpretedpost(text, text, text, text);

CREATE OR REPLACE FUNCTION public.notif_getinterpretedpost(
	par_personid text,
	par_initiatorid text,
	par_receiverid text,
	par_ts text,
	OUT interpreted text,
	OUT datetime text,
	OUT tltype text,
	OUT dt text,
	OUT initiatorid text,
	OUT receiverid text,
	OUT okc integer,
	OUT happyc integer,
	OUT sadc integer,
	OUT angryc integer,
	OUT surprisedc integer)
    RETURNS SETOF record 
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
  select interprettimeline(par_personid, initiatorid, receiverid, tlmessage, tltype) as timeline,
      to_char(datetime, 'Day, Month DD, yyyy'), tltype, datetime::text, initiatorid, receiverid,
      okc, happyc, sadc, angryc, surprisedc
  from notif_getpost(par_initiatorid, par_receiverid, par_ts);
$BODY$;

ALTER FUNCTION public.notif_getinterpretedpost(text, text, text, text)
    OWNER TO postgre;

---------------------- ################## ----------------
-- FUNCTION: public.notif_getpost(text, text, text)

-- DROP FUNCTION IF EXISTS public.notif_getpost(text, text, text);

CREATE OR REPLACE FUNCTION public.notif_getpost(
	par_initiatorid text,
	par_receiverid text,
	par_ts text,
	OUT initiatorid text,
	OUT receiverid text,
	OUT tlmessage text,
	OUT publicity integer,
	OUT datetime timestamp without time zone,
	OUT tltype text,
	OUT visible boolean,
	OUT semid text,
	OUT schoolid text,
	OUT alteredts timestamp without time zone,
	OUT okc integer,
	OUT happyc integer,
	OUT sadc integer,
	OUT angryc integer,
	OUT surprisedc integer)
    RETURNS SETOF record 
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
select
            upper(initiatorid),
            upper(receiverid),
            tlmessage, publicity,
            date_trunc('second',ts) as ts,
            tltype, visible, semid, schoolid, alteredts,
            okc, happyc, sadc, angryc, surprisedc
     from timeline
     where
		 upper(initiatorid) = upper(par_initiatorid) and
		 upper(receiverid) = upper(par_receiverid) and ts = par_ts::timestamp without time zone;
$BODY$;

ALTER FUNCTION public.notif_getpost(text, text, text)
    OWNER TO postgre;
--------------################----------------
-- FUNCTION: public.notif_poppost(text, text, text, text)

-- DROP FUNCTION IF EXISTS public.notif_poppost(text, text, text, text);

CREATE OR REPLACE FUNCTION public.notif_poppost(
	par_username text,
	par_initiatorid text,
	par_receiverid text,
	par_ts text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

    declare
       loc_timelinearray json[];
       loc_count int;
       timeline record;
       loc_bodyarr text[];
       loc_tiditemarr text[];
	   loc_personid text;
    begin
		loc_personid = getpersonidbyusername(par_username);
       	loc_count = 0;
          for timeline in select * from
             notif_getinterpretedpost(loc_personid, par_initiatorid, par_receiverid, par_ts) loop

             loc_bodyarr = regexp_split_to_array(timeline.interpreted, E'\\$');
             loc_tiditemarr = regexp_split_to_array(loc_bodyarr[2], E'\\:');

             --raise exception '% % %', loc_tiditemarr, loc_tiditemarr[2], loc_bodyarr[2];

             loc_timelinearray =
                 loc_timelinearray ||
                 json_build_object(
                     'body', timeline.interpreted,
                     'pic', getcloudinaryurl(loc_tiditemarr[2]),
                     'tltype', timeline.tltype,
                     'tstamp', timeline.datetime,
                     'initiatorid', timeline.initiatorid,
                     'receiverid', timeline.receiverid,
                     'tlts', timeline.dt,
                     'okc', timeline.okc,
                     'happyc', timeline.happyc,
                     'sadc', timeline.sadc,
                     'angryc', timeline.angryc,
                     'surprisedc', timeline.surprisedc
                 );

            loc_count = loc_count + 1;

        end loop;

        return (SELECT
              json_build_object(
                'status', 'ok',
                'size', loc_count,
                'post', loc_timelinearray
              )
        );
    end;
  
$BODY$;

ALTER FUNCTION public.notif_poppost(text, text, text, text)
    OWNER TO postgre;
-------------------- ############## ------------
-- FUNCTION: public.post_comments2(text, text, text, text, text, timestamp without time zone, text)

-- DROP FUNCTION IF EXISTS public.post_comments2(text, text, text, text, text, timestamp without time zone, text);

CREATE OR REPLACE FUNCTION public.post_comments2(
	par_username text,
	par_token text,
	par_group text,
	par_initiatorid text,
	par_receiverid text,
	par_timeline_ts timestamp without time zone,
	par_comment text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
  loc_cid text;
  loc_res text;
  loc_nowts timestamp without time zone default now();
  loc_tlin record;
  loc_commentername text;
  loc_commenter text;
  loc_receiverid text;
begin
   loc_res = verifyuser(par_username, par_token, par_group);
   loc_commenter = getpersonidbyusername(par_username);
   loc_commentername = getfullname(getpersonnumbypersonid(loc_commenter));
   if substr(par_receiverid, 1, 3) = '750' then
     loc_receiverid = lower(par_receiverid);
  else
     loc_receiverid = par_receiverid;
  end if;

   select into loc_tlin * from timeline where
       initiatorid = par_initiatorid and
       receiverid = loc_receiverid and
       to_char(ts, 'DD MM YYYY HH24:MI:SS') = to_char(par_timeline_ts, 'DD MM YYYY HH24:MI:SS');

   if loc_tlin isnull then
     raise exception 'No timeline!';
   end if;

   loc_cid = par_initiatorid || loc_receiverid || loc_tlin.ts::text || loc_commenter || loc_nowts;

   insert into comments
       (commentsid, initiatorid, receiverid, ts, commenter, comment, commentts, cfullname)
   values
       (loc_cid, par_initiatorid, loc_receiverid, loc_tlin.ts, loc_commenter, par_comment, loc_nowts, loc_commentername);

  perform inpm(loc_commenter, 'comment');

  update timeline
  set
      alteredts =  loc_nowts
  where
      initiatorid = par_initiatorid and
      receiverid = loc_receiverid and
      ts = loc_tlin.ts;

  return (select json_build_object(
                   'status', 'OK',
	  				'ts', loc_tlin.ts,
                   'comments', get_comments_relaxed (
                          par_initiatorid,
                          loc_receiverid,
                          loc_tlin.ts,
                          0,
                          par_username
                      ),
                    'reactions', get_reaction_status_relaxed (
                        par_initiatorid,
                        loc_receiverid,
                        loc_tlin.ts
                    )
                     )
         );

end;
$BODY$;

ALTER FUNCTION public.post_comments2(text, text, text, text, text, timestamp without time zone, text)
    OWNER TO postgre;

---------------- ############### -----------------------
-- FUNCTION: public.post_reaction2(text, text, text, text, text, timestamp without time zone, integer)

-- DROP FUNCTION IF EXISTS public.post_reaction2(text, text, text, text, text, timestamp without time zone, integer);

CREATE OR REPLACE FUNCTION public.post_reaction2(
	par_username text,
	par_token text,
	par_group text,
	par_initiatorid text,
	par_receiverid text,
	par_timeline_ts timestamp without time zone,
	par_reaction integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
  loc_cid text;
  loc_res text;
  loc_nowts timestamp without time zone default now();
  loc_tlin record;
  loc_commentername text;
  loc_commenter text;
  loc_receiverid text;
  loc_reactions record;
begin
   loc_res = verifyuser(par_username, par_token, par_group);

   if not (par_reaction >= 1 and par_reaction <= 5) then
     raise exception 'Unacceptable reaction!';
   end if;

   loc_commenter = getpersonidbyusername(par_username);
   loc_commentername = getfullname(getpersonnumbypersonid(loc_commenter));

   if substr(par_receiverid, 1, 3) = '750' then
     loc_receiverid = lower(par_receiverid);
  else
     loc_receiverid = par_receiverid;
  end if;

   select into loc_tlin * from timeline where
       initiatorid = par_initiatorid and
       receiverid = loc_receiverid and
       to_char(ts, 'DD MM YYYY HH24:MI:SS') = to_char(par_timeline_ts, 'DD MM YYYY HH24:MI:SS');

   if loc_tlin isnull then
     raise exception 'No timeline!';
   end if;

   loc_cid = par_initiatorid || loc_receiverid || loc_tlin.ts::text || loc_commenter || loc_nowts;

  select into loc_reactions * from reactions where
      initiatorid = par_initiatorid and
      receiverid = loc_receiverid and
      ts = loc_tlin.ts and
      reactor = loc_commenter;

   if loc_reactions isnull  then
         insert into reactions (reactionsid, initiatorid, receiverid, ts, reactor, reaction, reactionts, reactorname)
         values
                                (loc_cid, par_initiatorid, loc_receiverid, loc_tlin.ts, loc_commenter, par_reaction, loc_nowts, loc_commentername);
   else
       update reactions set reaction = par_reaction where reactionsid = loc_reactions.reactionsid;
   end if;

  perform inpm(loc_commenter, 'react');

  return (select json_build_object(
                   'status', 'OK',
	  				'ts', loc_tlin.ts,
                   'comments', get_comments_relaxed (
                          par_initiatorid,
                          loc_receiverid,
                          loc_tlin.ts,
                          0,
                          par_username
                      ),
                    'reactions', get_reaction_status_relaxed (
                        par_initiatorid,
                        loc_receiverid,
                        loc_tlin.ts
                    )
                     )
         );

end;
$BODY$;

ALTER FUNCTION public.post_reaction2(text, text, text, text, text, timestamp without time zone, integer)
    OWNER TO postgre;

-------------------------- ############## ---------------------
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

------------------- ############### -----------------------
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
	  loc_subdetails = loc_studentnames.subject;
	  loc_initiatorid = getpersonidbyusername(par_username);
	  
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
										'subdetails', loc_subdetails,
										'studentvroomid', loc_studentsect,
										'ts', loc_nowts
										
										
                  )
         );
  END;
$BODY$;

ALTER FUNCTION public.publishgrades(text, text, text, text, text, boolean)
    OWNER TO postgre;
	

----------------------- ##################### ----------------------------------
-- FUNCTION: public.read_notif(text, text)

-- DROP FUNCTION IF EXISTS public.read_notif(text, text);

CREATE OR REPLACE FUNCTION public.read_notif(
	par_notifid text,
	par_initiatorid text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
     loc_count text;
	 loc_channels text[];
	 
   begin
   			
      
      INSERT INTO notif_read
	  VALUES (par_notifid, par_initiatorid, now());
      return 'OK';
	  
   end;
$BODY$;

ALTER FUNCTION public.read_notif(text, text)
    OWNER TO admin;

---------------------------- ######################## -----------------------
-- FUNCTION: public.see_newnotif(text, text)

-- DROP FUNCTION IF EXISTS public.see_newnotif(text, text);

CREATE OR REPLACE FUNCTION public.see_newnotif(
	par_notifid text,
	par_initiatorid text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
     loc_count text;
	 loc_channels text[];
	 
   begin
   			
      
      INSERT INTO notif_seen
	  VALUES (par_notifid, par_initiatorid, now());
      return 'OK';
	  
   end;
$BODY$;

ALTER FUNCTION public.see_newnotif(text, text)
    OWNER TO admin;

---------------------------- ########################### --------------------------
-- FUNCTION: public.sendreminder2(text, text, text, text, text, text, text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.sendreminder2(text, text, text, text, text, text, text, text, text, text, text);

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

------------------------------ ####################### ----------------------------------

-- FUNCTION: public.sendreminderall2(text, text, text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.sendreminderall2(text, text, text, text, text, text, text);

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

----------------------------- ############################## --------------------

-- FUNCTION: public.setdeadline2(text, text, text, text, text, text, text, date)

-- DROP FUNCTION IF EXISTS public.setdeadline2(text, text, text, text, text, text, text, date);

CREATE OR REPLACE FUNCTION public.setdeadline2(
	par_username text,
	par_token text,
	par_group text,
	par_semid text,
	par_schoolid text,
	par_quarter text,
	par_deadlinetype text,
	par_ddate date)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

declare
  loc_v text;
  loc_pk text;
  loc_r record;
  loc_off record;
begin
  loc_v = verifyuser(par_username, par_token, par_group);
  --get all offered subjects in the school update the
  loc_pk = par_semid || par_schoolid || par_quarter || par_deadlinetype;
  select into loc_r * from deadlines where deadlineid = loc_pk;

  if loc_r isnull then
    insert into deadlines (
                            deadlineid,
                            semid,
                            schoolid,
                            quarter,
                            deadlinetype,
                            ddate
                          ) values
                          (
                            loc_pk,
                            par_semid,
                            par_schoolid,
                            par_quarter,
                            par_deadlinetype,
                            par_ddate
                         );
    loc_v = inpm(getpersonnumidbyuser(sha1(par_username)),'set deadline');
    loc_v = post_timeline(par_username,
                          par_token,
                          '',
                          par_ddate,
                          'Deadline submission for ' || par_deadlinetype || 
                          ' grading quarter ' || par_quarter || ', ' ||
                          ' will be on ' || par_ddate::text || '.' || '<br />@begin:' || par_ddate || '#@end:' || par_ddate,
                          par_group,
                          'event',
                          true,
                          3,
                          par_semid,
                          par_schoolid
      );
  else
    update deadlines set ddate = par_ddate
    where deadlineid = loc_pk;
    loc_v = inpm(getpersonnumidbyuser(sha1(par_username)),'update deadline');
    loc_v = post_timeline(par_username,
                          par_token,
                          '',
                          par_ddate,
                          'Updated Deadline submission for ' || par_deadlinetype || 
                          ' grading quarter ' || par_quarter || ', ' || ' will be on' || par_ddate::text ||  '<br /> @begin:' || par_ddate || '#@end:' || par_ddate,
                          par_group,
                          'event',
                          true,
                          3,
                          par_semid,
                          par_schoolid
      );
  end if;

  for loc_off in select *
               from offering
               where
                   semid = par_semid and
                   schoolid = par_schoolid loop

    if par_deadlinetype = 'Grade' then

          raise notice '%, %, %, %, %', loc_off.subjectid || ' ' || loc_off.level::text, loc_off.section, loc_off.schoolid, loc_off.semid, par_quarter;
          --select * from summativequartergrade where  section = 'ELITE' and schoolid=  'XXX' and semid =  '20182019' and quarter_ = '3';
          update summativequartergrade
          set
              deadline = par_ddate
          where
              subject = loc_off.subjectid || ' ' || loc_off.level::text and
              section = loc_off.section and
              schoolid = loc_off.schoolid and
              semid = loc_off.semid and
              quarter_ = par_quarter;
   else
        update mps set deadline = par_ddate where sectioncode = loc_off.offeringid;
   end if;
  end loop;

  return (select
            json_build_object(
                'status', 'OK',
				'ts', now()::timestamp without time zone
                )
         );
end;

$BODY$;

ALTER FUNCTION public.setdeadline2(text, text, text, text, text, text, text, date)
    OWNER TO postgre;

----------------------- ######################### -------------------------------


-- FUNCTION: public.stampevent(text, text, text, text, integer, text, text)

-- DROP FUNCTION IF EXISTS public.stampevent(text, text, text, text, integer, text, text);

CREATE OR REPLACE FUNCTION public.stampevent(
	par_initiatorid text,
	par_receiverid text,
	par_tlmessage text,
	par_tltype text,
	par_publicity integer,
	par_semid text,
	par_schoolid text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
    declare
    begin
      --this is a special case of timeline stamping
      --where the initiator is the teacher with username
      --and student is the receiver with lrn
	return insert2timeline(getpersonidbyusername(par_initiatorid),
						   getpersonidbyidnum(par_receiverid),
						   par_tlmessage,
						   par_tltype,
						   par_publicity,
						   now()::timestamp without time zone, par_semid, par_schoolid
			);
										
       
    END;
  
$BODY$;

ALTER FUNCTION public.stampevent(text, text, text, text, integer, text, text)
    OWNER TO admin;

------ ########################## ---------
-- FUNCTION: public.sendreminderenrollment2(text, text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.sendreminderenrollment2(text, text, text, text, text, text);

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
	
----------------- ######################## ------------------

-- FUNCTION: public.see_newnotif(text, text)

-- DROP FUNCTION IF EXISTS public.see_newnotif(text, text);

CREATE OR REPLACE FUNCTION public.see_newnotif(
	par_notifid text,
	par_initiatorid text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
   declare
     loc_count text;
	 loc_channels text[];
	 
   begin
   			
      
      INSERT INTO notif_seen
	  VALUES (par_notifid, par_initiatorid, now());
      return 'OK';
	  
   end;
$BODY$;

ALTER FUNCTION public.see_newnotif(text, text)
    OWNER TO admin;



