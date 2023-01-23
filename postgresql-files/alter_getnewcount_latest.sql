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
			and action_initiator != par_initiatorid and user_type != 'faculty'
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
		elsif par_usertype = 'admin' then
			for notif in select * from notifications where channel = ANY(par_channels) 
				and action_initiator != par_initiatorid
				and (user_type != 'faculty' or ((notif_type = 'comment' or  notif_type = 'reaction') and initiatorid = par_initiatorid or notif_type = 'BCast'))
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
