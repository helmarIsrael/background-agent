from getpass import getuser
import json
from flask import render_template, redirect, request, url_for, flash, session, jsonify
from mckeskwela_app.forms import CreateStudentForm, SignUpForm, LoginForm
from mckeskwela_app import app
import mckeskwela_app.models as models
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
            getUser = models.mckeskwla(user_id=logUser[0][0])
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
        new_user_id = str(uuid.uuid4())[:8]
        
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


        print(f'user id: {new_user_id}\nteacher id: {new_teacher_id}')

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
    if 'user' in session:
        user_request = False
        user = session['user']
        return render_template('home.html', user=user[0], title='Home')
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
    form.unique_id.data = str(uuid.uuid4())[:8]
    form.school.data = user[0][7]
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
                            gender=form.gender.data, school=form.school.data, teacher_id=user[0][0],father_id=new_father_id, mother_id=new_mother_id )
        
        

        addFather_db = models.mckeskwla(parent_id=new_father_id, student_unique=form.unique_id.data, teacher_id=user[0][0], 
                            firstname=form.father_firstname.data, lastname=form.father_lastname.data)
     
        

        addMother_db = models.mckeskwla(parent_id=new_mother_id, student_unique=form.unique_id.data, teacher_id=user[0][0], 
                            firstname=form.mother_firstname.data, lastname=form.mother_lastname.data)

        addStudent_db.addStudent()
        addFather_db.addParent()
        addMother_db.addParent()


        return redirect(url_for('home'))
        
    return render_template('student_signup.html', form=form)


@app.route('/activateAccount', methods=['GET', 'POST'])
def activate_account():
    return render_template('activate_account.html')































@app.route('/getStudents')
def getStudents():
    user = session['user']
    db = models.mckeskwla(teacher_id=user[0][0])
    students = db.get_student()
    student_array = []


    for item in students:
        studentDict = {}
        studentDict['id'] = item[1]
        studentDict['fname'] = item[2].upper()
        studentDict['lname'] = item[3].upper()
        studentDict['gender'] = item[4]
        studentDict['school'] = item[5]
        studentDict['activated'] = item[10]
        student_array.append(studentDict)
    
    return jsonify({'students': student_array})



@app.route('/getParents/<string:id>')
def getParents(id):
    user = session['user']
    db = models.mckeskwla(student_unique=id, teacher_id=user[0][0])
    dad = db.get_dad()
    mom = db.get_mom()
    child =db.get_child()
    
    
    return jsonify({'child':child ,'dad': dad, 'mom':mom})


@app.route('/activate_accounts/<string:childUsername>/<string:fatherUsername>/<string:motherUsername>')
def activate_accounts(childUsername, fatherUsername, motherUsername):
    child_username = childUsername.lower()
    child_password = str(uuid.uuid4())[:5]
    child_user_id = str(uuid.uuid4())[:8]

    dad_username = fatherUsername.lower()
    dad_password = str(uuid.uuid4())[:5]
    dad_user_id = str(uuid.uuid4())[:8]

    mom_username = motherUsername.lower()
    mom_password = str(uuid.uuid4())[:5]
    mom_user_id = str(uuid.uuid4())[:8]

    print(f''' Child Username: {child_username} password: {child_password}
    Father Username: {dad_username} password: {dad_password}
    Mother Username: {mom_username} password: {mom_password}''')

    child = [{'username': child_username, 'password': child_password}]
    dad = [{'username': dad_username, 'password': dad_password}]
    mom = [{'username': mom_username , 'password': mom_password}]
    

    add_child = models.mckeskwla(user_id=child_user_id, username=child_username, password=child_password, teacher_type='student')
    add_dad = models.mckeskwla(user_id=dad_user_id, username=dad_username, password=dad_password, teacher_type='parent')
    add_mom = models.mckeskwla(user_id=mom_user_id, username=mom_username, password=mom_password, teacher_type='parent')
    
    ####  ANG KULANG KAY IUPDATE ANG 'actived' UG ANG 'user_id' SA BOTH STUDENT UG PARENT

    
    return jsonify({'child':child, 'dad':dad, 'mom':mom})
