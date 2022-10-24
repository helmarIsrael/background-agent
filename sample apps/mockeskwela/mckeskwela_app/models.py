from mckeskwela_app import mysql


class mckeskwla(object):
    def __init__(self, teacher_type=None, firstname=None, lastname=None,
                gender=None, username=None, password=None, 
                division=None, district=None, school=None):
    
        self.teacher_type = teacher_type
        self.firstname = firstname
        self.lastname = lastname
        self.gender = gender
        self.username = username
        self.password = password
        self.division = division
        self.district = district
        self.school = school

    def addNewUser(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO teachers(teacher_type, firstname, lastname, gender, 
                                        username, password, division, district, school)
					VALUES ('%s', '%s', '%s','%s', '%s', '%s','%s', '%s', '%s')""" % (self.teacher_type, self.firstname, self.lastname, self.gender, 
                                        self.username, self.password, self.division, self.district, self.school)

        cursor.execute(sql)
        mysql.connection.commit()