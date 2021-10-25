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

class CreateUserAPIView(CreateAPIView):
    serializer_class = UserAccountSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # We create a token than will be used for future auth
        user = serializer.instance
        token = Token.objects.create(user=user)
        token_data = {"token": token.key}
        # Get profile data generated
        return Response(
            {
                **serializer.data, 
                'socials_link' : user.profile.socials_link,
                **token_data
             },
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class AuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'email': user.email,
            'company_name' : user.company_name,
            'first_name' : user.first_name,
            'last_name' : user.last_name,
            'user_type' : user.user_type,
            'socials_link' : user.profile.socials_link,
        })


class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)