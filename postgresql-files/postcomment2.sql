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
