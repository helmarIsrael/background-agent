from studentapp import mysql
from studentapp.for_valid import current_id
class students(object):
    def __init__(self, id=None, id_number=None,
                        firstname=None, lastname=None, 
                        yearlvl=None, gender=None, 
                        course=None, filter=None, 
                        college=None, dept=None,
                        message_payload=None, timestamp=None,
                        msg_type=None, channel=None
                                              ):

        self.id = id

        self.id_number = id_number
        self.firstname = firstname
        self.lastname = lastname
        self.yearlvl = yearlvl
        self.gender = gender
        self.course = course

        self.filter = filter
        self.college = college
        self.dept = dept

        self.message_payload = message_payload
        self.timestamp = timestamp
        self.msg_type = msg_type
        self.channel = channel



    def showAll(self):
        cursor = mysql.connection.cursor()
        if self.college != 'None' and self.filter !='None':
            sql = """SELECT s.id_number, s.firstName, s.lastName, c.code, s.yearLevel, d.name, clg.code, clg.name FROM
                        (((students AS s LEFT JOIN courses AS c ON s.course_code = c.code)
                        LEFT JOIN departments as d ON c.deptNo = d.dept_id)
                        LEFT JOIN colleges AS clg ON c.college_code = clg.code)
                        WHERE clg.code = '{}'
                        ORDER BY '{}' """.format(self.college, self.filter)
        else:
            sql = """SELECT s.id_number, s.firstName, s.lastName, c.code, s.yearLevel, d.name, clg.code, clg.name FROM
                    (((students AS s LEFT JOIN courses AS c ON s.course_code = c.code)
                    LEFT JOIN departments as d ON c.deptNo = d.dept_id)
                    LEFT JOIN colleges AS clg ON c.college_code = clg.code)"""


        cursor.execute(sql)
        display = cursor.fetchall()
        return display

    def add(self):
        cursor = mysql.connection.cursor()

        sql = """INSERT INTO students(id_number, firstName, lastName, yearLevel, gender, course_code)
             VALUES ('%s','%s','%s',%d,'%s','%s')""" % (self.id_number, 
                                                        self.firstname, 
                                                        self.lastname, 
                                                        self.yearlvl, 
                                                        self.gender, 
                                                        self.course)

        cursor.execute(sql)
        mysql.connection.commit()


    def search(self):
        cursor = mysql.connection.cursor()
        sql = """SELECT s.id_number, s.firstName, s.lastName, c.code, s.yearLevel, d.name, clg.code, clg.name, c.name, s.gender FROM
                    (((students AS s LEFT JOIN courses AS c ON s.course_code = c.code)
                    LEFT JOIN departments as d ON c.deptNo = d.dept_id)
                    LEFT JOIN colleges AS clg ON c.college_code = clg.code ) WHERE s.id_number = '{}'""".format(self.id_number)

        cursor.execute(sql)

        display = cursor.fetchall()
        return display

    def update(self):
        cursor = mysql.connection.cursor()
        sql = """UPDATE students SET id_number = '%s', firstName = '%s', lastName = '%s', yearLevel = %d, gender = '%s', course_code = '%s'
                WHERE id_number = '%s'"""  % (self.id_number, 
                                        self.firstname, 
                                        self.lastname, 
                                        self.yearlvl, 
                                        self.gender, 
                                        self.course,
                                        self.id)

        cursor.execute(sql)
        mysql.connection.commit()


    def validation(self):
        cursor = mysql.connection.cursor()
        sql = "SELECT id_number FROM students WHERE id_number = '{}'".format(self.id_number)

        cursor.execute(sql)
        display = cursor.fetchall()
        for item in display:
            if item[0] == self.id_number:
                if item[0] not in current_id:
                    return True
           

    def delete(self):
        cursor = mysql.connection.cursor()
        sql = "DELETE FROM students WHERE id_number = '{}'".format(self.id_number)

        cursor.execute(sql)
        mysql.connection.commit()



   

    @classmethod
    def showCollege(cls):
        cursor = mysql.connection.cursor()

        sql = "SELECT * FROM colleges"

        cursor.execute(sql)
        display = cursor.fetchall()
        return display


    def showDept(self):
        cursor = mysql.connection.cursor()

        sql = """SELECT DISTINCT c.deptNo, d.name, d.college_code FROM courses as c 
                JOIN departments AS d  
                ON d.dept_id = c.deptNo AND c.college_code != 'SGS' AND d.college_code = '{}'""".format(self.college)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display

    def showCourse(self):
        cursor = mysql.connection.cursor()
        sql = """SELECT d.name, c.code,c.name, clg.name, clg.code FROM 
                ((departments AS d JOIN courses as c ON d.dept_id = c.deptNo AND d.name = '{}' )
                JOIN colleges as clg ON c.college_code = clg.code AND clg.code != 'SGS')""".format(self.dept)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display



    @classmethod
    def showSGSdept(cls):
        cursor = mysql.connection.cursor()

        sql ="""SELECT DISTINCT d.dept_id, d.name, c.college_code
            FROM courses as c, departments as d
            WHERE c.deptNo = d.dept_id AND c.college_code = 'SGS'"""

        cursor.execute(sql)
        display = cursor.fetchall()
        return display

    def showSGScourse(self):
        cursor = mysql.connection.cursor()

        sql ="""SELECT d.name, c.code, c.name, clg.name, clg.code FROM ((courses as c JOIN departments as d 
        ON c.deptNo = d.dept_id AND d.name = '{}')
        JOIN colleges as clg ON c.college_code = clg.code AND c.college_code = 'SGS')""".format(self.dept)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display


    #### NOTIFICATION ##########
    def store_notif(self):
        cursor = mysql.connection.cursor()
        # print(self.message_payload, self.timestamp, self.msg_type, self.channel)
        sql = """INSERT INTO notifications(student_id, message_payload, timestamp, notif_type, channel) 
            VALUES ('%s', '%s','%s','%s','%s')""" % (self.id, self.message_payload, self.timestamp,
                                                self.msg_type, self.channel)
        

        cursor.execute(sql)
        mysql.connection.commit()

    # show_notif INITIALLY, BUT WILL ADD OTHER FUNCTION THAT CAN SEGREGATE NEW AND OLD 
    # BASED ON THE MACHINE/LOCAL TIME '+' OR '-' THE NOTIFICATION TIMESTAMP   
    def show_notif(self): 
        cursor = mysql.connection.cursor()
        sql = """SELECT message_payload, FROM_UNIXTIME(timestamp) AS UNIX, is_read, notif_id, student_id, notif_type FROM notifications
                ORDER BY timestamp DESC"""
        cursor.execute(sql)
        display = cursor.fetchall()
        result = [list(i) for i in display]
        return result


    def count_unread(self):
        cursor = mysql.connection.cursor()
        sql = """SELECT COUNT(*) FROM notifications WHERE is_new = 1"""
        cursor.execute(sql)
        display = cursor.fetchall()
        return display

    def new_viewed(self):
        cursor = mysql.connection.cursor()
        sql = """UPDATE notifications SET is_new = 0"""

        cursor.execute(sql)
        mysql.connection.commit()   

    def delete_notif(self):
        cursor = mysql.connection.cursor()
        sql = """DELETE FROM notifications 
                WHERE student_id = '{}' AND notif_type != 'remove'""".format(self.id_number)

        cursor.execute(sql)
        mysql.connection.commit()

    def read_notif(self):
        cursor = mysql.connection.cursor()
        sql = """UPDATE notifications SET is_read = 1 WHERE notif_id = {}""".format(self.id)
       
        cursor.execute(sql)
        mysql.connection.commit()