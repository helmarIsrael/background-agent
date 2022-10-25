from getpass import getuser
from flask import render_template, redirect, request, url_for, flash, session
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
        print(user)
        return render_template('home.html', user=user[0], title='Home')
    else:
        return redirect(url_for('login'))




@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))





@app.route('/createStudent', methods=['GET', 'POST'])
def createStudent():
    user = session['user']
    form = CreateStudentForm()
    form.unique_id.data = str(uuid.uuid4())[:8]
    if form.validate_on_submit() and request.method == 'POST':
        if form.school.data == None:
            form.school.data = 'No School'
        father_id = str(uuid.uuid4())[:8]
        mother_id = str(uuid.uuid4())[:8]
        print(f'''Teacher_id: {user[0][0]} firstname: {form.firstname.data}
                lastname: {form.lastname.data}
                gender: {form.gender.data}
                unique_id: {form.unique_id.data}
                school: {form.school.data}\n
                Father Firstname: {form.father_firstname.data}
                Father Lastname: {form.father_lastname.data}
                Father ID: {parent_id}
                Mother Firstname: {form.mother_firstname.data}
                Mother Lastname: {form.mother_lastname.data}
                Mother ID: {parent_id}
                ''')
        db = models.mckeskwla(student_unique=form.unique_id.data, firstname=form.firstname.data, lastname=form.lastname.data,
                            gender=form.gender.data, school=form.school.data, teacher_id=user[0][0],parent_unique=parent_id )
        
        db.addStudent()

        db = models.mckeskwla(parent_unique=parent_id, student_unique=form.unique_id.data, teacher_id=user[0][0], 
                            father_firstname=form.father_firstname.data, father_lastname=form.father_lastname.data,
                            mother_firstname=form.mother_firstname.data, mother_lastname=form.mother_lastname.data)
     
        db.addParent()
        return redirect(url_for('home'))
        
    return render_template('student_signup.html', form=form)
