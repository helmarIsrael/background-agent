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
