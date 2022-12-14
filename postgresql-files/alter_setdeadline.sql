-- FUNCTION: public.setdeadline(text, text, text, text, text, text, text, date)

-- DROP FUNCTION IF EXISTS public.setdeadline(text, text, text, text, text, text, text, date);

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
    loc_v = post_timeline2(par_username,
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
				'tl_details', loc_v
                )
         );
end;

$BODY$;

ALTER FUNCTION public.setdeadline2(text, text, text, text, text, text, text, date)
    OWNER TO postgre;
