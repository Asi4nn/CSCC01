from rest_framework import exceptions
from django.core.exceptions import ObjectDoesNotExist
from . import models as my_models
from .models import *

def utils_get_hashtags(content):
    tags = [i for i in content.split() if i.startswith('#')]
    return tags

def utils_find_object(object_type, object_id):
    try:
        type_object = getattr(my_models, object_type)
    except AttributeError:
        raise exceptions.NotFound(detail='cant find model') 

    try:
        find_object = type_object.objects.get(id=object_id)     
    except ObjectDoesNotExist:
        raise exceptions.NotFound(detail='object does not exist')
    
    return find_object

def utils_get_user_and_profile(token):
    curr_user = User.objects.get(auth_token=token)
    try:
        curr_user_profile = Profile.objects.get(owner=curr_user.id)
    except Profile.DoesNotExist:
        raise exceptions.NotFound(detail='Cannot find profile')
    
    return curr_user, curr_user_profile

def check_likes_exist(curr_user_profile, obj, object_type):
    if object_type == 'Post':
        if LikesRel.objects.filter(profile_id=curr_user_profile, post_id=obj).exists():
            return True
    if object_type == 'Comment':
        if LikesRel.objects.filter(profile_id=curr_user_profile, comment_id=obj).exists():
            return True
    return False