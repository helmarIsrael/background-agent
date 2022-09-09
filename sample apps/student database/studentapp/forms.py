from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField
from wtforms.validators import DataRequired, ValidationError, Regexp
import studentapp.models as models
import re

def validate_id(FlaskForm, field):
    student = models.students(id_number=field.data)
    if student.validation():
        raise ValidationError('I.D Number already exists')





class myCustomSelectField(SelectField):
    def pre_validate(self, form):
        pass


class registerForm(FlaskForm):
    register_fname = StringField('First Name', validators=[DataRequired()])
    register_lname = StringField('Last Name', validators=[DataRequired()])
    register_id = StringField('I.D Number', validators=[DataRequired(), validate_id, Regexp(regex=r"^[0-9]{4}-[0-9]{4}$", message="Please input a valid I.D Number")])


    register_gender = myCustomSelectField('Gender', choices=[('','Choose...'),('Male','Male'),('Female','Female')], validators=[DataRequired()])
    register_yearLvl = myCustomSelectField('Year Level', choices=[('','Choose...'),(1,1),(2,2),(3,3),(4,4),(5,5)], validators=[DataRequired()])
    register_college = myCustomSelectField('College', choices=[], validators=[DataRequired()])
    register_department = myCustomSelectField('Department', choices=[], validators=[DataRequired()])
    register_course = myCustomSelectField('Course', choices=[], validators=[DataRequired()])

    register_submit = SubmitField('Add New Student')




class updateForm(FlaskForm):
    update_fname = StringField('First Name', validators=[DataRequired()])
    update_lname = StringField('Last Name', validators=[DataRequired()])
    update_id = StringField('I.D Number', validators=[DataRequired(), validate_id, Regexp(regex=r"^[0-9]{4}-[0-9]{4}$", message="Please input a valid I.D Number")])


    update_gender = myCustomSelectField('Gender', choices=[('','Choose...'),('Male','Male'),('Female','Female')], validators=[DataRequired()])
    update_yearLvl = myCustomSelectField('Year Level', choices=[('','Choose...'),(1,1),(2,2),(3,3),(4,4),(5,5)], validators=[DataRequired()])
    update_college = myCustomSelectField('College', choices=[], validators=[DataRequired()])
    update_department = myCustomSelectField('Department', choices=[], validators=[DataRequired()])
    update_course = myCustomSelectField('Course', choices=[], validators=[DataRequired()])

    update_submit = SubmitField('Update')

class filterForm(FlaskForm):
    filter_college =  myCustomSelectField('College', choices=[], validators=[DataRequired()])
    filter_arrange = myCustomSelectField('Arrange by', choices=[('','Arrange by'),('id','ID'), ('lastName','Last Name'),('Year','Year')], default='',validators=[DataRequired()])
    filter_submit = SubmitField('Add Filter')



