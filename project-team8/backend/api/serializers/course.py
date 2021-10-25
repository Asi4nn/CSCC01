from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import *
from .users import *


class AssignmentSerializer(serializers.ModelSerializer):
    notes = serializers.URLField(allow_blank=True)

    class Meta:
        model = Assignment
        fields = ('notes',)


class LectureSerializer(serializers.ModelSerializer):
    video = serializers.URLField(allow_blank=True)
    notes = serializers.URLField(allow_blank=True)

    class Meta:
        model = Lecture
        fields = ('notes', 'video')


class DiscussionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussion
        fields = '__all__'


class ModuleItemSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(many=False, allow_null=True, required=False)
    lecture = LectureSerializer(many=False, allow_null=True, required=False)

    class Meta:
        model = ModuleItem
        fields = ('id', 'name', 'type', 'assignment', 'lecture', 'date')


class EditModuleItemSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(many=False, allow_null=True, required=False)
    lecture = LectureSerializer(many=False, allow_null=True, required=False)

    class Meta:
        model = ModuleItem
        fields = ('id', 'name', 'type', 'assignment', 'lecture', 'date')


class CourseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')


class StudentMarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mark
        field = ('mark',)


class MarkSerializer(serializers.ModelSerializer):
    student = UserDataSerializer()

    class Meta:
        model = Mark
        field = ('mark', 'student')


class AssignmentMarkSerializer(serializers.ModelSerializer):
    marks = MarkSerializer(many=True)

    class Meta:
        model = Assignment
        fields = ('marks', 'mark_visible')


class ModuleSerializer(serializers.ModelSerializer):
    items = ModuleItemSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = '__all__'


class PartialModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ('name', 'description')


class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('course_code', 'course_name', 'password', 'calendar_link')


class CourseSerializer(serializers.ModelSerializer):
    enrolled_students = UserDataSerializer(read_only=True, many=True)
    modules = ModuleSerializer(many=True)
    professor = UserDataSerializer(many=False)

    class Meta:
        model = Course
        fields = ('id', 'course_code', 'course_name', 'enrolled_students', 'year', 'semester', 'modules',
        'professor', 'calendar_link')
        depth = 2


class EnrollInCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('password',)
