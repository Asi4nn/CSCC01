from rest_framework import serializers
from django.contrib.auth import get_user_model
from api.models import *

class FollowingSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='following_user_id.email', read_only=True)
    class Meta:
        model = UserFollowing
        fields = ("id", "email", "following_user_id", "created")
        
class FollowersSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user_id.email', read_only=True)
    class Meta:
        model = UserFollowing
        fields = ("id", "email", "user_id", "created")