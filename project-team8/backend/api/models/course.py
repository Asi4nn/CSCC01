from django.db.models.deletion import CASCADE
from django.db.models.fields import BooleanField
from django.core.validators import RegexValidator
from django.dispatch import receiver
from django.db.models.signals import post_save
from djongo import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.db.models import signals
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.crypto import get_random_string
from .users import * 


class Mark(models.Model):
    mark = models.FloatField(default=0)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    
class Discussion(models.Model):
    question = models.CharField(max_length=1000)
    answer = models.CharField(max_length=10000)  # Maybe each answer seperated by a delimiter


class Lecture(models.Model):
    video = models.URLField()  # Link to video
    notes = models.URLField()  # Link to notes


class Assignment(models.Model):
    # video = models.URLField()  # Link to video
    notes = models.URLField()  # Link to notes
    marks = models.ManyToManyField(Mark)
    mark_visible = models.BooleanField(default=False)




class ModuleItem(models.Model):
    class ModuleItemType(models.TextChoices):
        assignment = "ASN", _("Assignment")
        lecture = "LEC", _("Lecture")

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=3, choices=ModuleItemType.choices)
    assignment = models.OneToOneField(Assignment, null=True, on_delete=models.CASCADE)
    lecture = models.OneToOneField(Lecture, null=True, on_delete=models.CASCADE)
    date = models.DateField()
    discussion = models.ManyToManyField(Discussion)

    class Meta:
        ordering = ['id']


class Module(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    items = models.ManyToManyField(ModuleItem)

    # assignments = models.ManyToManyField(Assignment, through=ModuleItem, related_name='assignment')
    # lectures = models.ManyToManyField(Lecture, through=ModuleItem, related_name='lecture')

    class Meta:
        ordering = ['id']


class Course(models.Model):
    course_code = models.CharField(max_length=30, null=True, blank=True)
    course_name = models.CharField(max_length=100, null=True, blank=True)
    description = models.CharField(max_length=500, null=True, blank=True)
    enrolled_students = models.ManyToManyField(User)
    year = models.IntegerField(null=True, blank=True)
    semester = models.CharField(max_length=100, null=True, blank=True)  # Summer, winter, fall
    modules = models.ManyToManyField(Module)
    professor = models.ForeignKey(User, on_delete=models.PROTECT, related_name="professor")
    password = models.CharField(max_length=100)
    calendar_link = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.course_name