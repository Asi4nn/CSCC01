from rest_framework.permissions import BasePermission
from api.utils import *
from rest_framework import exceptions

class CanDelete(BasePermission):

    def has_object_permission(self, request, view, obj):
        object_type = view.kwargs.get('object_type', None)
        object_id = view.kwargs.get('object_id', None)
        if object_type in ["post", "comment"]:
            #can delete if it is the users own post or comment
            curr_user, curr_user_profile = utils_get_user_and_profile(request.user.auth_token)
            post = utils_find_object(object_type, object_id)
            
            if curr_user_profile == post:
                return True
            else:
                raise exceptions.PermissionDenied(detail='you are not the owner of this object')
        
        #if object_type in ['item', 'module', 'lecture']
            #can delete if instructor or mentor for the course

        return True