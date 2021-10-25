from rest_framework import serializers
from django.contrib.auth import get_user_model
from api.models import *
from api.serializers.users import ProfileSerializer


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('parent_comment_id', 'content')

class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('content', 'allow_comments')

class DisplayCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class DisplayPostSerializer(serializers.ModelSerializer):
    profile_id = ProfileSerializer(read_only=True)
    class Meta:
        model = Post
        fields = '__all__'

class EditPostComment(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('content',)