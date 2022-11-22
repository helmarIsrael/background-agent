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
