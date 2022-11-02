from getpass import getuser
import json
import timeago
from flask import render_template, redirect, request, url_for, flash, session, jsonify
from mckeskwela_app.forms import CreatePost, CreateStudentForm, SignUpForm, LoginForm, addCommment
from mckeskwela_app import app
import mckeskwela_app.models as models
from datetime import datetime
import uuid


@app.route('/')
def toLogin():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    db = models.mckeskwla()
    if form.validate_on_submit():
        session.permanent = True
        db = models.mckeskwla(username=form.username.data,
                                password=form.password.data)
        if db.validateLogin() == 1:
            flash('Invalid Login. User does not exist', 'danger')
        elif db.validateLogin() == 2:
            flash('Invalid Login. Wrong Password', 'danger')
        else:
            # user = db.login()
            # session['user'] = user
            # return redirect(url_for('home'))
            logUser = db.login()
            getUser = models.mckeskwla(user_id=logUser[0][0], user_type=logUser[0][3])
            user = getUser.get_user()
            session['user'] = user
            return redirect(url_for('home'))

    return render_template('login.html', form=form)

@app.route('/signUp', methods=['GET', 'POST'])
def signup():
    form = SignUpForm()
    if form.validate_on_submit() and request.method == 'POST':
        if form.district.data == None:
            form.district.data = 'No District'
        if form.school.data == None:
            form.school.data = 'No School'
        new_user_id = f'user-{str(uuid.uuid4())[:5]}'
        
        teach_type = form.teach_type.data
        if teach_type == 'Superintendent':
            new_teacher_id = f'super-{str(uuid.uuid4())[:5]}'
        elif teach_type == 'Division Supervisor':
            new_teacher_id = f'divSup-{str(uuid.uuid4())[:5]}'
        elif teach_type == 'District Supervisor':
            new_teacher_id = f'distSup-{str(uuid.uuid4())[:5]}' 
        elif teach_type == 'School Head':
            new_teacher_id = f'schoolHead-{str(uuid.uuid4())[:5]}'
        elif teach_type == 'Public Teacher':
            new_teacher_id = f'teacher-{str(uuid.uuid4())[:5]}'
        new_username = f'{form.firstname.data}.{form.lastname.data}'


        addUser_db = models.mckeskwla(user_id=new_user_id, username=new_username, password=form.password.data, teacher_type=form.teach_type.data)
        addTeach_db = models.mckeskwla(teacher_id=new_teacher_id, teacher_type=form.teach_type.data, firstname=form.firstname.data, lastname=form.lastname.data,
                                        gender=form.gender.data, division=form.division.data, district=form.district.data, 
                                        school=form.school.data, user_id=new_user_id )
        addUser_db.addNewUser()
        addTeach_db.addTeacher()

        session.permanent = True
        login = models.mckeskwla(username=new_username,
                                password=form.password.data)
        logUser = login.login()
        getUser = models.mckeskwla(user_id=logUser[0][0])
        user = getUser.get_user()
        session['user'] = user
        return redirect(url_for('home'))
        
    return render_template('signUp.html', form=form)


@app.route('/home', methods=['GET', 'POST'])
def home():
    form = CreatePost()
    commentForm = addCommment()
    if 'user' in session:
        user_request = False
        user = session['user']
        id_user = user[0][3]
        auth_id = user[0][6] # ID OF THE ONE WHO ACTIVATED OR AUTHORIZED THIS ACCOUNT
        poster = f'{user[0][4]} {user[0][5]}'
        poster_type = user[0][0]
        print(user)

        curr_dt = datetime.now()
        post_tstamp= int(round(curr_dt.timestamp()))

        db = models.mckeskwla(teacher_id=auth_id)
        get_post = db.getPosts()
        posts = []
        for item in get_post:
            db = models.mckeskwla(post_id=item[0])
            count = db.getCommentCount()
            item.append(count)
            tstamp_datetime = str(datetime.fromtimestamp(int(item[7])))
            item[7] = str(timeago.format(tstamp_datetime, curr_dt))
            posts.append(item)

        filled = request.args.get('filled')
        if filled is None:
            filled = False
        postID =  f'post-{str(uuid.uuid4())[:5]}'
        comment_id =  f'comment-{str(uuid.uuid4())[:5]}'
        if form.is_submitted():
            if form.validate_on_submit() and request.method == 'POST':
                create = models.mckeskwla(post_id=postID, poster_name =poster, 
                                            user_type=poster_type,
                                            user_id=id_user, teacher_id=auth_id,
                                            post_title=form.title.data,
                                            post_content=form.content.data, 
                                            post_timestamp=post_tstamp,
                                    )
                create.addPost()
                form.title.data = None
                form.content.data = None
                filled = True
                print("asdvajvhvaousdq")
                return redirect(url_for('home'))
        if commentForm.is_submitted():
            if request.method == 'POST':
                comment_content = commentForm.comment.data
                comment_postID = commentForm.post_id.data
                comment_userID = commentForm.user_id.data
                commentor = commentForm.commentor.data
                print(f'''comment: {commentForm.comment.data}\ncomment id: {comment_id}\ncomment timestamp: {post_tstamp},
                post_id: {commentForm.post_id.data},
                user_id: {commentForm.user_id.data}''')

                comment = models.mckeskwla(comment_id=comment_id, user_id=comment_userID,
                                            post_id=comment_postID, poster_name=commentor, comment=comment_content,
                                            comment_timestamp=post_tstamp)

                comment.addComment()
                commentForm.comment.data = ''
                filled = True
        return render_template('home.html', user=user[0], title='Home', form=form, posts=posts, commentForm=commentForm)
    else:
        return redirect(url_for('login'))




@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))



@app.route('/classList', methods=['GET', 'POST'])
def classList():
    return render_template('classList.html')

@app.route('/createStudent', methods=['GET', 'POST'])
def createStudent():
    user = session['user']
    form = CreateStudentForm()
    form.unique_id.data = f'student-{str(uuid.uuid4())[:5]}'
    form.school.data = user[0][10]
    if form.validate_on_submit() and request.method == 'POST':
        if form.school.data == None:
            form.school.data = 'No School'
        new_father_id = f'father-{str(uuid.uuid4())[:5]}'
        new_mother_id = f'mother-{str(uuid.uuid4())[:5]}'
        # print(f'''Teacher_id: {user[0][0]} firstname: {form.firstname.data}
        #         lastname: {form.lastname.data}
        #         gender: {form.gender.data}
        #         unique_id: {form.unique_id.data}
        #         school: {form.school.data}\n
        #         Father Firstname: {form.father_firstname.data}
        #         Father Lastname: {form.father_lastname.data}
        #         Father ID: {parent_id}
        #         Mother Firstname: {form.mother_firstname.data}
        #         Mother Lastname: {form.mother_lastname.data}
        #         Mother ID: {parent_id}
        #         ''')
        addStudent_db = models.mckeskwla(student_unique=form.unique_id.data, firstname=form.firstname.data, lastname=form.lastname.data,
                            gender=form.gender.data, school=form.school.data, teacher_id=user[0][6],father_id=new_father_id, mother_id=new_mother_id )
        
        

        addFather_db = models.mckeskwla(parent_id=new_father_id, student_unique=form.unique_id.data, teacher_id=user[0][6], 
                            firstname=form.father_firstname.data, lastname=form.father_lastname.data)
     
        

        addMother_db = models.mckeskwla(parent_id=new_mother_id, student_unique=form.unique_id.data, teacher_id=user[0][6], 
                            firstname=form.mother_firstname.data, lastname=form.mother_lastname.data)

        addStudent_db.addStudent()
        addFather_db.addParent()
        addMother_db.addParent()


        return redirect(url_for('home'))
        
    return render_template('student_signup.html', form=form)


@app.route('/activateAccount', methods=['GET', 'POST'])
def activate_account():
    return render_template('activate_account.html')

























@app.route('/getComments/<string:id>')
def getComments(id):
    db = models.mckeskwla(post_id=id)
    comms = db.getComments()
    comments_list = []
    curr_dt = datetime.now()
    
    for item in comms:
        comments_dict = {}
        comments_dict['id'] = item[0]
        comments_dict['user_id'] = item[1]
        comments_dict['post_id'] = item[2]
        comments_dict['commentor'] = item[3]
        comments_dict['comment'] = item[4]
        tstamp_datetime = str(datetime.fromtimestamp(int(item[5])))
        comments_dict['timestamp'] = str(timeago.format(tstamp_datetime, curr_dt))
        comments_list.append(comments_dict)

    return jsonify({'comments': comments_list})


@app.route('/getStudents')
def getStudents():
    user = session['user']
    db = models.mckeskwla(teacher_id=user[0][6])
    students = db.get_student()
    student_array = []
    print(students)

    for item in students:
        studentDict = {}
        studentDict['id'] = item[1]
        studentDict['fname'] = item[3].upper()
        studentDict['lname'] = item[4].upper()
        studentDict['gender'] = item[6]
        studentDict['school'] = item[7]
        studentDict['activated'] = item[10]
        student_array.append(studentDict)
    
    return jsonify({'students': student_array})



@app.route('/getParents/<string:id>')
def getParents(id):
    user = session['user']
    db = models.mckeskwla(student_unique=id, teacher_id=user[0][6])
    dad = db.get_dad()
    mom = db.get_mom()
    child =db.get_child()
    
    
    return jsonify({'child':child ,'dad': dad, 'mom':mom})


@app.route('/activate_accounts/<string:child>/<string:dad>/<string:mom>')
def activate_accounts(child, dad, mom):
    child_list = child.split(",")
    child_username = child_list[0].lower()
    child_password = str(uuid.uuid4())[:5]
    child_user_id = str(uuid.uuid4())[:8]
    child_id = child_list[1]

    dad_list = dad.split(",")
    dad_username = dad_list[0].lower()
    dad_password = str(uuid.uuid4())[:5]
    dad_user_id = str(uuid.uuid4())[:8]
    dad_id = dad_list[1]

    mom_list = mom.split(",")
    mom_username = mom_list[0].lower()
    mom_password = str(uuid.uuid4())[:5]
    mom_user_id = str(uuid.uuid4())[:8]
    mom_id = mom_list[1]

    print(f'''Child_ID: {child_id} Child Username: {child_username} password: {child_password} user_id: {child_user_id}
    Dad_ID: {dad_id} Father Username: {dad_username} password: {dad_password} user_id: {dad_user_id}
    Mom_ID: {mom_id} Mother Username: {mom_username} password: {mom_password} user_id: {mom_user_id}''')

    child_details = [{'username': child_username, 'password': child_password}]
    dad_details = [{'username': dad_username, 'password': dad_password}]
    mom_details = [{'username': mom_username , 'password': mom_password}]
    

    add_child = models.mckeskwla(user_id=child_user_id, username=child_username, password=child_password, teacher_type='student')
    add_dad = models.mckeskwla(user_id=dad_user_id, username=dad_username, password=dad_password, teacher_type='parent')
    add_mom = models.mckeskwla(user_id=mom_user_id, username=mom_username, password=mom_password, teacher_type='parent')
    
    activate_child = models.mckeskwla(user_id=child_user_id, student_unique=child_id)
    activate_dad = models.mckeskwla(user_id=dad_user_id, student_unique=dad_id)
    activate_mom = models.mckeskwla(user_id=mom_user_id, student_unique=mom_id)

    add_child.addNewUser()
    add_dad.addNewUser()
    add_mom.addNewUser()

    activate_child.activate_child()
    activate_dad.activate_parent()
    activate_mom.activate_parent()
    
    return jsonify({'child':child_details, 'dad':dad_details, 'mom':mom_details})
