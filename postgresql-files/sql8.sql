select * from person where fname = 'CARDO' and lastname = 'MAGTANGGOL';

SELECT * FROM getpersonnumidbyuser('cardo.magtanggol');

SELECT * FROM getpersonname('F2018CARDOMAGTANGGOL-1');

SELECT * FROM getpersonidbyusername('name.faker');

SELECT * FROM login_credentials('cardo.magtanggol');

select count(*) from notifications where is_new = True and channel in ('a934fae687b6d918841b', 'myeskwela-testchan');


select count(*) from getnewnotifcount(True, ('asd','asdas'))