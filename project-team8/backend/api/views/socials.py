from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http import HttpResponse, Http404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.generics import *
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status, viewsets
from rest_framework.pagination import PageNumberPagination
from api.serializers import *
from api.models import *
from api.permissions import *

class SocialsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_id):
        try:
            curr_user = User.objects.get(auth_token=request.user.auth_token)
            add_profile = Profile.objects.get(socials_link=profile_id)
            user_to_add = User.objects.get(profile=add_profile)
            following = UserFollowing.objects.create(user_id=curr_user, following_user_id=user_to_add)
            following.save()
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'message': 'The profile of the user you are trying to remove does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, profile_id):
        try:
            curr_user = User.objects.get(auth_token=request.user.auth_token)
            remove_profile = Profile.objects.get(socials_link=profile_id)
            user_to_remove = User.objects.get(profile=remove_profile)
            following = UserFollowing.objects.get(user_id=curr_user, following_user_id=user_to_remove)
            following.delete()
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'message': 'The profile of the user you are trying to remove does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)



class GetNetworkView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        curr_user = User.objects.get(auth_token=request.user.auth_token)
        following = FollowingSerializer(curr_user.following.all(), many=True)
        followers = FollowersSerializer(curr_user.followers.all(), many=True)
        return Response({ 
            'following' : following.data,
            'follower'  : followers.data
         })