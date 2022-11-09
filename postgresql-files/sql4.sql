-- insert into personschool (personnumid, schoolid, iscurrent, status_, semid) 
-- values ('S2022CARDOMAGTANGGOL-11', 'XXX', true, 'NEW', getcurrsem());

-- select insup2personlevel(
--  'elem',
--  5,
--  'S2022CARDOMAGTANGGOL-11',
--  'F2018CARDOMAGTANGGOL-1',
--  getcurrsem(),
--  'XXX',
--  'AERO');
 
 
select enrollstudent(
	'S2022CARDOMAGTANGGOL-11',
	'XXX',
	getcurrsem(),
	5,
	'AERO');