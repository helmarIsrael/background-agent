-- select * from person where fname = 'CARDO' and lastname = 'MAGTANGGOL';

-- SELECT * FROM getpersonnumidbyuser('cardo.magtanggol');

-- SELECT * FROM getpersonname('F2018CARDOMAGTANGGOL-1');

-- SELECT * FROM getpersonidbyusername('name.faker');

-- SELECT * FROM login_credentials('cardo.magtanggol');

-- select count(*) from notifications where is_new = True and channel in ('a934fae687b6d918841b', 'myeskwela-testchan');

-- SELECT COUNT(*) FROM notifications where is_new = True;
-- select * from getnewnotifcount(True, ARRAY['a934fae687b6d918841b', 'myeskwela-testchan']);

-- select * from getnewnotifcount(True, ARRAY ['a934fae687b6d918841b', 'myeskwela-testchan'], 'P2022CARDOMAGTANGGOL-29', 'parents', ARRAY ['S2022CARDOMAGTANGGOL-14', 'S2022CARDOMAGTANGGOL-15']);
-- select * from getnotification(ARRAY ['a934fae687b6d918841b', 'myeskwela-testchan'], 'P2022CARDOMAGTANGGOL-29', 'parents');


-- select * from notifications where receiverid = 'F2018CARDOMAGTANGGOL-1'
-- select * from notifications where channel = ANY(ARRAY['a934fae687b6d918841b', 'myeskwela-testchan']) ORDER BY notif_ts DESC;
-- SELECT * from getnotification(ARRAY ['a934fae687b6d918841b', 'myeskwela-testchan'], 'S2022NAMEFAKER-1')


select * from getnewnotifcount(True, ARRAY ['a934fae687b6d918841b', 'myeskwela-testchan'], 'P2022CARDOMAGTANGGOL-29', 'parents', ARRAY ['S2022CARDOMAGTANGGOL-14', 'S2022CARDOMAGTANGGOL-15']);


-- select * from notifications where channel = ANY(ARRAY ['a934fae687b6d918841b', 'myeskwela-testchan']) 
-- and action_initiator != 'P2022CARDOMAGTANGGOL-29' and (user_type = 'faculty' 
-- OR (action_initiator = ANY(ARRAY ['S2022CARDOMAGTANGGOL-14', 'S2022CARDOMAGTANGGOL-15']) or receiverid = ANY(ARRAY ['S2022CARDOMAGTANGGOL-14', 'S2022CARDOMAGTANGGOL-15'])))  
-- order by notif_ts DESC;