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

    

    def validateLogin(self):
        cursor = mysql.connection.cursor()
        sql = "SELECT * FROM teachers WHERE username = '{}'".format(self.username)

        cursor.execute(sql)
        display = cursor.fetchall()
        if display:
            for item in display:
                if item[6] != self.password:
                    return 2
                else:
                    return 0
        elif not display:
            return 1
        else:
            return 0

    def login(self):
        cursor = mysql.connection.cursor()

        sql = "SELECT * FROM teachers WHERE username = '{}' and password = '{}'".format(self.username, self.password)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display