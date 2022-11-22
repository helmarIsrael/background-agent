-- FUNCTION: public.notif_poppost(text, text, text)

-- DROP FUNCTION IF EXISTS public.notif_poppost(text, text, text);

CREATE OR REPLACE FUNCTION public.notif_poppost(
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
    begin
       	loc_count = 0;
          for timeline in select * from
             notif_getinterpretedpost(par_initiatorid, par_receiverid, par_ts) loop

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

ALTER FUNCTION public.notif_poppost(text, text, text)
    OWNER TO postgre;
