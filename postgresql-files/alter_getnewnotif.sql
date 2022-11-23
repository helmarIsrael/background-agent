-- FUNCTION: public.getnewnotifcount(boolean, text[], text)

-- DROP FUNCTION IF EXISTS public.getnewnotifcount(boolean, text[], text);

CREATE OR REPLACE FUNCTION public.getnewnotifcount(
	par_status boolean,
	par_channels text[],
	par_initiatorid text)
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


      return notif_count::text;
   end;
$BODY$;

ALTER FUNCTION public.getnewnotifcount(boolean, text[], text)
    OWNER TO admin;
