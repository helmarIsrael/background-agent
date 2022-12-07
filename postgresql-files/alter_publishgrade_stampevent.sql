-- FUNCTION: public.stampevent(text, text, text, text, integer, text, text)

-- DROP FUNCTION IF EXISTS public.stampevent(text, text, text, text, integer, text, text);

CREATE OR REPLACE FUNCTION public.stampevent(
	par_initiatorid text,
	par_receiverid text,
	par_tlmessage text,
	par_tltype text,
	par_publicity integer,
	par_semid text,
	par_schoolid text)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
    declare
    begin
      --this is a special case of timeline stamping
      --where the initiator is the teacher with username
      --and student is the receiver with lrn
	return (select
                json_build_object(
                                        'status', insert2timeline(
									   getpersonidbyusername(par_initiatorid),
									   getpersonidbyidnum(par_receiverid),
									   par_tlmessage,
									   par_tltype,
									   par_publicity,
									   now()::timestamp without time zone, par_semid, par_schoolid),
										'initiatorid', getpersonidbyusername(par_initiatorid),
										'studentid', getpersonidbyidnum(par_receiverid),
										'ts', now()::timestamp without time zone
                  )
         );
    END;
  
$BODY$;

ALTER FUNCTION public.stampevent(text, text, text, text, integer, text, text)
    OWNER TO admin;
