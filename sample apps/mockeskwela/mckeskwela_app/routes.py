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
            user = db.login()
            session['user'] = user
            return redirect(url_for('home'))
        

    return render_template('login.html', form=form)

@app.route('/signUp/<string:user>', methods=['GET', 'POST'])
def signup(user):
    form = SignUpForm()
    if user == 'teacher':
        if form.validate_on_submit() and request.method == 'POST':
            form.district.data = 'No District'
            form.school.data = 'No School'
            
            print(f'''type: {form.teach_type.data} firstname: {form.firstname.data}
                    lastname: {form.lastname.data}
                    gender: {form.gender.data}
                    username: {form.username.data}
                    password: {form.password.data}
                    division: {form.division.data}
                    district: {form.district.data}
                    school: {form.school.data}
                    ''')
            db = models.mckeskwla(teacher_type=form.teach_type.data, firstname=form.firstname.data, lastname=form.lastname.data,
                                    gender=form.gender.data, username=form.username.data, password=form.password.data,
                                    division=form.division.data, district=form.district.data, school=form.school.data  
                                    )
            db.addNewUser()
            
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
                Father ID: {father_id}
                Mother Firstname: {form.mother_firstname.data}
                Mother Lastname: {form.mother_lastname.data}
                Mother ID: {mother_id}
                ''')
        # db = models.mckeskwla(teacher_type=form.teach_type.data, firstname=form.firstname.data, lastname=form.lastname.data,
        #                         gender=form.gender.data, username=form.username.data, password=form.password.data,
        #                         division=form.division.data, district=form.district.data, school=form.school.data  
        #                         )
        # db.addNewUser()
        
    return render_template('student_signup.html', form=form)
