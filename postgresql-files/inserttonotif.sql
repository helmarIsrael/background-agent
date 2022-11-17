-- FUNCTION: public.insert2notification(text, text, text, text, text, text, text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.insert2notification(text, text, text, text, text, text, text, text, text, text, text);

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
	par_poster text)
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
								  poster
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
				par_poster
			);

			return (select json_build_object('status', 'OK'));
	END;
	

$BODY$;

ALTER FUNCTION public.insert2notification(text, text, text, text, text, text, text, text, text, text, text)
    OWNER TO admin;
