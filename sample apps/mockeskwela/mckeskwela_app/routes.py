from turtle import title
from flask import render_template, redirect, request, url_for, flash, session
from numpy import tile
from mckeskwela_app.forms import SignUpForm, LoginForm
from mckeskwela_app import app
import mckeskwela_app.models as models


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
