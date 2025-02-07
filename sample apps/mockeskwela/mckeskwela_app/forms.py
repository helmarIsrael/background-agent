from enum import unique
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, SubmitField, SelectField, PasswordField, TextAreaField
from wtforms.validators import InputRequired, Length, ValidationError, DataRequired, Email
import mckeskwela_app.models as models
import re


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    submit = SubmitField('Log in')

class myCustomSelectField(SelectField):
    def pre_validate(self, form):
        pass

class SignUpForm(FlaskForm):
    teach_type = myCustomSelectField('Choose..', choices=[('','Choose...'),('Superintendent','Superintendent'),
            ('Division Supervisor','Division Supervisor'),
            ('District Supervisor','District Supervisor'),
            ('School Head','School Head'),
            ('Public Teacher','Public Teacher'),], validators=[DataRequired()])

    firstname = StringField('Firstname', validators=[DataRequired()])
    lastname = StringField('Lastname', validators=[DataRequired()])
    gender = myCustomSelectField('Gender', choices=[('','Choose...'),('Male','Male'),('Female','Female')], validators=[DataRequired()])
    # username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[
        DataRequired(), Length(min=5, max=20)])
    division =  myCustomSelectField('Division', choices=[('','Choose...'),('Division 1','Division 1'),('Division 2','Division 2'), ('Division 3','Division 3')])
    district = myCustomSelectField('District', choices=[('','Choose...'),('District 1','District 1'),('District 2','District 2')])

    school = myCustomSelectField('School', choices=[('','Choose...'),('School 1','School 1'),('School 2','School 2'), ('School 3','School 3')])


    submit = SubmitField('Submit')




class CreateStudentForm(FlaskForm):
    firstname = StringField('Firstname', validators=[DataRequired()])
    lastname = StringField('Lastname', validators=[DataRequired()])
    gender = myCustomSelectField('Gender', choices=[('','Choose...'),('Male','Male'),('Female','Female')], validators=[DataRequired()])
    unique_id = StringField('Unique I.D', validators=[DataRequired()])
    school = myCustomSelectField('School', choices=[('','Choose...'),('School 1','School 1'),('School 2','School 2'), ('School 3','School 3')])

    father_firstname = StringField('Father Firstname', validators=[DataRequired()])
    father_lastname = StringField('Father Lastname', validators=[DataRequired()])

    mother_firstname = StringField('Mother Firstname', validators=[DataRequired()])
    mother_lastname = StringField('Mother Lastname', validators=[DataRequired()])


    submit = SubmitField('Submit')





class CreatePost(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    content = TextAreaField('Content', validators=[DataRequired()])
    submit = SubmitField('Post')



class addCommment(FlaskForm):
    comment = TextAreaField('Add Comment', validators=[DataRequired()])
    post_id = StringField('post_id', validators=[DataRequired()])
    user_id = StringField('user_id', validators=[DataRequired()])
    comment_submit = SubmitField('Comment')
