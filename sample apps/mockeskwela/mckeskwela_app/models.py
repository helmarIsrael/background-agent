from mckeskwela_app import mysql


class mckeskwla(object):
    def __init__(self, teacher_type=None, firstname=None, lastname=None,
                gender=None, username=None, password=None, 
                division=None, district=None, school=None,
                father_firstname=None, father_lastname=None, 
                mother_firstname=None, mother_lastname=None,
                student_unique=None, parent_unique=None,
                teacher_id = None
                ):
    
        self.teacher_type = teacher_type
        self.firstname = firstname
        self.lastname = lastname
        self.gender = gender
        self.username = username
        self.password = password
        self.division = division
        self.district = district
        self.school = school

        self.father_firstname = father_firstname
        self.father_lastname = father_lastname

        self.mother_firstname = mother_firstname
        self.mother_lastname  = mother_lastname

        self.student_unique = student_unique
        self.parent_unique = parent_unique
        self.teacher_id = teacher_id

    def addNewUser(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO teachers(teacher_type, firstname, lastname, gender, 
                                        username, password, division, district, school)
					VALUES ('%s', '%s', '%s','%s', '%s', '%s','%s', '%s', '%s')""" % (self.teacher_type, self.firstname, self.lastname, self.gender, 
                                        self.username, self.password, self.division, self.district, self.school)

        cursor.execute(sql)
        mysql.connection.commit()

    
    def addStudent(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO students(unique_id, firstname, lastname, gender, 
                                        school, teacher_id, parent_id)
					VALUES ('%s', '%s', '%s','%s', '%s', '%s','%s')""" % (self.student_unique, self.firstname, self.lastname, self.gender, 
                                        self.school, self.teacher_id, self.parent_unique)

        cursor.execute(sql)
        mysql.connection.commit()
    
    def addParent(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO parents(unique_id, child_id, teacher_id, firstname, lastname)
					VALUES ('%s', '%s', '%s','%s', '%s')""" % (self.parent_unique, self.student_unique, self.teacher_id, self.firstname, self.lastname)

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