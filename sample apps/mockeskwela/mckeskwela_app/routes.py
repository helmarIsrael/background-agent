from flask import render_template, redirect, request, url_for
from mckeskwela_app.forms import SignUpForm
from mckeskwela_app import app



@app.route('/')
def toLogin():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')

@app.route('/signUp/<string:user>', methods=['GET', 'POST'])
def signup(user):
    form = SignUpForm()
    if user == 'teacher':
        if form.validate_on_submit() and request.method == 'POST':
            print(f'''type: {form.teach_type.data}\n
                    firstname: {form.firstname.data}\n
                    lastname: {form.lastname.data}\n
                    gender: {form.gender.data}\n
                    username: {form.username.data}
                    password: {form.password.data}
                    ''')
            
        return render_template('signUp.html', form=form)

