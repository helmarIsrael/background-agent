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
