
CREATE OR REPLACE FUNCTION public.getnotification(
	par_channels text[],
	par_initiatorid text)
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
	 notif_initiatorid text;
	 notif_receiverid text;
	 notif_read boolean;
	 notif_isnew boolean;
	 notif_count int;
	 
   begin
	 notif_count = 0;
     for notif in select * from
      		notifications where channel = ANY(par_channels) 
	  		and initiatorid != par_initiatorid order by notif_ts DESC
		loop
			notif_content = notif.notif;
			notif_initiatorid = notif.initiatorid;
			notif_receiverid = notif.receiverid;
			notif_tlts = notif.timeline_ts;
			notif_ts = notif.notif_ts;
			notif_read = notif.is_read;
			notif_isnew = notif.is_new;
			
			notif_array = 
				notif_array || 
				json_build_object (
					'body', notif_content,
					'initiatorid', notif_initiatorid,
					'receiverid', notif_receiverid,
					'timeline_timestamp', notif_tlts,
					'is_read', notif_read,
					'is_new', notif_isnew,
					'ts', notif_ts
				);
			notif_count = notif_count + 1;
		end loop;
			
		 return (SELECT
              json_build_object(
                'status', 'ok',
                'size', notif_count,
                'notifs', notif_array
              )
        );
			

      
	  
	  
   end;
$BODY$;

ALTER FUNCTION public.getnotification(text[], text)
    OWNER TO admin;
