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


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 50
    
class GetUsersInfoAPIView(ListAPIView):
    serializer_class = UserDataSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return get_user_model().objects.order_by("id")

class GetProfileView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [CanReadUpdateProfile]

    def get_object(self):
        try:
            return Profile.objects.get(socials_link=self.kwargs["id"])
        except Profile.DoesNotExist:
            raise Http404()