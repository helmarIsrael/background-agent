from pickle import NONE
from mckeskwela_app import mysql


class mckeskwla(object):
    def __init__(self, teacher_type=None, firstname=None, lastname=None,
                gender=None, username=None, password=None, 
                division=None, district=None, school=None,
                father_firstname=None, father_lastname=None, 
                mother_firstname=None, mother_lastname=None,
                student_unique=None, father_id=None, mother_id=None,
                teacher_id = None, user_id=None, parent_id=None, user_type=None,
                post_id=None, post_title = None, post_content = None, post_timestamp = None,
                poster_name=None, comment=None, comment_id=None, comment_timestamp = None,
                like_id = None, liker = None, liked = None):
    
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
        self.user_type = user_type

        self.post_id = post_id
        self.post_title = post_title
        self.post_content = post_content
        self.post_timestmap = post_timestamp
        self.poster_name = poster_name

        self.comment = comment
        self.comment_id = comment_id
        self.comment_timestamp = comment_timestamp
    
        self.like_id =like_id
        self.liker = liker
        self.liked = liked


####################################################################################################
#################################################### CREATION AND LOGIN ####################################3
###################################################################################################
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


####################################################################################################
#################################################### FETCHING USER DATA ####################################3
####################################################################################################
    def get_user(self):
        cursor = mysql.connection.cursor()
        if self.user_type == 'parent':
            sql = "SELECT u.user_type, p.* FROM parents as p LEFT JOIN user as u ON p.users_id = u.user_id WHERE u.user_id = '{}'".format(self.user_id)
        elif self.user_type =='student':
            sql = "SELECT u.user_type, s.* FROM students as s LEFT JOIN user as u ON s.user_id = u.user_id WHERE u.user_id = '{}'".format(self.user_id)
        else:
            sql = "SELECT u.user_type, u.user_id, t.* FROM teachers as t LEFT JOIN user as u ON t.user_id = u.user_id WHERE u.user_id = '{}'".format(self.user_id)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display





    def get_student(self):
        cursor = mysql.connection.cursor()

        sql = "SELECT * from students WHERE teacher_id = '{}'".format(self.teacher_id)

        cursor.execute(sql)
        display = cursor.fetchall()
        return display


    def get_dad(self):
        cursor = mysql.connection.cursor()

        dad = []

        dad_sql = """SELECT p.* FROM parents AS p LEFT JOIN students as s 
                    ON p.unique_id = s.father_id  WHERE s.unique_id = '{}' 
                    AND p.teacher_id = '{}';""".format(self.student_unique, self.teacher_id)

        cursor.execute(dad_sql)
        dad_display = cursor.fetchall()

        for item in dad_display:
            dadDict = {}
            dadDict['id'] = item[1]
            dadDict['teacher_id'] = item[5]
            dadDict['child_id'] =item[6]
            dadDict['fname'] = item[3].upper()
            dadDict['lname'] = item[4].upper()
            dadDict['activated'] = item[7]
            dad.append(dadDict)

        return dad

    
    def get_mom(self):
        cursor = mysql.connection.cursor()

        mom = []

        mom_sql = """SELECT p.* FROM parents AS p LEFT JOIN students as s 
                    ON p.unique_id = s.mother_id  WHERE s.unique_id = '{}' 
                    AND p.teacher_id = '{}';""".format(self.student_unique, self.teacher_id)

        cursor.execute(mom_sql)
        mom_display = cursor.fetchall()
        
        for item in mom_display:
            momDict = {}
            momDict['id'] = item[1]
            momDict['teacher_id'] = item[5]
            momDict['child_id'] =item[6]
            momDict['fname'] = item[3].upper()
            momDict['lname'] = item[4].upper()
            momDict['activated'] =item[7]
            mom.append(momDict)

        return mom

    
    def get_child(self):
        cursor = mysql.connection.cursor()

        child = []

        sql = """SELECT * FROM students WHERE unique_id = '{}' AND teacher_id = '{}';""".format(self.student_unique, self.teacher_id)

        cursor.execute(sql)
        display = cursor.fetchall()
        
        for item in display:
            studentDict = {}
            studentDict['id'] = item[1]
            studentDict['fname'] = item[3].upper()
            studentDict['lname'] = item[4].upper()
            studentDict['gender'] = item[6]
            studentDict['school'] = item[7]
            studentDict['activated'] = item[10]

            child.append(studentDict)

        return child

    
####################################################################################################
####################################### ACTIVATION ###################################################
###################################################################################################
    def activate_child(self):
        cursor = mysql.connection.cursor()
        sql = """
            UPDATE students SET user_id = '%s', activated = 1 WHERE unique_id = '%s'
        """ % (self.user_id, self.student_unique)

        cursor.execute(sql)
        mysql.connection.commit()


    
    def activate_parent(self):
        cursor = mysql.connection.cursor()
        sql = """
            UPDATE parents SET users_id = '%s', activated = 1 WHERE unique_id = '%s'
        """ % (self.user_id, self.student_unique)

        cursor.execute(sql)
        mysql.connection.commit()




####################################################################################################
###################################### POSTS ###################################################
###################################################################################################



    def addPost(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO posts (post_id, poster_name, poster_user_type, user_id,
                 auth_id, title, content, datetime_posted)
					 VALUES ('%s','%s', '%s', '%s','%s', '%s', '%s', '%s')""" % (self.post_id, self.poster_name, self.user_type,
                     self.user_id, self.teacher_id, self.post_title, self.post_content, self.post_timestmap)

        cursor.execute(sql)
        mysql.connection.commit()



    def get_currentUser_posts(self):
        cursor = mysql.connection.cursor()
        sql = """
                SELECT pst.*, s.firstname, s.lastname, u.user_type FROM 
                    ((posts as pst LEFT JOIN students as s ON  s.user_id = pst.user_id) 
                        LEFT JOIN user as u ON u.user_id = s.user_id) WHERE pst.user_id = '{}'
                        ORDER BY datetime_posted DESC;

        """.format(self.user_id)

        cursor.execute(sql)
        display = cursor.fetchall()

        result = [list(i) for i in display]
        return result

    

    def getPosts(self):
        cursor = mysql.connection.cursor()

        if self.user_type == 'student' or self.user_type == 'parent':
            sql = """
                    SELECT * from posts WHERE auth_id = '{}' ORDER BY datetime_posted DESC

            """.format(self.teacher_id)
        elif self.user_type == 'Public Teacher':
            sql = """
                   SELECT pst.*, t.school, t.division FROM ((posts as pst LEFT JOIN user as u ON pst.poster_user_type = u.user_type) 
                    LEFT JOIN teachers as t ON u.user_id = t.user_id) 
                    WHERE auth_id = '{}' or t.school = '{}' or (t.teacher_type = 'Division Supervisor' and t.division = '{}') ORDER BY datetime_posted DESC;

            """.format(self.teacher_id, self.school, self.division)

        elif self.user_type == 'School Head':
            sql = """
                   SELECT pst.*, t.school, t.district, t.division FROM ((posts as pst LEFT JOIN user as u ON pst.poster_user_type = u.user_type) 
                    LEFT JOIN teachers as t ON u.user_id = t.user_id) 
                    WHERE t.school = '{}' OR 
                    (t.teacher_type='District Supervisor' and t.district='{}')
                    OR (t.teacher_type='Superintendent' and t.division = '{}')
                     ORDER BY datetime_posted DESC;

            """.format(self.school, self.district, self.division)
        
        
        elif self.user_type == 'Division Supervisor':
            sql = """
                    SELECT pst.*, t.school, t.division FROM ((posts as pst LEFT JOIN user as u ON pst.poster_user_type = u.user_type)
                    LEFT JOIN teachers as t ON u.user_id = t.user_id) 
                    WHERE t.teacher_type='Public Teacher' AND t.division = '{}' OR pst.user_id = '{}' 
                    ORDER BY datetime_posted DESC;

            """.format(self.division, self.user_id)

        elif self.user_type == 'District Supervisor':
            sql = """SELECT pst.*, t.school, t.division 
                        FROM ((posts as pst LEFT JOIN user as u ON pst.poster_user_type = u.user_type)
                        LEFT JOIN teachers as t ON u.user_id = t.user_id) 
                        WHERE t.teacher_type='School Head' AND t.district = '{}' 
                        OR pst.user_id = '{}' ORDER BY datetime_posted DESC;
            
            """.format(self.district, self.user_id)

        
        elif self.user_type == 'Superintendent':
            sql = """SELECT pst.*, t.school, t.division 
                        FROM ((posts as pst LEFT JOIN user as u ON pst.poster_user_type = u.user_type)
                        LEFT JOIN teachers as t ON u.user_id = t.user_id) 
                        WHERE t.teacher_type='School Head' AND t.division = '{}' 
                        OR pst.user_id = '{}' ORDER BY datetime_posted DESC;
            
            """.format(self.division, self.user_id)
        

        cursor.execute(sql)
        display = cursor.fetchall()

        result = [list(i) for i in display]
        return result

    

    def viewPost(self):
        cursor = mysql.connection.cursor()
        sql = """
                SELECT * from posts WHERE auth_id = '{}' AND post_id = '{}' ORDER BY datetime_posted DESC

        """.format(self.teacher_id, self.post_id)

        cursor.execute(sql)
        display = cursor.fetchall()

        result = [list(i) for i in display]
        return result

    

####################################################################################################
###################################### COMMENT AND REACTS ###################################################
###################################################################################################

    def addComment(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO comments (comment_id, user_id, post_id, commentor, comment,
                 comment_timestamp)
					 VALUES('%s', '%s', '%s', '%s','%s', '%s')""" % (self.comment_id, self.user_id, self.post_id, self.poster_name, 
                                                        self.comment, self.comment_timestamp)

        cursor.execute(sql)
        mysql.connection.commit()

    def getCommentCount(self):
        cursor = mysql.connection.cursor()
        sql = """
                SELECT COUNT(*) FROM comments WHERE post_id = '{}';

        """.format(self.post_id)

        cursor.execute(sql)
        display = cursor.fetchall()
        count = display[0][0]
        

        return count

    
    def getComments(self):
        cursor = mysql.connection.cursor()
        sql = """
                SELECT * FROM comments WHERE post_id = '{}' ORDER BY comment_timestamp DESC;

        """.format(self.post_id)

        cursor.execute(sql)
        display = cursor.fetchall()

        return display

    

    def likePost(self):
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO likes (like_id, user_id, post_id, liker, liked,
                 timestamp)
					 VALUES('%s', '%s', '%s', '%s','%s', '%s')""" % (self.like_id, self.user_id, self.post_id, self.liker, 
                                                        self.liked, self.post_timestmap)

        cursor.execute(sql)
        mysql.connection.commit()

    def dislikePost(self):
        cursor = mysql.connection.cursor()
        sql = """DELETE FROM likes WHERE user_id = '{}' AND  post_id = '{}'""".format(self.user_id, self.post_id)

        cursor.execute(sql)
        mysql.connection.commit()

    def getLikeCount(self):
        cursor = mysql.connection.cursor()
        sql = """
                SELECT COUNT(*) FROM likes WHERE post_id = '{}';

        """.format(self.post_id)

        cursor.execute(sql)
        display = cursor.fetchall()
        count = display[0][0]
        

        return count

    def isLiked(self):
        cursor = mysql.connection.cursor()
        sql = """
                SELECT * FROM likes WHERE user_id = '{}' AND post_id = '{}';

        """.format(self.user_id, self.post_id)

        cursor.execute(sql)
        display = cursor.fetchall()
        
        if display:
            return 1
        else:
            return 0


    
