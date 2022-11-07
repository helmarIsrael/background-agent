--
-- PostgreSQL database dump
--

-- Dumped from database version 9.1.19
-- Dumped by pg_dump version 9.1.19
-- Started on 2015-11-11 15:21:22 PHT

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 258 (class 3079 OID 11677)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2876 (class 0 OID 0)
-- Dependencies: 258
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 270 (class 1255 OID 16405)
-- Dependencies: 6 1225
-- Name: _age(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION _age(date) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
   declare
       birthdate alias for $1;
       l int;
   begin
           l = (now()::date - birthdate)::int / 365;
           return l;
   end;
$_$;


ALTER FUNCTION public._age(date) OWNER TO postgres;

--
-- TOC entry 271 (class 1255 OID 16406)
-- Dependencies: 6
-- Name: academiceval(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION academiceval(text, OUT text, OUT integer, OUT text, OUT text, OUT text, OUT text, OUT text, OUT double precision, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
    select personnumid, year_, getsubjnumber(getofferingsubj(offeringid,semid)),
    getsubdesc(getofferingsubj(offeringid,semid)),getsemdesc(semid), grade, comment_,
    getofferingunits(offeringid, semid), withcomp(personnumid, offeringid, semid) from 
    distinctloads where personnumid = $1 order by semid;  
    --select degree, year_level, getsubjnumber(getofferingsubj(offeringid,semid)), 
    --getsubdesc(getofferingsubj(offeringid,semid)), getsemdesc(semid), grade, comment_,
    --getofferingunits(offeringid, semid), withcomp(personnumid, offeringid, semid) from class_list where personnumid = $1 order by semid;  
$_$;


ALTER FUNCTION public.academiceval(text, OUT text, OUT integer, OUT text, OUT text, OUT text, OUT text, OUT text, OUT double precision, OUT text) OWNER TO postgres;

--
-- TOC entry 272 (class 1255 OID 16407)
-- Dependencies: 1225 6
-- Name: add2cafetime(text, bigint, integer, bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION add2cafetime(text, bigint, integer, bigint, bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
-- ARG1 --> PERSONID
-- ARG2 --> PTYPEID
-- ARG3 --> ISDEFAULT
-- ARG4 --> TIMEALLOWANCE
-- arg5 --> semid
  declare
     d text;
  BEGIN
     select into d personid from person where
       personid = $1 and ptypeid = $2;
       
     if d isnull then
        raise exception 'PERSON NOT FOUND!!!';
     else
	select into d personid from cafetime where
        personid = $1 and ptypeid = $2 and semid = $5;
        
        if d isnull then
          insert into cafetime(personid,ptypeid, semid, timeleft, isdefault)
             values ($1, $2, $5, $4, $3);
        else
          update cafetime set
              isdefault = $3,
              timeleft = $4
              where 
                personid = $1 and ptypeid = $2 and semid = $5;
        end if;       
     end if;        
    return 1;
  END;

$_$;


ALTER FUNCTION public.add2cafetime(text, bigint, integer, bigint, bigint) OWNER TO postgres;

--
-- TOC entry 273 (class 1255 OID 16408)
-- Dependencies: 6 1225
-- Name: allyear(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION allyear(integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       yr ALIAS FOR $1;
       l text;
   begin
       if yr = 0  then
          l = 'All';
       else
          l = yr::text;
       end if;
       return l;
   end;
$_$;


ALTER FUNCTION public.allyear(integer) OWNER TO postgres;

--
-- TOC entry 274 (class 1255 OID 16409)
-- Dependencies: 6 1225
-- Name: appendzerom(text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION appendzerom(text, integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    str ALIAS FOR $1;
    maxLen ALIAS FOR $2;
    sLen INTEGER;
    cZero INTEGER; -- zero counter
    i INTEGER;
    res TEXT;
BEGIN
    sLen := length(str);
    cZero := maxLen - sLen;
    res := str;
FOR i in 0..cZero - 1 LOOP
         res := '0' || res;
    END LOOP;	
      RETURN res;
END;
$_$;


ALTER FUNCTION public.appendzerom(text, integer) OWNER TO postgres;

--
-- TOC entry 275 (class 1255 OID 16410)
-- Dependencies: 1225 6
-- Name: applyload(text, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION applyload(text, bigint, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       smid alias for $2;
       offid alias for $3;
       ptyp text;
       pid text;
   begin
       insert into personload (personnumid,offeringid, semid) values (personNum_, offid, smid);
       select into pid personid from personnum where personnumid = personnum_;
       ptyp = getptypename(getpersontype(pid));
       if ptyp = 'students' then
            insert into academicyearload(personnumid, offeringid,semid, degreeid, year_) values
              (personnum_, offid, smid, getdegreeid(getpersondegree(personnum_)), getpersonyear(personnum_)::int4); 
            update offering set lim = lim - 1 where offeringid = offid and semid = smid;
       end if;
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.applyload(text, bigint, text) OWNER TO postgres;

--
-- TOC entry 276 (class 1255 OID 16411)
-- Dependencies: 6 1225
-- Name: applyload2(text, bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION applyload2(text, bigint, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$ 
   declare 
       personNum_ ALIAS FOR $1; 
       smid alias for $2; 
       offid alias for $3; 
       uname alias for $4;
       ptyp text;
       pid int8;
       currlim integer;
       scod text;
       scod1 int;
       scod2 text;
       isallowed int;
       confsked text;
       m text;
       --courseyear text[];
       grd_ record;
       conf123 boolean;
       payments record;
       cy31211 text;
       pdegree text; --persondegree as opposed to the dog's food :)
       t902 record;
       undigest text; 
       labid_ int8;
       labdesc_ text;
       degtext text;
       degyear text;
       loc_1days1 text;
       loc_1days2 text;
       loc_1time1 text;
       loc_1time2 text;
  begin
       select into pid ptypeid from personnum where personnumid = personnum_;
       labid_ = subjlabfoff(offid);
       if labid_ isnull then
           labdesc_ = 'None';
           labid_ = 0;
       else
           labdesc_ = subjlabdesc(labid_);
       end if;
       
       ptyp = getptypename(pid);      
       if ptyp = 'students' then 
          select into currlim lim from offering where offeringid = offid and 
                 semid = smid; 
          select into scod1 count(offeringid) from personload where 
                    getofferingsubj(offeringid, smid) = getofferingsubj(offid, smid) and semid = smid 
                    and personnumid = personnum_; 
          SELECT Into isallowed islocked from sem where semid= smid; 
          if isallowed = 0 then 
             Raise exception 'The semester is already locked by the registar,further enrollees cannot be accepted!'; 
          end if;   
            if currlim <= 0 and getptypename(usertype(uname)) <> 'registrar' then 
    raise exception 'Section is Closed!'; 
          elsif scod1 > 0  then 
    raise exception 'Subject already assigned!'; 
          end if; 
       elsif not (uname = 'postgre' or uname = 'Orven E. Llantos' or uname = 'orven') then 
           if getptypename(usertype(uname)) <> 'admin' and getptypename(usertype(uname)) <> 'registrar' and getptypename(usertype(uname)) <> 'faculty' then
                 raise exception 'Request rejected: Access Denied!';
           end if;
       end if;
       select into scod offeringid from personload where offeringid = offid and 
                                        personnumid = personnum_ and semid = smid; 
       if not scod isnull then 
            raise exception 'Section code already assigned!'; 
       end if; 
       -- check if already assigned to other instructors 
       if ptyp <> 'students' then 
    select into scod2 getpersonfullname2(personnumid) from personload 
                  where offeringid = offid and 
            semid = smid and 
            getpersonnumtype(personnumid) > 1; 
    if not scod2 isnull then 
      raise exception 'Section code already assigned to %', scod2; 
    end if; 
      end if;  
       loc_1days1 = formalizedays(getofferingday(offid,smid));
       loc_1days2= formalizedays(getofferingday2(offid,smid));
       loc_1time1= getofferingtime(offid,smid);
       loc_1time2 =getofferingtime2(offid,smid);
       select into confsked offeringid || ',' || getsubjnumber(getofferingsubj(offeringid,semid)) 
             || ' Sched 1 [' || getofferingday(offeringid,smid) || ',' || normtimerange(getofferingtime(offeringid,smid)) || ',' 
                   || getofferingroom(offeringid,smid) || ']' || 
               ' Sched 2 [' || getofferingday2(offeringid,smid) || ',' || normtimerange(getofferingtime2(offeringid,smid)) || ',' 
                   || getofferingroom2(offeringid,smid) || ']' 
       from personload where 
        (
                 instr(
                            formalizedays(
                                                          getofferingday(offeringid,smid)
                                                         ), 
                                                          loc_1days1) > 0 
                 and 
                 testconflict(
                              getofferingtime(offeringid,smid),
                              loc_1time1) and personnumid = personnum_ and semid = smid 
      ) 
      or 
       ( 
                instr(
                                formalizedays(
                                getofferingday(offeringid,smid)
                                ),  
                                loc_1days2) > 0 
                 and 
                 testconflict(
                                    getofferingtime(offeringid,smid),
                                    loc_1time2) and personnumid = personnum_ and semid = smid 
       );             
         
  
     if not confsked isnull then 
            raise exception '[Mode: 1] Conflict with Section %', confsked; 
        end if; 
    select into confsked offeringid || ',' || getsubjnumber(getofferingsubj(offeringid,semid)) 
              || ' Sched 1 [' || getofferingday(offeringid,smid) || ',' || normtimerange(getofferingtime(offeringid,smid)) || ',' 
                   || getofferingroom(offeringid,smid) || ']' || 
                 ' Sched 2 [' || getofferingday2(offeringid,smid) || ',' || normtimerange(getofferingtime2(offeringid,smid)) || ',' 
                   || getofferingroom2(offeringid,smid) || ']' 
    from personload where 
         (
    
                 instr(
                          formalizedays(
                                                     getofferingday2(offeringid,smid)
                                                      ), 
                                                      loc_1days1) > 0 
                 and 
                 testconflict(
                                 getofferingtime2(offeringid,smid),
                                 loc_1time1) and personnumid = personnum_ and semid = smid
      ) 
      or 
       (
    
                 instr(
                               formalizedays(
                                                    getofferingday2(offeringid,smid)),  
                                                    loc_1days2) > 0 
                 and 
                 testconflict(
                                        getofferingtime2(offeringid,smid),
                                        loc_1time2) and personnumid = personnum_ and semid = smid
      );  --modified aug 5, 2010
       if not confsked isnull then 
            raise exception '[Mode: 2] Conflict with Section %', confsked; 
        end if; 
         -- check if student already enrolled the subject and has a passing grade...
         select into grd_ grade, getsemdesc(semid) as s from academicyearload where getofferingsubj(offeringid, semid) = getofferingsubj(offid, smid) and personnumid = personnum_;
        if not grd_ isnull then
         if isnumeric(grd_.grade) then
               if grd_.grade >= '75' then
                   pdegree = getpersondegree(personnum_);
                   if not (exceptiondegreenroll(pdegree)) then
                       raise exception 'Cannot enroll subject, it is already enrolled last % and it has a grade of %', grd_.s,grd_.grade;
                   end if; 
               end if;
         end if;
     end if;

     conf123 = getofloadstat(personnum_, smid);
     -- modified: 01/20/2010 
     if conf123 and getptypename(usertype(uname)) <> 'registrar' then
         raise exception 'Cannot enroll subject, only the registrar can modify the student load.';
     end if;

     if ptyp = 'students' then
         select into payments * from accounts where isnumeric(substring(receiptnum,1,1)) and semid = smid and personnumid = personNum_ and mult = -1;
         if payments isnull then
             raise exception 'Please let the student pay first.';
         end if;
      end if;
     
       select into t902 * from personload where personnumid = personnum_ and offeringid = offid and semid = smid;
       if t902 isnull then
          insert into personload (personnumid,offeringid, semid) values (personNum_, offid, smid); 
          undigest = unmd5uname(uname);
          m = log_action(undigest,personnum_ || ' was loaded with section ' || offid || ' by ' || undigest);

          if ptyp = 'students' then
              cy31211 = array_to_string(semcy(personnum_, smid), '-'); 
              degtext = substring(cy31211, 0, length(cy31211)-1);
              degyear = substring(cy31211, length(cy31211), length(cy31211)); 
              insert into academicyearload(personnumid, offeringid,semid, degreeid, year_, labid, labdesc, coursedesc, subject, stuyear) values 
              (personnum_, offid, smid, getdegreeid(degtext), getpersonyear(personnum_)::int4, labid_, labdesc_, degtext, getsubjnumberoff(offid), degyear::int); 
              update offering set lim = lim - 1 where offeringid = offid and semid = smid; 
          end if;
       end if; 
       return 'OK'; 
   end; 
$_$;


ALTER FUNCTION public.applyload2(text, bigint, text, text) OWNER TO postgres;

--
-- TOC entry 277 (class 1255 OID 16414)
-- Dependencies: 1225 6
-- Name: assess(text, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION assess(text, bigint, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       sid alias for $2;
       lev alias for $3;
       tf float8;
       othercharges float8;
       tpf float8;
       degree int8;
       yr_ int;
       rmsubjcharge record;
       l float8;
       a float8;
       b float8;
       scy text[];
       aentry text;
  begin
           --revised: april 7, 2009
           --added tpf -- test paper fee
           --revised Sat 01 Aug 2009
          -- added semid in getofferingsubj 
          l = 0.0; 
          if upper(getptypename(getpersonnumtype(pid))) = 'STUDENTS' then
           	scy = semcy(pid,sid);
           	degree = getdegreeid(scy[1]);
           	yr_ = scy[2]::int; 
           	tf = studtotalload(pid, sid) * perunitcharge(degree, yr_, sid, lev);
	   	tpf = computetestpaperfee(sid, lev, pid);
           	othercharges = computestandardcharges(sid,lev);

           	if othercharges isnull then
              		othercharges = 0;
           	end if;
          
 		select into rmsubjcharge sum(labchargef(subjlabf(getofferingsubj(offeringid,sid)), sid, lev)) as sbj_  
	                    from academicyearload where personnumid = pid and
	                          semid = sid and
	                          NOT 
	                          subjlabf(getsubjectid(getsubjnumber(getofferingsubj(offeringid, sid)))) IsNull;
	   
	   	if rmsubjcharge.sbj_ isnull then
                	   a= 0;
           	else
                	   a = rmsubjcharge.sbj_;
           	end if;

           	select into rmsubjcharge   
	                  sum(subjectcharge(getsubjnumber(getofferingsubj(offeringid,sid)), sid, lev)) as sbjc
	                    from academicyearload where personnumid = pid and
	                          semid = sid;
	                          
           	if rmsubjcharge.sbjc isnull then
                	   b= 0;
           	else
                	   b = rmsubjcharge.sbjc;
           	end if;

           	l = tf + othercharges + a +rmsubjcharge.sbjc + tpf;

           	select into aentry personnumid from accounts where receiptnum = 'assess'
           	and semid = sid and personnumid = pid;
         
           	if l isnull then
             		l =0.0;
           	end if;
            end if;
           return l;
   end;
$_$;


ALTER FUNCTION public.assess(text, bigint, text) OWNER TO postgres;

--
-- TOC entry 278 (class 1255 OID 16415)
-- Dependencies: 6 1225
-- Name: autodetbookstat(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION autodetbookstat(text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
    sDesc alias for $1;  
    c int8; 
  begin
    select into c count(bookstatid) from bookstat where upper(statusdesc) = upper(sDesc);
    
    if c = 0 then
        insert into bookstat(statusdesc) values (sDesc);
    end if;    
    return;
  end;
$_$;


ALTER FUNCTION public.autodetbookstat(text) OWNER TO postgres;

--
-- TOC entry 279 (class 1255 OID 16416)
-- Dependencies: 6 1225
-- Name: autoinsperson(text, text, text, text, text, integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION autoinsperson(text, text, text, text, text, integer, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
   fn alias for $1;
   ln alias for $2;
   m alias for $3;
   ptype alias for $4;
   course alias for $5;
   yr_ alias for $6;
   id text;
   gender alias for $7;
   ptypeid int8;
  begin
    ptypeid = getptypeid(ptype);
    select into id getpersonid(fn, ln, m, ptypeid);
    if id isnull then
      perform insUpdater(genid(ptype),ln,fn,m, getdegreeid(course), ptypeid,  yr_, gender, 1);
    end if;
    return;
  end;
  $_$;


ALTER FUNCTION public.autoinsperson(text, text, text, text, text, integer, text) OWNER TO postgres;

--
-- TOC entry 280 (class 1255 OID 16417)
-- Dependencies: 1225 6
-- Name: autoinssubclass(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION autoinssubclass(text, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
     desc_ alias for $1;
     cls alias for $2;
     cnum text;
     d int8;
  BEGIN
    cnum = getclassnum(cls);
    select into d subclassid from subclass where upper(description) = upper(desc_) and classnum = cnum;         
    
    if d ISNULL then
       insert into subclass (description, classnum) values (desc_, cnum);
    end if;	
    return;
  END;

$_$;


ALTER FUNCTION public.autoinssubclass(text, text) OWNER TO postgres;

--
-- TOC entry 281 (class 1255 OID 16418)
-- Dependencies: 6 1225
-- Name: availstat(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION availstat(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    curr alias for $1;
    end_ alias for $2;
    msg text;
  begin
     if curr::int8 <= end_::int8 then
        msg = 'AVAILABLE';
     else
        msg = 'NOT AVAILABLE';
      end if;
     return msg;
  end;
$_$;


ALTER FUNCTION public.availstat(text, text) OWNER TO postgres;

--
-- TOC entry 282 (class 1255 OID 16419)
-- Dependencies: 6 1225
-- Name: bahandler(text, text, bigint, text, boolean, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION bahandler(text, text, bigint, text, boolean, double precision) RETURNS void
    LANGUAGE plpgsql
    AS $_$
   declare
       usename ALIAS for $1;
       stuid alias for $2;
       sid alias for $3;
       baccount alias for $4;
       isdel alias for $5;
       amt alias for $6;
       desc1 text;
       pr text;
   begin
        if  ECpermit(usename)   then
          if isdel then
	      delete from accounts where receiptnum = baccount and
	                                 personnumid = stuid and semid = sid;
              desc1 = 'deleted'; 
          else
              update accounts set amount = amt where receiptnum = baccount and
	                                 personnumid = stuid and semid = sid;
              desc1 = 'updated'; 
          end if;
		     pr = ECdec(usename);
		     pr = log_action(usename,stuid || ' account is ' || desc1 || '  with ' || baccount || ' amounting to ' || amt::text);
		    
       end if;
       return;
   end;
$_$;


ALTER FUNCTION public.bahandler(text, text, bigint, text, boolean, double precision) OWNER TO postgres;

--
-- TOC entry 283 (class 1255 OID 16420)
-- Dependencies: 6 1225
-- Name: basicunit(double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION basicunit(double precision) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    n alias for $1;
    wordEq text;
  begin
      if n = 0 then 
	 wordEq =  '';
      end if;

      if n =  1 then
	  wordEq = 'one';
      end if;

     if n = 2 then
	  wordEq = 'two';
     end if;
     
    if n = 3 then
	  wordEq = 'three';
    end if;
    
    if n = 4 then
	  wordEq = 'four';
   end if;   
  
  if n = 5 then
	  wordEq = 'five';
   end if;

    if n = 6 then
	  wordEq = 'six';
   end if;
    
 if n = 7 then
	  wordEq = 'seven';
 end if;

     if n = 8 then
	  wordEq = 'eight';
  end if;

     if n = 9 then
	  wordEq = 'nine';
    end if;

     if n = 10 then
	  wordEq = 'ten';
    end if;

     if n = 11 then
	  wordEq = 'eleven';
    end if;

     if n = 12 then
	  wordEq = 'twelve';
    end if;

     if n = 13 then
	  wordEq = 'thirteen';
     end if;

     if n = 14 then
	  wordEq = 'fourteen';
    end if;

     if n = 15 then
	  wordEq = 'fifteen';
    end if;

     if n = 16 then
	  wordEq = 'sixteen';
    end if;

     if n = 17 then
	  wordEq = 'seventeen';
    end if;

     if n = 18 then
	  wordEq = 'eighteen';
    end if;

     if n = 19 then
	  wordEq = 'nineteen';
     end if;
     return wordEq;
  end;
$_$;


ALTER FUNCTION public.basicunit(double precision) OWNER TO postgres;

--
-- TOC entry 284 (class 1255 OID 16421)
-- Dependencies: 1225 6
-- Name: basicunit(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION basicunit(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    n alias for $1;
    wordEq text;
  begin
      if n = 0 then 
	 wordEq =  '';
      end if;

      if n =  1 then
	  wordEq = 'one';
      end if;

     if n = 2 then
	  wordEq = 'two';
     end if;
     
    if n = 3 then
	  wordEq = 'three';
    end if;
    
    if n = 4 then
	  wordEq = 'four';
   end if;   
  
  if n = 5 then
	  wordEq = 'five';
   end if;

    if n = 6 then
	  wordEq = 'six';
   end if;
    
 if n = 7 then
	  wordEq = 'seven';
 end if;

     if n = 8 then
	  wordEq = 'eight';
  end if;

     if n = 9 then
	  wordEq = 'nine';
    end if;

     if n = 10 then
	  wordEq = 'ten';
    end if;

     if n = 11 then
	  wordEq = 'eleven';
    end if;

     if n = 12 then
	  wordEq = 'twelve';
    end if;

     if n = 13 then
	  wordEq = 'thirteen';
     end if;

     if n = 14 then
	  wordEq = 'fourteen';
    end if;

     if n = 15 then
	  wordEq = 'fifteen';
    end if;

     if n = 16 then
	  wordEq = 'sixteen';
    end if;

     if n = 17 then
	  wordEq = 'seventeen';
    end if;

     if n = 18 then
	  wordEq = 'eighteen';
    end if;

     if n = 19 then
	  wordEq = 'nineteen';
     end if;
     return wordEq;
  end;
$_$;


ALTER FUNCTION public.basicunit(bigint) OWNER TO postgres;

--
-- TOC entry 285 (class 1255 OID 16422)
-- Dependencies: 6
-- Name: browsepermits(bigint, text, date); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION browsepermits(bigint, text, date, OUT text, OUT text, OUT integer, OUT date) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
   select personnumid, personname, count_, date_::date from permitprint where semid = $1 and examperiod = $2 and date_::date = $3 order by count_ asc;
$_$;


ALTER FUNCTION public.browsepermits(bigint, text, date, OUT text, OUT text, OUT integer, OUT date) OWNER TO postgre;

--
-- TOC entry 286 (class 1255 OID 16423)
-- Dependencies: 6
-- Name: browsestupermit(bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION browsestupermit(bigint, text, text, OUT text, OUT text, OUT integer, OUT date) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
   select personnumid, personname, count_, date_::date from permitprint where semid = $1 and examperiod = $2 and upper(personname) like upper($3) order by count_ asc;
$_$;


ALTER FUNCTION public.browsestupermit(bigint, text, text, OUT text, OUT text, OUT integer, OUT date) OWNER TO postgre;

--
-- TOC entry 287 (class 1255 OID 16424)
-- Dependencies: 6 1225
-- Name: browsesubjload(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION browsesubjload() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    loads record;
    personrec record;
    n text;
BEGIN
    --CREATE TABLE academicyearload
    -- personnumid text,
    -- degreeid bigint,
    -- year_ integer,
    -- offeringid text,
    -- semid bigint,
    -- grade text,
    -- comment_ text,
   FOR loads in select * from personload where isnumeric(substring(personnumid,1,1)) LOOP
       select into n personnumid from academicyearload where personnumid = loads.personnumid and semid = loads.semid and offeringid = loads.offeringid;   
       if n isnull then
         --raise notice 'null'; --%', loads.personnumid;
           select into personrec * from person where personid in 
                (select personid from personnum where personnumid = loads.personnumid and ptypeid =1) and ptypeid =1;
          raise notice '===> %, %, %, %', loads.personnumid,personrec.personid, loads.offeringid, loads.semid;
          insert into academicyearload(personnumid, degreeid, year_, offeringid, semid)
              values (loads.personnumid, personrec.degreeid, personrec.year_, loads.offeringid, loads.semid);
       --else
         --raise notice 'not';
       end if;
   END LOOP;	
      RETURN;
END;
$$;


ALTER FUNCTION public.browsesubjload() OWNER TO postgres;

--
-- TOC entry 288 (class 1255 OID 16425)
-- Dependencies: 6 1225
-- Name: cafeset(text, text, text, bigint, bigint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION cafeset(text, text, text, bigint, bigint, integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
     p_personid alias for $1;
     p_ptype alias for $2;
     p_password alias for $3;
     p_semid alias for $4;
     p_timeleft alias for $5;
     p_isdefault alias for $6;
     l_pp text;
     l_pc text;
     l_ptypeid int8;
     d int8;
  BEGIN
    l_ptypeid = getptypeid(p_ptype);
    select into l_pp personid from passwordrepo where personid = p_personid and ptypeid = l_ptypeid;

    if l_pp isnull then
        insert into passwordRepo (personid, ptypeid, pword) values 
                                (p_personid, l_ptypeid, p_password);
    else
        update passwordrepo set pword = p_password where personid = p_personid and ptypeid = l_ptypeid;
    end if;

     select into l_pc personid from cafetime where personid = p_personid and ptypeid = l_ptypeid and semid = p_semid;

     if l_pc isnull then
         Insert into cafetime (personid, ptypeid, semid,timeleft, isdefault) values 
        (p_personid, l_ptypeid, p_semid, p_timeleft, p_isdefault);
     else
         update cafetime set timeleft = p_timeleft, isdefault = p_isdefault where 
             personid = p_personid and ptypeid = l_ptypeid and semid = p_semid; 
     end if;
    return 'OK';
  END;
$_$;


ALTER FUNCTION public.cafeset(text, text, text, bigint, bigint, integer) OWNER TO postgres;

--
-- TOC entry 289 (class 1255 OID 16426)
-- Dependencies: 1225 6
-- Name: callowed(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION callowed(text, bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
   declare
       pid ALIAS FOR $1;
       sid alias for $2;
       c int;
   begin
       c = 0;
       select into c isallowed from cwhitelist where semid = sid and personnumid = pid;

       if c isnull then
         c = 0;
       end if;
       
       return c;
   end;
$_$;


ALTER FUNCTION public.callowed(text, bigint) OWNER TO postgres;

--
-- TOC entry 290 (class 1255 OID 16427)
-- Dependencies: 1225 6
-- Name: callowed(text, bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION callowed(text, bigint, text, text) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
   declare
       pid ALIAS FOR $1;
       sid alias for $2;
       authorizer_ alias for $3;
       period_ alias for $4;
       c int;
   begin
       c = 0;
       select into c isallowed from cwhitelist where semid = sid and personnumid = pid
       and authorizer = authorizer_ and period = period_;

       if c isnull then
         c = 0;
       end if;
       
       return c;
   end;
$_$;


ALTER FUNCTION public.callowed(text, bigint, text, text) OWNER TO postgre;

--
-- TOC entry 291 (class 1255 OID 16428)
-- Dependencies: 6
-- Name: cashier_trans(date, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION cashier_trans(date, text, OUT text, OUT text, OUT text, OUT text, OUT text, OUT double precision) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
    select ''::text, filterpersonid(personnumid), 
    upper(getpersonfullname(getpersonidnumid(personnumid))), 
    filterreceiptnum(receiptnum), 
    getccmodename(chargenameid), 
    amount FROM accounts where 
    date_ = $1 AND cashier_name = $2 
     and (mult = -1 or mult = 0) and chargenameid in 
    (select ccmodeid from ccmode where displayable = 1 and ismisc = 0) order by
    filterreceiptnum(receiptnum)::numeric asc;
$_$;


ALTER FUNCTION public.cashier_trans(date, text, OUT text, OUT text, OUT text, OUT text, OUT text, OUT double precision) OWNER TO postgre;

--
-- TOC entry 294 (class 1255 OID 16429)
-- Dependencies: 6 1225
-- Name: checkconsistency(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION checkconsistency() RETURNS void
    LANGUAGE plpgsql
    AS $$
  declare
     rc record;
     amt double precision;
  begin
     for rc in select * from accounts where personnumid <> '2006-0001' and 
              (chargenameid = getccmodeid('Tuition') or 
              chargenameid = getccmodeid('Miscellaneous')) loop
              amt = distribamount(rc.receiptnum, rc.semid, rc.cashier_name);
              if rc.amount <> amt then
                perform pd_fill(rc.personnumid, rc.amount - amt, rc.semid, rc.receiptnum, rc.date_, 'Tuition', rc.cashier_name, 0); 
                raise notice '% added in distrib % % dated % encoded by %', rc.personnumid, rc.amount - amt,rc.receiptnum, rc.date_, rc.cashier_name;   
              end if;
      end loop;
  end;
$$;


ALTER FUNCTION public.checkconsistency() OWNER TO postgres;

--
-- TOC entry 295 (class 1255 OID 16430)
-- Dependencies: 6 1225
-- Name: clearinetusers(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION clearinetusers(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
     sid alias for $1;
     names_ record;
   begin
      for names_ in select personid from personnum where personnumid in 
         (select distinct personnumid from 
                academicyearload where semid = sid) 
                and ptypeid = getptypeid('students') loop
           raise notice 'DROP %;', names_.personid;
           --perform drop user names_.personid;
       end loop;         
      return 'OK';
   end;
$_$;


ALTER FUNCTION public.clearinetusers(bigint) OWNER TO postgres;

--
-- TOC entry 296 (class 1255 OID 16431)
-- Dependencies: 6 1225
-- Name: computestandardcharges(bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION computestandardcharges(bigint, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       sid alias for $1;
       lev alias for $2;
       l float8;
   begin
      
       select into l sum(rate) from chargesdetails where ccmodeid <> getccmodeid('Per Unit') and semid = sid
                and ccmodeid <> getccmodeid('Test Paper') and level_ = lev;
       if l isnull then
          l = 0;
       end if;  
       return l;
   end;
$_$;


ALTER FUNCTION public.computestandardcharges(bigint, text) OWNER TO postgres;

--
-- TOC entry 297 (class 1255 OID 16432)
-- Dependencies: 6 1225
-- Name: computetestpaperfee(bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION computetestpaperfee(bigint, text, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       sid alias for $1;
       lev alias for $2;
       pid alias for $3;
       l float8;
       tl int8; 
       tpfee float8; 
   begin 
       select into l rate from chargesdetails where semid = sid and ccmodeid = getccmodeid('Test Paper') and level_ = lev;
       select into tl count(offeringid) from academicyearload where personnumid = pid and
          semid = sid;

       if l isnull then
          l = 0;
       end if;  
        
       tpfee = l * tl::float8;   
   
       return tpfee;
   end;
$_$;


ALTER FUNCTION public.computetestpaperfee(bigint, text, text) OWNER TO postgres;

--
-- TOC entry 298 (class 1255 OID 16433)
-- Dependencies: 6 1225
-- Name: computetf(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION computetf(text, bigint) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       sid alias for $2;
       d_ text;  
       d int8;
       y int;
   begin
       d_ = getpersondegree(pid);
       d = getdegreeid(d_);
       y = getpersonyear(pid);
       return studtotalload(pid, sid) * perunitcharge(d, y, sid, getlev(getpersondegree(pid)));
   end;
$_$;


ALTER FUNCTION public.computetf(text, bigint) OWNER TO postgres;

--
-- TOC entry 299 (class 1255 OID 16434)
-- Dependencies: 6 1225
-- Name: constraintconf(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION constraintconf() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare
    c int;
  begin
    select into c count(subjectid) from subject where subjectid = new.subjectid;
    
    if c > 0 then
      new.subjectid = gensubjid();
    end if;
    return new;
  end;
$$;


ALTER FUNCTION public.constraintconf() OWNER TO postgres;

--
-- TOC entry 300 (class 1255 OID 16435)
-- Dependencies: 1225 6
-- Name: constraintconfup(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION constraintconfup() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare
    c text;
  begin

    if new.islec = 1 then
         delete from subjlab where subjectid = new.subjectid;
    end if;

    return new;
  end;
$$;


ALTER FUNCTION public.constraintconfup() OWNER TO postgres;

--
-- TOC entry 301 (class 1255 OID 16436)
-- Dependencies: 1225 6
-- Name: convert3rdtosummer(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION convert3rdtosummer(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE
       c TEXT;
 BEGIN
       if upper($1) = '3RD' then
            c = 'Summer';
       else
            c = $1 || ' Semester';
       end if;
    RETURN c;  
  END;
$_$;


ALTER FUNCTION public.convert3rdtosummer(text) OWNER TO postgres;

--
-- TOC entry 302 (class 1255 OID 16437)
-- Dependencies: 1225 6
-- Name: convert3rdtosummer2(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION convert3rdtosummer2(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE
       c TEXT;
 BEGIN
       if upper($1) = '3RD' then
            c = 'Summer';
       else
            c = $1 || '';
       end if;
    RETURN c;  
  END;
$_$;


ALTER FUNCTION public.convert3rdtosummer2(text) OWNER TO postgres;

--
-- TOC entry 303 (class 1255 OID 16438)
-- Dependencies: 6 1225
-- Name: convertsummerto3rd(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION convertsummerto3rd(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE
       c TEXT;
 BEGIN
       if upper($1) = 'SUMMER' then
            c = '3rd';
       else
            c = $1;
       end if;
    RETURN c;  
  END;
$_$;


ALTER FUNCTION public.convertsummerto3rd(text) OWNER TO postgres;

--
-- TOC entry 304 (class 1255 OID 16439)
-- Dependencies: 6 1225
-- Name: countenrolled(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION countenrolled(text, bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
   declare
       abbr alias for $1;
       sid alias for $2;
       i int;
   begin
	   select into i count(coursedesc) from distinct_ids_enrolled where semid = sid and upper(coursedesc) = upper(abbr);
           return i;
   end;
$_$;


ALTER FUNCTION public.countenrolled(text, bigint) OWNER TO postgres;

--
-- TOC entry 305 (class 1255 OID 16440)
-- Dependencies: 6 1225
-- Name: countocc(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION countocc(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    desc_ alias for $1;
     d text;
     l int;
     pk text;
  BEGIN
     select into l  max(position('.' in authnum)) from author where cuttersid = desc_;
     if l > 0 then
        SELECT into d Max(substring(authnum, 1, l - 1)::numeric)  from author where cuttersid = desc_;
        l = d::numeric + 1;
        d = l::text; 
    else
       d = '1';
     end if;
  
     --select into pk authnum from author where authnum = d || '.' || desc_;
     --if not pk isnull then
     --end if; 
    --raise notice '%', d || '.' || desc_;
    return d;
  END;

 $_$;


ALTER FUNCTION public.countocc(text) OWNER TO postgres;

--
-- TOC entry 292 (class 1255 OID 16441)
-- Dependencies: 6
-- Name: countpromises(bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION countpromises(bigint, text, text, OUT bigint) RETURNS SETOF bigint
    LANGUAGE sql
    AS $_$
    select count(*) from
     cwhitelist where isallowed = 1 and semid = $1 and personnumid = $2 and period = $3;
$_$;


ALTER FUNCTION public.countpromises(bigint, text, text, OUT bigint) OWNER TO postgre;

--
-- TOC entry 293 (class 1255 OID 16442)
-- Dependencies: 6 1225
-- Name: countstubentries(text, text, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION countstubentries(text, text, date) RETURNS integer
    LANGUAGE plpgsql
    AS $_$ 
  declare 
    from_ alias for $1; 
    to_ alias for $2; 
    d8_ alias for $3; 
    start_ text; 
    end_ text; 
    yr_ text; 
    c  int; 
  begin 
       yr_ = yearpart(d8_); 
      start_ = yr_ || '-' || from_; 
      end_ = yr_ || '-' || to_; 
      select into c count(*) from accounts  where receiptnum >= start_ and receiptnum <= end_; 
      return c; 
  end; 
$_$;


ALTER FUNCTION public.countstubentries(text, text, date) OWNER TO postgres;

--
-- TOC entry 306 (class 1255 OID 16443)
-- Dependencies: 1225 6
-- Name: createsem_ay(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION createsem_ay(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE 
          yearRange ALIAS FOR $1;
          semdesc_ ALIAS FOR $2;
          yearID_ INT8; 
          semstrID_ INT8;
          rid RECORD;
          dumm INT;
 BEGIN
         SELECT INTO yearID_ ayid from ay where year_ = yearRange;
         
         
          if yearID_ ISNULL then
               INSERT INTO ay (year_) VALUES (yearRange);
          end if; 

          SELECT INTO yearID_ ayid from ay where year_ = yearRange;
          SELECT INTO semstrID_ semid from sem where ayID = yearID_ AND semdesc = semdesc_;
          

          if semstrID_ ISNULL then
 
                         INSERT INTO sem (ayid,semdesc) VALUES (yearID_, semdesc_);
                        

		 SELECT INTO semstrID_ semid from sem where ayID = yearID_ AND semdesc = semdesc_;
                 delete from currsem;
                 insert into currsem(currsemid) values (semstrID_);
		 --raise notice 'NOTICE: %', semstrID_; 
		 --PERFORM populateAvailRooms(roomsid,semstrID_, semdesc_) FROM rooms order by roomsid;
       	   	            

	 end if;
          
	  
    RETURN 'ok';  
  END;
$_$;


ALTER FUNCTION public.createsem_ay(text, text) OWNER TO postgres;

--
-- TOC entry 307 (class 1255 OID 16444)
-- Dependencies: 1225 6
-- Name: createsem_ay2(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION createsem_ay2(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE 
          yearRange ALIAS FOR $1;
          semdesc_ ALIAS FOR $2;
          yearID_ INT8; 
          semstrID_ INT8;
          rid RECORD;
          yrnodash text; -- August 5, 2010
          yrform int8; -- August 5, 2010
          semform int8; -- August 5, 2010
          semcount text; -- August 5, 2010
          dashplace integer; -- August 5, 2010
          yrRange text;
          app_ text;
          dumm INT;
 BEGIN
         -- syntax: 		select createsem_ay2('2009-2010', '1st');
		 --		select createsem_ay2('2009-2010', '2nd');
	 	 --		select createsem_ay2('2010-2011', '3rd');
         -- August 5, 2010 -- making it serve forever
         dashplace = instr('-', yearRange);
         yrRange = yearRange;
         app_ = '';
         if semdesc_ = '1st' then
              semcount = '1';
          elsif semdesc_ = '2nd' then
              semcount = '2';
          else
              semcount = '3';
              yrRange = substr(yearRange, 1,4);
              app_ = '0';
          end if;

          --if semdesc <> '3rd' then
             
             yrnodash = substr(yearRange, 1,4) || substr(yearRange, dashplace +1,4) || app_; 
          --else
          --  yrnodash = yearRange;
          --end if;

          if semdesc_ = '3rd' then
             yrform =  yrnodash || app_;
             --yrform =  (yrRange::int)::text|| yrRange || app_;
             --yrRange = (yrRange::int - 1)::text|| yrRange;
           else
             yrform = yrnodash::int8;
          end if;

          SELECT INTO yearID_ ayid from ay where year_ = yrRange;
          
          if yearID_ ISNULL then
               INSERT INTO ay (ayid,year_) VALUES (yrform, yrRange);
          end if; 

          SELECT INTO yearID_ ayid from ay where year_ = yrRange;
          SELECT INTO semstrID_ semid from sem where ayID = yearID_ AND semdesc = semdesc_;
          -- remove the appended zero in case of summer
   
          yrnodash = substr(yearRange, 1,4) || substr(yearRange, dashplace +1,4);  
          yrform = yrnodash::int8;
           
          if semdesc_ <> '3rd' then
              semform = (yrnodash || semcount)::int8;
          else
              semform = ((yrRange::int - 1)::text || yrRange || '3')::int8; 
          end if;

          if semstrID_ ISNULL then
                 INSERT INTO sem (semid,ayid,semdesc) VALUES (semform, yearID_, semdesc_);
	  end if;
    RETURN 'ok';  
  END;
$_$;


ALTER FUNCTION public.createsem_ay2(text, text) OWNER TO postgres;

--
-- TOC entry 308 (class 1255 OID 16445)
-- Dependencies: 1225 6
-- Name: currassessplusba(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION currassessplusba(text, bigint) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
  declare
     studentid alias for $1;
     semid_ alias for $2;
     encoded_ba double precision;
     system_ba double precision;
     assessment double precision;
     degree text;
  begin
    degree = getpcurrdegree(studentid, semid_);
    SELECT into encoded_ba sum(amount) 
         FROM accounts 
          where 
            --encoded_bk_act_bal(studentid,semid_, receiptnum) > 0 
             -- and 
                substr(receiptnum,1,2) = 'BA' 
                  and 
                   personnumid = studentid 
                     and 
                       mult = 1 and semid = semid_;
           if encoded_ba isnull then
              encoded_ba = 0.0;
           end if;
           
       SELECT into system_ba stubalance(studentid, semid_)
           where round(stubalance(studentid, semid_)::numeric,2) > 0;
           
       if system_ba isnull then
          system_ba = 0.0;
       end if; 
       
       select into assessment payable from acctsum
         where personnumid = studentid and semid = semid_;
       if assessment isnull then   
          assessment = assess(studentid,semid_,getlev(degree));  
       end if;
       return assessment + system_ba + encoded_ba;
  end;
$_$;


ALTER FUNCTION public.currassessplusba(text, bigint) OWNER TO postgre;

--
-- TOC entry 309 (class 1255 OID 16446)
-- Dependencies: 1225 6
-- Name: currrctdate(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION currrctdate(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    cashier_ alias for $1;
    rnumber record;
    curr text;
  begin
      select into rnumber * from receiptstubs where cashier_name = cashier_ and rcounter_::int8 <= to_::int8 order by from_::int8 asc limit 1;
      curr = yearpart(rnumber.date_controlled);
      return curr;
  end;
$_$;


ALTER FUNCTION public.currrctdate(text) OWNER TO postgres;

--
-- TOC entry 310 (class 1255 OID 16447)
-- Dependencies: 1225 6
-- Name: currreceipt(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION currreceipt(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    cashier_ alias for $1;
    cnum text;
    rnumber record;
    numr int8;
    curr text;
  begin
      select into rnumber * from receiptstubs where cashier_name = cashier_ and rcounter_::int8 <= to_::int8 order by from_::int8 asc limit 1;
      
      if rnumber isnull then
          raise exception ' You got no more receipt in your stub, please contact your stub controller.  ';
      end if;   
      curr = rnumber.rcounter_;
      numr = curr::int8 + 1;
      return curr;
  end;
$_$;


ALTER FUNCTION public.currreceipt(text) OWNER TO postgres;

--
-- TOC entry 311 (class 1255 OID 16448)
-- Dependencies: 6 1225
-- Name: degree_(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION degree_(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    dgr text;
BEGIN
     select into dgr mydegree(degreeid) || '-' || year_ from person where personid = $1 and ptypeid = $2;
      RETURN dgr;
END;
$_$;


ALTER FUNCTION public.degree_(text, bigint) OWNER TO postgres;

--
-- TOC entry 312 (class 1255 OID 16449)
-- Dependencies: 6 1225
-- Name: degreedeptclosure(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION degreedeptclosure(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE
     dept_ text;
     deptid int8;
  BEGIN
     select into deptid depid from degree where upper(abbr) = upper($1);
     
     if deptid ISNULL then
        RAISE EXCEPTION 'COULD NOT SEARCH FOR THE DEPT FOR THAT DEGREE';
     end if;
     dept_ = fetchDeptName(deptid);
     return dept_;
  END;
$_$;


ALTER FUNCTION public.degreedeptclosure(text) OWNER TO postgres;

--
-- TOC entry 313 (class 1255 OID 16450)
-- Dependencies: 1225 6
-- Name: degreefreq(bigint, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION degreefreq(bigint, date) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
     declare
        cnt int8;
     begin
        select into cnt count(distinct USERS_iD) from logsinet where
          USERS_ID in (select personid from person where  DEGREEID = $1 and ptypeid = 1)
          and to_date(timestamptodate(timestamp_), 'MM/DD/YYYY') = $2;
        return cnt;
     end;
$_$;


ALTER FUNCTION public.degreefreq(bigint, date) OWNER TO postgres;

--
-- TOC entry 314 (class 1255 OID 16451)
-- Dependencies: 6 1225
-- Name: degreefreqmonthly(bigint, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION degreefreqmonthly(bigint, date) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
     declare
        cnt int8;
     begin
        select into cnt count(distinct USERS_iD) from logsinet where
          USERS_ID in (select personid from person where  DEGREEID = $1 and ptypeid = 1)
          and extract(month from to_date(timestamptodate(timestamp_), 'MM/DD/YYYY')) = extract(month from $2);
        return cnt;
     end;
$_$;


ALTER FUNCTION public.degreefreqmonthly(bigint, date) OWNER TO postgres;

--
-- TOC entry 595 (class 1255 OID 1272876)
-- Dependencies: 6
-- Name: degs(); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION degs(OUT bigint, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $$
    
     select degreeid, abbr 
     from 
     degree
     where degreeid <> 1 
     order by abbr;
$$;


ALTER FUNCTION public.degs(OUT bigint, OUT text) OWNER TO postgre;

--
-- TOC entry 315 (class 1255 OID 16452)
-- Dependencies: 6 1225
-- Name: del2account2_(text, text, bigint, text, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION del2account2_(text, text, bigint, text, double precision) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
       rctid alias for $1;
       pid alias for $2;
       smd alias for $3;
       usename alias for $4;
       amt alias for $5;
       pidr text;
       pr text;
  begin
     
     if ECpermit(usename) then
	   
           delete from accounts where receiptnum = rctid  and personnumid = pid and semid = smd;
	   --raise exception 'rctid++: % pid: % smd: % usename: % amt : %', rctid, pid, smd, usename, amt;
           pr = ECdec(usename);
           pidr = log_action(usename,pid || ' account is deleted  with ' || rctid || ' amounting to ' || amt::text);	    
     end if;
    return 'OK'; 
  end;
$_$;


ALTER FUNCTION public.del2account2_(text, text, bigint, text, double precision) OWNER TO postgres;

--
-- TOC entry 316 (class 1255 OID 16453)
-- Dependencies: 6 1225
-- Name: del2account_(text, text, text, date, text, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION del2account_(text, text, text, date, text, double precision) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
       rctid alias for $1;
       pid alias for $2;
       ccmodename alias for $3;
       d8_ alias for $4;
       usename alias for $5;
       amt alias for $6;
       pidR text;
       ccmodeid int8;
       pr text;
  begin
     if ECpermit(usename) then
		     if pid = 'Cash' then
			 pidR = '2006-0001';
		     else
			 pidR = pid;
		     end if;  
		     ccmodeid = getccmodeid(ccmodename);
		     delete from accounts where receiptnum = rctid and date_ = d8_ and chargenameid = ccmodeid and personnumid = pidR and cashier_name = usename;
		     pr = ECdec(usename);
		     pidr = log_action(usename,pid || ' account is deleted  with ' || ccmodename || ' amounting to ' || amt::text);
		    
     end if;
    return 'OK'; 
  end;
$_$;


ALTER FUNCTION public.del2account_(text, text, text, date, text, double precision) OWNER TO postgres;

--
-- TOC entry 317 (class 1255 OID 16454)
-- Dependencies: 1225 6
-- Name: delstub(text, text, text, date, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION delstub(text, text, text, date, text, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
    cashier_ alias for $1;
    controller_ alias for $2;
    stubno alias for $3;
    d8_ alias for $4;
    from_ alias for $5;
    to_ alias for $6;
    yr_ text;
    start_ text;
    end_ text;
    c  int;
    msg text;
  begin
      yr_ = yearpart(d8_);
      start_ = yr_ || '-' || from_;
      end_ = yr_ || '-' || to_;
      
      select into c count(*) from accounts  where receiptnum >= start_ and receiptnum <= end_;
      if c > 0 then
          raise exception 'Cannot delete stub entry there are % receipt(s) already in use.', c;
      else
          delete from receiptstubs where  cashier_name = cashier_ and 
                controller_name = controller_ and 
                stubnumber = stubno and
                date_controlled = d8_;
                msg = log_action(controller_,controller_ || ' deleted stub number ' || stubno || ' with series from ' || from_ || ' to ' || to_ || ' assigned to '|| cashier_ || '.');
      end if;
      return;
  end;
$_$;


ALTER FUNCTION public.delstub(text, text, text, date, text, text) OWNER TO postgres;

--
-- TOC entry 318 (class 1255 OID 16455)
-- Dependencies: 6 1225
-- Name: deptfreq(bigint, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION deptfreq(bigint, date) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
     declare
        cnt int8;
     begin
        select into cnt count(distinct USERS_iD) from logsinet where
          USERS_ID in (select personid from person where  DEGREEID IN 
            (SELECT DEGREEID FROM DEGREE WHERE DEPID = $1) and ptypeid = 1) 
          and to_date(timestamptodate(timestamp_), 'MM/DD/YYYY') = $2;
        return cnt;
     end;
$_$;


ALTER FUNCTION public.deptfreq(bigint, date) OWNER TO postgres;

--
-- TOC entry 319 (class 1255 OID 16456)
-- Dependencies: 6 1225
-- Name: deptfreqmonthly(bigint, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION deptfreqmonthly(bigint, date) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
     declare
        cnt int8;
     begin
        select into cnt count(distinct USERS_iD) from logsinet where
          USERS_ID in (select personid from person where  DEGREEID IN 
            (SELECT DEGREEID FROM DEGREE WHERE DEPID = $1) and ptypeid = 1) 
          and extract(month from to_date(timestamptodate(timestamp_), 'MM/DD/YYYY')) = extract(month from $2);
        return cnt;
     end;
$_$;


ALTER FUNCTION public.deptfreqmonthly(bigint, date) OWNER TO postgres;

--
-- TOC entry 320 (class 1255 OID 16457)
-- Dependencies: 6 1225
-- Name: deptofcourse(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION deptofcourse(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       dr ALIAS FOR $1;
       dep_ int8;
       l text;
   begin
       select into dep_ depid from degree where degreeid = dr;
	select into l desc_ from dep where depid = dep_;
       return l;
   end;
$_$;


ALTER FUNCTION public.deptofcourse(bigint) OWNER TO postgres;

--
-- TOC entry 321 (class 1255 OID 16458)
-- Dependencies: 6 1225
-- Name: deptofdegree(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION deptofdegree(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
     d int8;
   begin
      select into d depid from degree where upper(abbr) = upper($1);
      return d;
   end;
$_$;


ALTER FUNCTION public.deptofdegree(text) OWNER TO postgres;

--
-- TOC entry 322 (class 1255 OID 16459)
-- Dependencies: 6 1225
-- Name: detlablec(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION detlablec(integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    islec alias for $1;
    msg text;
BEGIN
      if islec = 1 then
          msg = 'LECTURE';
      else
          msg = 'LABORATORY';
      end if;    
      RETURN msg;
END;
$_$;


ALTER FUNCTION public.detlablec(integer) OWNER TO postgres;

--
-- TOC entry 323 (class 1255 OID 16460)
-- Dependencies: 6 1225
-- Name: dettpordesc(text, bigint, text, double precision, integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION dettpordesc(text, bigint, text, double precision, integer, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    s text;
    sid alias for $2;
    pid alias for $3;
    rate alias for $4;
    isRate alias for $5;
    degree alias for $6;
  begin
    s = $1;
    if isRate = 0 then
      if s = 'Test Paper' then
           s = 'Test Paper ' || testpapercount(sid,pid) || ' x ' ||  rate::text;
      end if; 
    else
      if s = 'Test Paper' then
         s = rate::text;
      else
         s = computetestpaperfee(sid, getlev(degree), pid)::text;
      end if;
    end if;
    return s;
  end;
$_$;


ALTER FUNCTION public.dettpordesc(text, bigint, text, double precision, integer, text) OWNER TO postgres;

--
-- TOC entry 324 (class 1255 OID 16461)
-- Dependencies: 6 1225
-- Name: distribamount(text, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION distribamount(text, bigint, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       rctnum alias for $1;
       sid alias for $2;
       cname alias for $3;
       s double precision; 
   begin
     select into s sum(amount) from payment_details where receiptnum = rctnum and semid = sid 
             and cashier_name = cname;
     if s isnull then
        s = 0;
     end if;
     return s;
   end;
$_$;


ALTER FUNCTION public.distribamount(text, bigint, text) OWNER TO postgres;

--
-- TOC entry 327 (class 1255 OID 16462)
-- Dependencies: 6
-- Name: distribcols(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION distribcols(date, OUT text) RETURNS SETOF text
    LANGUAGE sql
    AS $_$
    select distinct getccmodename(chargenameid) as chargename from accounts
         where 
             getccmodename(chargenameid) <> 'Tuition' and 
             date_ = $1 and instr(receiptnum,'-') = 5 
         union
             (select distinct chargename from payment_details   
                  where chargename <> 'Tuition' and 
                  date_ = $1) order by chargename asc;
$_$;


ALTER FUNCTION public.distribcols(date, OUT text) OWNER TO postgres;

--
-- TOC entry 328 (class 1255 OID 16463)
-- Dependencies: 6
-- Name: distribnames(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION distribnames(date, OUT text, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $$
 select distinct filterpersonid(personnumid),
     getpersonfullname(getpersonidnumid(filterpersonid(personnumid))) as pname, '' 
     from accounts where date_ = now()::date order by pname;
$$;


ALTER FUNCTION public.distribnames(date, OUT text, OUT text, OUT text) OWNER TO postgres;

--
-- TOC entry 329 (class 1255 OID 16464)
-- Dependencies: 6 1225
-- Name: distribpaydetails(text, date, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION distribpaydetails(text, date, text, OUT text, OUT double precision) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $_$
declare
   pdetailslist record;
begin
  if processid($1) <> '2006-0001' then
    return query select chargename, amount
       from payment_details where personnumid = $1 and 
       date_ = $2 and receiptnum = $3;
  else
    return query select getccmodename(chargenameid), amount
       from accounts where 
           personnumid = processid($1) and date_ = $2 and 
           receiptnum = $3;
  end if;
end;
$_$;


ALTER FUNCTION public.distribpaydetails(text, date, text, OUT text, OUT double precision) OWNER TO postgre;

--
-- TOC entry 330 (class 1255 OID 16465)
-- Dependencies: 6 1225
-- Name: distribpayreceipts(date); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION distribpayreceipts(date, OUT text, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $_$
  begin    
     return query select distinct receiptnum, filterpersonid(personnumid),
     getpersonfullname(getpersonidnumid(filterpersonid(personnumid)))
         from accounts where date_ = $1 and instr(receiptnum, '-') = 5  order by receiptnum asc;
  end;
$_$;


ALTER FUNCTION public.distribpayreceipts(date, OUT text, OUT text, OUT text) OWNER TO postgre;

--
-- TOC entry 331 (class 1255 OID 16466)
-- Dependencies: 6 1225
-- Name: distribute(text, double precision, bigint, text, date, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION distribute(text, double precision, bigint, text, date, text, text, integer) RETURNS void
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       amt alias for $2;
       smid alias for $3;
       rctnum alias for $4;
       d8 alias for $5;
       cashier_ alias for $6;
       pdegree alias for $7;
       pyear alias for $8;
       payments_ record;
       tuition_ record;
       misc_ record;
       test_paper_ record;
       subject_ record;
       labcharge_ record;
       level_1 text;
       myamount double precision;
       downpayment double precision;
       myamount2 double precision;
       remaining double precision;
       totalmisc double precision;
       totalpayments double precision;
       totallabcharge double precision;
       totalsubjectcharge double precision;
       odwn double precision;
       stutotalload double precision; -- Thursday, 19 August, 2010 01:34:53 PM PHT 
   begin
          level_1 = getlev(pdegree);
          stutotalload = studtotalload(pid,smid);
          downpayment = amt;
          select into payments_ * from payment_details where personnumid = pid and semid = smid order by date_ asc; 
          --select into totalpayments sum(amount) from payment_details where personnumid = pid and semid = smid; 

          --if totalpayments isnull then
           --    totalpayments = 0;
          --end if;
          
         SELECT into totalmisc sum(rate) FROM chargesdetails where semid =  smid
	 						       AND ccmodeid <> getccmodeid('Per Unit') 
         						       and level_ = level_1 
	 						       and ccmodeid <> getccmodeid('Test Paper');
       
         --=============================================================================================================
         -- miscellaneous
         if downpayment > 0 then 
                          FOR misc_ IN select getccmodename(ccmodeid) as desc_, rate FROM chargesdetails where semid =  smid
										 AND ccmodeid <> getccmodeid('Per Unit') 
										 and level_ = level_1 
										 and  ccmodeid <> getccmodeid('Test Paper')  
										 order by mode,desc_ asc LOOP
                              --odwn = downpayment; 
                              if downpayment > 0 then
                                   downpayment = subdistribute(pid, downpayment, smid, rctnum, d8, misc_.desc_, cashier_, misc_.rate);
                              end if;
                          END LOOP;
                         --totalpayments = totalpayments - (odwn - downpayment); -- (odwn - downpayment) --> the total payment i made
         else -- this means i paid the total miscellaneous
              --totalpayments = totalpayments - totalmisc; 
         end if;

         -- back accounts check
         -- stubalance('" & txtpersonid.Text & "', " & myglobals.semid & ")
         -- if there is back account
         --      rewind and distribute into that semester  -- recursive call to distribute
         --      after distribution return whatever is left in the money
         -- end if; 

         if stutotalload > 0 then -- only compute if subjects are enrolled
		               -- test paper
                                SELECT into test_paper_  computetestpaperfee(semid  , level_1, pid) as tfee FROM chargesdetails  
											where semid = smid   AND level_ = level_1 and   
											ccmodeid = getccmodeid('Test Paper'); -- Test Paper
         			if downpayment > 0 then
             			--odwn = downpayment;
	     				downpayment = subdistribute(pid, downpayment, smid, rctnum, d8, 'Test Paper', cashier_, test_paper_.tfee);
             			--totalpayments = totalpayments - (odwn - downpayment); -- (odwn - downpayment) --> the total payment i made
         			else -- this means i paid the total test paper
            				-- totalpayments = totalpayments - test_paper_.tfee;
         			end if;
         			--raise notice 'misc total payments % downpayment % ', totalpayments, downpayment;					 
         			-- subject lab
         			if downpayment > 0 then  
              				SELECT into  totallabcharge 
				 		sum(labchargef(subjlabf(getsubjectid(getsubjnumber(getofferingsubj(offeringid, semid)))), semid, level_1))    
				 		FROM academicyearload 
				 		where personnumid = pid 
				       		and  semid = smid   
				       		AND NOT subjlabf(getsubjectid(getsubjnumber(getofferingsubj(offeringid, semid)))) IsNull;
				           
              			if not totallabcharge isnull then
                    			if downpayment > 0 then
				    		FOR labcharge_ IN SELECT subjlabdesc(subjlabf(getsubjectid(getsubjnumber(getofferingsubj(offeringid, semid))))) as desc_,  
						 sum(labchargef(subjlabf(getsubjectid(getsubjnumber(getofferingsubj(offeringid, semid)))), semid, level_1)) as rate    
						 FROM academicyearload 
						 where personnumid = pid 
						       and  semid = smid   
						       AND NOT subjlabf(getsubjectid(getsubjnumber(getofferingsubj(offeringid, semid)))) IsNull  
						 group by desc_ loop
						 --odwn = downpayment;
                                                 if downpayment > 0 then
				                    downpayment = subdistribute(pid, downpayment, smid, rctnum, d8, labcharge_.desc_, cashier_, labcharge_.rate);
                                                 end if;
                                                 --totalpayments = totalpayments - (odwn - downpayment); -- (odwn - downpayment) --> the total payment i made
				    		end loop;		   
                     		else -- this means i paid the total lab charge
				--totalpayments = totalpayments - totallabcharge;  
                     		end if;
               	      	end if;	     			 
	       	end if;			 
         	--=============================================================================================================
          	--raise notice 'lab total payments % downpayment % ', totalpayments, downpayment;
          	if downpayment > 0 then
               --totalsubjectcharge
                	SELECT into totalsubjectcharge sum(subjectcharge(getsubjnumber(getofferingsubj(offeringid, semid)), semid , level_1)) 
                    		FROM  academicyearload  
					where personnumid = pid and semid = smid and  
					subjectcharge(getsubjnumber(getofferingsubj(offeringid, semid)), smid, level_1) > 0; 
 
                   		if not totalsubjectcharge isnull then
                         		if downpayment > 0 then
			      			for subject_ in SELECT getsubjnumber(getofferingsubj(offeringid, semid)) as subj_, 
							subjectcharge(getsubjnumber(getofferingsubj(offeringid, semid)), semid , level_1)  as rate
							FROM  academicyearload  
							where personnumid = pid and semid = smid and  
							subjectcharge(getsubjnumber(getofferingsubj(offeringid, semid)), smid, level_1) > 0 loop

                                        		if downpayment > 0 then
				 	 		 	downpayment = subdistribute(pid, downpayment, smid, rctnum, d8, subject_.subj_, cashier_, subject_.rate);
                                        		end if;
                                        
			      			end loop;	 
			 		else -- this means i paid the total subject charge
			      			totalpayments = totalpayments - totalsubjectcharge; 
			 		end if;     
                   		end if; 
          		end if;
          --raise notice 'sub charge total payments % downpayment % ', totalpayments, downpayment; 
          		if downpayment > 0 then
               			select into tuition_ studtotalload(pid,smid) * 
	                       		perunitcharge(getdegreeid(pdegree), pyear,   smid  ,level_1) as t 
									from person where  
									personid in 
									  (select personid from personnum 
									        where personnumid  = pid) 
									           and ptypeid = getptypeid('students');
               			select into odwn sum(amount) from payment_details where personnumid = pid and semid = smid and chargename = 'Tuition';
               			if odwn isnull then
                 			odwn = 0;
               			end if;
                		-- finally
                		if downpayment > 0 then
                        		if odwn < tuition_.t then
                             			downpayment = subdistribute(pid, downpayment, smid, rctnum, d8, 'Tuition', cashier_, tuition_.t);
                        		end if;
                		end if;
          		end if;

          		--raise notice 'tuition total payments % downpayment % ', totalpayments, downpayment; 
 	--================================================================================================================          
        else
                  perform pd_fill(pid, downpayment, smid, rctnum, d8, 'Tuition', cashier_, 0); -- if student did not enrolled yet place the money in tuition
        end if;	
        return;
   end;
$_$;


ALTER FUNCTION public.distribute(text, double precision, bigint, text, date, text, text, integer) OWNER TO postgres;

--
-- TOC entry 332 (class 1255 OID 16469)
-- Dependencies: 6 1225
-- Name: distribute_all(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION distribute_all() RETURNS void
    LANGUAGE plpgsql
    AS $$
  declare
       rec record;
       count_ int8;
      ctr int8;
  begin
           ctr = 1;
           select into count_ count(*) from accounts where
                 					   chargenameid = getccmodeid('Tuition') or chargenameid = getccmodeid('Miscellaneous');
            FOR rec IN select personnumid, amount, 
                                                            semid, receiptnum, date_, 
                                                            cashier_name
						from accounts where
                 					   chargenameid = getccmodeid('Tuition') or chargenameid = getccmodeid('Miscellaneous') loop
                                            
                                               perform   distribute(rec.personnumid, rec.amount, 
                                                            rec.semid, rec.receiptnum, rec.date_, 
                                                            rec.cashier_name, getpersondegree(rec.personnumid), 
                                                            getpersonyear(rec.personnumid)::int);               
                                                raise notice '% of %', ctr,  count_;
                                                ctr = ctr + 1;
                          END LOOP;
       return; 
  end;
$$;


ALTER FUNCTION public.distribute_all() OWNER TO postgres;

--
-- TOC entry 340 (class 1255 OID 16470)
-- Dependencies: 6 1225
-- Name: doassess(text, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION doassess(text, bigint, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       sid alias for $2;
       assessor alias for $3;
       l float8;
       acct record;
       amtpaid double precision;
       addlcharge double precision;
       LINT INT8;
       level_ text;
   begin
      if upper(getptypename(getpersonnumtype(pid))) = 'STUDENTS' then
           level_ = getlev(getpcurrdegree(pid, sid)); 
           l = assess(pid, sid, level_);      
           
               select into acct * from acctsum where personnumid = pid and semid = sid;
               select into amtpaid sum(amount) from accounts where personnumid = pid and semid = sid and mult = -1;
               select into addlcharge sum(amount) from accounts where personnumid = pid and semid = sid and mult  = 1 and receiptnum <> 'assess';
                
               if amtpaid isnull then
                  amtpaid = 0.0;
               end if;            

                if addlcharge isnull then
                    addlcharge = 0.0;
                end if;

               if acct isnull then
                 insert into acctsum (personnumid, semid, payable, amountpaid) values (pid, sid, l + addlcharge, amtpaid);
               else
                 update acctsum set payable = l + addlcharge, amountpaid = amtpaid where personnumid = pid and semid = sid;
               end if;	
             
           level_ = log_action(assessor,pid || ' was assessed by ' || assessor);                      
        end if; 
      return 'OK';
   end;
$_$;


ALTER FUNCTION public.doassess(text, bigint, text) OWNER TO postgres;

--
-- TOC entry 596 (class 1255 OID 1272880)
-- Dependencies: 6
-- Name: dyears(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION dyears(text, bigint, OUT integer) RETURNS SETOF integer
    LANGUAGE sql
    AS $_$
    
     select distinct year_ 
     from 
     academicyearload
     where getdegree(degreeid) = $1 and semid = $2
     order by year_ desc;
$_$;


ALTER FUNCTION public.dyears(text, bigint, OUT integer) OWNER TO postgre;

--
-- TOC entry 341 (class 1255 OID 16471)
-- Dependencies: 6 1225
-- Name: eccount(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION eccount(text) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
  declare
    s int;
    uid alias for $1;
  begin
    select into s count_ from errorcorrect where userid = uid and d8_ = now()::date;
    
    return s;
  end;
$_$;


ALTER FUNCTION public.eccount(text) OWNER TO postgres;

--
-- TOC entry 342 (class 1255 OID 16472)
-- Dependencies: 6 1225
-- Name: ecdec(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ecdec(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    uid alias for $1;
  begin
    update errorcorrect set count_ = count_ - 1 where userid = uid and d8_ = now()::date;
    
    return 'OK';
  end;
$_$;


ALTER FUNCTION public.ecdec(text) OWNER TO postgres;

--
-- TOC entry 343 (class 1255 OID 16473)
-- Dependencies: 6 1225
-- Name: ecpermit(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ecpermit(text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
  declare
    uid alias for $1;
    res boolean;
  begin
    
    if ECcount(uid) > 0 then
         res = true;
    else
         res = false;
         raise exception 'Cannot do operation. You ran-out of error correcting privileges.';
    end if;
    return res;
  end;
$_$;


ALTER FUNCTION public.ecpermit(text) OWNER TO postgres;

--
-- TOC entry 344 (class 1255 OID 16474)
-- Dependencies: 6 1225
-- Name: eliminvalid(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION eliminvalid() RETURNS void
    LANGUAGE plpgsql
    AS $$
   DECLARE
   BEGIN
    delete from publication where classnum isnull and 
       title isnull and edition isnull and
       volumes isnull and
       pages isnull and
       fundsrc isnull and
       costprice isnull and
       pubid isnull and
       copyrightyear isnull and
       bookstatid isnull and
       buildingid isnull;
    RETURN;  
  END;
$$;


ALTER FUNCTION public.eliminvalid() OWNER TO postgres;

--
-- TOC entry 345 (class 1255 OID 16475)
-- Dependencies: 6 1225
-- Name: encoded_bk_act_bal(text, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION encoded_bk_act_bal(text, bigint, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
  declare
    pid alias for $1;
    sid alias for $2;
    banum alias for $3;
    v int;
    s float8;
  begin
      --receipt num will contain BA01 for first back account and BA01receiptnum for payments     
     select into s sum(amount * mult) from accounts where chargenameid = getccmodeid('Back Account') and
          personnumid = pid and semid = sid and strpos(receiptnum,banum)>0;
      if s isnull then
         s = 0;
      end if;
     return s;
  end;
$_$;


ALTER FUNCTION public.encoded_bk_act_bal(text, bigint, text) OWNER TO postgres;

--
-- TOC entry 325 (class 1255 OID 16476)
-- Dependencies: 6
-- Name: enrolledsubjects(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION enrolledsubjects(text, bigint, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
    select distinct offeringid, getsubjnumber(subjectid) as subj from offering where 
            offeringid in (select offeringid from personload where personnumid = $1 and 
	                  semid =  $2) and semid = $2  order by offeringid asc;
$_$;


ALTER FUNCTION public.enrolledsubjects(text, bigint, OUT text, OUT text) OWNER TO postgre;

--
-- TOC entry 326 (class 1255 OID 16477)
-- Dependencies: 6 1225
-- Name: enrollstat(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION enrollstat(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
       declare
          id_ alias for $1;
          res text;
       begin
          if getofloadstat(id_, getcurrsem()) then
              res = 'TRUE';
          else
       	      res = 'FALSE';
          end if;
       	  return res;
       end;
      $_$;


ALTER FUNCTION public.enrollstat(text) OWNER TO postgre;

--
-- TOC entry 346 (class 1255 OID 16478)
-- Dependencies: 6 1225
-- Name: entergrade(text, text, text, bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION entergrade(text, text, text, bigint, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       pid ALIAS FOR $1;
       grd alias for $2;
       scode alias for $3;
       sid alias for $4;
       remarks alias for $5;
       changer alias for $6;
       owner_ text;
       n float8;
       lstat integer;
       m text;
   begin
       -- Tue 19 May 2009 10:27:51 AM PHT 
       if not gradevalidate(grd) then
            raise exception 'Invalid Grade Entry.';
       end if;
      
       if not gradecommentvalidate(grd, remarks) then
            raise exception 'Invalid Grade, Remark Entry.';
       end if;


       select into owner_ personnumid from personload where offeringid = scode and semid = sid  and personnumid = changer;
       select into lstat locked from offering where offeringid = scode and semid = sid;
	
       if owner_ isnull then
          owner_ = 'null';
       end if;

       if changer <> owner_ and getptypename(usertype(changer)) <> 'registrar' then
              raise exception 'Access Denied: This section does not belong to you.';
       end if; 

       if lstat = 1 then
          raise exception 'This section is already locked.';    
       end if;
       m = log_action(changer,pid || ' was encoded a grade ' || grd || ' for ' || getsubjnumber(getofferingsubj(scode,sid)) || ' by ' || changer || ' during A.Y.' || getsemdesc(sid)); 
       update academicyearload set grade =  upper(grd), comment_ = remarks where
              personnumid = pid and offeringid = scode and semid = sid;
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.entergrade(text, text, text, bigint, text, text) OWNER TO postgres;

--
-- TOC entry 347 (class 1255 OID 16479)
-- Dependencies: 1225 6
-- Name: entergradeweb(text, text, text, bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION entergradeweb(text, text, text, bigint, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       pid ALIAS FOR $1;
       grd alias for $2;
       scode alias for $3;
       sid alias for $4;
       remarks alias for $5;
       changer alias for $6;
       owner_ text;
       n float8;
       lstat integer;
       m text;
       undigest text;
   begin
       -- Wednesday, 12 October, 2011 10:41:53 AM PHT 
       if not gradevalidate(grd) then
            raise exception 'Invalid Grade Entry.';
       end if;
       
       if not gradecommentvalidate(grd, remarks) then
            raise exception 'Invalid Grade, Remark Entry.';
       end if;

       select into owner_ md5(personnumid) from personload where offeringid = scode and semid = sid  and md5(personnumid) = changer;
       select into lstat locked from offering where offeringid = scode and semid = sid;
	
       if owner_ isnull then
          owner_ = 'null';
       end if;

       if changer <> owner_ and getptypename(usertype(changer)) <> 'registrar' then
              raise exception 'Access Denied: This section does not belong to you.';
       end if; 

       if lstat = 1 then
          raise exception 'This section is already locked.';    
       end if;
       undigest = unmd5uname(changer);
       m = log_action(undigest,pid || ' was encoded a grade ' || grd || ' for ' || getsubjnumber(getofferingsubj(scode,sid)) || ' by ' || undigest || ' during A.Y.' || getsemdesc(sid) || ' via web interface.'); 
       update academicyearload set grade =  upper(grd), comment_ = remarks where
              personnumid = pid and offeringid = scode and semid = sid;
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.entergradeweb(text, text, text, bigint, text, text) OWNER TO postgre;

--
-- TOC entry 348 (class 1255 OID 16480)
-- Dependencies: 1225 6
-- Name: exceptiondegreenroll(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION exceptiondegreenroll(text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
 declare
    pdegree alias for $1;
 begin
   return instr(pdegree, 'ED') > 0 and instr(pdegree, 'B') > 0 or instr(pdegree,'BSIE') > 0 or instr(pdegree, 'HRM') > 0;
 end;
$_$;


ALTER FUNCTION public.exceptiondegreenroll(text) OWNER TO postgre;

--
-- TOC entry 349 (class 1255 OID 16481)
-- Dependencies: 6
-- Name: exemptedstuds(bigint, text, date); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION exemptedstuds(bigint, text, date, OUT text, OUT text, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
    select personnumid, getpersonfullname2(personnumid), getpersondegree(personnumid), getpersonyear(personnumid) from
     cwhitelist where isallowed = 1 and semid = $1 and period = $2 and stamp::date = $3;
$_$;


ALTER FUNCTION public.exemptedstuds(bigint, text, date, OUT text, OUT text, OUT text, OUT text) OWNER TO postgre;

--
-- TOC entry 350 (class 1255 OID 16482)
-- Dependencies: 1225 6
-- Name: exportperson(text, text, text, text, bigint, bigint, integer, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION exportperson(text, text, text, text, bigint, bigint, integer, text, text, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
   declare
	personid_ alias for $1;
	lname_ alias for $2;
	fname_ alias for $3;
	mi_ alias for $4;
	ptypeid_ alias for $5;
	degreeid_ alias for $6;
	year__ alias for $7;
	status_ alias for $8;
	gender_ alias for $9;
	scholarship_ alias for $10;
	pix text;
   begin
	   --select personid,lname,fname,mi,ptypeid,degreeid, year_,status,gender,scholarship FROM person
           select into pix personid from person where personid = personid_;
           if pix isnull then
             insert into person (personid,lname,fname,mi,ptypeid,degreeid, year_,status,gender,scholarship) values (personid_,lname_,fname_,mi_,ptypeid_,degreeid_, year__,status_,gender_,scholarship_);
           else
              update person set lname = lname_,
		     fname = fname_,
		     mi = mi_,
		     ptypeid = ptypeid_,
		     degreeid = degreeid_, 
		     year_ = year__,
		     status = status_,
		     gender = gender_,
		     scholarship = scholarship_
              where personid  = personid_;
           end if;
           return;
   end;
$_$;


ALTER FUNCTION public.exportperson(text, text, text, text, bigint, bigint, integer, text, text, text) OWNER TO postgres;

--
-- TOC entry 351 (class 1255 OID 16483)
-- Dependencies: 6
-- Name: exskdsenc(bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION exskdsenc(bigint, text, text, OUT text, OUT double precision) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
    select period, rate from examschedsdetails where semid = $1 and semester = $2
    and level_ = $3 order by stamp asc;   
$_$;


ALTER FUNCTION public.exskdsenc(bigint, text, text, OUT text, OUT double precision) OWNER TO postgre;

--
-- TOC entry 352 (class 1255 OID 16484)
-- Dependencies: 6
-- Name: exsperiods(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION exsperiods(text, OUT text) RETURNS SETOF text
    LANGUAGE sql
    AS $_$
    select period from examperiods where status = true and semester = $1;  
$_$;


ALTER FUNCTION public.exsperiods(text, OUT text) OWNER TO postgre;

--
-- TOC entry 353 (class 1255 OID 16485)
-- Dependencies: 6 1225
-- Name: fetchdepid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fetchdepid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
  declare
    depid_  int8;
  begin
    select into depid_ depid from dep where upper(desc_) = upper($1);
       
    if depid_ isnull then
       raise exception 'DEPARTMENT NAME NOT FOUND!!!';
    end if;
  return depid_;
  end;
$_$;


ALTER FUNCTION public.fetchdepid(text) OWNER TO postgres;

--
-- TOC entry 354 (class 1255 OID 16486)
-- Dependencies: 1225 6
-- Name: fetchdeptname(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fetchdeptname(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   DECLARE 
      depID_ ALIAS For $1;
      depNAME TEXT;
   BEGIN
     SELECT INTO depNAME desc_ FROM dep WHERE depid = depID_;  
    RETURN depName;  
  END;
$_$;


ALTER FUNCTION public.fetchdeptname(bigint) OWNER TO postgres;

--
-- TOC entry 355 (class 1255 OID 16487)
-- Dependencies: 6 1225
-- Name: filterpersonid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION filterpersonid(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    s text;
  begin
    s = $1;
    if s = '2006-0001' then
       s = 'Cash';
    end if;
    return s;
  end;
$_$;


ALTER FUNCTION public.filterpersonid(text) OWNER TO postgres;

--
-- TOC entry 333 (class 1255 OID 16488)
-- Dependencies: 6 1225
-- Name: filterreceiptnum(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION filterreceiptnum(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    s text;
  begin
    s = $1;
    if substr(s,6,2) = 'BA' then
        s =  substr(s,10,length(s) - 9);
    elsif not isnumeric(substr(s,1,4)) then
       s = '';
    else
       s = substr(s,6, length(s) - 5);   
    end if;
    return s;
  end;
$_$;


ALTER FUNCTION public.filterreceiptnum(text) OWNER TO postgres;

--
-- TOC entry 334 (class 1255 OID 16489)
-- Dependencies: 6 1225
-- Name: filterreceiptnum2(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION filterreceiptnum2(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    s text;
  begin
    s = $1;
    if substr(s,6,2) = 'BA' then
        s =  substr(s,10,length(s) - 9);
    elsif not isnumeric(substr(s,1,4)) then
         s = $2;
        if s <> 'Discount' then
          s = '';
        else
          s = $1;  
        end if;
    else
       s = substr(s,6, length(s) - 5);   
    end if;
    return s;
  end;
$_$;


ALTER FUNCTION public.filterreceiptnum2(text, text) OWNER TO postgres;

--
-- TOC entry 335 (class 1255 OID 16490)
-- Dependencies: 6 1225
-- Name: formalize_(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION formalize_(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       t alias for $1;
       l text;
       c text;
       i int;
   begin
           l ='';
	   --date modified: Thu 16 Apr 2009 11:51:08 AM PHT 
	   -- added: <<c1
           --date modified: April 18,2009
           for i in 1..length(t) loop 
		c = substr(t,i,1); 
		if c = ' ' or c = '-' then
			l = l || '_';
                elsif c = 'ñ' then
			l = l || 'n';
		elsif c = 'Ñ' then
			l = l || 'N';	
		elsif c = ',' or c = '.' then --<<c1: strip out , and . in name
		else
			l = l || c; 
		end if;       
           end loop;
           return l;
   end;
$_$;


ALTER FUNCTION public.formalize_(text) OWNER TO postgres;

--
-- TOC entry 336 (class 1255 OID 16491)
-- Dependencies: 6 1225
-- Name: formalizedays(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION formalizedays(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
    declare
       in_ alias for $1;
       dz text;
    begin
         if in_ = 'M-F' then
             dz = 'MWF*TH';
         elsif in_ = 'MON' then 
             dz = 'M';
         elsif  in_ = 'WED'  then
             dz = 'W';
         elsif in_ = 'FRI'  then
             dz = 'F';
         elsif in_ = 'THURS' then
             dz = 'TH';
         elsif in_ = 'TUE'  then
             dz = '*';
         elsif in_ = 'TTH' then
             dz = '*TH';
         else
             dz = in_;
         end if;
         return dz;
    end;
$_$;


ALTER FUNCTION public.formalizedays(text) OWNER TO postgres;

--
-- TOC entry 337 (class 1255 OID 16492)
-- Dependencies: 6 1225
-- Name: fullname(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION fullname(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    full_ text;
BEGIN
     select into full_ lname || ', ' || fname || ' ' || mi from person where personid = $1 and ptypeid = $2;
      RETURN full_;
END;
$_$;


ALTER FUNCTION public.fullname(text, bigint) OWNER TO postgres;

--
-- TOC entry 338 (class 1255 OID 16493)
-- Dependencies: 1225 6
-- Name: genbaccountid(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION genbaccountid(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    pid alias for $1;
    sid alias for $2;
    v text;
    s int;
  begin
    select into s count(*) from accounts where personnumid = pid and semid = sid and
                  chargenameid = getccmodeid('Back Account');
    s = s + 1; 
    v = appendzerom(s::text, 2); 
    return v;
  end;
$_$;


ALTER FUNCTION public.genbaccountid(text, bigint) OWNER TO postgres;

--
-- TOC entry 356 (class 1255 OID 16494)
-- Dependencies: 6 1225
-- Name: gencallnumber(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION gencallnumber(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       axnNum ALIAS FOR $1;
       pubtyp_ ALIAS FOR $2;
       auth text;
       aNum text;
       cNum text;
       cpwrt int4;
       callNum text; 
  begin
       auth = getPubAuthor(axnNum,pubtyp_);
       select into cNum classnum from publication where accessionNum = axnNum and pubtypeid = pubtyp_;
       select into cpwrt copyrightyear from publication where accessionNum = axnNum and pubtypeid = pubtyp_;
       aNum = getPubauthnum(axnNum, pubtyp_);
       callNum = cNum || ' ' || upper(substring(auth,1,1)) || ' ' || aNum || ' ' || cpwrt;

       return callNum;
   end;
$_$;


ALTER FUNCTION public.gencallnumber(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 357 (class 1255 OID 16495)
-- Dependencies: 6 1225
-- Name: genellipse(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION genellipse(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType Alias for $2;
       fname_ int;
       ellipse text;
   begin
       select into fname_ count(authNum) from bookauth where accessionnum = anum and pubtypeid = pubType;
      
	if fname_ > 1 then
	   ellipse = '...';
	else
           ellipse = '';
	end if;
       return ellipse;
   end;
  $_$;


ALTER FUNCTION public.genellipse(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 358 (class 1255 OID 16496)
-- Dependencies: 6 1225
-- Name: generateec(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION generateec(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    s text;
    uid alias for $1;
  begin
    select into s userid from errorcorrect where userid = uid and d8_ = now()::date;
    if s isnull then
        insert into errorcorrect (userid, d8_) values (uid, now()::date);
    end if;
   
    return 'OK';
  end;
$_$;


ALTER FUNCTION public.generateec(text) OWNER TO postgres;

--
-- TOC entry 359 (class 1255 OID 16497)
-- Dependencies: 1225 6
-- Name: genid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION genid(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
     class_ alias for $1;
     id text; --already in hex
     presentid text;
     countNum numeric;
     ded int;
     dd2 int;
     ptypeid_ int8;
     prefix text;
     yearbeg text;
begin
     ptypeid_ = getptypeid(class_);
     yearbeg = yearpart(now()::date);
     if ptypeid_ = 1  then
        ded = 3;
        dd2 = 1; 
        prefix = '';  
     elsif ptypeid_ > 1 then      
         ded = 3;
         dd2 = 2;
         prefix = substr(class_,1,1);  
     else
        raise exception '% not found', class_;
     end if;
     --id format: 2006-0001 -- student
     --	         a2006-0001 -- others (i.e., faculty and the like...)
     select into presentid max(substring(personnumid, length(personnumid) - ded,4)) 
            from personNUM 
            where 
            upper(substring(personnumid, dd2, 4)) = upper(yearbeg)
            and 
            ptypeid = ptypeid_ and instr2(personnumid,  '-' , 1) > 0 and 
            isnumeric(substring(personnumid, length(personnumid) - ded,4));
     --raise exception '%', id;  
     if presentid isnull then
       id = prefix || upper(substring(yearbeg, 1, 4)) || '-0001';
     else
        countNum = presentid::numeric;
	countNum = countNum + 1;
        id = prefix || yearbeg|| '-' || upper(appendzerom(countNUm::text, 4));
     end if;
   return id;
end;
$_$;


ALTER FUNCTION public.genid(text) OWNER TO postgres;

--
-- TOC entry 360 (class 1255 OID 16498)
-- Dependencies: 1225 6
-- Name: gensection_code(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION gensection_code(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
declare
  sid alias for $1;
  semd alias for $2;
  scode text;
  s int;
BEGIN
  select into s max(offeringid) from offering where offeringid like sid || '%' and semid = semd;
  --s = s + 1;
  --
  if s isnull then
     s = 1;
     scode = sid || s::text; 
  else
     if substring(s::text,length(s::text) ,1) = '9' then
       scode = sid || '10';
     else
       s = s +1;
       scode = s::text;  
     end if;
   end if;

   SELECT INTO S offeringid from offering where offeringid = scode and semid = semd;

    while not s isnull loop
       s = s +1;
       scode = s::text; 
       SELECT INTO S offeringid from offering where offeringid = scode and semid = semd;
    end loop;
   
  RETURN scode;
END;
$_$;


ALTER FUNCTION public.gensection_code(text, bigint) OWNER TO postgres;

--
-- TOC entry 361 (class 1255 OID 16499)
-- Dependencies: 6 1225
-- Name: gensubjid(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION gensubjid() RETURNS text
    LANGUAGE plpgsql
    AS $$
  declare
     yearbeg text;
     id text;
     c int;
begin
   select into c max(subjectid::int) from subject; 
   if c isnull then
      c = 1000;
   else
      c = c + 1;
   end if; 
   id = c::text;
   return id;
end;
$$;


ALTER FUNCTION public.gensubjid() OWNER TO postgres;

--
-- TOC entry 362 (class 1255 OID 16500)
-- Dependencies: 6 1225
-- Name: getaddress(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getaddress(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       i text;
   begin
	   select into i home_add from person_details where personnumid = pid;
           if i isnull then
              i = ''; 
	   end if;
           return i;
   end;
$_$;


ALTER FUNCTION public.getaddress(text) OWNER TO postgres;

--
-- TOC entry 363 (class 1255 OID 16501)
-- Dependencies: 1225 6
-- Name: getage(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getage(text) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       i int;
   begin
	   select into i _age(birthday) from person_details where personnumid = pid;
           return i;
   end;
$_$;


ALTER FUNCTION public.getage(text) OWNER TO postgres;

--
-- TOC entry 364 (class 1255 OID 16502)
-- Dependencies: 6 1225
-- Name: getauthfullname(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getauthfullname(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       fname_ text;
   begin
       select into fname_ lname || ', ' || fname || ' ' ||  mi from author where upper(authNum) = upper($1);
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getauthfullname(text) OWNER TO postgres;

--
-- TOC entry 365 (class 1255 OID 16503)
-- Dependencies: 6 1225
-- Name: getauthlname(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getauthlname(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       l text;
   begin
       select into l lname from author where authNum = aNum;
       return l;
   end;
$_$;


ALTER FUNCTION public.getauthlname(text) OWNER TO postgres;

--
-- TOC entry 366 (class 1255 OID 16504)
-- Dependencies: 6 1225
-- Name: getauthnum(text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getauthnum(text, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       l ALIAS FOR $1;
       f ALIAS FOR $2;
       m ALIAS FOR $3;
       aNum text;
   begin
       select into aNum authNum from author where 
                upper(lname) = upper(l) and upper(fname) = upper(f) and upper(mi) = upper(m);
       return aNum;
   end;
$_$;


ALTER FUNCTION public.getauthnum(text, text, text) OWNER TO postgres;

--
-- TOC entry 367 (class 1255 OID 16505)
-- Dependencies: 6 1225
-- Name: getbirthday(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbirthday(text) RETURNS date
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       l date;
   begin
           select into l birthday from person_details where personnumid = pid;
           return l;
   end;
$_$;


ALTER FUNCTION public.getbirthday(text) OWNER TO postgres;

--
-- TOC entry 368 (class 1255 OID 16506)
-- Dependencies: 6 1225
-- Name: getbookauthor(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbookauthor(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType Alias for $2;
       author text;
   begin
       select into author getauthfullname(authnum) from bookauth where accessionnum = aNum and pubtypeid = pubType;
      
       return author;
   end;

  $_$;


ALTER FUNCTION public.getbookauthor(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 369 (class 1255 OID 16507)
-- Dependencies: 6 1225
-- Name: getbookstatdesc(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbookstatdesc(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       tpid_ ALIAS FOR $1;
       l text;
   begin
       select into l statusdesc from Bookstat where bookstatid = tpid_;
       return l;
   end;
$_$;


ALTER FUNCTION public.getbookstatdesc(bigint) OWNER TO postgres;

--
-- TOC entry 339 (class 1255 OID 16508)
-- Dependencies: 6 1225
-- Name: getbookstatid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbookstatid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       tp_ ALIAS FOR $1;
       l int8;
   begin
       select into l bookStatID from Bookstat where upper(statusdesc) = upper(tp_);
       return l;
   end;
$_$;


ALTER FUNCTION public.getbookstatid(text) OWNER TO postgres;

--
-- TOC entry 370 (class 1255 OID 16509)
-- Dependencies: 6 1225
-- Name: getbookstatidnum_(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbookstatidnum_(bigint, bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType Alias for $2;
       fname_ int8;
   begin
       select into fname_ bookstatid from publication where accessionnum = anum and pubtypeid = pubType limit 1;
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getbookstatidnum_(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 371 (class 1255 OID 16510)
-- Dependencies: 6 1225
-- Name: getbookstatidtext_(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbookstatidtext_(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType Alias for $2;
       fname_ text;
   begin
       select into fname_ getbookstatdesc(getbookstatidnum_(aNum, pubtype));
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getbookstatidtext_(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 372 (class 1255 OID 16511)
-- Dependencies: 6 1225
-- Name: getbooktitle(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbooktitle(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType Alias for $2;
       fname_ text;
   begin
       select into fname_ title from publication where accessionnum = aNum and pubtypeid = pubType;
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getbooktitle(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 373 (class 1255 OID 16512)
-- Dependencies: 6 1225
-- Name: getbuildingid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbuildingid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       tp_ ALIAS FOR $1;
       l int8;
   begin
       select into l buildingID from building where upper(name_) = upper(tp_);
       return l;
   end;
$_$;


ALTER FUNCTION public.getbuildingid(text) OWNER TO postgres;

--
-- TOC entry 374 (class 1255 OID 16513)
-- Dependencies: 6 1225
-- Name: getbuildingname(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getbuildingname(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       tpid_ ALIAS FOR $1;
       l text;
   begin
       select into l  name_ from building where buildingid = tpid_;
       return l;
   end;
$_$;


ALTER FUNCTION public.getbuildingname(bigint) OWNER TO postgres;

--
-- TOC entry 375 (class 1255 OID 16514)
-- Dependencies: 6 1225
-- Name: getccmodeid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getccmodeid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       tpid_ ALIAS FOR $1;
       l int8;
   begin
       select into l  ccmodeid from ccmode where upper(description) = upper(tpid_);
       return l;
   end;
$_$;


ALTER FUNCTION public.getccmodeid(text) OWNER TO postgres;

--
-- TOC entry 376 (class 1255 OID 16515)
-- Dependencies: 1225 6
-- Name: getccmodename(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getccmodename(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       tpid_ ALIAS FOR $1;
       l text;
   begin
       select into l  description from ccmode where ccmodeid = tpid_;
       return l;
   end;
$_$;


ALTER FUNCTION public.getccmodename(bigint) OWNER TO postgres;

--
-- TOC entry 377 (class 1255 OID 16516)
-- Dependencies: 6 1225
-- Name: getchargeid(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getchargeid(bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       sid ALIAS FOR $1;
       cid int8;
   begin
       select into cid chargesid from charges where semid = sid;
       return cid;  
   end;
$_$;


ALTER FUNCTION public.getchargeid(bigint) OWNER TO postgres;

--
-- TOC entry 378 (class 1255 OID 16517)
-- Dependencies: 1225 6
-- Name: getclassdesc(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getclassdesc(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       cNum ALIAS for $1;
       desc_ text;
   begin
       select into desc_ subjClass from class_ where 
                classNum = cNum;
       return desc_;
   end;
$_$;


ALTER FUNCTION public.getclassdesc(text) OWNER TO postgres;

--
-- TOC entry 379 (class 1255 OID 16518)
-- Dependencies: 6
-- Name: getclasslist(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getclasslist(text, bigint, OUT text, OUT text, OUT text, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
select personnumid,  
       upper(name), 
       degree || '-' || year_level::text, 
       grade, 
       comment_ 
       from class_list where  
      offeringid = $1 and semid = $2
      order by name asc;
$_$;


ALTER FUNCTION public.getclasslist(text, bigint, OUT text, OUT text, OUT text, OUT text, OUT text) OWNER TO postgre;

--
-- TOC entry 380 (class 1255 OID 16519)
-- Dependencies: 6 1225
-- Name: getclassnum(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getclassnum(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       desc ALIAS for $1;
       cNum text;
   begin
       select into cNum classNum from class_ where 
                upper(subjClass) = upper(desc);
       return cNum;
   end;
$_$;


ALTER FUNCTION public.getclassnum(text) OWNER TO postgres;

--
-- TOC entry 381 (class 1255 OID 16520)
-- Dependencies: 6 1225
-- Name: getcopyrightyear(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getcopyrightyear(bigint, bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType ALIAS FOR $2;
       fname_ int;
   begin
       select into fname_ copyrightyear from publication where accessionnum = anum and pubtypeid = pubType;
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getcopyrightyear(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 382 (class 1255 OID 16521)
-- Dependencies: 6 1225
-- Name: getcurrentperiod(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getcurrentperiod(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    semester_ alias for $1;
    semid_ alias for $2;
    t text;
  begin
    
    select into t period from examschedsdetails where semid = semid_ and semester = semester_ and active;
    if t isnull then
       t = 'NOT SET';
    end if;
    return t;
  end;
$_$;


ALTER FUNCTION public.getcurrentperiod(text, bigint) OWNER TO postgre;

--
-- TOC entry 383 (class 1255 OID 16522)
-- Dependencies: 6 1225
-- Name: getcurrentperiod2(bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getcurrentperiod2(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    semid_ alias for $1;
    t text;
  begin
    
    select into t period from examschedsdetails where semid = semid_ and active;
    if t isnull then
       t = 'NOT SET';
    end if;
    return t;
  end;
$_$;


ALTER FUNCTION public.getcurrentperiod2(bigint) OWNER TO postgre;

--
-- TOC entry 384 (class 1255 OID 16523)
-- Dependencies: 6 1225
-- Name: getcurrsem(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getcurrsem() RETURNS bigint
    LANGUAGE plpgsql
    AS $$
  declare
    s int8;
  begin
     select into s currsemid from currsem;
     
     if s isnull then
       raise exception 'CURRENT SEM NOT INITIALIZED';
     end if;
     
     return s;
  end;
$$;


ALTER FUNCTION public.getcurrsem() OWNER TO postgres;

--
-- TOC entry 385 (class 1255 OID 16524)
-- Dependencies: 6 1225
-- Name: getcuttersid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getcuttersid(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
     desc_ alias for $1;
     d text;
  BEGIN
    select into d cuttersid from author where authnum = desc_;
    return d;
  END;

$_$;


ALTER FUNCTION public.getcuttersid(text) OWNER TO postgres;

--
-- TOC entry 386 (class 1255 OID 16525)
-- Dependencies: 6 1225
-- Name: getdegree(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getdegree(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       did ALIAS FOR $1;
       n text;
   begin
       select into n abbr from degree where degreeid = did;
       return n;
   end;
$_$;


ALTER FUNCTION public.getdegree(bigint) OWNER TO postgres;

--
-- TOC entry 387 (class 1255 OID 16526)
-- Dependencies: 1225 6
-- Name: getdegreeid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getdegreeid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       abbr_ ALIAS FOR $1;
       n int8;
   begin
       select into n degreeid from degree where upper(abbr) = upper(abbr_);
       return n;
   end;
$_$;


ALTER FUNCTION public.getdegreeid(text) OWNER TO postgres;

--
-- TOC entry 388 (class 1255 OID 16527)
-- Dependencies: 1225 6
-- Name: getdeptdesc(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getdeptdesc(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       deptid_ ALIAS for $1;
       desc1 text;
   begin
       select into desc1 desc_  from dep where 
               depid = deptid_;
       return desc1;
   end;
$_$;


ALTER FUNCTION public.getdeptdesc(bigint) OWNER TO postgres;

--
-- TOC entry 389 (class 1255 OID 16528)
-- Dependencies: 6 1225
-- Name: getdeptid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getdeptid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       depname ALIAS FOR $1;
       n int8;
   begin
       select into n depid from dep where upper(desc_) = upper(depname);
       return n;
   end;
$_$;


ALTER FUNCTION public.getdeptid(text) OWNER TO postgres;

--
-- TOC entry 390 (class 1255 OID 16529)
-- Dependencies: 6 1225
-- Name: getdeptidofroom(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getdeptidofroom(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       roomid_ ALIAS FOR $1;
       n int8;
   begin
       select into n depid from room where upper(roomid) = upper(roomid_);
       return n;
   end;
$_$;


ALTER FUNCTION public.getdeptidofroom(text) OWNER TO postgres;

--
-- TOC entry 391 (class 1255 OID 16530)
-- Dependencies: 1225 6
-- Name: getencidtype(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getencidtype(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       typeid text;
       tname text;
   begin
      select into typeid c from verify_use where a = personnum_;
      select into tname c from enctype where a = typeid;
       return upper(tname);
   end;
$_$;


ALTER FUNCTION public.getencidtype(text) OWNER TO postgre;

--
-- TOC entry 392 (class 1255 OID 16531)
-- Dependencies: 6 1225
-- Name: getfullname(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getfullname(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       full text;
   begin
       select into full lname || ',' || fname || ' ' || mi from author 
                where authNum = aNum;
       return full;
   end;
$_$;


ALTER FUNCTION public.getfullname(text) OWNER TO postgres;

--
-- TOC entry 393 (class 1255 OID 16532)
-- Dependencies: 6 1225
-- Name: getgender(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getgender(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
  	n alias for $1;
   	b text;
  begin
	select into b gender from person where personid in 
             (select personid from personnum where personnumid = n) and not gender isnull;
        return b;
  end;
$_$;


ALTER FUNCTION public.getgender(text) OWNER TO postgres;

--
-- TOC entry 394 (class 1255 OID 16533)
-- Dependencies: 6 1225
-- Name: getgrade(text, text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getgrade(text, text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    oferingid alias for $1;
    pnumid alias for $2;
    smid alias for $3;
    grd text;
  begin
     select into grd grade from academicyearload where offeringid = oferingid
        and personnumid = pnumid and semid = smid;
    
     return grd;
  end;
$_$;


ALTER FUNCTION public.getgrade(text, text, bigint) OWNER TO postgres;

--
-- TOC entry 395 (class 1255 OID 16534)
-- Dependencies: 6 1225
-- Name: getiduncrypt(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getiduncrypt(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
 declare
   encid alias for $1;
   uncrypt text;
 begin 
   select into uncrypt personnumid from personnum where md5(personnumid) = encid;
   return uncrypt;
 end;
$_$;


ALTER FUNCTION public.getiduncrypt(text) OWNER TO postgre;

--
-- TOC entry 396 (class 1255 OID 16535)
-- Dependencies: 6 1225
-- Name: getincamt(text, date, date, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getincamt(text, date, date, integer) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       cname alias for $1;
       d8from alias for $2;
       d8to alias for $3;
       sign alias for $4;
       i double precision;
   begin
	   select into i sum(amount) from accounts where chargenameid = getccmodeid(cname) and
		mult = sign and (date_ >= d8from and date_ <= d8to);
           if i isnull then
		i = 0;
           end if;
           return i;
   end;
$_$;


ALTER FUNCTION public.getincamt(text, date, date, integer) OWNER TO postgres;

--
-- TOC entry 408 (class 1255 OID 16536)
-- Dependencies: 6 1225
-- Name: getincomesum(text, text, date, date, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getincomesum(text, text, date, date, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       cname ALIAS FOR $1;
       lev_ alias for $2;
       d1 alias for $3;
       d2 alias for $4;
       pname alias for $5;
       amt float8;
       gr text;
   begin

       gr =  getptypename(usertype(pname));
       if lev_ <> 'all' then
             if upper(gr) <> 'AUDITOR' then    
   	          select into amt sum(amount) from accounts where 
 		    (date_ >= d1 and DATE_ <= d2) and cashier_name = pname 
		    and (mult = -1 or mult = 0) and chargenameid = getccmodeid(cname) and 
		    getlev(getpersondegree(personnumid)) = lev_;
             else
                    select into amt sum(amount) from accounts where 
 		    (date_ >= d1 and DATE_ <= d2)  
		    and (mult = -1 or mult = 0) and chargenameid = getccmodeid(cname) and 
		    getlev(getpersondegree(personnumid)) = lev_;
             end if;
	else
	
              if upper(gr) <> 'AUDITOR' then 
                 select into amt sum(amount) FROM accounts where  
                   (date_ >= d1 and DATE_ <= d2) AND cashier_name = pname 
                   and (mult = -1 or mult = 0) and chargenameid = getccmodeid(cname); 
              else
                   select into amt sum(amount) FROM accounts where  
                   (date_ >= d1 and DATE_ <= d2) 
                   and (mult = -1 or mult = 0) and chargenameid = getccmodeid(cname); 
              end if; 

	end if;	
	
	if amt isnull then
           amt = 0;
	end if; 
	return amt;
   end;
$_$;


ALTER FUNCTION public.getincomesum(text, text, date, date, text) OWNER TO postgres;

--
-- TOC entry 409 (class 1255 OID 16537)
-- Dependencies: 6 1225
-- Name: getlev(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getlev(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       ab alias for $1;
       l text;
   begin
           --mult for other payments should be zero
           select into l level_ from degree where upper(abbr) = upper(ab);
           if l isnull then
                 l = 'Undergrad';
           end if;
           return l;
   end;
$_$;


ALTER FUNCTION public.getlev(text) OWNER TO postgres;

--
-- TOC entry 410 (class 1255 OID 16538)
-- Dependencies: 6 1225
-- Name: getmajor(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getmajor(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       did ALIAS FOR $1;
       n text;
   begin
       select into n major from degree where degreeid = did;
       return n;
   end;
$_$;


ALTER FUNCTION public.getmajor(bigint) OWNER TO postgres;

--
-- TOC entry 411 (class 1255 OID 16539)
-- Dependencies: 1225 6
-- Name: getmiscsum(bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getmiscsum(bigint, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       sid ALIAS FOR $1;
       lev_ alias for $2;
       amt float8;
   begin
        select into amt sum(rate) from miscellaneous where semester = sid and upper(level_) = upper(lev_);
        if amt isnull then
           amt = 0;
	end if; 
	return amt;
   end;
$_$;


ALTER FUNCTION public.getmiscsum(bigint, text) OWNER TO postgres;

--
-- TOC entry 412 (class 1255 OID 16540)
-- Dependencies: 6
-- Name: getmyload(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getmyload(text, bigint, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
    select distinct offeringid, 
           getsubjnumber(subjectid) as d
    from offering where  
         offeringid in (select offeringid from personload where 
         md5(personnumid) = $1 and semid = $2) and semid = $2 order by d;  
$_$;


ALTER FUNCTION public.getmyload(text, bigint, OUT text, OUT text) OWNER TO postgre;

--
-- TOC entry 413 (class 1255 OID 16541)
-- Dependencies: 6
-- Name: getmyloaddat(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getmyloaddat(text, bigint, OUT text) RETURNS text
    LANGUAGE sql
    AS $_$
    select 'Schedule 1: ' || daysched || ' '  || normtimerange(time_sched) || ' ' || roomid || ' ' || ' Schedule 2: ' || 
            daysched2 || ' ' || normtimerange(time_sched2) || ' '  || roomid2 
    from offering where  
         offeringid = $1 and semid = $2;  
$_$;


ALTER FUNCTION public.getmyloaddat(text, bigint, OUT text) OWNER TO postgre;

--
-- TOC entry 414 (class 1255 OID 16542)
-- Dependencies: 6
-- Name: getmyteachingsem(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getmyteachingsem(text, OUT bigint) RETURNS SETOF bigint
    LANGUAGE sql
    AS $_$
select distinct semid from personload where 
         md5(personnumid) = $1  
	 order by semid desc limit 4; 
$_$;


ALTER FUNCTION public.getmyteachingsem(text, OUT bigint) OWNER TO postgre;

--
-- TOC entry 416 (class 1255 OID 16544)
-- Dependencies: 6 1225
-- Name: getofferingday(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingday(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   ofid alias for $1;
      res text;
  begin
    select into res daysched from offering where offeringid = ofid and semid = getcurrsem();
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingday(text) OWNER TO postgres;

--
-- TOC entry 415 (class 1255 OID 16543)
-- Dependencies: 6 1225
-- Name: getofferingday(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingday(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$ declare ofid alias FOR $1; sid alias FOR $2; res text; begin    SELECT into res daysched FROM offering where offeringid = ofid AND semid = sid;   RETURN res;END;  $_$;


ALTER FUNCTION public.getofferingday(text, bigint) OWNER TO postgres;

--
-- TOC entry 418 (class 1255 OID 16546)
-- Dependencies: 1225 6
-- Name: getofferingday2(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingday2(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   ofid alias for $1;
      res text;
  begin
    select into res daysched2 from offering where offeringid = ofid and semid = getcurrsem();
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingday2(text) OWNER TO postgres;

--
-- TOC entry 417 (class 1255 OID 16545)
-- Dependencies: 6 1225
-- Name: getofferingday2(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingday2(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$ declare   ofid alias FOR $1;   sid alias FOR $2;   res text; begin     SELECT into res daysched2 FROM offering where offeringid = ofid AND semid = sid;   RETURN res;  END; $_$;


ALTER FUNCTION public.getofferingday2(text, bigint) OWNER TO postgres;

--
-- TOC entry 420 (class 1255 OID 16548)
-- Dependencies: 6 1225
-- Name: getofferingroom(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingroom(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   ofid alias for $1;
      res text;
  begin
    select into res roomid from offering where offeringid = ofid and semid = getcurrsem();
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingroom(text) OWNER TO postgres;

--
-- TOC entry 419 (class 1255 OID 16547)
-- Dependencies: 6 1225
-- Name: getofferingroom(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingroom(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$   declare       ofid alias FOR $1;       sid alias FOR $2;       res text;   begin     SELECT into res roomid FROM offering where offeringid = ofid AND semid = sid;   RETURN res; END; $_$;


ALTER FUNCTION public.getofferingroom(text, bigint) OWNER TO postgres;

--
-- TOC entry 422 (class 1255 OID 16550)
-- Dependencies: 6 1225
-- Name: getofferingroom2(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingroom2(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   ofid alias for $1;
      res text;
  begin
    select into res roomid2 from offering where offeringid = ofid and semid = getcurrsem();
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingroom2(text) OWNER TO postgres;

--
-- TOC entry 421 (class 1255 OID 16549)
-- Dependencies: 6 1225
-- Name: getofferingroom2(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingroom2(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$   declare     ofid alias FOR $1;     sid alias FOR $2;     res text; begin  SELECT into res roomid2 FROM offering where offeringid = ofid AND semid = sid;  RETURN res;END;$_$;


ALTER FUNCTION public.getofferingroom2(text, bigint) OWNER TO postgres;

--
-- TOC entry 423 (class 1255 OID 16551)
-- Dependencies: 6 1225
-- Name: getofferingsubj(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingsubj(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   ofid alias for $1;
      res text;
  begin
    select into res subjectid from offering where offeringid = ofid;
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingsubj(text) OWNER TO postgres;

--
-- TOC entry 397 (class 1255 OID 16552)
-- Dependencies: 6 1225
-- Name: getofferingsubj(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingsubj(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   ofid alias for $1;
   sid alias for $2;
      res text;
  begin
    select into res subjectid from offering where offeringid = ofid and semid = sid;
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingsubj(text, bigint) OWNER TO postgres;

--
-- TOC entry 399 (class 1255 OID 16554)
-- Dependencies: 6 1225
-- Name: getofferingtime(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingtime(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   ofid alias for $1;
      res text;
  begin
    select into res time_sched from offering where offeringid = ofid and semid = getcurrsem();
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingtime(text) OWNER TO postgres;

--
-- TOC entry 398 (class 1255 OID 16553)
-- Dependencies: 6 1225
-- Name: getofferingtime(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingtime(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$    declare        ofid alias FOR $1;       sid alias FOR $2;       res text;  begin     SELECT into res time_sched FROM offering where offeringid = ofid AND semid = sid;     RETURN res; END;$_$;


ALTER FUNCTION public.getofferingtime(text, bigint) OWNER TO postgres;

--
-- TOC entry 401 (class 1255 OID 16556)
-- Dependencies: 6 1225
-- Name: getofferingtime2(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingtime2(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   ofid alias for $1;
      res text;
  begin
    select into res time_sched2 from offering where offeringid = ofid and semid = getcurrsem();
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingtime2(text) OWNER TO postgres;

--
-- TOC entry 400 (class 1255 OID 16555)
-- Dependencies: 6 1225
-- Name: getofferingtime2(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingtime2(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$    declare       ofid alias FOR $1;       sid alias FOR $2;       res text; begin    SELECT into res time_sched2 FROM offering where offeringid = ofid AND semid = sid;   RETURN res; END; $_$;


ALTER FUNCTION public.getofferingtime2(text, bigint) OWNER TO postgres;

--
-- TOC entry 403 (class 1255 OID 16558)
-- Dependencies: 1225 6
-- Name: getofferingunits(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingunits(text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
  declare
      ofid alias for $1;
      res float8;
  begin
    select into res getsubjunits(subjectid) from offering where offeringid = ofid and semid = getcurrsem();
    return res;
  end;
  $_$;


ALTER FUNCTION public.getofferingunits(text) OWNER TO postgres;

--
-- TOC entry 402 (class 1255 OID 16557)
-- Dependencies: 1225 6
-- Name: getofferingunits(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofferingunits(text, bigint) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$ declare    ofid alias FOR $1;    sid alias FOR $2;    res float8;begin  SELECT into res getsubjunits(subjectid) FROM offering where offeringid = ofid AND semid = sid;  RETURN res;END;$_$;


ALTER FUNCTION public.getofferingunits(text, bigint) OWNER TO postgres;

--
-- TOC entry 404 (class 1255 OID 16559)
-- Dependencies: 6 1225
-- Name: getofloadstat(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getofloadstat(text, bigint) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ alias for $1;
       sid alias for $2;
       b boolean;
   begin
       select into b conf from officialload where personnumid = personnum_ and semid = sid;
       if b isnull then
          b  = false;
       end if;
       return b;
   end;
$_$;


ALTER FUNCTION public.getofloadstat(text, bigint) OWNER TO postgres;

--
-- TOC entry 405 (class 1255 OID 16560)
-- Dependencies: 1225 6
-- Name: getpcurrdegree(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getpcurrdegree(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
 declare
   personnumid_ alias for $1;
   semid_ alias for $2;
   crsyr text;
 begin
    crsyr = array_to_string(semcy(personnumid_, semid_),'-');
    return substring(crsyr, 1, instr(crsyr, '-') -1);
 end;
$_$;


ALTER FUNCTION public.getpcurrdegree(text, bigint) OWNER TO postgre;

--
-- TOC entry 406 (class 1255 OID 16561)
-- Dependencies: 1225 6
-- Name: getperiodrate(bigint, text, text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getperiodrate(bigint, text, text, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
  declare
   semid_ alias for $1;
   semester_ alias for $2;
   period_ alias for $3;
   level1_ alias for $4;
   r8 double precision;
  begin
    select into r8 rate from examschedsdetails where semid = semid_ and semester = semester_
     and period = period_ and level_ = level1_;
   if r8 isnull then
      r8 = 0.0;
   end if;
   return r8/100.00;
  end;
$_$;


ALTER FUNCTION public.getperiodrate(bigint, text, text, text) OWNER TO postgre;

--
-- TOC entry 407 (class 1255 OID 16562)
-- Dependencies: 1225 6
-- Name: getpersondegree(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersondegree(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       degree text;
       pid record;
   begin
       select into pid * from personnum where personnumid = anum;  
       select into degree getdegree(degreeid) from person 
                where personid = pid.personid and ptypeid = pid.ptypeid;
       return degree;
   end;
$_$;


ALTER FUNCTION public.getpersondegree(text) OWNER TO postgres;

--
-- TOC entry 425 (class 1255 OID 16563)
-- Dependencies: 6 1225
-- Name: getpersondegreeid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersondegreeid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       degree bigint;
       pid record;
   begin
       select into pid * from personnum where personnumid = anum;  
       select into degree degreeid from person 
                where personid = pid.personid and ptypeid = pid.ptypeid;
       return degree;
   end;
$_$;


ALTER FUNCTION public.getpersondegreeid(text) OWNER TO postgres;

--
-- TOC entry 426 (class 1255 OID 16564)
-- Dependencies: 6 1225
-- Name: getpersonfullname(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonfullname(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       full_ text;
   begin
      if anum <> 'Cash' then
       select into full_ lname || ',' || fname || ' ' || null2nulltext(mi) from person 
                where personid = anum;
      else
         full_ = anum;
      end if; 
      return full_;
   end;
$_$;


ALTER FUNCTION public.getpersonfullname(text) OWNER TO postgres;

--
-- TOC entry 427 (class 1255 OID 16565)
-- Dependencies: 6 1225
-- Name: getpersonfullname2(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonfullname2(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       full_ text;
       pid text;
   begin
       select into pid personid from personnum where personnumid = anum;  
       select into full_ lname || ', ' || fname || ' ' || null2nulltext(mi) from person 
                where personid = pid;
       return full_;
   end;
$_$;


ALTER FUNCTION public.getpersonfullname2(text) OWNER TO postgres;

--
-- TOC entry 428 (class 1255 OID 16566)
-- Dependencies: 6 1225
-- Name: getpersonfullname2(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonfullname2(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       persontype alias for $2;
       full_ text;
       pid text;
       ptyp int8;
   begin
       ptyp = getptypeid(persontype);
       select into pid personid from personnum where personnumid = anum and ptypeid = ptyp;  
       select into full_ lname || ', ' || fname || ' ' || null2nulltext(mi) from person 
                where personid = pid and ptypeid = ptyp;
       return full_;
   end;
$_$;


ALTER FUNCTION public.getpersonfullname2(text, text) OWNER TO postgres;

--
-- TOC entry 429 (class 1255 OID 16567)
-- Dependencies: 6 1225
-- Name: getpersonfullname3(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION getpersonfullname3(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       full_ text;
       prec record;
      
   begin
       select into prec * from verify_use where a = aNum;        
       select into full_ lname || ', ' || fname || ' ' || null2nulltext(mi) from person 
                where md5(personid) = prec.b and md5(ptypeid::text) = prec.c;
       return upper(full_);
   end;
$_$;


ALTER FUNCTION public.getpersonfullname3(text) OWNER TO postgre;

--
-- TOC entry 430 (class 1255 OID 16568)
-- Dependencies: 6 1225
-- Name: getpersonid(text, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonid(text, text, text, integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
   fn alias for $1;
   ln alias for $2;
   m alias for $3;
   ptypeid_ alias for $4;
   id text;
BEGIN
   select into id personID from person where 
       upper(fname) = upper(fn) and 
       upper(lname) = upper(ln) and upper(mi) = upper(m) 
       and ptypeid = ptypeid_;   
   return id;
END;
$_$;


ALTER FUNCTION public.getpersonid(text, text, text, integer) OWNER TO postgres;

--
-- TOC entry 431 (class 1255 OID 16569)
-- Dependencies: 6 1225
-- Name: getpersonidnumid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonidnumid(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       typeid text;
   begin
     if instr(personNum_, 'Cash') = 0 then
        select into typeid personid from personnum where personnumid = personnum_;
     else
        typeid = 'Cash';
     end if; 

     return typeid;
   end;
$_$;


ALTER FUNCTION public.getpersonidnumid(text) OWNER TO postgres;

--
-- TOC entry 432 (class 1255 OID 16570)
-- Dependencies: 6 1225
-- Name: getpersonnumpid_(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonnumpid_(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       typeid text;
   begin
      select into typeid personnumid from personnum where personid = personnum_;
       return typeid;
   end;
$_$;


ALTER FUNCTION public.getpersonnumpid_(text) OWNER TO postgres;

--
-- TOC entry 433 (class 1255 OID 16571)
-- Dependencies: 6 1225
-- Name: getpersonnumtype(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonnumtype(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       typeid int8;
   begin
      select into typeid ptypeid from personnum where personnumid = personnum_;
       return typeid;
   end;
$_$;


ALTER FUNCTION public.getpersonnumtype(text) OWNER TO postgres;

--
-- TOC entry 434 (class 1255 OID 16572)
-- Dependencies: 6 1225
-- Name: getpersontype(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersontype(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   DECLARE
      pname int8;  
   BEGIN
       SELECT INTO pname ptypeid FROM person where upper(personid) = upper($1);
       if pname ISNULL then
          RAISE EXCEPTION 'PERSON TYPE NOT FOUND!!!';
          pname = '';
       end if;
    RETURN pname;  
  END;
$_$;


ALTER FUNCTION public.getpersontype(text) OWNER TO postgres;

--
-- TOC entry 435 (class 1255 OID 16573)
-- Dependencies: 6 1225
-- Name: getpersonyear(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonyear(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       degree text;
       pid record;
   begin
       select into pid * from personnum where personnumid = anum;  
       select into degree year_ from person 
                where personid = pid.personid and ptypeid = pid.ptypeid;
       return degree;
   end;
$_$;


ALTER FUNCTION public.getpersonyear(text) OWNER TO postgres;

--
-- TOC entry 436 (class 1255 OID 16574)
-- Dependencies: 6 1225
-- Name: getptypeid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getptypeid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   DECLARE
      pid_ INT8;  
   BEGIN
       SELECT INTO pid_ PtypeID FROM PTYPE where upper(meaning) = upper($1);
       if pid_ ISNULL then
          RAISE EXCEPTION 'PERSON TYPE NOT FOUND!!!';
          pid_ := 0;
       end if;
    RETURN pid_;  
  END;
$_$;


ALTER FUNCTION public.getptypeid(text) OWNER TO postgres;

--
-- TOC entry 437 (class 1255 OID 16575)
-- Dependencies: 6 1225
-- Name: getptypename(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getptypename(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   DECLARE
      pname TEXT;  
   BEGIN
       SELECT INTO pname meaning FROM PTYPE where ptypeid = $1;
       if pname ISNULL then
          RAISE EXCEPTION 'PERSON TYPE NOT FOUND!!!';
          pname = '';
       end if;
    RETURN pname;  
  END;
$_$;


ALTER FUNCTION public.getptypename(bigint) OWNER TO postgres;

--
-- TOC entry 438 (class 1255 OID 16576)
-- Dependencies: 6 1225
-- Name: getpubauthnum(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpubauthnum(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType Alias for $2;
       fname_ text;
   begin
       select into fname_ cuttersid from author where authnum in 
            (select authNum from bookauth where accessionnum = anum and pubtypeid = pubType limit 1);
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getpubauthnum(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 439 (class 1255 OID 16577)
-- Dependencies: 1225 6
-- Name: getpubauthor(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpubauthor(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       fname_ text;
   begin
       select into fname_ getAUthfullname(authNum) from bookauth where upper(accessionnum) = upper(anum)
               and pubtypeid = getBookpubtype(anum) order by authnum asc limit 1;
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getpubauthor(text) OWNER TO postgres;

--
-- TOC entry 440 (class 1255 OID 16578)
-- Dependencies: 6 1225
-- Name: getpubauthor(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpubauthor(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType Alias for $2;
       fname_ text;
   begin
       select into fname_ getAUthfullname(authNum) from bookauth where accessionnum = anum and pubtypeid = pubType limit 1;
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getpubauthor(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 441 (class 1255 OID 16579)
-- Dependencies: 1225 6
-- Name: getpubedition(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpubedition(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubType ALIAS FOR $2;
       fname_ text;
   begin
       select into fname_ edition from publication where accessionnum = anum and pubtypeid = pubType;
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getpubedition(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 442 (class 1255 OID 16580)
-- Dependencies: 1225 6
-- Name: getpublisherid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpublisherid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       tp_ ALIAS FOR $1;
       l int8;
   begin
       select into l pubID from publisher where upper(pubname) = upper(tp_);
       return l;
   end;
$_$;


ALTER FUNCTION public.getpublisherid(text) OWNER TO postgres;

--
-- TOC entry 443 (class 1255 OID 16581)
-- Dependencies: 1225 6
-- Name: getpublishername(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpublishername(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       tpid_ ALIAS FOR $1;
       l text;
   begin
       select into l  pubname from publisher where buildingid = tpid_;
       return l;
   end;
$_$;


ALTER FUNCTION public.getpublishername(bigint) OWNER TO postgres;

--
-- TOC entry 444 (class 1255 OID 16582)
-- Dependencies: 6 1225
-- Name: getpubtitle(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpubtitle(bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$

   declare
       aNum ALIAS FOR $1;
       pubTypeID ALIAS FOR $2;
       fname_ text;
   begin
       --raise exception '% %', aNum, pubtypeID;  
       select into fname_ title from publication where accessionnum = aNum and pubtypeid = pubTypeID;
      
       return fname_;
   end;

  $_$;


ALTER FUNCTION public.getpubtitle(bigint, bigint) OWNER TO postgres;

--
-- TOC entry 445 (class 1255 OID 16583)
-- Dependencies: 1225 6
-- Name: getpubtype_(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpubtype_(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       tpid_ ALIAS FOR $1;
       l text;
   begin
       select into l type_ from pubtype where pubtypeid = tpid_;
       return l;
   end;
$_$;


ALTER FUNCTION public.getpubtype_(bigint) OWNER TO postgres;

--
-- TOC entry 446 (class 1255 OID 16584)
-- Dependencies: 6 1225
-- Name: getpubtypeid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpubtypeid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       tp_ ALIAS FOR $1;
       l int8;
   begin
       select into l pubtypeid from pubtype where upper(type_) = upper(tp_);
       return l;
   end;
$_$;


ALTER FUNCTION public.getpubtypeid(text) OWNER TO postgres;

--
-- TOC entry 447 (class 1255 OID 16585)
-- Dependencies: 1225 6
-- Name: getscholarshipstat(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getscholarshipstat(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       aNum ALIAS FOR $1;
       degree text;
       pid text;
   begin
       select into pid personid from personnum where personnumid = anum;  
       select into degree scholarship from person 
                where personid = pid;
       return degree;
   end;
$_$;


ALTER FUNCTION public.getscholarshipstat(text) OWNER TO postgres;

--
-- TOC entry 448 (class 1255 OID 16586)
-- Dependencies: 1225 6
-- Name: getscodesubj(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getscodesubj(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    offid alias for $1;
    subj text;
BEGIN
      select into subj subjectid from offering where offeringid = offid;  
      RETURN subj;
END;
$_$;


ALTER FUNCTION public.getscodesubj(text) OWNER TO postgres;

--
-- TOC entry 449 (class 1255 OID 16587)
-- Dependencies: 6 1225
-- Name: getsemdesc(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsemdesc(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
  
    s text;
  begin
    select into s convert3rdtosummer(semdesc) || ',' || getsemstr(ayid)
         from sem where semid = $1;
    return s;
  end;
$_$;


ALTER FUNCTION public.getsemdesc(bigint) OWNER TO postgres;

--
-- TOC entry 450 (class 1255 OID 16588)
-- Dependencies: 6 1225
-- Name: getsemdesc2(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsemdesc2(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
  
    s text;
  begin
    select into s convert3rdtosummer2(semdesc) || ',' || getsemstr(ayid)
         from sem where semid = $1;
    return s;
  end;
$_$;


ALTER FUNCTION public.getsemdesc2(bigint) OWNER TO postgres;

--
-- TOC entry 460 (class 1255 OID 16589)
-- Dependencies: 1225 6
-- Name: getsemid(text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsemid(text, text, text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
    declare
          fromyear alias FOR $1;
          toyear alias FOR $2;
          semd alias FOR $3;
          semdi int8;
    begin
       if lower(semd) <> 'summer' then
           SELECT into semdi semid FROM sem where ayid IN ( SELECT ayid FROM ay where year_ = FromYear || '-' || toyear)  
              AND semdesc = semd;
       else
	   SELECT into semdi semid FROM sem where ayid IN ( SELECT ayid FROM ay where year_ = FromYear)  
              AND semdesc = convertSummerTo3rd(semd); 
       end if; 
       IF semdi IsNull THEN
           semdi = 0;
       END IF ;
     RETURN semdi;
    END ;
$_$;


ALTER FUNCTION public.getsemid(text, text, text) OWNER TO postgres;

--
-- TOC entry 461 (class 1255 OID 16590)
-- Dependencies: 1225 6
-- Name: getsemstr(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsemstr(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE 
          ayID_ ALIAS FOR $1;
          years_ TEXT;
  BEGIN
       SELECT INTO years_ year_ FROM ay WHERE ayID = ayID_;

    RETURN years_;  
  END;
$_$;


ALTER FUNCTION public.getsemstr(bigint) OWNER TO postgres;

--
-- TOC entry 462 (class 1255 OID 16591)
-- Dependencies: 1225 6
-- Name: getstatus(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getstatus(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
  	n alias for $1;
   	b text;
  begin
	select into b status from person where personid in 
             (select personid from personnum where personnumid = n);
        return b;
  end;
$_$;


ALTER FUNCTION public.getstatus(text) OWNER TO postgres;

--
-- TOC entry 463 (class 1255 OID 16592)
-- Dependencies: 6 1225
-- Name: getsubdesc(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsubdesc(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       subjid ALIAS FOR $1;
       n text;
   begin
       select into n description from subject where upper(subjectid) = upper(subjid);
       return n;
   end;
$_$;


ALTER FUNCTION public.getsubdesc(text) OWNER TO postgres;

--
-- TOC entry 464 (class 1255 OID 16593)
-- Dependencies: 6 1225
-- Name: getsubjectid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsubjectid(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE 
          snum ALIAS FOR $1;
          sid TEXT;
  BEGIN
       SELECT INTO sid subjectid FROM subject WHERE upper(subjnumber) = upper(snum);

    RETURN sid;  
  END;
$_$;


ALTER FUNCTION public.getsubjectid(text) OWNER TO postgres;

--
-- TOC entry 465 (class 1255 OID 16594)
-- Dependencies: 1225 6
-- Name: getsubjectidsem(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsubjectidsem(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  DECLARE 
          scode ALIAS FOR $1;
          smid alias for $2;
          sid TEXT;
  BEGIN
       SELECT INTO sid subjectid FROM offering WHERE offeringid = scode and semid = smid;

    RETURN sid;  
  END;
$_$;


ALTER FUNCTION public.getsubjectidsem(text, bigint) OWNER TO postgres;

--
-- TOC entry 466 (class 1255 OID 16595)
-- Dependencies: 1225 6
-- Name: getsubjlec(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsubjlec(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       subjid ALIAS FOR $1;
       n integer;
       t text;
   begin
       select into n islec from subject where upper(subjectid) = upper(subjid);
       if n = 1 then
          t = '(LEC)';  
       else
          t = '(LAB)';
       end if;
       return t;
   end;
$_$;


ALTER FUNCTION public.getsubjlec(text) OWNER TO postgres;

--
-- TOC entry 467 (class 1255 OID 16596)
-- Dependencies: 6 1225
-- Name: getsubjnumber(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsubjnumber(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       subjid ALIAS FOR $1;
       n text;
   begin
       select into n subjnumber from subject where upper(subjectid) = upper(subjid);
       return upper(n);
   end;
$_$;


ALTER FUNCTION public.getsubjnumber(text) OWNER TO postgres;

--
-- TOC entry 468 (class 1255 OID 16597)
-- Dependencies: 6 1225
-- Name: getsubjnumberoff(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsubjnumberoff(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    offid alias for $1;
    lid text;
  begin
        select into lid subjnumber from subject where subjectid in
	(
		select subjectid from offering where offeringid = offid
	);	
        return lid;
  end;
$_$;


ALTER FUNCTION public.getsubjnumberoff(text) OWNER TO postgres;

--
-- TOC entry 469 (class 1255 OID 16598)
-- Dependencies: 1225 6
-- Name: getsubjunits(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsubjunits(text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       subjid ALIAS FOR $1;
       n float8;
   begin
       select into n units_credit from subject where upper(subjectid) = upper(subjid);
       return n;
   end;
$_$;


ALTER FUNCTION public.getsubjunits(text) OWNER TO postgres;

--
-- TOC entry 470 (class 1255 OID 16599)
-- Dependencies: 1225 6
-- Name: getunitsinclude(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getunitsinclude(text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       subjid ALIAS FOR $1;
       n float8;
   begin
       select into n (units_credit * mult) from subject where upper(subjectid) = upper(subjid);
       return n;
   end;
$_$;


ALTER FUNCTION public.getunitsinclude(text) OWNER TO postgres;

--
-- TOC entry 471 (class 1255 OID 16600)
-- Dependencies: 1225 6
-- Name: getuser_group(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getuser_group(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       tp_ ALIAS FOR $1;
       l oid;
       m text;
   begin
       select into l usesysid from pg_user where usename::text = tp_;
       select into m groname::text from pg_group where instr2(array_to_string(grolist, ''), l::text, 1) > 0; 
       return m;
   end;
$_$;


ALTER FUNCTION public.getuser_group(text) OWNER TO postgres;

--
-- TOC entry 472 (class 1255 OID 16601)
-- Dependencies: 6 1225
-- Name: getusersin_group(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getusersin_group(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       tp_ ALIAS FOR $1;
       us_ oid[];
       l oid;
       i int;
       uname_ name;
       m text;
       
   begin
       m = '';
       select into us_ grolist from pg_group where groname = tp_;
       for i in 1..array_upper(us_, 1) loop
         select into uname_ usename from pg_user where usesysid = us_[i];
         m = m || uname_::text || ',';
       end loop;

       return m;
   end;
$_$;


ALTER FUNCTION public.getusersin_group(text) OWNER TO postgres;

--
-- TOC entry 476 (class 1255 OID 16602)
-- Dependencies: 6 1225
-- Name: gradecommentvalidate(text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION gradecommentvalidate(text, text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
  declare 
     grd_ alias for $1;
     comm_ alias for $2;
     res boolean; 
 begin
     if isnumeric(grd_) then
         if grd_::numeric >= 75.0 then
             res =  upper(comm_) = 'PASSED'; 
         else
             res = upper(comm_) = 'FAILED';
         end if;
     elsif grd_ = 'INC' then
        res = upper(comm_) = 'INCOMPLETE';
     elsif grd_ = 'OTP' then 
        res = true;
     elsif grd_ = 'NG' or grd_ = 'WDRW' or grd_ = 'DRP' or grd_ = 'NC' or grd_ = 'LEFT' then
        res = not (upper(comm_) = 'PASSED' or upper(comm_) = 'FAILED') and nonnum(grd_, comm_); 
     end if;
     return res; 
  end;
$_$;


ALTER FUNCTION public.gradecommentvalidate(text, text) OWNER TO postgre;

--
-- TOC entry 477 (class 1255 OID 16603)
-- Dependencies: 6 1225
-- Name: gradevalidate(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION gradevalidate(text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
DECLARE
    grd alias for $1;
    grd_ text;
    isvalid boolean;
BEGIN
      grd_ = upper(grd);
      if length(grd_) = 0 then
         isvalid = false;
      elsif grd_ = 'NC' then
         isvalid = true;
      elsif grd_ = 'NG' then
         isvalid = true;
      elsif grd_ = 'INC' then
         isvalid = true;
      elsif grd_ = 'OTP' then
         isvalid = true;
      elsif grd_ = 'DRP' then
         --raise exception 'DRP cannot be used anymore instead use LEFT';
         isvalid = true;
      elsif grd_ = 'WDRW' then
         isvalid = true;
      elsif grd_ = 'LEFT' then
         isvalid = true;
      elsif grd_ = 'PASSED' then --added this grade Sat 20 Jun 2009 04:56:54 PM PHT 
         isvalid = true;
      elsif grd_ = '69' then
         isvalid = true;
      elsif isnumeric(grd_) then
        if  grd_::numeric >= 75 and grd_::numeric <= 99 then
           isvalid = true;
        else
           isvalid = false;   
        end if;
      else
         isvalid = false;
      end if;                  
      RETURN isvalid;
END;
$_$;


ALTER FUNCTION public.gradevalidate(text) OWNER TO postgres;

--
-- TOC entry 478 (class 1255 OID 16604)
-- Dependencies: 1225 6
-- Name: grantec(text, integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION grantec(text, integer, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
    cname alias for $1;
    c alias for $2;
    au_name alias for $3;
    msg text;
  begin
    update errorcorrect set count_ = count_ + c where userid = cname and d8_ = now()::date;
     msg = log_action(au_name,cname || ' is granted with ' || c::text || ' additional EC previlege(s).');
    return;
  end;
$_$;


ALTER FUNCTION public.grantec(text, integer, text) OWNER TO postgres;

--
-- TOC entry 479 (class 1255 OID 16605)
-- Dependencies: 6 1225
-- Name: grantstub(text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION grantstub(text, text, text, text, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$ 
  declare 
    cashier_ alias for $1; 
    controller_ alias for $2; 
    frm_ alias for $3; 
    t_ alias for $4; 
    snum alias for $5;
    msg text;
    stubcount int; 
  begin 
     if length(btrim(frm_)) = 0 then 
        raise exception 'Series START cannot be empty!!!'; 
     end if; 
     if length(btrim(t_)) = 0 then 
        raise exception 'Series END cannot be empty!!!'; 
     end if; 
     if length(btrim(snum)) = 0 then 
        raise exception 'STUB NUMBER cannot be empty!!!'; 
     end if; 
     if frm_::numeric > t_::numeric then 
        raise exception 'Series Start Cannot be greater than Series End.'; 
     end if;  
     select into stubcount count(*) from receiptstubs where stubnumber = snum and yearpart(date_controlled) = yearpart(now()::date); 
     if stubcount > 1 then 
         raise exception 'Stubnumber % is already in the database!!!', snum; 
     end if; 
     insert into receiptstubs (cashier_name, controller_name, from_, to_, date_controlled, rcounter_, stubnumber) values (cashier_, controller_, frm_, t_, now()::timestamp without time zone, frm_, snum); 
     msg = log_action(controller_,cashier_ || ' is granted with receipt stub number' || snum || 'series from ' || frm_ || ' to ' || t_ || ' by '|| controller_ ||'.'); 
    return; 
  end; 
$_$;


ALTER FUNCTION public.grantstub(text, text, text, text, text) OWNER TO postgres;

--
-- TOC entry 480 (class 1255 OID 16606)
-- Dependencies: 6 1225
-- Name: hex2dec(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION hex2dec(text) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
  declare
  	n alias for $1;
   	i numeric;
  	he numeric;
  	res numeric;
  begin
	res = 0;
  	he = Length(n) - 1;
  	For i in 1..Length(n) loop
   		res = res + todec(substring(n, i, 1)) * raiseNtoE(16, he);
   		he = he - 1;
	end loop;
        return res;
  end;
$_$;


ALTER FUNCTION public.hex2dec(text) OWNER TO postgres;

--
-- TOC entry 481 (class 1255 OID 16607)
-- Dependencies: 1225 6
-- Name: idingroup(oid[], bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION idingroup(oid[], bigint) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
  declare
    found boolean;
    i int8;
  begin
     found = false;
     i = 1;
     while not $1[i] isnull and not found loop
       if $1[i] = $2 then
         found = true;
       end if;
       i = i + 1;
     end loop;
     return found;   
  end;
$_$;


ALTER FUNCTION public.idingroup(oid[], bigint) OWNER TO postgres;

--
-- TOC entry 482 (class 1255 OID 16608)
-- Dependencies: 1225 6
-- Name: incgrademonitor(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION incgrademonitor() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare
    s text;
  begin

    if old.grade = 'INC' and (new.comment_ = 'PASSED' or new.comment_ = 'FAILED') then
          return new;
    end if;
    
    if old.grade = 'INC' then
       delete from inctab where personnumid = old.personnumid and semid = old.semid and offeringid = old.offeringid;
    end if;

    if new.grade = 'INC' then
       s = insupinctab(new.personnumid, new.semid, new.offeringid, new.grade);
    end if;    

    return new;
  end;
$$;


ALTER FUNCTION public.incgrademonitor() OWNER TO postgres;

--
-- TOC entry 484 (class 1255 OID 16609)
-- Dependencies: 1225 6
-- Name: ins2account_(text, bigint, double precision, double precision, text, date, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ins2account_(text, bigint, double precision, double precision, text, date, text, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
       pid alias for $1;
       sid alias for $2;
       l alias for $3; --amount
       m alias for $4; --multiplier
       d alias for $5; 
       d8 alias for $6;
       rct alias for $7;
       cname alias for $8;
       insok alias for $9;
       mid int8;
       ts text;
       min text;
  begin
      mid = getccmodeid(d);
      --modified: 11/12/2009
      -- added the distribute function 
      --raise exception ' receipt number % ',rct;
      --if upper(d) = 'DISCOUNT' then
      --   select into ts personnumid from accounts where personnumid = pid and semid = sid and chargenameid = mid;
      --else
      
      
      
      if not translockstat(cname, d8) then
          raise exception 'Cannot Modify Entry this transaction has been locked.';
      end if;
      
         select into ts personnumid from accounts where personnumid = pid and semid = sid and chargenameid = mid and
           receiptnum = rct;
      --end if;
      if ts isnull then      
          if insok = 'ok' then
 	        insert into accounts (personnumid, semid, amount, mult,chargenameid, date_, receiptnum, cashier_name)
	                  values (pid, sid, l, m, mid, d8, rct, cname);
               if d = 'Tuition' or d = 'Miscellaneous' then 
                     perform distribute(pid,l, sid, rct, d8, cname, getpersondegree(pid), getpersonyear(pid)::int);
               end if;
                 min = log_action(cname,pid || ' account is added  with ' || d || ' amounting to ' || (m * l)::text);
           else
                  raise exception 'Please request a new stub assignment.';
           end if;
      else
         if upper(d) <> 'DISCOUNT' then 
           delete from payment_details where personnumid = pid and semid = sid and receiptnum = rct;
           update accounts set amount = l where personnumid = pid and semid = sid and chargenameid = mid and
           receiptnum = rct;
           perform distribute(pid,l, sid, rct, d8, cname, getpersondegree(pid), getpersonyear(pid)::int);
         else
             update accounts set amount = l, receiptnum = rct where personnumid = pid and semid = sid and chargenameid = mid;
         end if;
         min = log_action(cname,pid || ' account is modified  with ' || d || ' amounting to ' || (m * l)::text);
      end if;

     return 'OK';
  end;
$_$;


ALTER FUNCTION public.ins2account_(text, bigint, double precision, double precision, text, date, text, text, text) OWNER TO postgres;

--
-- TOC entry 485 (class 1255 OID 16610)
-- Dependencies: 1225 6
-- Name: ins2allowed(text, bigint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ins2allowed(text, bigint, integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       pid ALIAS FOR $1;
       sid alias for $2;
       val alias for $3;
       c int;
   begin
      
       select into c isallowed from cwhitelist where semid = sid and personnumid = pid;

       if c isnull then
           insert into cwhitelist (personnumid, semid, isallowed) values (pid, sid, val);
       else
           update cwhitelist set isallowed = val where personnumid = pid and semid = sid;
       end if;
       
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.ins2allowed(text, bigint, integer) OWNER TO postgres;

--
-- TOC entry 486 (class 1255 OID 16611)
-- Dependencies: 6 1225
-- Name: ins2allowed(text, bigint, integer, text, text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION ins2allowed(text, bigint, integer, text, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       pid ALIAS FOR $1;
       sid alias for $2;
       val alias for $3;
       authorizer_ alias for $4;
       period_ alias for $5;
       description_ alias for $6;
       c int;
   begin
    
       select into c isallowed from cwhitelist where semid = sid and personnumid = pid
       and authorizer = authorizer_ and period = period_;

       if c isnull then
           insert into cwhitelist 
             (personnumid, semid, isallowed, description, authorizer, period, stamp) 
             values (pid, sid, val, description_, authorizer_, period_, now()::timestamp without time zone);
       else
           update cwhitelist set isallowed = val where personnumid = pid and semid = sid and personnumid = pid
           and authorizer = authorizer_ and period = period_;
       end if;
       
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.ins2allowed(text, bigint, integer, text, text, text) OWNER TO postgre;

--
-- TOC entry 487 (class 1255 OID 16612)
-- Dependencies: 6 1225
-- Name: ins2dep(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ins2dep(text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
     coll alias for $1;
begin
   insert into dep (desc_, reserved, displayable) values (upper(coll), 0, 1);
   return;
end;
$_$;


ALTER FUNCTION public.ins2dep(text) OWNER TO postgres;

--
-- TOC entry 488 (class 1255 OID 16613)
-- Dependencies: 1225 6
-- Name: ins2enc_room(text, text, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ins2enc_room(text, text, integer, integer) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
    roomid_ alias for $1;
    dep alias for $2;
    isLec_ alias for $3;
    isIns alias for $4;
    depid_ bigint;
BEGIN
      depid_ = getdeptid(dep);

      if isIns = 1 then
         insert into room(roomid, depid, islec)
          values
          (upper(roomid_), depid_, isLec_);
      else
          update room set
             depid = depid_,
             islec = islec_
             where roomid = upper(roomid_);
      end if;
      
      RETURN;
END;
$_$;


ALTER FUNCTION public.ins2enc_room(text, text, integer, integer) OWNER TO postgres;

--
-- TOC entry 489 (class 1255 OID 16614)
-- Dependencies: 1225 6
-- Name: ins2off(integer, text, text, text, text, bigint, text, integer, text, bigint, integer, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ins2off(integer, text, text, text, text, bigint, text, integer, text, bigint, integer, bigint) RETURNS void
    LANGUAGE plpgsql
    AS $_$
declare
  isIns alias for $1;
  offid alias for $2;
  subjid alias for $3;
  tymskd alias for $4;
  rmid alias for $5;
  dpid alias for $6;
  dyskd alias for $7;
  slim alias for $8;
  scode alias for $9;
  sdegreeid alias for $10;
  syear alias for $11;
  sid alias for $12;
BEGIN
  if isIns = 1 then
      INSERT INTO offering (offeringid, semid, subjectid, time_sched, roomid, depid, daysched,lim,section_code,degreeid,year_) VALUES 
       (offid, sid, subjid, tymskd, rmid, dpid, dyskd, slim, scode,sdegreeid, syear);
  else
      UPDATE offering SET  
		subjectid = subjid, 
		time_sched = tymskd, 
		roomid = rmid, 
		depid = dpid, 
		daysched = dyskd, 
		lim = slim, 
		section_code = scode, 
		degreeid = sdegreeid, 
		year_ = syear
	WHERE 
		offeringid = offid and semid  = sid; 
  end if;
  RETURN;
END;
$_$;


ALTER FUNCTION public.ins2off(integer, text, text, text, text, bigint, text, integer, text, bigint, integer, bigint) OWNER TO postgres;

--
-- TOC entry 490 (class 1255 OID 16615)
-- Dependencies: 6 1225
-- Name: ins2off(integer, text, text, text, text, bigint, text, integer, text, bigint, integer, bigint, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ins2off(integer, text, text, text, text, bigint, text, integer, text, bigint, integer, bigint, text, text, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$ --                             tsk    rm          day
declare
  isIns alias for $1;
  offid alias for $2;
  subjid alias for $3;
  tymskd alias for $4;
  rmid alias for $5;
  dpid alias for $6;
  dyskd alias for $7;
  slim alias for $8;
  scode alias for $9;
  sdegreeid alias for $10;
  syear alias for $11;
  sid alias for $12;
  tymskd2 alias for $13;
  rmid2 alias for $14;
  dyskd2 alias for $15;
  --revised: april 7, 2009
  -- added parameters 13,14,15
BEGIN
  if isIns = 1 then
      INSERT INTO offering (offeringid, semid, subjectid, time_sched, 
                  roomid, depid, daysched,lim,section_code,degreeid,year_, time_sched2, roomid2, daysched2) VALUES 
       (offid, sid, subjid, tymskd, rmid, dpid, dyskd, slim, scode,sdegreeid, syear, tymskd2, rmid2, dyskd2);
  else
      UPDATE offering SET  
		subjectid = subjid, 
		time_sched = tymskd, 
		roomid = rmid, 
		depid = dpid, 
		daysched = dyskd, 
		lim = slim, 
		section_code = scode, 
		degreeid = sdegreeid, 
		year_ = syear,
                time_sched2 = tymskd2,
                roomid2 = rmid2,
	        daysched2 = dyskd2
         WHERE 
		offeringid = offid and semid  = sid; 
  end if;
  RETURN;
END;
$_$;


ALTER FUNCTION public.ins2off(integer, text, text, text, text, bigint, text, integer, text, bigint, integer, bigint, text, text, text) OWNER TO postgres;

--
-- TOC entry 491 (class 1255 OID 16616)
-- Dependencies: 6 1225
-- Name: ins2sbj(text, text, text, double precision, integer, text, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ins2sbj(text, text, text, double precision, integer, text, integer, integer) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
     subjid alias for $1;
     subjnum alias for $2;
     subjdesc alias for $3;
     subjcred alias for $4;
     subjislec alias for $5;
     subjcode alias for $6;
     isadd alias for $7;
     subjdep alias for $8;
begin
   if isadd = 1 then
      insert into subject (subjectid, subjnumber, description, units_credit, islec, code, depid)
      values
      (subjid, subjnum, subjdesc,subjcred, subjislec, subjcode, subjdep);
   else
      update subject set
         subjnumber = subjnum, -- csc 101
         description = subjdesc, -- intro to programming
         units_credit = subjcred, -- 3 units
         isLec = subjislec, -- 0 false 1 - true (is lecture subject)
         depid = subjdep,
         code = subjcode where subjectid = subjid; -- R  
   end if;
   return;
end;
$_$;


ALTER FUNCTION public.ins2sbj(text, text, text, double precision, integer, text, integer, integer) OWNER TO postgres;

--
-- TOC entry 492 (class 1255 OID 16617)
-- Dependencies: 6 1225
-- Name: ins2sbj(text, text, text, double precision, integer, text, integer, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION ins2sbj(text, text, text, double precision, integer, text, integer, bigint) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
     subjid alias for $1;
     subjnum alias for $2;
     subjdesc alias for $3;
     subjcred alias for $4;
     subjislec alias for $5;
     subjcode alias for $6;
     isadd alias for $7;
     subjdep alias for $8;
begin
   if isadd = 1 then
      insert into subject (subjectid, subjnumber, description, units_credit, islec, code, depid)
      values
      (subjid, subjnum, subjdesc,subjcred, subjislec, subjcode, subjdep);
   else
      update subject set
         subjnumber = subjnum, -- csc 101
         description = subjdesc, -- intro to programming
         units_credit = subjcred, -- 3 units
         isLec = subjislec, -- 0 false 1 - true (is lecture subject)
         depid = subjdep,
         code = subjcode where subjectid = subjid; -- R  
   end if;
   return;
end;
$_$;


ALTER FUNCTION public.ins2sbj(text, text, text, double precision, integer, text, integer, bigint) OWNER TO postgres;

--
-- TOC entry 493 (class 1255 OID 16618)
-- Dependencies: 6 1225
-- Name: insbdate2pdetails(text, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION insbdate2pdetails(text, date) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       l alias for $2;
       m text;
   begin
           select into m personnumid from person_details where personnumid = pid;
           
           if m isnull then
            insert into person_details (personnumid, birthday) values (pid, l);
           else
             update person_details set birthday = l where personnumid = pid;
           end if;
           return 'OK';
   end;
$_$;


ALTER FUNCTION public.insbdate2pdetails(text, date) OWNER TO postgres;

--
-- TOC entry 494 (class 1255 OID 16619)
-- Dependencies: 6 1225
-- Name: inspectborrowed(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION inspectborrowed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
   c int8;
begin
   --one book for one day
   select into c count(accessionNum) from borrow where
      upper(accessionnum) = upper(new.accessionnum) and
      upper(personid) = upper(new.personid) and
      pubtypeid = new.pubtypeid and
      returndate isnull;
   
   if c > 0 then
    raise exception 'BOOK IS ALREADY ASSIGNED TO THIS USER!';
   end if;

   select into c count(accessionNum) from borrow where
	upper(accessionNum) = upper(new.accessionNum) and 
	pubtypeid = new.pubtypeid and
        not dateborrowed isnull and returndate isnull;

   if c > 0 then
     raise exception 'BOOK IS NOT RETURNED!';
   end if;

   return new;
end;
$$;


ALTER FUNCTION public.inspectborrowed() OWNER TO postgres;

--
-- TOC entry 495 (class 1255 OID 16620)
-- Dependencies: 1225 6
-- Name: inssubjlab(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION inssubjlab(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       subjid ALIAS FOR $1;
       ldesc_ alias for $2;
       ltype int8;
       l text;
   begin
       select into ltype labtypeid from labtype where upper(desc_) = upper(ldesc_);
       
       select into l subjectid from subjlab where subjectid = subjid;

       if not l isnull then
           update subjlab  set labtypeid = ltype where subjectid = subjid;
       else
           -- note:
           -- if not null constraint is raised and you are sure dat ltype is
           -- in record, re-define the function putting this line,
           -- raise excepton '%,%', subjid, ltypeid
           -- then, remove later on...
	   -- [[[[[weird]]]]]
           insert into subjlab (subjectid, labtypeid) values (subjid, ltype);
       end if;
            
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.inssubjlab(text, text) OWNER TO postgres;

--
-- TOC entry 503 (class 1255 OID 16622)
-- Dependencies: 6 1225
-- Name: instr(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION instr(text, text) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
declare
   p1 int;
   p2 int;
   res int;
BEGIN    
        p1 = position($1 in $2);
        p2 = position($2 in $1);
        if  p1 >= p2  then
             res = p1;
        else
             res = p2;
        end if;
        return res;
END;
$_$;


ALTER FUNCTION public.instr(text, text) OWNER TO postgres;

--
-- TOC entry 502 (class 1255 OID 16621)
-- Dependencies: 6 1225
-- Name: instr(character varying, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION instr(character varying, character varying, integer, integer) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
DECLARE
    string ALIAS FOR $1;
    string_to_search ALIAS FOR $2;
    beg_index ALIAS FOR $3;
    occur_index ALIAS FOR $4;
    pos integer NOT NULL DEFAULT 0;
    occur_number integer NOT NULL DEFAULT 0;
    temp_str varchar;
    beg integer;
    i integer;
    length integer;
    ss_length integer;
BEGIN
    IF beg_index > 0 THEN
        beg := beg_index;
        temp_str := substring(string FROM beg_index);

        FOR i IN 1..occur_index LOOP
            pos := position(string_to_search IN temp_str);

            IF i = 1 THEN
                beg := beg + pos - 1;
            ELSE
                beg := beg + pos;
            END IF;

            temp_str := substring(string FROM beg + 1);
        END LOOP;

        IF pos = 0 THEN
            RETURN 0;
        ELSE
            RETURN beg;
        END IF;
    ELSE
        ss_length := char_length(string_to_search);
        length := char_length(string);
        beg := length + beg_index - ss_length + 2;

        WHILE beg > 0 LOOP
            temp_str := substring(string FROM beg FOR ss_length);
            pos := position(string_to_search IN temp_str);

            IF pos > 0 THEN
                occur_number := occur_number + 1;

                IF occur_number = occur_index THEN
                    RETURN beg;
                END IF;
            END IF;

            beg := beg - 1;
        END LOOP;

        RETURN 0;
    END IF;
END;
$_$;


ALTER FUNCTION public.instr(character varying, character varying, integer, integer) OWNER TO postgres;

--
-- TOC entry 504 (class 1255 OID 16623)
-- Dependencies: 6 1225
-- Name: instr2(text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION instr2(text, text, integer) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
DECLARE
    string ALIAS FOR $1;
    string_to_search ALIAS FOR $2;
    beg_index ALIAS FOR $3;
    pos integer NOT NULL DEFAULT 0;
    temp_str varchar;
    beg integer;
    length integer;
    ss_length integer;
BEGIN
    IF beg_index > 0 THEN
        temp_str := substring(string FROM beg_index);
        pos := position(string_to_search IN temp_str);

        IF pos = 0 THEN
            RETURN 0;
        ELSE
            RETURN pos + beg_index - 1;
        END IF;
    ELSE
        ss_length := char_length(string_to_search);
        length := char_length(string);
        beg := length + beg_index - ss_length + 2;

        WHILE beg > 0 LOOP
            temp_str := substring(string FROM beg FOR ss_length);
            pos := position(string_to_search IN temp_str);

            IF pos > 0 THEN
                RETURN beg;
            END IF;

            beg := beg - 1;
        END LOOP;

        RETURN 0;
    END IF;
END;
$_$;


ALTER FUNCTION public.instr2(text, text, integer) OWNER TO postgres;

--
-- TOC entry 505 (class 1255 OID 16624)
-- Dependencies: 6 1225
-- Name: insup2permit(text, bigint, text, text, timestamp without time zone, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION insup2permit(text, bigint, text, text, timestamp without time zone, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
     personnumid_ alias for $1;
     semid_ alias for $2;
     examperiod_ alias for $3;
     printedby_ alias for $4;
     date1_ alias for $5;
     semester_ alias for $6;
     permid int;
     r8 double precision;
     level_ text;
     cr8 double precision;
     whitlisted text;
     acctsumrec record;
     bas double precision;
  begin
     level_ = getlev(getpcurrdegree(personnumid_, semid_));      
     r8 = getperiodrate(semid_, semester_, examperiod_, level_);
     select into acctsumrec payable as p,amountpaid as a from acctsum where personnumid = personnumid_ and semid = semid_ and payable - amountpaid > 0; 
     bas = stubalance(personnumid_, semid_);
      
     if getcurrentperiod(semester_, getcurrsem()) = 'NOT SET' then
        raise exception 'PRINTING OF PERMIT DENIED!\n Pls make sure the payment schedule for major exams is properly set.\nAnd one exam period should at least be activated.\n Please have this done by the Asst. Treasurer.';
     end if;


     select into whitlisted personnumid from cwhitelist where personnumid = personnumid_ and semid = semid_ and period = examperiod_;
     
     if acctsumrec isnull then 
         cr8 = 0;
     else
         cr8 = acctsumrec.a / (acctsumrec.p + bas);
     end if;
     -- rate = 0 meaning rate is not set
     -- cr8 >= r8 meaning amount paid is greater than or equal to existing required rate
     --  round(l::numeric,2)
     if round(r8::numeric, 2) <= 0.00 or round(cr8::numeric, 2) >= round(r8::numeric,2) or round(cr8::numeric,2) <= 0.00 or not whitlisted isnull then
         select into permid count(*) from permitprint where examperiod = examperiod_ and printedby = printedby_ and semid = semid_;
         if permid isnull then
            permid = 1;
         else
            permid = permid + 1;
         end if; 

       insert into permitprint (personnumid, personname, count_, date_, examperiod, semid, printedby) values
           (personnumid_, getpersonfullname2(personnumid_), permid, date1_,examperiod_,semid_, printedby_); 
     else
        raise exception 'Student must settle the balance first or issue a promisory note.';
     end if;
     return 'ok';
  end;
$_$;


ALTER FUNCTION public.insup2permit(text, bigint, text, text, timestamp without time zone, text) OWNER TO postgre;

--
-- TOC entry 506 (class 1255 OID 16625)
-- Dependencies: 6 1225
-- Name: insupdater(text, text, text, text, bigint, bigint, integer, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION insupdater(text, text, text, text, bigint, bigint, integer, text, integer) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
   id alias for $1; 
   ln alias for $2;
   fn alias for $3;
   mn alias for $4;
   ptypid alias for $5;
   degid alias for $6;
   yr_ alias for $7;
   gender_ alias for $8;
   isIns alias for $9;
   pid_ text;
BEGIN
   pid_ = fn || '_' || ln;
   if isIns = 1 then
     insert into person (personid, lname, fname, mi, degreeid ,ptypeid, year_, gender) 
        values (pid_,ln,fn,mn,degid,ptypid,yr_, gender_);
     insert into personnum(personnumid, personid, ptypeid) values 
       (id, pid_, ptypid);   
   else
     update person set lname = ln, fname = fn, mi = mn, degreeid = degid,
      ptypeid = ptypid, year_ = yr_, gender = gender_ where personid = pid_;
   end if;   
   return;
END;
$_$;


ALTER FUNCTION public.insupdater(text, text, text, text, bigint, bigint, integer, text, integer) OWNER TO postgres;

--
-- TOC entry 507 (class 1255 OID 16626)
-- Dependencies: 6 1225
-- Name: insupdater(text, text, text, text, bigint, bigint, integer, text, integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION insupdater(text, text, text, text, bigint, bigint, integer, text, integer, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
   id alias for $1; 
   ln alias for $2;
   fn alias for $3;
   mn alias for $4;
   ptypid alias for $5;
   degid alias for $6;
   yr_ alias for $7;
   gender_ alias for $8;
   isIns alias for $9;
   stat alias for $10;
   pid_ text;
BEGIN
   --id format is 2007-00099
   -- modified: april 8, 2009
   if isIns = 1 then
     pid_ = parsewithchar(fn, '_') || '_' || parsewithchar(ln, '_');
     pid_ = resolvename(pid_);
     insert into person (personid, lname, fname, mi, degreeid ,ptypeid, year_, gender, status) values (pid_,ln,fn,mn,degid,ptypid,yr_, gender_, stat);
     insert into personnum(personnumid, personid, ptypeid) values (id, pid_, ptypid);   
   else
     update person set lname = ln, fname = fn, mi = mn, 
       degreeid = degid, ptypeid = ptypid, year_ = yr_, 
       gender = gender_, status = stat 
       where 
       personid in (select personid from personnum where personnumid = id) and ptypeid = ptypid;
   end if;   

   update academicyearload set 
             degreeid = degid, year_ = yr_ 
             where personnumid = id and semid = getcurrsem();  
   
   return;
END;
$_$;


ALTER FUNCTION public.insupdater(text, text, text, text, bigint, bigint, integer, text, integer, text) OWNER TO postgres;

--
-- TOC entry 508 (class 1255 OID 16627)
-- Dependencies: 6 1225
-- Name: insupexrates(bigint, text, text, double precision, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION insupexrates(bigint, text, text, double precision, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
    semid_ alias for $1;
    semester_ alias for $2;
    period_ alias for $3;
    rate_ alias for $4;
    level1_ alias for $5;
    t record;
  begin 
    select into t * from examschedsdetails where semid = semid_ and 
           semester = semester_ and period = period_
           and level_ = level1_;
    if t isnull then
       insert into examschedsdetails (semid, semester, period, rate, stamp, level_) values (semid_, semester_, period_, rate_, now()::timestamp without time zone, level1_);
    else
      update examschedsdetails set rate = rate_ where semid = semid_ and semester = semester_ and period = period_ and level_ = level1_;
    end if;
    return;
  end;
$_$;


ALTER FUNCTION public.insupexrates(bigint, text, text, double precision, text) OWNER TO postgre;

--
-- TOC entry 509 (class 1255 OID 16628)
-- Dependencies: 1225 6
-- Name: insupinctab(text, bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION insupinctab(text, bigint, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
    declare
       pid alias for $1;
       sid alias for $2;
       ofid alias for $3;
       grd alias for $4;
       testpid text;
     begin
       select into testpid personnumid from inctab where personnumid = pid and semid = sid and offeringid = ofid;
       if grd = '-' then
       elsif not gradevalidate(grd) then
            raise exception 'Invalid Grade Entry.';
       end if;
 
       if testpid isnull then
            insert into inctab (personnumid, semid, offeringid, grade) values (pid,sid, ofid, grd);
       else
            update inctab set grade = grd where personnumid = pid and semid = sid and offeringid = ofid; 
            if grd = '-' then
                update academicyearload set comment_ = '' where personnumid = pid and offeringid = ofid and semid = sid;
            elsif grd::numeric >= 75.0 then
                update academicyearload set comment_ = 'PASSED' where personnumid = pid and offeringid = ofid and semid = sid;
            end if;
       end if;  

       return 'OK';   
    end;
  $_$;


ALTER FUNCTION public.insupinctab(text, bigint, text, text) OWNER TO postgres;

--
-- TOC entry 510 (class 1255 OID 16629)
-- Dependencies: 1225 6
-- Name: insupofficialload(text, bigint, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION insupofficialload(text, bigint, boolean) RETURNS void
    LANGUAGE plpgsql
    AS $_$
   declare
      personNum_ alias for $1;
      sid alias for $2;
      conf_ alias for $3;
      b text;
   begin
       select into b personnumid from officialload where personnumid = personNum_ and semid = sid;
       if b isnull then
             insert into officialload (personnumid, semid, conf) values (personNum_, sid, conf_);
       else
             update officialload set conf = conf_ where personnumid = personNum_ and semid = sid;
       end if;
   end;
$_$;


ALTER FUNCTION public.insupofficialload(text, bigint, boolean) OWNER TO postgres;

--
-- TOC entry 511 (class 1255 OID 16630)
-- Dependencies: 6
-- Name: isnumeric(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION isnumeric(text) RETURNS boolean
    LANGUAGE sql
    AS $_$
SELECT $1 ~ '^[0-9]+$'
$_$;


ALTER FUNCTION public.isnumeric(text) OWNER TO postgres;

--
-- TOC entry 512 (class 1255 OID 16631)
-- Dependencies: 1225 6
-- Name: labchargef(bigint, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION labchargef(bigint, bigint, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       ltypeid ALIAS FOR $1;
       sid alias for $2;
       lev alias for $3;
       c float8;
   begin
       c = 0;

       if not ltypeid isnull then
         select into c rate from labcharge where semid = sid and labtypeid = ltypeid and level_ = lev;
       end if;
       
       if c isnull then
             c = 0.0;
       end if;

       return c;
   end;
$_$;


ALTER FUNCTION public.labchargef(bigint, bigint, text) OWNER TO postgres;

--
-- TOC entry 513 (class 1255 OID 16632)
-- Dependencies: 6
-- Name: labincomepercourse(text, text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION labincomepercourse(text, text, bigint, OUT text, OUT bigint, OUT numeric) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
   SELECT labdesc AS t,
       count(labid), 
       round(sum(labchargef(labid, semid, $2))::numeric, 2)
       FROM academicyearload where
            coursedesc = $1 and
            semid = $3 AND 
            labid <> 0 group by t 
$_$;


ALTER FUNCTION public.labincomepercourse(text, text, bigint, OUT text, OUT bigint, OUT numeric) OWNER TO postgre;

--
-- TOC entry 598 (class 1255 OID 1272917)
-- Dependencies: 6
-- Name: lgrades(text, bigint, integer); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION lgrades(text, bigint, integer, OUT text, OUT text, OUT text, OUT text, OUT integer, OUT text, OUT text, OUT double precision, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
       select personnumid, -- TEXT
       upper(getpersonfullname2(personnumid)), -- TEXT
       getgender(personnumid), -- TEXT
       getdegree(degreeid), -- TEXT
       year_,  -- INTEGER
       subject, -- TEXT
       getsubdesc(getofferingsubj(offeringid, semid)), --TEXT
       getofferingunits(offeringid, semid), -- double precision
       grade, -- TEXT
	   comment_ -- TEXT
	   from academicyearload
       where 
       getdegree(degreeid) = $1 and semid = $2 and 
          year_ = $3
       order by upper(getpersonfullname2(personnumid))
$_$;


ALTER FUNCTION public.lgrades(text, bigint, integer, OUT text, OUT text, OUT text, OUT text, OUT integer, OUT text, OUT text, OUT double precision, OUT text, OUT text) OWNER TO postgre;

--
-- TOC entry 597 (class 1255 OID 1272879)
-- Dependencies: 6
-- Name: loads(text, bigint, integer); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION loads(text, bigint, integer, OUT text, OUT text, OUT text, OUT text, OUT integer, OUT text, OUT text, OUT text, OUT double precision) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
       select personnumid, -- TEXT
       upper(getpersonfullname2(personnumid)), -- TEXT
       getgender(personnumid), -- TEXT
       getdegree(degreeid), -- TEXT
       year_,  -- INTEGER
       subject, -- TEXT
       getsubdesc(getofferingsubj(offeringid, semid)), --TEXT
       labdesc, --TEXT 
       getofferingunits(offeringid, semid) -- double precision
       from academicyearload
       where 
       getdegree(degreeid) = $1 and semid = $2 and 
          year_ = $3
       order by upper(getpersonfullname2(personnumid))
$_$;


ALTER FUNCTION public.loads(text, bigint, integer, OUT text, OUT text, OUT text, OUT text, OUT integer, OUT text, OUT text, OUT text, OUT double precision) OWNER TO postgre;

--
-- TOC entry 514 (class 1255 OID 16633)
-- Dependencies: 1225 6
-- Name: lockallenroll(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION lockallenroll() RETURNS void
    LANGUAGE plpgsql
    AS $$
   declare
      sturec record;
      count int;
   begin
       count = 0;
       for sturec in select distinct personnumid, semid from academicyearload where isnumeric(substring(personnumid,1,1)) loop
           perform insupofficialload(sturec.personnumid, sturec.semid, true);
           raise notice 'locking enrollment of % for %', sturec.personnumid, getsemdesc(sturec.semid);
           count = count + 1;
       end loop;
       raise warning 'Processed % records', count;
   end;
$$;


ALTER FUNCTION public.lockallenroll() OWNER TO postgres;

--
-- TOC entry 515 (class 1255 OID 16634)
-- Dependencies: 1225 6
-- Name: lockfacsection(text, bigint, integer, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION lockfacsection(text, bigint, integer, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       scode ALIAS FOR $1;
       sid alias for $2;
       val alias for $3;
	   facid alias for $4;
	   rec record;
	   msg text;
   begin
       select into rec * from personload where offeringid = scode and semid = sid and md5(personnumid) = facid;
	   
        if not rec isnull then
         update offering set locked = val where offeringid = scode and semid = sid;
         msg = 'OK';
	   else
	      msg = 'NOT OK';
       end if;	   
	  return msg;
   end;
$_$;


ALTER FUNCTION public.lockfacsection(text, bigint, integer, text) OWNER TO postgre;

--
-- TOC entry 516 (class 1255 OID 16635)
-- Dependencies: 1225 6
-- Name: locksectionval(text, bigint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION locksectionval(text, bigint, integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       scode ALIAS FOR $1;
       sid alias for $2;
       val alias for $3;
   begin
   
       update offering set locked = val where offeringid = scode and semid = sid;
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.locksectionval(text, bigint, integer) OWNER TO postgres;

--
-- TOC entry 517 (class 1255 OID 16636)
-- Dependencies: 1225 6
-- Name: log_action(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION log_action(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
declare
  user_ alias for $1;
  act alias for $2;
BEGIN
  INSERT INTO logs(users_id, date_, activity) values (user_, now()::date, act);
  RETURN 'ok';
END;
$_$;


ALTER FUNCTION public.log_action(text, text) OWNER TO postgres;

--
-- TOC entry 518 (class 1255 OID 16637)
-- Dependencies: 6 1225
-- Name: login_(text, date, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION login_(text, date, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
BEGIN
  INSERT INTO logs(users_id, date_, activity) values ($1, 'now', $3);
  RETURN 'ok';
END;
$_$;


ALTER FUNCTION public.login_(text, date, text) OWNER TO postgres;

--
-- TOC entry 424 (class 1255 OID 16638)
-- Dependencies: 6 1225
-- Name: logininet_(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION logininet_(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
BEGIN
  INSERT INTO logsInet(users_id, timestamp_, activity, semid) values ($1, current_timestamp, $2, getcurrsem());
  RETURN 'ok';
END;
$_$;


ALTER FUNCTION public.logininet_(text, text) OWNER TO postgres;

--
-- TOC entry 451 (class 1255 OID 16639)
-- Dependencies: 6 1225
-- Name: magic(); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION magic() RETURNS text
    LANGUAGE plpgsql
    AS $$
 declare
   mword text;
   rtext text;
   dtext text;
   key1 record;
 begin
      rtext = random()::text;
      mword = substring(rtext,3, length(rtext));
      dtext = md5(now()::date::text);
      select into key1 * from pass where passpk = dtext;
      if key1 isnull then
          insert into pass(passpk, key_) values (dtext, mword);
      else
          mword = key1.key_;
      end if;
      return mword;
 end;
$$;


ALTER FUNCTION public.magic() OWNER TO postgre;

--
-- TOC entry 452 (class 1255 OID 16640)
-- Dependencies: 6
-- Name: miscincomepersem(double precision, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION miscincomepersem(double precision, bigint, text, OUT text, OUT numeric) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
   SELECT getccmodename(ccmodeid), round((rate * $1)::numeric, 2) FROM chargesdetails where semid = $2
                            AND ccmodeid <> getccmodeid('Per Unit') and level_ = $3 and 
                            ccmodeid <> getccmodeid('Test Paper');
$_$;


ALTER FUNCTION public.miscincomepersem(double precision, bigint, text, OUT text, OUT numeric) OWNER TO postgres;

--
-- TOC entry 453 (class 1255 OID 16641)
-- Dependencies: 1225 6
-- Name: mydegree(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION mydegree(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   DECLARE
        d TEXT; 
   BEGIN
        select into d abbr from degree where degreeid = $1;
         
        if d ISNULL then
               d = ' '; 
        end if;        

    RETURN d;  
  END;
$_$;


ALTER FUNCTION public.mydegree(bigint) OWNER TO postgres;

--
-- TOC entry 454 (class 1255 OID 16642)
-- Dependencies: 6
-- Name: myecgrants(text, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION myecgrants(text, date, OUT text, OUT date, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
  select * from logs where users_id = $1 and activity like '%granted%EC%' and date_ = $2;
$_$;


ALTER FUNCTION public.myecgrants(text, date, OUT text, OUT date, OUT text) OWNER TO postgres;

--
-- TOC entry 455 (class 1255 OID 16643)
-- Dependencies: 6
-- Name: mylastlog(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION mylastlog(text, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
  select to_char(time_, 'FMDay, Month DD,YYYY HH:MI A.M.'), ipaddress from webuselog where usename = $1  order by time_ desc limit 2;
$_$;


ALTER FUNCTION public.mylastlog(text, OUT text, OUT text) OWNER TO postgre;

--
-- TOC entry 456 (class 1255 OID 16644)
-- Dependencies: 6
-- Name: nbackacct(bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION nbackacct(bigint, OUT text, OUT text, OUT numeric) RETURNS SETOF record
    LANGUAGE sql
    AS $_$

   select personnumid, 
          upper(getpersonfullname2(personnumid, 'students')),  
          round((payable-amountpaid)::numeric,2)
          from acctsum where round((payable-amountpaid)::numeric,2) > 0.00 and semid < $1
          order by upper(getpersonfullname(personnumid));

$_$;


ALTER FUNCTION public.nbackacct(bigint, OUT text, OUT text, OUT numeric) OWNER TO postgre;

--
-- TOC entry 483 (class 1255 OID 16645)
-- Dependencies: 1225 6
-- Name: nextreceipt(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION nextreceipt(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    cashier_ alias for $1;
    cnum text;
    rnumber record;
    numr int8;
    curr text;
  begin
      select into rnumber * from receiptstubs where cashier_name = cashier_ and rcounter_::int8 <= to_::int8 order by from_::int8 asc limit 1;
      
      if rnumber isnull then
          raise exception ' You got no more receipt in your stub, please contact your stub controller.  ';
      end if;   
      curr = rnumber.rcounter_;
      numr = curr::int8 + 1;
      update receiptstubs set rcounter_ = numr::text where cashier_name = cashier_ and controller_name = rnumber.controller_name and
             date_controlled = rnumber.date_controlled and from_ = rnumber.from_;
      return curr;
  end;
$_$;


ALTER FUNCTION public.nextreceipt(text) OWNER TO postgres;

--
-- TOC entry 496 (class 1255 OID 16646)
-- Dependencies: 6 1225
-- Name: nonnum(text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION nonnum(text, text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
declare
  g_ alias for $1;
  c_ alias for $2;
   g text;
   c text;
  res boolean;
begin
  g = upper(g_);
  c = upper(c_);
 
  if g = 'NG' then
	  res = instr(c,'NO GRADE') <> 0;
  elsif g = 'WDRW' then
	  res = instr(c,'WITHDRAW') <> 0;
  elsif g = 'NC' then
	  res = instr(c,'NO CREDIT') <> 0;
  elsif g = 'DRP' then
	  res = instr(c,'DROPPED') <> 0;
  elsif g = 'LEFT' then
          res = true;
  end if;
  return res;
end;
  $_$;


ALTER FUNCTION public.nonnum(text, text) OWNER TO postgre;

--
-- TOC entry 497 (class 1255 OID 16647)
-- Dependencies: 1225 6
-- Name: normtimerange(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION normtimerange(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
    DECLARE
       time_sched alias for $1;
       ftime text;
    BEGIN
    if time_sched = 'none' then
      ftime = 'none';
    else
      ftime = tonormaltimecafe(substring(time_sched,1,5)) || '-' ||
       tonormaltimecafe(substring(time_sched,7,5)); 
    end if;
    RETURN ftime;
  END;
$_$;


ALTER FUNCTION public.normtimerange(text) OWNER TO postgres;

--
-- TOC entry 498 (class 1255 OID 16648)
-- Dependencies: 1225 6
-- Name: note(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION note() RETURNS void
    LANGUAGE plpgsql
    AS $$
   declare
	
   begin
	   raise exception '=====================================';
           return;
   end;
$$;


ALTER FUNCTION public.note() OWNER TO postgres;

--
-- TOC entry 499 (class 1255 OID 16649)
-- Dependencies: 1225 6
-- Name: null2nulltext(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION null2nulltext(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       tst ALIAS FOR $1;
       res text;
   begin
       if tst isnull then
          res = '';
       else
          res = tst;
       end if;
       return res;
   end;
$_$;


ALTER FUNCTION public.null2nulltext(text) OWNER TO postgres;

--
-- TOC entry 519 (class 1255 OID 16650)
-- Dependencies: 6 1225
-- Name: num2words(double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION num2words(double precision) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       m alias for $1;
       r text;
       i text;
       mtext text;
       t text;
       a text;
       n float8;
       dotpos integer;
   begin 
      if m <> 0 then
       if m < 0 then
          t = 'negative ';  
          n = m * -1;
       else
          t = ''; 
          n = m;
       end if;  
       mtext = n::text;
      
       i = substring(mtext, length(mtext) - 1, 2); --handles .95

       dotpos = instr2(mtext, '.', 1);

       if dotpos > 0 then
          r = substring(mtext, 1, dotpos - 1); -- get the whole number part
       else
          r = '00';
       end if; 
       --raise exception '%', i || ' ' || r;
       if substring(i, 1,1) = '.' then -- handles .9
          -- fix some problem
          i = substring(i, 2, 1) || '0'; 
          r = substring(mtext, 1, length(mtext) - 2);
       elseif substring(mtext, length(mtext) - 2,1) <> '.' then
          r = mtext;
          i = '00';
       end if;
       
        

       if i::int <> 0::int then
         a = ' and ';
       else
         a = ' ';
       end if;
       mtext = t || towords(r::int8) || a || towords(i::int8);
     else
       mtext = 'zero';
     end if;
     return mtext;
   end;
$_$;


ALTER FUNCTION public.num2words(double precision) OWNER TO postgres;

--
-- TOC entry 520 (class 1255 OID 16651)
-- Dependencies: 6 1225
-- Name: parsedays(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION parsedays(text) RETURNS text[]
    LANGUAGE plpgsql
    AS $_$
DECLARE
        days ALIAS FOR $1;
        d text;
        elt text[];
BEGIN   
        d = upper(days);
        if d = 'MWF' then
           elt = array['MON', 'WED', 'FRI'];
        elsif d = 'TTH' then
           elt = array['TUE', 'THU'];
        elsif d = 'M-F' then
           elt = array['MON','TUE', 'WED','THUR', 'FRI'];
        elsif d = 'MW' then
           elt = array['MON', 'WED'];
        elsif d = 'WF' then
           elt = array['WED','FRI'];
        elsif d = 'MON' then 
           elt = array['MON']; 
        elsif d =  'TUE' then
	   elt = array['TUE'];	
	elsif d =  'WED' then
	   elt = array['WED']; 
	elsif d =  'THUR' then
	   elt = array['THUR'];
	elsif d =  'FRI' then
           elt = array['FRI'];
        elsif d = 'SAT' then
           elt = array['SAT'];
        elsif d = 'SUN' then
           elt = array['SUN'];        
	end if;
RETURN elt;
END;
$_$;


ALTER FUNCTION public.parsedays(text) OWNER TO postgres;

--
-- TOC entry 521 (class 1255 OID 16652)
-- Dependencies: 6 1225
-- Name: parsewithchar(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION parsewithchar(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
   a alias for $1; 
   inscar alias for $2;
   pos int;
   str_ text; 
   scann int; 
   char_ text;
   BEGIN
     pos = 1;
     scann = 1;
     str_ = '';
     while pos <= length(a) loop
      char_ = substring(a, pos, 1); 
      if char_ = ' ' then
         str_ = str_ || inscar;
      else
         str_ = str_ || char_;
      end if;
      pos = pos + 1;
     end loop;
   return str_;
END;
$_$;


ALTER FUNCTION public.parsewithchar(text, text) OWNER TO postgres;

--
-- TOC entry 522 (class 1255 OID 16653)
-- Dependencies: 1225 6
-- Name: pd_fill(text, double precision, bigint, text, date, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION pd_fill(text, double precision, bigint, text, date, text, text, integer) RETURNS void
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       amt alias for $2;
       smid alias for $3;
       rctnum alias for $4;
       d8 alias for $5;
       chrgnem alias for $6;
       cashier_ alias for $7;
       mod alias for $8;
       rec text;
   begin
       if mod = 0 then -- insert
               select into rec personnumid from payment_details where personnumid = pid and receiptnum = rctnum and semid = smid and
                                   chargename = chrgnem and date_ = d8;
               if rec isnull then
                          insert into payment_details (personnumid, amount, semid, receiptnum, date_, chargename, cashier_name)
                                      values (pid, amt, smid, rctnum, d8, chrgnem, cashier_);   
               else
                          update payment_details set amount = amount + amt where personnumid = pid and receiptnum = rctnum and semid = smid and
                                   chargename = chrgnem and date_ = d8;
               end if;

         else  -- delete
          delete from payment_details where personnumid = pid and receiptnum = rctnum and semid = smid;
        end if;  
          return;
   end;
$_$;


ALTER FUNCTION public.pd_fill(text, double precision, bigint, text, date, text, text, integer) OWNER TO postgres;

--
-- TOC entry 525 (class 1255 OID 16654)
-- Dependencies: 1225 6
-- Name: perunitcharge(bigint, integer, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION perunitcharge(bigint, integer, bigint, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       degree ALIAS FOR $1;
       yearlevel alias for $2; 
       sid alias for $3;
       pugen float8; --per unit generic '1'
       pudeg1 float8; --per unit degree at some year level
       pudeg2 float8; --per unit degree at all year level
       lev alias for $4;
       l float8;

   begin
--select perunitcharge('BSIT',2,getcurrsem());d
      -- raise exception 'level: ==> %', lev;
       select into pudeg1 rate from degreespecialcharge where semid = sid and 
              degreeid = degree and year_ = yearlevel and level_ = lev;
       
       if pudeg1 isnull then
          select into pudeg2 rate from degreespecialcharge where semid = sid and 
              degreeid = degree and year_ = 0 and level_ = lev;
          if pudeg2 isnull then
             l = -1;  
          else 
             l = pudeg2;    
	  end if;
       else
           l = pudeg1;
       end if;     
 
       if l = -1 then
           select into pugen rate from chargesdetails where semid = sid and ccmodeid = getccmodeid('Per Unit') and level_ = lev;
           --ccmodeid = 1 is per unit
	   l = pugen;
       end if;
       return l;
   end;
$_$;


ALTER FUNCTION public.perunitcharge(bigint, integer, bigint, text) OWNER TO postgres;

--
-- TOC entry 526 (class 1255 OID 16655)
-- Dependencies: 6 1225
-- Name: populateacademicyearload(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION populateacademicyearload() RETURNS void
    LANGUAGE plpgsql
    AS $$
  declare
    labid_ int8;
    labdesc_ text; 
    coursedesc_ text;
    ayrec record;
    total int;
    idx int;
  begin
     select into total count(*) from academicyearload;
     idx = 1;
     FOR ayrec in select personnumid, offeringid, semid from academicyearload  LOOP
           labid_ = subjlabfoff(ayrec.offeringid);
           if labid_ isnull then
                labdesc_ = 'None';
                labid_ = 0;
           else
                labdesc_ = subjlabdesc(labid_);
           end if;
             coursedesc_ = array_to_string(semcy(ayrec.personnumid, ayrec.semid), '-'); 
             coursedesc_ = substring(coursedesc_, 0, length(coursedesc_)-1);
             update academicyearload set 
                   labid = labid_,
                   labdesc = labdesc_,
                   coursedesc = coursedesc_
             where
                   personnumid = ayrec.personnumid and
                   offeringid = ayrec.offeringid and
                   semid = ayrec.semid;
             raise notice 'PROCESSING % of % RECORDS', idx, total;
             idx = idx + 1;
     END LOOP;	
   
  end;
$$;


ALTER FUNCTION public.populateacademicyearload() OWNER TO postgres;

--
-- TOC entry 527 (class 1255 OID 16656)
-- Dependencies: 6 1225
-- Name: populateacademicyearsubject(); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION populateacademicyearsubject() RETURNS void
    LANGUAGE plpgsql
    AS $$
  declare
    ayrec record;
    total int;
    idx int;
  begin
     select into total count(*) from academicyearload;
     idx = 1;
     FOR ayrec in select personnumid, offeringid, semid from academicyearload  LOOP
             update academicyearload set 
                 subject = getsubjnumberoff(offeringid)
             where
                   personnumid = ayrec.personnumid and
                   offeringid = ayrec.offeringid and
                   semid = ayrec.semid;
             raise notice 'PROCESSING % of % RECORDS', idx, total;
             idx = idx + 1;
     END LOOP;
   
  end;
$$;


ALTER FUNCTION public.populateacademicyearsubject() OWNER TO postgre;

--
-- TOC entry 528 (class 1255 OID 16657)
-- Dependencies: 1225 6
-- Name: populateayyear(); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION populateayyear() RETURNS void
    LANGUAGE plpgsql
    AS $$
  declare
    coursedesc_ text;
    ayrec record;
    total int;
    idx int;
  begin
     select into total count(*) from academicyearload;
     idx = 1;
     FOR ayrec in select personnumid, offeringid, semid from academicyearload  LOOP
             coursedesc_ = array_to_string(semcy(ayrec.personnumid, ayrec.semid), '-'); 
             coursedesc_ = substring(coursedesc_, length(coursedesc_), length(coursedesc_));
             update academicyearload set 
                   stuyear = coursedesc_::int
             where
                   personnumid = ayrec.personnumid and
                   offeringid = ayrec.offeringid and
                   semid = ayrec.semid;
             raise notice 'PROCESSING % of % RECORDS', idx, total;
             idx = idx + 1;
     END LOOP;
   
  end;
$$;


ALTER FUNCTION public.populateayyear() OWNER TO postgre;

--
-- TOC entry 529 (class 1255 OID 16658)
-- Dependencies: 6 1225
-- Name: preventnullchargeid(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION preventnullchargeid() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare 
     s text;
  begin
    if new.chargenameid isnull then
         raise exception 'Invalid Description!!';
    end if;

    if new.mult = 1 or new.mult = -1 then
        s = doassess(new.personnumid, new.semid, 'cashier');
    end if;  
    
    return new;
  end;
$$;


ALTER FUNCTION public.preventnullchargeid() OWNER TO postgres;

--
-- TOC entry 530 (class 1255 OID 16659)
-- Dependencies: 1225 6
-- Name: processid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION processid(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    s text;
  begin
    s = $1;
    if s = 'Cash' then
       s = '2006-0001';
    end if;
    return s;
  end;
$_$;


ALTER FUNCTION public.processid(text) OWNER TO postgres;

--
-- TOC entry 531 (class 1255 OID 16660)
-- Dependencies: 1225 6
-- Name: queryec(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION queryec(text) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
  declare
    cname alias for $1;
    msg text;
  begin
    msg = generateec(cname);
    return eccount(cname);
  end;
$_$;


ALTER FUNCTION public.queryec(text) OWNER TO postgres;

--
-- TOC entry 532 (class 1255 OID 16661)
-- Dependencies: 6 1225
-- Name: raisentoe(numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION raisentoe(numeric, numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
   DECLARE
       n alias for $1;
       e alias for $2;
       i int;
       res numeric;
   begin 
   	res = 1;
   
   	If e > 0 Then
    		For i in 1..e loop
         		res = res * n;
    		end loop;
   	End If;
      return res;
   End;
$_$;


ALTER FUNCTION public.raisentoe(numeric, numeric) OWNER TO postgres;

--
-- TOC entry 533 (class 1255 OID 16662)
-- Dependencies: 6 1225
-- Name: reassessacctdel(); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION reassessacctdel() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare
    s text;
  begin
    if old.mult = 1 or old.mult = -1 then
     s = doassess(old.personnumid, old.semid, 'cashier');
    end if;    
    return new;
  end;
$$;


ALTER FUNCTION public.reassessacctdel() OWNER TO postgre;

--
-- TOC entry 534 (class 1255 OID 16663)
-- Dependencies: 6 1225
-- Name: reassessacctupdate(); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION reassessacctupdate() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare
    s text;
  begin
    if new.mult = 1 or new.mult = -1 then
     s = doassess(new.personnumid, new.semid, 'cashier');
    end if;    
    return new;
  end;
$$;


ALTER FUNCTION public.reassessacctupdate() OWNER TO postgre;

--
-- TOC entry 535 (class 1255 OID 16664)
-- Dependencies: 1225 6
-- Name: reassesstriggdel(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION reassesstriggdel() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare
    s text;
  begin
    s = doassess(old.personnumid, old.semid, 'cashier');
    return old;
  end;
$$;


ALTER FUNCTION public.reassesstriggdel() OWNER TO postgres;

--
-- TOC entry 536 (class 1255 OID 16665)
-- Dependencies: 1225 6
-- Name: reassesstriggins(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION reassesstriggins() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare
    s text;
  begin
    s = doassess(new.personnumid, new.semid, 'cashier');
    return new;
  end;
$$;


ALTER FUNCTION public.reassesstriggins() OWNER TO postgres;

--
-- TOC entry 523 (class 1255 OID 16666)
-- Dependencies: 6 1225
-- Name: removeload(text, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION removeload(text, bigint, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       smid alias for $2;
       offid alias for $3;
       ptyp text;
       pid text;
   begin
       delete from personload where personnumid = personNum_ and
                                    offeringid =  offid and semid = smid;
       select into pid personid from personnum where personnumid = personnum_;
       ptyp = getptypename(getpersontype(pid));
       if ptyp = 'students' then
            delete from academicyearload  where personnumid = personNum_ and
                                    offeringid = offid and semid = smid;
            update offering set lim = lim + 1 where offeringid = offid;
       end if;
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.removeload(text, bigint, text) OWNER TO postgres;

--
-- TOC entry 524 (class 1255 OID 16667)
-- Dependencies: 6 1225
-- Name: removeload2(text, bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION removeload2(text, bigint, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       smid alias for $2;
       offid alias for $3;
       uname alias for $4;
       ptyp text;
       pid int8;
       m text;
       lockstat integer;
       grd text;
       conf123 boolean;
   begin
         
          
	if not (uname = 'postgre' or uname = 'Orven E. Llantos' or uname = 'orven') then      
		if getptypename(usertype(uname)) <> 'admin' and getptypename(usertype(uname)) <> 'registrar' and getptypename(usertype(uname)) <> 'regstaff' then
			if getptypename(usertype(uname)) <> 'faculty' then
                               raise exception 'Request rejected: Access Denied!';
			 elsif getptypename(usertype(uname)) = 'faculty' and getptypename(getpersonnumtype(personnum_)) <> 'students' then
				raise exception 'Request rejected: Access Denied!';
                         end if;
                 end if;
           select into lockstat islocked from sem where semid = smid; -- added: 10/09/2009 
                                                                                                                 -- if enrollment is closed faculty and deans cannot be allowed to remove student loads  
           if lockstat = 0 then 
               if (getptypename(usertype(uname)) = 'faculty' or getptypename(usertype(uname)) = 'admin')and getptypename(getpersonnumtype(personnum_)) = 'students' then
				RAISE EXCEPTION 'ENROLLMENT IS CLOSED: ONLY THE REGISTRAR CAN REMOVE STUDENT SUBJECT LOAD.';
	       end if;
	   end if;
       end if; 

       select into grd grade from academicyearload where personnumid = personnum_ and
                        offeringid = offid and semid = smid;
       
       if not grd isnull and not grd = 'WDRW' then
           raise exception 'THIS SUBJECT ALREADY HAS A GRADE.CANNOT REMOVE.';
       end if;
       				 
       delete from personload where personnumid = personNum_ and
                                    offeringid =  offid and semid = smid;
       --select into pid personid from personnum where personnumid = personnum_;
       select into pid ptypeid from personnum where personnumid = personnum_;
       ptyp = getptypename(pid);   

       conf123 = getofloadstat(personnum_, smid);
       -- modified: 01/20/2010 
       if conf123 and getptypename(usertype(uname)) <> 'registrar' then
          raise exception 'Cannot remove subject, only the registrar can modify the student load.';
       end if;

       m = log_action(uname, offid || ' was removed from ' || personnum_ || ' by ' || uname);
       if ptyp = 'students' then
            delete from academicyearload  where personnumid = personNum_ and
                                    offeringid = offid and semid = smid;
            update offering set lim = lim + 1 where offeringid = offid;
       end if;
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.removeload2(text, bigint, text, text) OWNER TO postgres;

--
-- TOC entry 537 (class 1255 OID 16668)
-- Dependencies: 1225 6
-- Name: resolvename(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION resolvename(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
   a alias for $1;
   res text; 
   cnt int;
   BEGIN
     res = '';
     select into cnt count(*) from person where upper(personid) = upper(a);
     if cnt > 0 then
        res = a || cnt::text;
     else
        res = a;
     end if;
   return res;
END;
$_$;


ALTER FUNCTION public.resolvename(text) OWNER TO postgres;

--
-- TOC entry 538 (class 1255 OID 16669)
-- Dependencies: 6 1225
-- Name: semcy(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION semcy(text, bigint) RETURNS text[]
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       sid alias for $2;
       did int8;
       dd int8;
       yea int;
       y int;
       cy text;
   begin
           
           dd = getdegreeid(getpersondegree(pid));
           yea = getpersonyear(pid); 

           select into did degreeid from academicyearload where personnumid = pid and semid = sid limit 1;

	    if not did isnull then
               dd = did;
               select into y year_ from academicyearload where personnumid = pid and semid = sid limit 1;
               if not y isnull then
                  yea = y;
               end if;
	    end if;	

           cy = getdegree(dd) || '-' || yea::text;
           return string_to_array(cy, '-');
   end;
$_$;


ALTER FUNCTION public.semcy(text, bigint) OWNER TO postgres;

--
-- TOC entry 539 (class 1255 OID 16670)
-- Dependencies: 1225 6
-- Name: semcy2(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION semcy2(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       sid alias for $2;
       did text;
     begin
           
         select into did getdegree(degreeid) || '-' ||  year_ 
         from academicyearload where personnumid = pid and semid = sid limit 1;

	 
           return did;
   end;
$_$;


ALTER FUNCTION public.semcy2(text, bigint) OWNER TO postgre;

--
-- TOC entry 540 (class 1255 OID 16671)
-- Dependencies: 6 1225
-- Name: semstat(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION semstat(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    sid alias for $1;
    v int;
    s text;
  begin
    select into v islocked from sem where semid = sid;
     if v = 1 then
          s = 'OPEN';
     else
          s = 'CLOSED';
     end if;  
    return s;
  end;
$_$;


ALTER FUNCTION public.semstat(bigint) OWNER TO postgres;

--
-- TOC entry 541 (class 1255 OID 16672)
-- Dependencies: 6 1225
-- Name: semtext(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION semtext(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       s ALIAS FOR $1;
       full_ text;
   begin
      select into full_ convert3rdtosummer(semdesc) || ',' || getsemstr(ayid) from sem where semid = s;
       return full_;
   end;
$_$;


ALTER FUNCTION public.semtext(bigint) OWNER TO postgres;

--
-- TOC entry 542 (class 1255 OID 16673)
-- Dependencies: 6 1225
-- Name: setexamperiod(text, text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION setexamperiod(text, text, bigint) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
    semester_ alias for $1;
    period_ alias for $2;
    semid_ alias for $3;
    t record;
  begin
     select into t * from examschedsdetails where semester = semester_ and
            period = period_ and semid = semid_;
     if t isnull then
          raise exception 'The payment schedule is not yet created.';
     else
          update examschedsdetails set active = false where semester = semester_ and
          semid = semid_;
          update examschedsdetails set active = true where semester = semester_ and
            period = period_ and semid = semid_;
     end if;
     return;
  end;
$_$;


ALTER FUNCTION public.setexamperiod(text, text, bigint) OWNER TO postgre;

--
-- TOC entry 543 (class 1255 OID 16674)
-- Dependencies: 1225 6
-- Name: setsemlock(bigint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION setsemlock(bigint, integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    sid alias for $1;
    v alias for $2;
  begin
    update sem set islocked = v where semid = sid;   
    return 'OK';
  end;
$_$;


ALTER FUNCTION public.setsemlock(bigint, integer) OWNER TO postgres;

--
-- TOC entry 544 (class 1255 OID 16675)
-- Dependencies: 6 1225
-- Name: size(text[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION size(text[]) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
DECLARE
        data_array ALIAS FOR $1;
        array_element text;
        counter int4;
BEGIN   
        -- set the counter
        counter := 0;
        
        -- loop until we terminate
        WHILE true LOOP
                -- get the element from the array
                array_element := data_array[counter + 1];  -- 1 based arrays
                
                -- exit the loop if no more data
                IF (array_element IS NULL) THEN
                        EXIT;   -- exit the  loop
                END IF;


                -- increment the counter
                counter := counter + 1;                 
        END LOOP;
RETURN counter;
END;
$_$;


ALTER FUNCTION public.size(text[]) OWNER TO postgres;

--
-- TOC entry 545 (class 1255 OID 16676)
-- Dependencies: 6 1225
-- Name: stubalance(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION stubalance(text, bigint) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       sid alias for $2;
       ASSESSMENT FLOAT8;
       l double precision;
       minusonesem int8;
       MSG TEXT;
   begin
           minusonesem = stuprevsem(pid, sid);
           --msg = doassess(pid, minusonesem, 'auto-assess-cashier');
           if not minusonesem isnull then
               l = stubalancenow(pid, minusonesem); 
           else
                l = 0.0;
           end if;
           return l;
   end;
$_$;


ALTER FUNCTION public.stubalance(text, bigint) OWNER TO postgres;

--
-- TOC entry 546 (class 1255 OID 16677)
-- Dependencies: 6 1225
-- Name: stubalancenow(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION stubalancenow(text, bigint) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       sid alias for $2;
       l float8;
       msg text;
       assessment float8;
   begin
           --mult for other payments should be zero
           --select into assessment amount from accounts where personnumid = pid and receiptnum = 'assess' and 
           --   semid = sid;
           if pid <> '2006-0001' then
              msg = doassess(pid, sid, 'auto-assess-cashier');
              select into l sum((payable-amountpaid)) from acctsum where personnumid = pid and semid <= sid and round((payable-amountpaid)::numeric,2) <> 0; 
              if l isnull then
                 l = 0;
	      end if;
	   else
	       l = 0;
	   end if;
           return round(l::numeric,2);
   end;
$_$;


ALTER FUNCTION public.stubalancenow(text, bigint) OWNER TO postgres;

--
-- TOC entry 547 (class 1255 OID 16678)
-- Dependencies: 6 1225
-- Name: stubstatus(text, text, text, text, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION stubstatus(text, text, text, text, date) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    cashier_ alias for $1;
    controller_ alias for $2;
    startx_ alias for $3;
    endx_ alias for $4;
    datex_ alias for $5;
    rnumber record;
    res text;
  begin
      select into rnumber * from receiptstubs where cashier_name = cashier_ and controller_name = controller_ and
           date_controlled = datex_ and from_ = startx_ and to_ = endx_;
      
      if rnumber.rcounter_::int8 > rnumber.to_::int8 then
         res = 'CLOSED';
      else
          res = 'OK';
      end if;   
            return res;
  end;
$_$;


ALTER FUNCTION public.stubstatus(text, text, text, text, date) OWNER TO postgres;

--
-- TOC entry 548 (class 1255 OID 16679)
-- Dependencies: 1225 6
-- Name: studtotalload(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION studtotalload(text, bigint) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       pid ALIAS FOR $1;
       sid alias for $2;
       u_ float8;
   begin
       select into u_ sum(getunitsinclude(subjectid)) from offering where offeringid in
          (select offeringid from academicyearload where personnumid = pid and
          semid = sid) and semid = sid;

         if u_ isnull then
           u_ = 0;
         end if;
          
       return u_;
   end;
$_$;


ALTER FUNCTION public.studtotalload(text, bigint) OWNER TO postgres;

--
-- TOC entry 550 (class 1255 OID 16680)
-- Dependencies: 6 1225
-- Name: stupayable(text, bigint, text, text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION stupayable(text, bigint, text, text, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
  declare
    studentid alias for $1;
    semid_ alias for $2;
    semester_ alias for $3;
    level1_ alias for $4;
    period_ alias for $5;
    r8 double precision;
    bas double precision;
    payable_ double precision;
    acctsumrec record;
  begin
  
        r8 = getperiodrate(semid_, semester_, period_, level1_);
        select into acctsumrec payable as p, amountpaid as a  from acctsum where personnumid = studentid and semid = semid_ and payable - amountpaid > 0; 
        bas = stubalance(studentid, semid_); -- back account
        --select into acct_amount sum((payable - amountpaid)) from acctsum where personnumid = studentid and semid <= semid_;
        --acct_amount =  stubalancenow(studentid, semid_);--currassessplusba(studentid, semid_);
        --if acct_amount isnull or acct_amount < 0.0 then
        --   acct_amount = 0.0;
        --end if;
        payable_ = ((bas + acctsumrec.p) * r8) - acctsumrec.a;
     
    return round(payable_::numeric, 2);
  end;
$_$;


ALTER FUNCTION public.stupayable(text, bigint, text, text, text) OWNER TO postgre;

--
-- TOC entry 551 (class 1255 OID 16681)
-- Dependencies: 6 1225
-- Name: stuprevsem(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION stuprevsem(text, bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       sid alias for $2;
       l int8;
   begin
          select into l max(semid) from acctsum where personnumid = pid and 
          semid < sid; 
           
          return l;
   end;
$_$;


ALTER FUNCTION public.stuprevsem(text, bigint) OWNER TO postgres;

--
-- TOC entry 552 (class 1255 OID 16682)
-- Dependencies: 6 1225
-- Name: stusumacct(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION stusumacct(text, bigint) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
 declare
   stuid alias for $1;
   smid alias for $2;
   tot double precision;
 begin
    select into tot sum((payable - amountpaid)) from acctsum where personnumid = stuid;
    if tot isnull then
            tot = 0;
    end if;
    return tot;
 end;
$_$;


ALTER FUNCTION public.stusumacct(text, bigint) OWNER TO postgre;

--
-- TOC entry 553 (class 1255 OID 16683)
-- Dependencies: 1225 6
-- Name: subdistribute(text, double precision, bigint, text, date, text, text, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION subdistribute(text, double precision, bigint, text, date, text, text, double precision) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       pid alias for $1;
       amt alias for $2;
       smid alias for $3;
       rctnum alias for $4;
       d8 alias for $5;
       chrgnem alias for $6;
       cashier_ alias for $7;
       rate alias for $8;
       myamount double precision;
       downpayment double precision;
       myamount2 double precision;
       remaining double precision;
   begin
       -- get all payments for this payable
	   downpayment = amt;
        select into myamount sum(amount) from payment_details where personnumid = pid 
                                                                    and semid = smid 
                                                                    and chargename = chrgnem;
                          if myamount isnull then -- if nothing is paid for this payable
                                     if downpayment >= rate then  -- if downpayment bigger or exactly the same as the amount for this payable
                                              myamount2 = rate;   -- the amount will be stored in the database
                                              downpayment =  downpayment - rate; -- and the downpayment will be deducted by the amount
                                      else    -- otherwise
                                              myamount2 = downpayment; -- the downpayment will be stored in the database 
                                              downpayment = 0;   -- nothing is left
                                      end if;
                                      perform pd_fill(pid, myamount2, smid, rctnum, d8, chrgnem, cashier_, 0);  -- store in db  
                         else -- otherwise
					-- if it is paid --do nothing
					if myamount < rate then -- if what i paid is still not enough
					     remaining = rate - myamount; -- how much do i owe?
					     if downpayment >= remaining then -- if what i paid exceed or exactly the amount payable
						    myamount2 = remaining; -- the remaining amount will be stored in the db
						    downpayment =  downpayment - remaining; -- deduct it from my downpayment
					     else -- otherwise
						    myamount2 = downpayment; 
						    downpayment = 0;
					     end if;
					     perform pd_fill(pid, myamount2, smid, rctnum, d8, chrgnem, cashier_, 0);   
					end if;
				     end if;
          return downpayment;
   end;
$_$;


ALTER FUNCTION public.subdistribute(text, double precision, bigint, text, date, text, text, double precision) OWNER TO postgres;

--
-- TOC entry 554 (class 1255 OID 16684)
-- Dependencies: 1225 6
-- Name: subjectcharge(text, bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION subjectcharge(text, bigint, text) RETURNS double precision
    LANGUAGE plpgsql
    AS $_$
   declare
       subj ALIAS FOR $1;
       sid alias for $2;
       lev alias for $3;
       
       l float8;
   begin
       
       select into l rate from addsubjectcharge where subj like subjectid || '%' and semid = sid and level_ = lev;
       if l isnull then
          l = 0;
       end if;  
       return l;
   end;
$_$;


ALTER FUNCTION public.subjectcharge(text, bigint, text) OWNER TO postgres;

--
-- TOC entry 555 (class 1255 OID 16685)
-- Dependencies: 6
-- Name: subjectincomepercourse(text, text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION subjectincomepercourse(text, text, bigint, OUT text, OUT numeric) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
select * 
from
(
SELECT  subject AS t,
        Round(sum(subjectcharge(subject, getcurrsem(),$2))::numeric,2) as r FROM
        academicyearload where
           semid = $3  and
           coursedesc = $1
           group by t order by t asc
 ) v
 where r > 0;
 $_$;


ALTER FUNCTION public.subjectincomepercourse(text, text, bigint, OUT text, OUT numeric) OWNER TO postgres;

--
-- TOC entry 556 (class 1255 OID 16686)
-- Dependencies: 6 1225
-- Name: subjlabdesc(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION subjlabdesc(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       labt ALIAS FOR $1;
       ldesc text;
   begin
       select into ldesc desc_ from labtype where labtypeid = labt;    
       return ldesc;
   end;
$_$;


ALTER FUNCTION public.subjlabdesc(bigint) OWNER TO postgres;

--
-- TOC entry 557 (class 1255 OID 16687)
-- Dependencies: 6 1225
-- Name: subjlabf(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION subjlabf(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       subjid ALIAS FOR $1;
       ltype int8;
   begin
       select into ltype labtypeid from subjlab where subjectid = subjid;
       
       return ltype;
   end;
$_$;


ALTER FUNCTION public.subjlabf(text) OWNER TO postgres;

--
-- TOC entry 558 (class 1255 OID 16688)
-- Dependencies: 6 1225
-- Name: subjlabfoff(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION subjlabfoff(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
  declare
    offid alias for $1;
    lid int8;
  begin
	
	select into lid labtypeid from subjlab where subjectid in
	(
		select subjectid from subject where subjnumber in 
		(
			select subjnumber from subject where subjectid in
			(
				select subjectid from offering where offeringid = offid
			)						
		)
	);
        return lid;
  end;
$_$;


ALTER FUNCTION public.subjlabfoff(text) OWNER TO postgres;

--
-- TOC entry 559 (class 1255 OID 16689)
-- Dependencies: 6 1225
-- Name: subjlabid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION subjlabid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
   declare
       subjid ALIAS FOR $1;
       ltype int8;
   begin
       select into ltype labtypeid from labtype where upper(desc_) = upper(subjid);
       
       return ltype;
   end;
$_$;


ALTER FUNCTION public.subjlabid(text) OWNER TO postgres;

--
-- TOC entry 560 (class 1255 OID 16690)
-- Dependencies: 6 1225
-- Name: subjlock(text, bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION subjlock(text, bigint) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
  declare
     subjid_ alias for $1;
     semid_ alias for $2;
     g integer;
  begin
     select into g locked from offering where offeringid = subjid_ and semid = semid_;
     return g;
  end;
$_$;


ALTER FUNCTION public.subjlock(text, bigint) OWNER TO postgre;

--
-- TOC entry 561 (class 1255 OID 16691)
-- Dependencies: 6 1225
-- Name: testarray(text[], integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION testarray(text[], integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       test alias for $1;
       idx alias for $2;
   begin   
        return test[idx];
   end;
$_$;


ALTER FUNCTION public.testarray(text[], integer) OWNER TO postgres;

--
-- TOC entry 562 (class 1255 OID 16692)
-- Dependencies: 6 1225
-- Name: testconflict(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION testconflict(text, text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
  declare
   range1 alias for $1;
   range2 alias for $2;
   b1 text;
   e1 text;
   b2 text;
   e2 text;
   res boolean;
  begin
     if range1 <> 'none' and range2 <> 'none' then   
    		b1 = timebeginning(range1);
    		e1 = timeend(range1);
    		b2 = timebeginning(range2);
    		e2 = timeend(range2);
    		--cond1: b1 <= b2 and e1 > b2
    		--cond2:  b1 < e2 and e1 > e2
    		res = (range1 = range2 or (b1 <= b2 and e1 > b2) or (b1 < e2 and e1 > e2));
      else
          res = false;
      end if;
     return res;
  end;
  $_$;


ALTER FUNCTION public.testconflict(text, text) OWNER TO postgres;

--
-- TOC entry 549 (class 1255 OID 16693)
-- Dependencies: 1225 6
-- Name: testpapercount(bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION testpapercount(bigint, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       sid alias for $1;
       pid alias for $2;
       tl int8; --total load 
   begin
       select into tl count(offeringid) from academicyearload where personnumid = pid and
          semid = sid;  
       return tl::text;
   end;
$_$;


ALTER FUNCTION public.testpapercount(bigint, text) OWNER TO postgres;

--
-- TOC entry 457 (class 1255 OID 16694)
-- Dependencies: 6
-- Name: testpaperincomepercourse(text, text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION testpaperincomepercourse(text, text, bigint, OUT text, OUT numeric, OUT double precision) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
SELECT 'Test Paper'::text,sum(testpapercount(semid, personnumid):: int8),                             
               sum(computetestpaperfee(semid, $2, personnumid)) 
                             FROM distinct_ids_enrolled 
                             where semid = $3 AND coursedesc =  $1 group by coursedesc; --order by personnumid
$_$;


ALTER FUNCTION public.testpaperincomepercourse(text, text, bigint, OUT text, OUT numeric, OUT double precision) OWNER TO postgres;

--
-- TOC entry 458 (class 1255 OID 16695)
-- Dependencies: 6 1225
-- Name: textualizestat(boolean); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION textualizestat(lstat boolean) RETURNS text
    LANGUAGE plpgsql
    AS $$
  declare
    res text;
  begin
  
     if lstat then
        res = 'Allowed';
     else
        res = 'DisAllowed';
     end if;
     return res;
  end;
 $$;


ALTER FUNCTION public.textualizestat(lstat boolean) OWNER TO postgre;

--
-- TOC entry 459 (class 1255 OID 16696)
-- Dependencies: 6 1225
-- Name: timebeginning(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION timebeginning(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   range alias for $1;
   t text;
  begin
    t = substring(range,1,5);
    return t;
  end;
  $_$;


ALTER FUNCTION public.timebeginning(text) OWNER TO postgres;

--
-- TOC entry 473 (class 1255 OID 16697)
-- Dependencies: 1225 6
-- Name: timeend(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION timeend(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
   range alias for $1;
   t text;
  begin
    t = substring(range,7,5);
    return t;
  end;
  $_$;


ALTER FUNCTION public.timeend(text) OWNER TO postgres;

--
-- TOC entry 474 (class 1255 OID 16698)
-- Dependencies: 6 1225
-- Name: timenow_(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION timenow_() RETURNS text
    LANGUAGE plpgsql
    AS $$
   begin
       return tonormaltimecafe(extract(hour from now())::text ||':' || extract(minute from now())::text);
   end;
$$;


ALTER FUNCTION public.timenow_() OWNER TO postgres;

--
-- TOC entry 475 (class 1255 OID 16699)
-- Dependencies: 6 1225
-- Name: timestamptodate(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION timestamptodate(timestamp without time zone) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    m text;
    d text;
    y text;
    mdy text;
  begin
     m = appendzerom(extract(month from $1)::text, 2);
     d = appendzerom(extract(day from $1)::text,2);
     y = extract(year from $1)::text;
     mdy = m || '/' || d || '/' || y;
    
    return mdy;
  end;
$_$;


ALTER FUNCTION public.timestamptodate(timestamp without time zone) OWNER TO postgres;

--
-- TOC entry 500 (class 1255 OID 16700)
-- Dependencies: 6 1225
-- Name: timestamptohours(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION timestamptohours(timestamp without time zone) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    h text;
    m text;
    s text;
    hms text;
  begin
     h = appendzerom(extract(hour from $1)::text, 2);
     m = appendzerom(extract(minute from $1)::text,2);
     s = appendzerom((extract(second from $1)::int4)::text,2);
     hms = h || ':' || m || ':' || s;
    
    return hms;
  end;
$_$;


ALTER FUNCTION public.timestamptohours(timestamp without time zone) OWNER TO postgres;

--
-- TOC entry 501 (class 1255 OID 16701)
-- Dependencies: 6 1225
-- Name: tociviliancafe(numeric, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION tociviliancafe(numeric, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    h text;
    m text;
BEGIN	
   m = appendzerom(substr($2, 4, 5),2);
   if $1 > 12 then
     h := $1 - 12;
     h := appendzerom(h, 2) || ':' || m || ' PM'; 
       
   else 
     h := $1;
    if $1 = 12 then
      h := appendzerom(h, 2) || ':' || m || ' PM';  
    else
      h := appendzerom(h, 2) || ':' || m || ' AM';  
    end if;
     
   end if;

   RETURN h;
END;
$_$;


ALTER FUNCTION public.tociviliancafe(numeric, text) OWNER TO postgres;

--
-- TOC entry 563 (class 1255 OID 16702)
-- Dependencies: 6 1225
-- Name: todec(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION todec(text) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
   DECLARE
      n alias for $1;
      h numeric;
   BEGIn
   	If n = 'A' Then
     		h = 10;
   	end if; 
           
        If n = 'B' Then
     		h = 11;
   	end if; 
        
        If n = 'C' Then
     		h = 12;
   	end if; 
            
        If n = 'D' Then
     		h = 13;
	end if;
 
	If n = 'E' Then
     		h = 14;
        end if;

	If n = 'F' Then
     		h = 15;
   	end if;

   	IF n = 'O' then
   	        h = 0;
   	end if;
 
        if not (n = 'A' or n = 'B' or n = 'C' or n = 'D' or n = 'E' or n = 'F' or n = 'O') then
     		h = to_number(n, '99');
   	End If;
  	return h;
    End;
$_$;


ALTER FUNCTION public.todec(text) OWNER TO postgres;

--
-- TOC entry 564 (class 1255 OID 16703)
-- Dependencies: 6 1225
-- Name: toggletrans(text, date, boolean); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION toggletrans(cname text, d8 date, status boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$
  declare
     f bigint;
  begin
  
     select into f count(*) from transaction_lock where cashier_name = cname and date_ = d8;
                    
     if f = 0 then
        insert into transaction_lock (cashier_name, date_, lockstatus) values (cname, d8, status);
     else
        update transaction_lock set lockstatus = status where cashier_name = cname and date_ = d8;
     end if;
     
  end;
$$;


ALTER FUNCTION public.toggletrans(cname text, d8 date, status boolean) OWNER TO postgre;

--
-- TOC entry 565 (class 1255 OID 16704)
-- Dependencies: 6 1225
-- Name: toggletrans(text, date, boolean, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION toggletrans(cname text, d8 date, status boolean, auditname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
  declare
     f bigint;
     act text;
  begin
  
     select into f count(*) from transaction_lock where cashier_name = cname and date_ = d8;
                    
     if f = 0 then
        insert into transaction_lock (cashier_name, date_, lockstatus) values (cname, d8, status);
     else
        update transaction_lock set lockstatus = status where cashier_name = cname and date_ = d8;
     end if;
     
     if status then
       act = 'allowed';
     else
       act = 'dis-allowed';
     end if;
     
     act = log_action(auditname,cname || ' was  ' || act || ' to edit ' || d8::text || ' entries by ' || auditname || ' dated ' || now()::date); 
  end;
$$;


ALTER FUNCTION public.toggletrans(cname text, d8 date, status boolean, auditname text) OWNER TO postgre;

--
-- TOC entry 566 (class 1255 OID 16705)
-- Dependencies: 6 1225
-- Name: tonormaltimecafe(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION tonormaltimecafe(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
    DECLARE
       military_ alias for $1;
       normal text;
       t1hour numeric;
    BEGIN
         t1hour := to_number(substr(military_,1,2),'99');
          
         normal := toCivilianCafe(t1hour,military_);     
  
    RETURN normal;  
  END;
$_$;


ALTER FUNCTION public.tonormaltimecafe(text) OWNER TO postgres;

--
-- TOC entry 567 (class 1255 OID 16706)
-- Dependencies: 6 1225
-- Name: totaltuitpercourse(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION totaltuitpercourse(text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
    degreen_ alias for $1;
    sid alias for $2;
    tuit float8;
    perunitcharge_ float8;
    acct record;
    y_ integer;
    did int8;
    lev text;
  begin
        y_ = 0;
        did = getdegreeid(degreen_);
        lev = getlev(degreen_);
        tuit = 0; 
        FOR acct IN select personnumid, stuyear FROM distinct_ids_enrolled where 
            semid =  sid and coursedesc = degreen_ order by stuyear asc LOOP 
            
            if y_ <> acct.stuyear::integer then
                perunitcharge_ = perunitcharge(did, acct.stuyear::integer,sid,lev);
            end if; 
            tuit = tuit + (studtotalload(acct.personnumid,sid) * perunitcharge_);
        END LOOP;

    return tuit;
  end;
$_$;


ALTER FUNCTION public.totaltuitpercourse(text, bigint) OWNER TO postgres;

--
-- TOC entry 575 (class 1255 OID 16707)
-- Dependencies: 1225 6
-- Name: towords(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION towords(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
 declare 
    n alias for $1;
    w text;
    v text;
    rem int8;
    q int8;
 begin
   if n <= 19 then
    w =  basicUnit(n);
   elseif (n >= 20 and n <= 99) then
     q = n / 10;
     rem = n % 10;

     if q = 2 then
        v = 'twenty ';
     elseif q = 3 then
        v = 'thirty ';
     elseif q = 4 then
        v = 'forty ';
     elseif (q = 5) then
        v = 'fifty ';
     elseif q = 6 then
        v =  'sixty ';
     elseif q = 7 then
        v = 'seventy ';
     elseif q = 8 then
	v = 'eighty ';
     elseif q = 9 then
        v = 'ninety ';
     end if;

    w = v || basicUnit(rem);
   elseif (n >= 100 and n <= 999) then

     q = n / 100;
     rem = n % 100;
     w = basicUnit(q) || ' hundred ' || toWords(rem); 
 
   elseif (n >= 1000 and n <= 9999) then
     q = n / 1000;
     rem = n % 1000;
     w = basicUnit(q) || ' thousand ' ||toWords(rem); 
   elseif (n >= 10000 and n <= 99999) then
     q = n / 1000;
     rem = n % 1000;
     if (q <= 19) then
	v = basicUnit(q);
     else
	v = toWords(q); 
     end if;
     w = v || ' thousand ' || toWords(rem); 
   elseif (n >= 100000 and n <= 999999) then
      q = n / 1000;
      rem = n % 1000;

      w = toWords(q) || ' thousand ' || toWords(rem);
   end if;
   return w;
 end;
$_$;


ALTER FUNCTION public.towords(bigint) OWNER TO postgres;

--
-- TOC entry 576 (class 1255 OID 16708)
-- Dependencies: 6
-- Name: transactionstoday(text, date); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION transactionstoday(text, date, OUT text, OUT text) RETURNS SETOF record
    LANGUAGE sql
    AS $_$
    select cashier_name, textualizestat(lockstatus) from
     transaction_lock where cashier_name = $1 and date_ = $2;
$_$;


ALTER FUNCTION public.transactionstoday(text, date, OUT text, OUT text) OWNER TO postgre;

--
-- TOC entry 577 (class 1255 OID 16709)
-- Dependencies: 6 1225
-- Name: transfer_acadrecord(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION transfer_acadrecord(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
declare
  from_id alias for $1;
  to_id alias for $2;
begin
  update personload set personnumid = to_id where personnumid = from_id;
  update academicyearload set  personnumid = to_id where personnumid = from_id;
  update accounts set personnumid = to_id where personnumid = from_id;
  update payment_details set personnumid = to_id where personnumid = from_id;
  update personnum set personid = 'none' where personnumid = from_id and ptypeid = 1;
  return 'OK';
end;
$_$;


ALTER FUNCTION public.transfer_acadrecord(text, text) OWNER TO postgres;

--
-- TOC entry 578 (class 1255 OID 16710)
-- Dependencies: 6 1225
-- Name: transferrct(text, text, bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION transferrct(text, text, bigint, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
       rctid alias for $1;
       usename alias for $2;
       semfrom alias for $3;
       semto alias for $4; 
       pidR text;
       pr text;
      rctpd text;
  begin
     -- modified: 11/12/2009 
     -- added modificaton for payment details...
     if ECpermit(usename) then
		     update accounts set
		              semid = semto
		              where
		                 receiptnum = rctid and
		                 semid = semfrom;
                       
                     --select into rctpd receiptnum from payment_details where semid = semfrom and receiptnum = rctid limit 1;

                      --if not rctpd isnull then -- if there is an entry for this receipt in the payment details
                                -- update it..
                 		update payment_details set semid = semto where receiptnum = rctid and semid = semfrom; 
         	      --end if; 
      	     
                     pr = ECdec(usename);
		     pidr = log_action(usename,rctid || 
		        ' is transferred from ' || getsemdesc(semfrom) 
		        || ' to ' || getsemdesc(semto));
		    
     end if;
    return 'OK'; 
  end;
$_$;


ALTER FUNCTION public.transferrct(text, text, bigint, bigint) OWNER TO postgres;

--
-- TOC entry 579 (class 1255 OID 16711)
-- Dependencies: 1225 6
-- Name: translockstat(text, date); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION translockstat(cname text, d8 date) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
  declare
    lstat boolean;
  begin

     if d8 <> now()::date then
              select into lstat lockstatus from transaction_lock where cashier_name = cname and date_ = d8;
              if lstat isnull then
                 lstat = false;
              end if;
     else
              lstat = true;
     end if;
     return lstat;
  end;
$$;


ALTER FUNCTION public.translockstat(cname text, d8 date) OWNER TO postgre;

--
-- TOC entry 580 (class 1255 OID 16712)
-- Dependencies: 6 1225
-- Name: trashentry(text, text, date, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION trashentry(text, text, date, text, text, text, text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
  declare
    cashier_ alias for $1;
    rctnum alias for $2;
    d8_ alias for $3;
    pid alias for $4;
    oldccmodename alias for $5;
    amt_ alias for $6;
    m alias for $7;
    curr text;
  begin
    
      
      if not translockstat(cashier_, d8_) then
          raise exception 'Cannot Modify Entry this transaction has been locked.';
      end if;
    
     if ECpermit(cashier_) then
       update accounts set mult = 0, amount = 0, chargenameid = getccmodeid(m) where receiptnum = rctnum and chargenameid = getccmodeid(oldccmodename) and personnumid = pid  and date_ = d8_;
       if oldccmodename = 'Tuition' or oldccmodename = 'Miscellaneous' then
           delete from payment_details where personnumid = pid and receiptnum = rctnum; 
       end if;
       curr = log_action(cashier_,cashier_ || lower(m) ||' trashed ' || rctnum|| ' from ' || pid || ' as payment for ' || oldccmodename || ' amounting to '|| amt_ || '.');
       curr = ecdec(cashier_);
     end if;
  end;
$_$;


ALTER FUNCTION public.trashentry(text, text, date, text, text, text, text) OWNER TO postgres;

--
-- TOC entry 581 (class 1255 OID 16713)
-- Dependencies: 6 1225
-- Name: txt2degreeid(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION txt2degreeid(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
DECLARE
    --input is abbr
    dgr int8;
BEGIN
     select into dgr degreeid from degree where upper(abbr) = upper($1);
      RETURN dgr;
END;
$_$;


ALTER FUNCTION public.txt2degreeid(text) OWNER TO postgres;

--
-- TOC entry 594 (class 1255 OID 132822)
-- Dependencies: 6
-- Name: ulogsview(text, date); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION ulogsview(text, date, OUT text) RETURNS SETOF text
    LANGUAGE sql
    AS $_$
     select activity from logs 
       where 
         users_id = $1 and 
         date_ = $2;
 $_$;


ALTER FUNCTION public.ulogsview(text, date, OUT text) OWNER TO postgre;

--
-- TOC entry 582 (class 1255 OID 16714)
-- Dependencies: 6 1225
-- Name: unmd5uname(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION unmd5uname(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
 declare
    md5name alias for $1;
    undigest text;
 begin
    select into undigest personnumid from personnum where md5(personnumid) = md5name;
    if undigest isnull then
       undigest = md5name;
    end if; 
    return undigest;
 end;
$_$;


ALTER FUNCTION public.unmd5uname(text) OWNER TO postgre;

--
-- TOC entry 583 (class 1255 OID 16715)
-- Dependencies: 6 1225
-- Name: upd8borrow(); Type: FUNCTION; Schema: public; Owner: Orven E. Llantos
--

CREATE FUNCTION upd8borrow() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    pid RECORD;
BEGIN
        for pid in select personid from borrow where ptypeid isnull loop
            update borrow set ptypeid = getpersontype(pid.personid) where personid = pid.personid;
        end loop;
      RETURN;
END;
$$;


ALTER FUNCTION public.upd8borrow() OWNER TO "Orven E. Llantos";

--
-- TOC entry 584 (class 1255 OID 16716)
-- Dependencies: 6 1225
-- Name: updateload(text, bigint, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION updateload(text, bigint, text, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       smid alias for $2;
       offid alias for $3;
       uname alias for $4;
       offid2 alias for $5;
       ptyp text;
       pid text;
       currlim integer;
       scod text;
       scod1 int;
       scod2 text;
       isallowed int;
       confsked text;
   begin
            --raise exception '% %', offid, offid2;
            update personload set offeringid = offid2 where offeringid = offid and personnumid = personNum_ and semid = smid;
            update academicyearload set offeringid = offid2 where offeringid = offid and personnumid = personNum_ and semid = smid;
	    --insert into academicyearload(personnumid, offeringid,semid, degreeid, year_) values
            --  (personnum_, offid, smid, getdegreeid(getpersondegree(personnum_)), getpersonyear(personnum_)::int4); 
            update offering set lim = lim + 1 where offeringid = offid;
            update offering set lim = lim - 1 where offeringid = offid2;
      
       return 'OK';
   end;
$_$;


ALTER FUNCTION public.updateload(text, bigint, text, text, text) OWNER TO postgres;

--
-- TOC entry 585 (class 1255 OID 16717)
-- Dependencies: 6 1225
-- Name: updatepcy(text, text, integer, text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION updatepcy(text, text, integer, text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   declare
       personNum_ ALIAS FOR $1;
       course alias for $2;
       yr_ alias for $3;
       uname alias for $4;
       sid alias for $5;
       did int8;
       typeid text;
       s text;
       crs text;
   begin
        crs = trim(course);
        if getdegreeid(crs) isnull then
           raise exception '% is an invalid course!', course;
        end if; 
        did = getdegreeid(crs);
        update person set year_ = yr_,
           degreeid = did where 
           personid = getpersonidnumid(personnum_) and ptypeid = getptypeid('students');
        update academicyearload set year_ = yr_, degreeid = did where semid = sid and personnumid = personnum_;
	   s = log_action(uname,personnum_ || ' was updated with course ' || crs || ' and year ' || yr_ ||' by ' || uname);
        return '';   
   end;
$_$;


ALTER FUNCTION public.updatepcy(text, text, integer, text, bigint) OWNER TO postgres;

--
-- TOC entry 586 (class 1255 OID 16718)
-- Dependencies: 6 1225
-- Name: updaterctentry(text, text, text, double precision, double precision, date, text, text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION updaterctentry(text, text, text, double precision, double precision, date, text, text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
       rctid alias for $1;
       usename alias for $2;
       pid alias for $3;
       amt alias for $4;
       mult_ alias for $5;
       d8 alias for $6;
       ccmodename alias for $7;
       oldccmodename alias for $8;
       sid alias for $9;
       ccmodeid int8;  
       pidR text;
       pr text;
       rctpd text; 
       oldpid text;
  begin
     -- modified: 11/12/2009 
     -- added: distribute
     if not translockstat(usename, d8) then
          raise exception 'Cannot Modify Entry this transaction has been locked.';
      end if;
     if ECpermit(usename) then
		     if pid = 'Cash' then
			 pidR = '2006-0001';
		     else
			 pidR = pid;
		     end if;  
		     ccmodeid = getccmodeid(ccmodename);
		     select into oldpid personnumid from accounts where receiptnum = rctid and
		                                                                                               semid = sid and 
                                                                                                               chargenameid = getccmodeid(oldccmodename);
                      update accounts set
		              personnumid = pid,
		              amount = amt,
		              mult = mult_,
		              date_ = d8,
		              chargenameid = ccmodeid
		              where
		                 receiptnum = rctid and
		                 semid = sid and chargenameid = getccmodeid(oldccmodename);
                      
                       select into rctpd receiptnum from payment_details where personnumid = pid and semid = sid and receiptnum = rctid limit 1;
                      
                         if not rctpd isnull  or (ccmodename = 'Tuition' or ccmodename = 'Miscellaneous') then -- if there's a corresponding receipt entry in the payment details
                               if not rctpd isnull then
                                         delete from payment_details where personnumid = pid and semid = sid and receiptnum = rctid;
                               end if;
                             
                               if oldpid <> pid then  -- if this is a transfer of entry (i.e., from 2007-0012 --> 2008-1234)
                                            delete from payment_details where personnumid = oldpid and semid = sid and receiptnum = rctid;
                               end if;
                               
                                if ccmodename = 'Tuition' or ccmodename = 'Miscellaneous' then
                                          perform distribute(pid,amt, sid, rctid, d8, usename, getpersondegree(pid), getpersonyear(pid)::int); 
                               end if; 
                      end if; 
	

    	              pr = ECdec(usename);
		     pidr = log_action(usename,pid || 
		        ' account is modified  with ' || ccmodename 
		        || ' amounting to ' || amt::text);
		    
     end if;
    return 'OK'; 
  end;
$_$;


ALTER FUNCTION public.updaterctentry(text, text, text, double precision, double precision, date, text, text, bigint) OWNER TO postgres;

--
-- TOC entry 587 (class 1255 OID 16719)
-- Dependencies: 6 1225
-- Name: updatestub(text, text, text, text, text, text, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION updatestub(text, text, text, text, text, text, date) RETURNS void
    LANGUAGE plpgsql
    AS $_$ 
  declare  
    cashier_ alias for $1; 
    controller_ alias for $2; 
    frm_ alias for $3; 
    t_ alias for $4; 
    snum alias for $5; 
    currreceiptnum alias for $6; 
    d8_ alias for $7; 
    msg text; 
  begin 
      if length(btrim(frm_)) = 0 then 
        raise exception 'Series START cannot be empty!!!'; 
     end if; 
     if length(btrim(t_)) = 0 then 
       raise exception 'Series END cannot be empty!!!'; 
    end if; 
    if length(btrim(snum)) = 0 then 
       raise exception 'STUB NUMBER cannot be empty!!!'; 
    end if; 
     if frm_::numeric > t_::numeric then 
       raise exception 'Series Start Cannot be greater than Series End.'; 
    end if; 
    update receiptstubs set 
               from_ = frm_, 
               to_ = t_,
               stubnumber = snum,
               rcounter_ = currreceiptnum
             where 
               cashier_name = cashier_ and 
               controller_name = controller_ and 
               date_controlled = d8_; 
    msg = log_action(controller_,controller_ || ' modified stub number ' || snum || 
                ' with series from ' || frm_ || ' to ' || t_ || ' and starting value '|| 
                currreceiptnum ||' assigned to '|| cashier_ || '.'); 
    return; 
  end;
$_$;


ALTER FUNCTION public.updatestub(text, text, text, text, text, text, date) OWNER TO postgres;

--
-- TOC entry 588 (class 1255 OID 16720)
-- Dependencies: 6 1225
-- Name: upper(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION upper(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
   begin
           return $1::text;
   end;
$_$;


ALTER FUNCTION public.upper(bigint) OWNER TO postgres;

--
-- TOC entry 589 (class 1255 OID 16721)
-- Dependencies: 6 1225
-- Name: usertype(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION usertype(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
-- input username
declare
    uid int8;
    groupN text;
    ptypID int8;
begin
   select into uid usesysid from pg_user where upper(usename) = upper($1);
   
   if not uid isnull then
      select into groupN groname from pg_group where idingroup(grolist, uid);
      ptypid = getptypeid(groupN);
   end if;
   
   return ptypid;
end;
$_$;


ALTER FUNCTION public.usertype(text) OWNER TO postgres;

--
-- TOC entry 590 (class 1255 OID 16722)
-- Dependencies: 6 1225
-- Name: usertypedig(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION usertypedig(text) RETURNS bigint
    LANGUAGE plpgsql
    AS $_$
-- input md5 username
declare
    uid int8;
    groupN text;
    ptypID int8;
begin
   -- Wednesday, 12 October, 2011 10:58:19 AM PHT 
   select into uid usesysid from pg_user where md5(usename) = $1;
   
   if not uid isnull then
      select into groupN groname from pg_group where idingroup(grolist, uid);
      ptypid = getptypeid(groupN);
   end if;
   
   return ptypid;
end;
$_$;


ALTER FUNCTION public.usertypedig(text) OWNER TO postgre;

--
-- TOC entry 591 (class 1255 OID 16723)
-- Dependencies: 6 1225
-- Name: watchdepid(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION watchdepid() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    declare 
       c int;
    BEGIN
       select into c reserved from dep where upper(desc_) = upper(New.desc_);
       
       if not c isnull then  
	       if  c = 1 then
	            RAISE EXCEPTION ' THIS IS A RESERVED ID NUMBER, ALTERATION IS PROHIBITED';
	       end if; 
       end if;
    RETURN NEW;  
  END;
$$;


ALTER FUNCTION public.watchdepid() OWNER TO postgres;

--
-- TOC entry 592 (class 1255 OID 16724)
-- Dependencies: 1225 6
-- Name: watchins(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION watchins() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  declare
  	t int;
  	m int8; 
  begin
    select into t count(description) from ccmode where description = new.description;
    if t > 1 then
       select into m max(ccmodeid) from ccmode where description = new.description;
       delete from ccmode where ccmodeid = m;
    end if;
    return new;
  end;
$$;


ALTER FUNCTION public.watchins() OWNER TO postgres;

--
-- TOC entry 593 (class 1255 OID 16725)
-- Dependencies: 6 1225
-- Name: watchnone(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION watchnone() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
     
     if upper(new.courseid) = 'NONE' then
       RAISE EXCEPTION 'RESERVED FIELD, MODIFICATION NOT ALLOWED.';
     end if; 
    
    return NEW;
END;
$$;


ALTER FUNCTION public.watchnone() OWNER TO postgres;

--
-- TOC entry 568 (class 1255 OID 16726)
-- Dependencies: 6 1225
-- Name: watchone(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION watchone() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
   id  int8;
  id1 int8;
BEGIN
     select into id ccmodeid  from ccmode where description = 'Graduation Fee';
     
       select into id1 ccmodeid  from ccmode where description = 'Test Paper Fee';
     
     if new.ccmodeid = 1 or new.ccmodeid = id or new.ccmodeid = id1 then
       RAISE EXCEPTION 'RESERVED FIELD, MODIFICATION NOT ALLOWED.';
     end if; 
  
  return NEW;
END;
$$;


ALTER FUNCTION public.watchone() OWNER TO postgres;

--
-- TOC entry 569 (class 1255 OID 16727)
-- Dependencies: 6 1225
-- Name: web_logger(text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION web_logger(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
 declare
    ip_ alias for $1;
    uname alias for $2;
 begin
    insert into webuselog(time_, ipaddress,usename) values (now(), ip_, uname);
    return 'OK';
 end;
$_$;


ALTER FUNCTION public.web_logger(text, text) OWNER TO postgre;

--
-- TOC entry 570 (class 1255 OID 16728)
-- Dependencies: 1225 6
-- Name: webable(text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION webable(text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
 declare
   usename alias for $1;
   qres text;
   res text;
 begin
   select into qres d from verify_use where a = usename;
   
   if (qres = 'b326b5062b2f0e69046810717534cb09') then
      res = 'OK';
   else
      res = 'NOK';
    end if;
  
   return res;   
 end;
$_$;


ALTER FUNCTION public.webable(text) OWNER TO postgre;

--
-- TOC entry 571 (class 1255 OID 16729)
-- Dependencies: 6
-- Name: withbalance(bigint); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION withbalance(bigint, OUT text, OUT text, OUT numeric) RETURNS SETOF record
    LANGUAGE sql
    AS $$
select personnumid, getpersonfullname2(personnumid) as name_,round((payable-amountpaid)::numeric,2) as balance from acctsum where round((payable-amountpaid)::numeric,2) > 0.00 and semid = getcurrsem() order by name_ asc;
$$;


ALTER FUNCTION public.withbalance(bigint, OUT text, OUT text, OUT numeric) OWNER TO postgre;

--
-- TOC entry 572 (class 1255 OID 16730)
-- Dependencies: 6 1225
-- Name: withcomp(text, text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION withcomp(text, text, bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
     id alias for $1;
     offid alias for $2;
     smid alias for $3;
     grd text;
  begin
     select into grd grade from inctab where personnumid = id and semid = smid and offeringid = offid;
     if grd isnull or grd = 'INC' then
        grd = '';
     end if;
     return grd;
  end;
$_$;


ALTER FUNCTION public.withcomp(text, text, bigint) OWNER TO postgres;

--
-- TOC entry 573 (class 1255 OID 16731)
-- Dependencies: 6 1225
-- Name: yearpart(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION yearpart(date) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
   d alias for $1;
   a text;
BEGIN
   a = extract(year from d)::text;
   return a;
END;
$_$;


ALTER FUNCTION public.yearpart(date) OWNER TO postgres;

--
-- TOC entry 574 (class 1255 OID 16732)
-- Dependencies: 6 1225
-- Name: yepnope(text, text); Type: FUNCTION; Schema: public; Owner: postgre
--

CREATE FUNCTION yepnope(text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
  declare
     user_ alias for $1;
     pword alias for $2;
     vuse record;
     res text;
  begin 
      res = '334c4a4c42fdb79d7ebc3e73b517e6f8';
      select into vuse * from verify_use where a = user_;
      if not vuse isnull then
           select into res a from u_credentials where a = vuse.b and b = pword and c = vuse.c;
           if res isnull then
                res = '334c4a4c42fdb79d7ebc3e73b517e6f8';
           end if;
      end if;
      return res;
  end;
$_$;


ALTER FUNCTION public.yepnope(text, text) OWNER TO postgre;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 161 (class 1259 OID 16733)
-- Dependencies: 6
-- Name: academicyearload; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE academicyearload (
    personnumid text,
    degreeid bigint,
    year_ integer,
    offeringid text,
    semid bigint,
    grade text,
    comment_ text,
    labid bigint,
    labdesc text,
    coursedesc text,
    subject text,
    stuyear integer
);


ALTER TABLE public.academicyearload OWNER TO postgres;

--
-- TOC entry 162 (class 1259 OID 16739)
-- Dependencies: 2520 6
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE accounts (
    personnumid text,
    amount double precision,
    mult double precision,
    semid bigint,
    receiptnum text,
    date_ date,
    chargenameid bigint,
    cashier_name text DEFAULT 'none'::text
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 163 (class 1259 OID 16746)
-- Dependencies: 6
-- Name: acctsum; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE acctsum (
    personnumid text NOT NULL,
    semid bigint NOT NULL,
    payable double precision,
    amountpaid double precision
);


ALTER TABLE public.acctsum OWNER TO postgre;

--
-- TOC entry 164 (class 1259 OID 16752)
-- Dependencies: 2521 6
-- Name: addsubjectcharge; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE addsubjectcharge (
    subjectid text NOT NULL,
    semid bigint NOT NULL,
    rate double precision,
    level_ text DEFAULT 'Undergrad'::text
);


ALTER TABLE public.addsubjectcharge OWNER TO postgres;

--
-- TOC entry 165 (class 1259 OID 16759)
-- Dependencies: 2522 6
-- Name: person; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE person (
    personid text NOT NULL,
    lname text,
    fname text,
    mi text,
    ptypeid bigint NOT NULL,
    degreeid bigint,
    year_ integer,
    status text,
    gender text,
    scholarship text DEFAULT 'paying'::text
);


ALTER TABLE public.person OWNER TO postgres;

--
-- TOC entry 166 (class 1259 OID 16766)
-- Dependencies: 2846 6
-- Name: admin; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW admin AS
    SELECT person.personid, person.lname, ((person.fname || ' '::text) || person.mi) AS name_, mydegree(person.degreeid) AS dgr, person.degreeid FROM person WHERE (person.ptypeid = 4);


ALTER TABLE public.admin OWNER TO postgres;

--
-- TOC entry 167 (class 1259 OID 16770)
-- Dependencies: 6
-- Name: allowedusers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE allowedusers (
    personid text NOT NULL,
    ptypeid bigint NOT NULL
);


ALTER TABLE public.allowedusers OWNER TO postgres;

--
-- TOC entry 168 (class 1259 OID 16776)
-- Dependencies: 6
-- Name: author; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE author (
    authnum text NOT NULL,
    lname text,
    fname text,
    mi text,
    cuttersid text
);


ALTER TABLE public.author OWNER TO postgres;

--
-- TOC entry 169 (class 1259 OID 16782)
-- Dependencies: 6
-- Name: ay; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE ay (
    ayid bigint NOT NULL,
    year_ text
);


ALTER TABLE public.ay OWNER TO postgres;

--
-- TOC entry 170 (class 1259 OID 16788)
-- Dependencies: 169 6
-- Name: ay_ayid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE ay_ayid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ay_ayid_seq OWNER TO postgres;

--
-- TOC entry 2886 (class 0 OID 0)
-- Dependencies: 170
-- Name: ay_ayid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE ay_ayid_seq OWNED BY ay.ayid;


--
-- TOC entry 171 (class 1259 OID 16790)
-- Dependencies: 2524 2525 2526 2527 6
-- Name: offering; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE offering (
    offeringid text NOT NULL,
    semid bigint NOT NULL,
    subjectid text,
    time_sched text,
    roomid text,
    depid bigint,
    daysched text,
    lim integer,
    section_code text,
    degreeid bigint,
    year_ integer,
    locked integer DEFAULT 0,
    time_sched2 text DEFAULT 'none'::text,
    daysched2 text DEFAULT 'none'::text,
    roomid2 text DEFAULT 'none'::text
);


ALTER TABLE public.offering OWNER TO postgres;

--
-- TOC entry 172 (class 1259 OID 16800)
-- Dependencies: 2847 6
-- Name: block_schedules; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW block_schedules AS
    SELECT offering.offeringid, getsubjnumber(getofferingsubj(offering.offeringid, offering.semid)) AS getsubjnumber, offering.time_sched, offering.roomid, offering.daysched, offering.semid, getdegree(offering.degreeid) AS getdegree, offering.year_, offering.section_code FROM offering WHERE (offering.section_code <> 'X'::text);


ALTER TABLE public.block_schedules OWNER TO postgres;

--
-- TOC entry 173 (class 1259 OID 16804)
-- Dependencies: 6
-- Name: classnumpub; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE classnumpub (
    classnumpubid bigint NOT NULL,
    accessionnum bigint,
    pubtypeid bigint,
    classnum text
);


ALTER TABLE public.classnumpub OWNER TO postgres;

--
-- TOC entry 174 (class 1259 OID 16810)
-- Dependencies: 2848 6
-- Name: bnumrel; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW bnumrel AS
    SELECT getbookstatidnum_(classnumpub.accessionnum, classnumpub.pubtypeid) AS bookstatid, classnumpub.pubtypeid, classnumpub.accessionnum, getpubtype_(classnumpub.pubtypeid) AS type, getbooktitle(classnumpub.accessionnum, classnumpub.pubtypeid) AS title, getcopyrightyear(classnumpub.accessionnum, classnumpub.pubtypeid) AS copyrightyear, classnumpub.classnum FROM classnumpub;


ALTER TABLE public.bnumrel OWNER TO postgres;

--
-- TOC entry 175 (class 1259 OID 16814)
-- Dependencies: 6
-- Name: bookauth; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE bookauth (
    accessionnum bigint,
    pubtypeid bigint,
    authnum text
);


ALTER TABLE public.bookauth OWNER TO postgres;

--
-- TOC entry 176 (class 1259 OID 16820)
-- Dependencies: 6
-- Name: bookstat; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE bookstat (
    bookstatid bigint NOT NULL,
    statusdesc text
);


ALTER TABLE public.bookstat OWNER TO postgres;

--
-- TOC entry 177 (class 1259 OID 16826)
-- Dependencies: 6 176
-- Name: bookstat_bookstatid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE bookstat_bookstatid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookstat_bookstatid_seq OWNER TO postgres;

--
-- TOC entry 2893 (class 0 OID 0)
-- Dependencies: 177
-- Name: bookstat_bookstatid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE bookstat_bookstatid_seq OWNED BY bookstat.bookstatid;


--
-- TOC entry 178 (class 1259 OID 16828)
-- Dependencies: 6
-- Name: borrow; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE borrow (
    personid text,
    ptypeid bigint,
    accessionnum bigint,
    pubtypeid bigint,
    semid bigint,
    dateborrowed date,
    duedate date,
    returndate date
);


ALTER TABLE public.borrow OWNER TO postgres;

--
-- TOC entry 179 (class 1259 OID 16834)
-- Dependencies: 6
-- Name: building; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE building (
    buildingid bigint NOT NULL,
    name_ text,
    address_ text
);


ALTER TABLE public.building OWNER TO postgres;

--
-- TOC entry 180 (class 1259 OID 16840)
-- Dependencies: 6 179
-- Name: building_buildingid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE building_buildingid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.building_buildingid_seq OWNER TO postgres;

--
-- TOC entry 2897 (class 0 OID 0)
-- Dependencies: 180
-- Name: building_buildingid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE building_buildingid_seq OWNED BY building.buildingid;


--
-- TOC entry 181 (class 1259 OID 16842)
-- Dependencies: 6
-- Name: cafesettings; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE cafesettings (
    strict_ integer,
    timelimit bigint
);


ALTER TABLE public.cafesettings OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 16845)
-- Dependencies: 6
-- Name: cafetime; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE cafetime (
    personid text NOT NULL,
    ptypeid bigint NOT NULL,
    semid bigint NOT NULL,
    timeleft bigint,
    isdefault integer
);


ALTER TABLE public.cafetime OWNER TO postgres;

--
-- TOC entry 183 (class 1259 OID 16851)
-- Dependencies: 2531 2532 6
-- Name: ccmode; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE ccmode (
    ccmodeid bigint NOT NULL,
    description text,
    ismisc integer DEFAULT 0,
    displayable integer DEFAULT 1
);


ALTER TABLE public.ccmode OWNER TO postgres;

--
-- TOC entry 184 (class 1259 OID 16859)
-- Dependencies: 6 183
-- Name: ccmode_ccmodeid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE ccmode_ccmodeid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ccmode_ccmodeid_seq OWNER TO postgres;

--
-- TOC entry 2901 (class 0 OID 0)
-- Dependencies: 184
-- Name: ccmode_ccmodeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE ccmode_ccmodeid_seq OWNED BY ccmode.ccmodeid;


--
-- TOC entry 185 (class 1259 OID 16861)
-- Dependencies: 6
-- Name: charges; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE charges (
    chargesid bigint NOT NULL,
    semid bigint
);


ALTER TABLE public.charges OWNER TO postgres;

--
-- TOC entry 186 (class 1259 OID 16864)
-- Dependencies: 185 6
-- Name: charges_chargesid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE charges_chargesid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.charges_chargesid_seq OWNER TO postgres;

--
-- TOC entry 2903 (class 0 OID 0)
-- Dependencies: 186
-- Name: charges_chargesid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE charges_chargesid_seq OWNED BY charges.chargesid;


--
-- TOC entry 187 (class 1259 OID 16866)
-- Dependencies: 2535 6
-- Name: chargesdetails; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE chargesdetails (
    semid bigint NOT NULL,
    ccmodeid bigint NOT NULL,
    rate double precision,
    mode integer,
    level_ text DEFAULT 'Undergrad'::text NOT NULL
);


ALTER TABLE public.chargesdetails OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 16873)
-- Dependencies: 6
-- Name: class_; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE class_ (
    classnum text NOT NULL,
    subjclass text
);


ALTER TABLE public.class_ OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 16879)
-- Dependencies: 2849 6
-- Name: class_list; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW class_list AS
    SELECT academicyearload.offeringid, academicyearload.personnumid, getpersonfullname2(academicyearload.personnumid) AS name, getpersondegree(academicyearload.personnumid) AS degree, academicyearload.year_ AS year_level, academicyearload.grade, academicyearload.comment_, academicyearload.semid FROM academicyearload WHERE (getpersonnumtype(academicyearload.personnumid) = 1);


ALTER TABLE public.class_list OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 16883)
-- Dependencies: 6 173
-- Name: classnumpub_classnumpubid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE classnumpub_classnumpubid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classnumpub_classnumpubid_seq OWNER TO postgres;

--
-- TOC entry 2907 (class 0 OID 0)
-- Dependencies: 190
-- Name: classnumpub_classnumpubid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE classnumpub_classnumpubid_seq OWNED BY classnumpub.classnumpubid;


--
-- TOC entry 191 (class 1259 OID 16885)
-- Dependencies: 2850 6
-- Name: countpersons; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW countpersons AS
    SELECT person.personid, count(person.personid) AS d FROM person GROUP BY person.personid ORDER BY person.personid;


ALTER TABLE public.countpersons OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 16889)
-- Dependencies: 6
-- Name: currsem; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE currsem (
    currsemid bigint
);


ALTER TABLE public.currsem OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 16892)
-- Dependencies: 2536 2537 6
-- Name: cwhitelist; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE cwhitelist (
    personnumid text,
    semid bigint,
    isallowed integer DEFAULT 1,
    description text,
    period text DEFAULT 'Finals'::text,
    authorizer text,
    stamp timestamp without time zone
);


ALTER TABLE public.cwhitelist OWNER TO postgre;

--
-- TOC entry 194 (class 1259 OID 16900)
-- Dependencies: 2538 6
-- Name: degree; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE degree (
    degreeid bigint NOT NULL,
    desc_ text,
    abbr text,
    depid bigint,
    level_ text DEFAULT 'Undergrad'::text
);


ALTER TABLE public.degree OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 16907)
-- Dependencies: 6 194
-- Name: degree_degreeid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE degree_degreeid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.degree_degreeid_seq OWNER TO postgres;

--
-- TOC entry 2912 (class 0 OID 0)
-- Dependencies: 195
-- Name: degree_degreeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE degree_degreeid_seq OWNED BY degree.degreeid;


--
-- TOC entry 196 (class 1259 OID 16909)
-- Dependencies: 2540 6
-- Name: degreespecialcharge; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE degreespecialcharge (
    degreeid bigint NOT NULL,
    semid bigint NOT NULL,
    chargemode text,
    rate double precision,
    year_ integer NOT NULL,
    level_ text DEFAULT 'Undergrad'::text
);


ALTER TABLE public.degreespecialcharge OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16916)
-- Dependencies: 6
-- Name: dep; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE dep (
    depid bigint NOT NULL,
    desc_ text,
    reserved integer,
    displayable integer
);


ALTER TABLE public.dep OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 16922)
-- Dependencies: 6 197
-- Name: dep_depid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE dep_depid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dep_depid_seq OWNER TO postgres;

--
-- TOC entry 2916 (class 0 OID 0)
-- Dependencies: 198
-- Name: dep_depid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE dep_depid_seq OWNED BY dep.depid;


--
-- TOC entry 199 (class 1259 OID 16924)
-- Dependencies: 2851 6
-- Name: distinct_ids_enrolled; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW distinct_ids_enrolled AS
    SELECT DISTINCT academicyearload.personnumid, academicyearload.coursedesc, academicyearload.semid, academicyearload.stuyear FROM academicyearload;


ALTER TABLE public.distinct_ids_enrolled OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16928)
-- Dependencies: 2852 6
-- Name: distinctloads; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW distinctloads AS
    SELECT DISTINCT academicyearload.offeringid, academicyearload.semid, academicyearload.personnumid, academicyearload.year_, academicyearload.grade, academicyearload.comment_ FROM academicyearload ORDER BY academicyearload.semid, academicyearload.offeringid, academicyearload.personnumid, academicyearload.year_, academicyearload.grade, academicyearload.comment_;


ALTER TABLE public.distinctloads OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16932)
-- Dependencies: 2853 6
-- Name: double_pers; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW double_pers AS
    SELECT formalize_(person.personid) AS p, count(formalize_(person.personid)) AS q FROM person GROUP BY person.personid;


ALTER TABLE public.double_pers OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16936)
-- Dependencies: 6
-- Name: room; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE room (
    roomid text NOT NULL,
    depid bigint NOT NULL,
    islec integer
);


ALTER TABLE public.room OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16942)
-- Dependencies: 2854 6
-- Name: encoded_room; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW encoded_room AS
    SELECT room.roomid, getdeptdesc(room.depid) AS dept_name, detlablec(room.islec) AS islect FROM room ORDER BY room.roomid;


ALTER TABLE public.encoded_room OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16946)
-- Dependencies: 2542 6
-- Name: subject; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE subject (
    subjectid text NOT NULL,
    subjnumber text,
    description text,
    islec integer,
    code text,
    depid bigint,
    units_credit double precision,
    mult double precision DEFAULT 1.0
);


ALTER TABLE public.subject OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16953)
-- Dependencies: 2855 6
-- Name: encoded_subject; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW encoded_subject AS
    SELECT subject.subjectid, subject.subjnumber, subject.description, subject.units_credit, subject.islec, subject.code, getdeptdesc(subject.depid) AS department FROM subject;


ALTER TABLE public.encoded_subject OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16957)
-- Dependencies: 6
-- Name: ptype; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE ptype (
    ptypeid bigint NOT NULL,
    meaning text,
    idcount bigint
);


ALTER TABLE public.ptype OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16963)
-- Dependencies: 2856 6
-- Name: enctype; Type: VIEW; Schema: public; Owner: postgre
--

CREATE VIEW enctype AS
    SELECT md5((ptype.ptypeid)::text) AS a, md5(ptype.meaning) AS b, ptype.meaning AS c FROM ptype;


ALTER TABLE public.enctype OWNER TO postgre;

--
-- TOC entry 208 (class 1259 OID 16967)
-- Dependencies: 2857 6
-- Name: enrolledstuds; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW enrolledstuds AS
    SELECT DISTINCT academicyearload.personnumid AS id, getpersonfullname2(academicyearload.personnumid) AS fn, getpersondegree(academicyearload.personnumid) AS d, getpersonyear(academicyearload.personnumid) AS y, academicyearload.semid FROM academicyearload ORDER BY academicyearload.semid, getpersonfullname2(academicyearload.personnumid), academicyearload.personnumid, getpersondegree(academicyearload.personnumid), getpersonyear(academicyearload.personnumid);


ALTER TABLE public.enrolledstuds OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16971)
-- Dependencies: 2544 6
-- Name: errorcorrect; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE errorcorrect (
    userid text NOT NULL,
    d8_ date NOT NULL,
    count_ integer DEFAULT 1
);


ALTER TABLE public.errorcorrect OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16978)
-- Dependencies: 2858 6
-- Name: es_cashiers; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW es_cashiers AS
    SELECT DISTINCT accounts.cashier_name FROM accounts WHERE ((accounts.cashier_name <> 'none'::text) AND (accounts.cashier_name <> 'postgre'::text)) ORDER BY accounts.cashier_name;


ALTER TABLE public.es_cashiers OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16982)
-- Dependencies: 6
-- Name: examperiods; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE examperiods (
    semester text NOT NULL,
    period text NOT NULL,
    status boolean
);


ALTER TABLE public.examperiods OWNER TO postgre;

--
-- TOC entry 212 (class 1259 OID 16988)
-- Dependencies: 6
-- Name: examscheds; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE examscheds (
    semester text NOT NULL
);


ALTER TABLE public.examscheds OWNER TO postgre;

--
-- TOC entry 213 (class 1259 OID 16994)
-- Dependencies: 2545 6
-- Name: examschedsdetails; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE examschedsdetails (
    semid bigint NOT NULL,
    semester text NOT NULL,
    period text NOT NULL,
    rate double precision,
    stamp timestamp without time zone,
    active boolean DEFAULT false,
    level_ text NOT NULL
);


ALTER TABLE public.examschedsdetails OWNER TO postgre;

--
-- TOC entry 214 (class 1259 OID 17001)
-- Dependencies: 2859 6
-- Name: faculty; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW faculty AS
    SELECT person.personid, person.lname, ((person.fname || ' '::text) || person.mi) AS name_, mydegree(person.degreeid) AS dgr, person.degreeid FROM person WHERE (person.ptypeid = 2);


ALTER TABLE public.faculty OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 17005)
-- Dependencies: 6
-- Name: income; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE income (
    receiptnum text NOT NULL,
    semid bigint NOT NULL,
    customername text,
    desc_ text,
    amount double precision,
    date_ date
);


ALTER TABLE public.income OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 17011)
-- Dependencies: 2860 6
-- Name: income_; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW income_ AS
    SELECT getccmodename(accounts.chargenameid) AS cname, accounts.amount, accounts.date_, accounts.cashier_name, accounts.semid AS semester, accounts.personnumid AS studentid FROM accounts WHERE (((accounts.mult = ((-1))::double precision) OR (accounts.mult = (0)::double precision)) AND (accounts.chargenameid IN (SELECT ccmode.ccmodeid FROM ccmode WHERE ((ccmode.displayable = 1) AND (ccmode.ismisc = 0)))));


ALTER TABLE public.income_ OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17015)
-- Dependencies: 6
-- Name: inctab; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE inctab (
    personnumid text NOT NULL,
    semid bigint NOT NULL,
    offeringid text NOT NULL,
    grade text
);


ALTER TABLE public.inctab OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 17021)
-- Dependencies: 2546 6
-- Name: labcharge; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE labcharge (
    labtypeid bigint NOT NULL,
    semid bigint NOT NULL,
    rate double precision,
    level_ text DEFAULT 'Undergrad'::text NOT NULL
);


ALTER TABLE public.labcharge OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17028)
-- Dependencies: 6
-- Name: labtype; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE labtype (
    labtypeid bigint NOT NULL,
    desc_ text
);


ALTER TABLE public.labtype OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17034)
-- Dependencies: 219 6
-- Name: labtype_labtypeid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE labtype_labtypeid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.labtype_labtypeid_seq OWNER TO postgres;

--
-- TOC entry 2937 (class 0 OID 0)
-- Dependencies: 220
-- Name: labtype_labtypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE labtype_labtypeid_seq OWNED BY labtype.labtypeid;


--
-- TOC entry 221 (class 1259 OID 17036)
-- Dependencies: 6
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE logs (
    users_id text,
    date_ date,
    activity text
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17042)
-- Dependencies: 6
-- Name: logsinet; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE logsinet (
    users_id text,
    timestamp_ timestamp without time zone,
    activity text,
    semid bigint
);


ALTER TABLE public.logsinet OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17048)
-- Dependencies: 2548 6
-- Name: receiptstubs; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE receiptstubs (
    cashier_name text NOT NULL,
    controller_name text NOT NULL,
    from_ text NOT NULL,
    to_ text,
    date_controlled date NOT NULL,
    rcounter_ text,
    stubnumber text DEFAULT '000'::text
);


ALTER TABLE public.receiptstubs OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17055)
-- Dependencies: 2861 6
-- Name: manage_receipts; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW manage_receipts AS
    SELECT receiptstubs.cashier_name AS cashier, receiptstubs.controller_name AS controller, receiptstubs.from_ AS series_start, receiptstubs.to_ AS series_end, receiptstubs.date_controlled AS mark_date, receiptstubs.rcounter_ AS available_number, receiptstubs.stubnumber FROM receiptstubs;


ALTER TABLE public.manage_receipts OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17059)
-- Dependencies: 2862 6
-- Name: miscellaneous; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW miscellaneous AS
    SELECT chargesdetails.semid AS semester, getccmodename(chargesdetails.ccmodeid) AS cname, chargesdetails.rate, chargesdetails.level_ FROM chargesdetails WHERE (chargesdetails.ccmodeid IN (SELECT ccmode.ccmodeid FROM ccmode WHERE (ccmode.ismisc = 1)));


ALTER TABLE public.miscellaneous OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17063)
-- Dependencies: 2863 6
-- Name: monitor_usage; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW monitor_usage AS
    SELECT count(logsinet.users_id) AS used, logsinet.users_id FROM logsinet WHERE (logsinet.activity ~~ 'OPA%'::text) GROUP BY logsinet.users_id ORDER BY count(logsinet.users_id) DESC;


ALTER TABLE public.monitor_usage OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17067)
-- Dependencies: 6
-- Name: officialload; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE officialload (
    personnumid text NOT NULL,
    semid bigint NOT NULL,
    conf boolean NOT NULL
);


ALTER TABLE public.officialload OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17073)
-- Dependencies: 6
-- Name: pass; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE pass (
    passpk text NOT NULL,
    key_ text
);


ALTER TABLE public.pass OWNER TO postgre;

--
-- TOC entry 229 (class 1259 OID 17079)
-- Dependencies: 6
-- Name: passwordrepo; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE passwordrepo (
    personid text NOT NULL,
    ptypeid bigint NOT NULL,
    pword text
);


ALTER TABLE public.passwordrepo OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17085)
-- Dependencies: 2549 6
-- Name: payment_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE payment_details (
    personnumid text,
    amount double precision,
    semid bigint,
    receiptnum text,
    date_ date,
    chargename text,
    cashier_name text DEFAULT 'none'::text
);


ALTER TABLE public.payment_details OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17092)
-- Dependencies: 6
-- Name: permitprint; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE permitprint (
    personnumid text NOT NULL,
    personname text,
    count_ integer,
    date_ timestamp without time zone,
    examperiod text NOT NULL,
    semid bigint NOT NULL,
    printedby text
);


ALTER TABLE public.permitprint OWNER TO postgre;

--
-- TOC entry 232 (class 1259 OID 17098)
-- Dependencies: 6
-- Name: person_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE person_details (
    personnumid text NOT NULL,
    age integer,
    birthday date,
    birthplace text,
    religion text,
    pg text,
    home_add text,
    occpg text,
    guardian text,
    addressg text,
    occg text,
    primary_school text,
    addressps text,
    yeargradps text,
    elem_school text,
    addresselems text,
    yeargradelems text,
    high_school text,
    addresshs text,
    yeargradhs text,
    school_last_attended text,
    addresssla text,
    yeargradsla text
);


ALTER TABLE public.person_details OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17104)
-- Dependencies: 6
-- Name: personcharges; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE personcharges (
    personnumid text NOT NULL,
    semid bigint NOT NULL
);


ALTER TABLE public.personcharges OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 17110)
-- Dependencies: 6
-- Name: personload; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE personload (
    personnumid text,
    offeringid text,
    semid bigint
);


ALTER TABLE public.personload OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17116)
-- Dependencies: 2550 6
-- Name: personnum; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE personnum (
    personnumid text NOT NULL,
    personid text,
    ptypeid bigint,
    webled boolean DEFAULT false
);


ALTER TABLE public.personnum OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17123)
-- Dependencies: 6
-- Name: previous_school_units; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE previous_school_units (
    personnumid text NOT NULL,
    subjectid text NOT NULL,
    school_attendedid bigint NOT NULL,
    grade text,
    ayear text NOT NULL,
    semdesc text NOT NULL,
    degreename text,
    units double precision,
    subj_desc text,
    equiv_subj text
);


ALTER TABLE public.previous_school_units OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17129)
-- Dependencies: 206 6
-- Name: ptype_ptypeid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE ptype_ptypeid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ptype_ptypeid_seq OWNER TO postgres;

--
-- TOC entry 2954 (class 0 OID 0)
-- Dependencies: 237
-- Name: ptype_ptypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE ptype_ptypeid_seq OWNED BY ptype.ptypeid;


--
-- TOC entry 238 (class 1259 OID 17131)
-- Dependencies: 6
-- Name: publication; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE publication (
    accessionnum bigint NOT NULL,
    pubtypeid bigint NOT NULL,
    datereceived date,
    classnum text,
    title text,
    edition text,
    volumes text,
    pages text,
    fundsrc text,
    costprice double precision,
    pubid bigint,
    copyrightyear integer,
    bookstatid bigint,
    buildingid bigint,
    isbn text
);


ALTER TABLE public.publication OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17137)
-- Dependencies: 6
-- Name: publisher; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE publisher (
    pubid bigint NOT NULL,
    pubname text,
    pubaddress text
);


ALTER TABLE public.publisher OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 17143)
-- Dependencies: 6 239
-- Name: publisher_pubid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE publisher_pubid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.publisher_pubid_seq OWNER TO postgres;

--
-- TOC entry 2957 (class 0 OID 0)
-- Dependencies: 240
-- Name: publisher_pubid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE publisher_pubid_seq OWNED BY publisher.pubid;


--
-- TOC entry 241 (class 1259 OID 17145)
-- Dependencies: 6
-- Name: pubtype; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE pubtype (
    pubtypeid bigint NOT NULL,
    type_ text
);


ALTER TABLE public.pubtype OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 17151)
-- Dependencies: 6 241
-- Name: pubtype_pubtypeid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE pubtype_pubtypeid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pubtype_pubtypeid_seq OWNER TO postgres;

--
-- TOC entry 2960 (class 0 OID 0)
-- Dependencies: 242
-- Name: pubtype_pubtypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE pubtype_pubtypeid_seq OWNED BY pubtype.pubtypeid;


--
-- TOC entry 243 (class 1259 OID 17153)
-- Dependencies: 6
-- Name: school_attended; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE school_attended (
    school_attendedid bigint NOT NULL,
    school_name text
);


ALTER TABLE public.school_attended OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 17159)
-- Dependencies: 6 243
-- Name: school_attended_school_attendedid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE school_attended_school_attendedid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.school_attended_school_attendedid_seq OWNER TO postgres;

--
-- TOC entry 2961 (class 0 OID 0)
-- Dependencies: 244
-- Name: school_attended_school_attendedid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE school_attended_school_attendedid_seq OWNED BY school_attended.school_attendedid;


--
-- TOC entry 245 (class 1259 OID 17161)
-- Dependencies: 2554 6
-- Name: sem; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sem (
    semid bigint NOT NULL,
    ayid bigint,
    semdesc text,
    islocked integer DEFAULT 1
);


ALTER TABLE public.sem OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 17168)
-- Dependencies: 245 6
-- Name: sem_semid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sem_semid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sem_semid_seq OWNER TO postgres;

--
-- TOC entry 2963 (class 0 OID 0)
-- Dependencies: 246
-- Name: sem_semid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sem_semid_seq OWNED BY sem.semid;


--
-- TOC entry 247 (class 1259 OID 17170)
-- Dependencies: 2864 6
-- Name: staff; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW staff AS
    SELECT person.personid, person.lname, ((person.fname || ' '::text) || person.mi) AS name_, mydegree(person.degreeid) AS dgr, person.degreeid FROM person WHERE (person.ptypeid = 3);


ALTER TABLE public.staff OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 17174)
-- Dependencies: 2865 6
-- Name: student; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW student AS
    SELECT person.personid, person.lname, ((person.fname || ' '::text) || person.mi) AS name_, mydegree(person.degreeid) AS dgr, person.status, person.year_ AS yr, person.degreeid FROM person WHERE (person.ptypeid = 1);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 17178)
-- Dependencies: 2866 6
-- Name: stugrades; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW stugrades AS
    SELECT academicyearload.personnumid AS id, academicyearload.semid, getsubjnumber(getofferingsubj(academicyearload.offeringid, academicyearload.semid)) AS subj, getsubdesc(getofferingsubj(academicyearload.offeringid, academicyearload.semid)) AS desc_, academicyearload.grade AS rate, getsubjunits(getofferingsubj(academicyearload.offeringid, academicyearload.semid)) AS units FROM academicyearload ORDER BY academicyearload.semid, academicyearload.personnumid, getsubjnumber(getofferingsubj(academicyearload.offeringid, academicyearload.semid));


ALTER TABLE public.stugrades OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 17182)
-- Dependencies: 6
-- Name: subclass; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE subclass (
    subclassid bigint NOT NULL,
    description text,
    classnum text
);


ALTER TABLE public.subclass OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 17188)
-- Dependencies: 6 250
-- Name: subclass_subclassid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE subclass_subclassid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subclass_subclassid_seq OWNER TO postgres;

--
-- TOC entry 2968 (class 0 OID 0)
-- Dependencies: 251
-- Name: subclass_subclassid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE subclass_subclassid_seq OWNED BY subclass.subclassid;


--
-- TOC entry 252 (class 1259 OID 17190)
-- Dependencies: 6
-- Name: subjlab; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE subjlab (
    subjectid text NOT NULL,
    labtypeid bigint NOT NULL
);


ALTER TABLE public.subjlab OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 17196)
-- Dependencies: 6
-- Name: transaction_lock; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE transaction_lock (
    cashier_name text NOT NULL,
    date_ date NOT NULL,
    lockstatus boolean
);


ALTER TABLE public.transaction_lock OWNER TO postgre;

--
-- TOC entry 254 (class 1259 OID 17202)
-- Dependencies: 2867 6
-- Name: u_credentials; Type: VIEW; Schema: public; Owner: postgre
--

CREATE VIEW u_credentials AS
    SELECT md5(passwordrepo.personid) AS a, md5(passwordrepo.pword) AS b, md5((passwordrepo.ptypeid)::text) AS c FROM passwordrepo;


ALTER TABLE public.u_credentials OWNER TO postgre;

--
-- TOC entry 255 (class 1259 OID 17206)
-- Dependencies: 6
-- Name: usebuff; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE usebuff (
    personid text,
    ptypeid bigint,
    time_ timestamp without time zone
);


ALTER TABLE public.usebuff OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 17212)
-- Dependencies: 2868 6
-- Name: verify_use; Type: VIEW; Schema: public; Owner: postgre
--

CREATE VIEW verify_use AS
    SELECT md5(personnum.personnumid) AS a, md5(personnum.personid) AS b, md5((personnum.ptypeid)::text) AS c, md5((personnum.webled)::text) AS d FROM personnum;


ALTER TABLE public.verify_use OWNER TO postgre;

--
-- TOC entry 257 (class 1259 OID 17216)
-- Dependencies: 6
-- Name: webuselog; Type: TABLE; Schema: public; Owner: postgre; Tablespace: 
--

CREATE TABLE webuselog (
    time_ timestamp without time zone NOT NULL,
    ipaddress text,
    usename text NOT NULL
);


ALTER TABLE public.webuselog OWNER TO postgre;

--
-- TOC entry 2523 (class 2604 OID 17222)
-- Dependencies: 170 169
-- Name: ayid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ay ALTER COLUMN ayid SET DEFAULT nextval('ay_ayid_seq'::regclass);


--
-- TOC entry 2529 (class 2604 OID 17223)
-- Dependencies: 177 176
-- Name: bookstatid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY bookstat ALTER COLUMN bookstatid SET DEFAULT nextval('bookstat_bookstatid_seq'::regclass);


--
-- TOC entry 2530 (class 2604 OID 17224)
-- Dependencies: 180 179
-- Name: buildingid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY building ALTER COLUMN buildingid SET DEFAULT nextval('building_buildingid_seq'::regclass);


--
-- TOC entry 2533 (class 2604 OID 17225)
-- Dependencies: 184 183
-- Name: ccmodeid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ccmode ALTER COLUMN ccmodeid SET DEFAULT nextval('ccmode_ccmodeid_seq'::regclass);


--
-- TOC entry 2534 (class 2604 OID 17226)
-- Dependencies: 186 185
-- Name: chargesid; Type: DEFAULT; Schema: pu