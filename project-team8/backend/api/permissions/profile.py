from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission
from api.models import User
from rest_framework import exceptions
from django.apps import apps
from api.utils import *


class CanReadUpdateProfile(BasePermission):

     def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        #if request.method in permissions.SAFE_METHODS:
        #    return True

        if (request.method == "PUT" or request.method == "PATCH"):
            if (request.user.is_authenticated):
                user = User.objects.get(auth_token = request.user.auth_token)
                url = view.kwargs["id"]
                if (user.profile.socials_link == url): 
                    return True
                    
        raise exceptions.PermissionDenied()