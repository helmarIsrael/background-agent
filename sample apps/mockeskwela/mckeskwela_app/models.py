from mckeskwela_app import mysql


class mckeskwla(object):
    def __init__(self, teacher_type=None, firstname=None, lastname=None,
                gender=None, username=None, password=None, 
                division=None, district=None, school=None,
                father_firstname=None, father_lastname=None, 
                mother_firstname=None, mother_lastname=None,
                student_unique=None, father_id=None, mother_id=None,
                teacher_id = None, user_id=None, parent_id=None
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
        self.parent_id = parent_id
        self.father_id = father_id
        self.mother_id = mother_id
        self.teacher_id = teacher_id

        self.user_id = user_id
    
    def addNewUser(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO user(user_id, username, password, user_type)
					VALUES ('%s', '%s', '%s', '%s')""" % (self.user_id, self.username, self.password, self.teacher_type)

        cursor.execute(sql)
        mysql.connection.commit()


    def addTeacher(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO teachers(teacher_id, teacher_type, firstname, lastname, gender, 
                                        division, district, school, user_id)
					VALUES ('%s','%s', '%s', '%s','%s','%s', '%s', '%s', '%s')""" % (self.teacher_id, self.teacher_type, self.firstname, self.lastname, self.gender, 
                                        self.division, self.district, self.school, self.user_id)

        cursor.execute(sql)
        mysql.connection.commit()

    
    def addStudent(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO students(unique_id, firstname, lastname, gender, 
                                        school, teacher_id, father_id, mother_id)
					VALUES ('%s', '%s', '%s','%s', '%s', '%s','%s', '%s')""" % (self.student_unique, self.firstname, self.lastname, self.gender, 
                                        self.school, self.teacher_id, self.father_id, self.mother_id)

        cursor.execute(sql)
        mysql.connection.commit()
    
    def addParent(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO parents(unique_id, child_id, teacher_id, firstname, lastname)
					VALUES ('%s', '%s', '%s','%s', '%s')""" % (self.parent_id, self.student_unique, self.teacher_id,
                                                                            self.firstname, self.lastname)

        cursor.execute(sql)
        mysql.connection.commit()

    

    def validateLogin(self):
        cursor = mysql.connection.cursor()
        sql = "SELECT * FROM user WHERE username = '{}'".format(self.username)

        cursor.execute(sql)
        display = cursor.fetchall()
        if display:
            for item in display:
                if item[2] != self.password:
                    return 2
                else:
                    return 0
        elif not display:
            return 1
        else:
            return 0

    def login(self):
        cursor = mysql.connection.cursor()

        sql = "SELECT * FROM user WHERE username = '{}' and password = '{}'".format(self.username, self.password)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display



    def get_user(self):
        cursor = mysql.connection.cursor()

        sql = "SELECT t.* FROM teachers as t LEFT JOIN user as u ON t.user_id = u.user_id WHERE u.user_id = '{}'".format(self.user_id)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display





    def get_student(self):
        cursor = mysql.connection.cursor()

        # sql = '''SELECT s.*, p.firstname, p.lastname FROM students as s 
        #         LEFT JOIN parents as p ON s.unique_id = p.child_id 
        #         WHERE s.teacher_id = {} AND p.teacher_id = {}'''.format(self.teacher_id)

        sql = "SELECT * from students WHERE teacher_id = '{}'".format(self.teacher_id)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display
