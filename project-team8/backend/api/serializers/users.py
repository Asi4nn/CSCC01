from rest_framework import serializers
from django.contrib.auth import get_user_model
from api.models import *


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='owner.email', read_only=True)
    first_name = serializers.CharField(source='owner.first_name', read_only=True)
    last_name = serializers.CharField(source='owner.last_name', read_only=True)
    company_name = serializers.CharField(source='owner.company_name', read_only=True)
    user_type = serializers.CharField(source='owner.user_type', read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'description', 'socials_link', 'username', 'email', 'first_name', 'last_name', 'company_name', 'user_type')

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email', 'username', 'password', 'first_name', 'last_name', 'company_name', 'user_type')
        write_only_fields = ('password')
        read_only_fields = ('is_staff', 'is_superuser', 'is_active')

    def create(self, validated_data):
        user = super(UserAccountSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserDataSerializer(serializers.ModelSerializer):
    socials_link = serializers.CharField(source='profile.socials_link', read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('email', 'first_name', 'last_name', 'company_name', 'user_type', 'socials_link')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'