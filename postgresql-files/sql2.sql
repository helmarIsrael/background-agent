-- SELECT updatepassword('mamaeng.faker', '1');

-- SELECT getpersonidbyusername('papaeng.faker');

-- select * from getmykids('P2022CARDOMAGTANGGOL-29', 'students');

-- select * from personlevel WHERE studentid =''	' and semid = '20222023';


select * from person where personid IN
                      (
                        select personid from getclasslist(
                        'AERO', 5, 'XXX', '20222023')
                        
                        ) 

-- SELECT personid FROM getclasslist ('AERO', 5, 'XXX', '202222023')