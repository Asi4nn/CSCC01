from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission
from api.models import User
from rest_framework import exceptions
from django.apps import apps
from api.utils import *

class CanCreateCourse(BasePermission):
    def has_permission(self, request, view):
        user = User.objects.get(auth_token=request.user.auth_token)
        if user.user_type == "INSTR":
            return True
        else:
            raise exceptions.PermissionDenied(detail='Not an instructor')


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        user = User.objects.get(auth_token=request.user.auth_token)
        if user.user_type == "ENTRE":
            return True
        else:
            raise exceptions.PermissionDenied(detail='Not an student')


class IsInCourse(BasePermission):
    def has_permission(self, request, view):
        curr_user, curr_user_profile = utils_get_user_and_profile(request.user.auth_token)

        course = utils_find_object("Course", view.kwargs['course_id'])

        if not course.enrolled_students.filter(id=curr_user_profile.id).exists():
            raise exceptions.PermissionDenied(detail='Not enrolled in this course')            
        return True

