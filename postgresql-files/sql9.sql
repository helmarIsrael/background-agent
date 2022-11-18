-- select * from notifications where initiatorid != 'F2018CARDOMAGTANGGOL-1' 
-- and channel = ANY(ARRAY['a934fae687b6d918841b', 'myeskwela-testchan']) order by notif_ts DESC;

SELECT * FROM getnotification(ARRAY['a934fae687b6d918841b', 'myeskwela-testchan'], 'F2018CARDOMAGTANGGOL-1');