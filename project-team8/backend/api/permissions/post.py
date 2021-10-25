from rest_framework.permissions import BasePermission
from api.utils import *
from rest_framework import exceptions


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        object_type = view.kwargs.get('object_type', None)
        object_id = view.kwargs.get('object_id', None)

        curr_user, curr_user_profile = utils_get_user_and_profile(request.user.auth_token)
        obj = utils_find_object(object_type, object_id)

        if curr_user_profile == obj:
            return True
        else:
            raise exceptions.PermissionDenied(detail='you are not the owner of this object')
        