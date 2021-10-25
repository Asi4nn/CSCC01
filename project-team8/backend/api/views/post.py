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
from api.utils import *
from datetime import datetime


class CreateCommentAPIView(APIView):

    def get_permissions(self):
        if self.kwargs['object_type'] == 'Post':
            self.permission_classes = [IsAuthenticated]
        if self.kwargs['object_type'] in ['ModuleItem', 'Assignment', 'Lecture', 'Discussion', 'Module']:
            self.permission_classes = [IsAuthenticated | IsInCourse]
        return super(CreateCommentAPIView, self).get_permissions()
            
    serializer_class = CreateCommentSerializer

    def post(self, request, *args, **kwargs):
        curr_user, curr_user_profile = utils_get_user_and_profile(request.user.auth_token)

        tags = utils_get_hashtags(request.data['content'])

        new_comment = Comment(parent_model_id=kwargs['object_id'],
        parent_model_type=kwargs['object_type'],
        profile_id=curr_user_profile, 
        content=request.data["content"],
        hash_tags=tags)        

        if request.data['parent_comment_id'] != 0:
            new_comment.parent_comment_id = request.data["parent_comment_id"]
        new_comment.save()
        
        return Response({'message': 'Success'}, status=status.HTTP_200_OK)

class CreatePostAPIView(CreateAPIView):
    serializer_class = CreatePostSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        curr_user, curr_user_profile = utils_get_user_and_profile(request.user.auth_token)

        tags = utils_get_hashtags(request.data['content'])

        new_post = Post(allow_comments = request.data['allow_comments'],
        profile_id = curr_user_profile,
        content = request.data['content'], 
        hash_tags = " ".join(tags))

        new_post.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)

class DisplayCommentsAPIView(RetrieveAPIView):
    serializer_class = DisplayCommentSerializer
    queryset = Comment.objects.all()

    def get(self, request, object_type, object_id):
        serializer = self.get_serializer(Comment.objects.filter(parent_model_type=object_type, parent_model_id=object_id), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DisplayPostAPIView(RetrieveAPIView):
    serializer_class = DisplayPostSerializer
    queryset = Post.objects.all()

    def get(self, request, profile_id):
        serializer = self.get_serializer(Post.objects.filter(profile_id=profile_id), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EditPostCommentAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated | IsOwner]
    
    def patch(self, request, object_type, object_id):
        obj = utils_find_object(object_type, object_id)

        obj.content=request.data['content']
        obj.edit_date=datetime.now()
        
        obj.save()

        return Response({'message': 'success'}, status=status.HTTP_200_OK)

class ToLikeAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, object_type, object_id):
        curr_user, curr_user_profile = utils_get_user_and_profile(request.user.auth_token)
        obj = utils_find_object(object_type, object_id)

        #check if we already liked
        if check_likes_exist(curr_user_profile, obj, object_type):
            return Response({'message': 'you already liked this'}, status=status.HTTP_400_BAD_REQUEST)

        obj.likes = obj.likes + 1
        obj.save()

        if object_type == 'Post':
            LikesRel.objects.create(profile_id=curr_user_profile, post_id=obj)
        if object_type == 'Comment':
            LikesRel.objects.create(profile_id=curr_user_profile, comment_id=obj)
        
        return Response({'message': 'success'}, status=status.HTTP_200_OK)

class UnLikeAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, object_type, object_id):
        curr_user, curr_user_profile = utils_get_user_and_profile(request.user.auth_token)
        obj = utils_find_object(object_type, object_id)

        #check if we havnt liked it yet
        if not check_likes_exist(curr_user_profile, obj, object_type):
            return Response({'message': 'you havnt liked this yet'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if object_type == 'Post':
                rel = LikesRel.objects.get(profile_id=curr_user_profile, post_id=obj)
            if object_type == 'Comment':
                rel = LikesRel.objects.get(profile_id=curr_user_profile, comment_id=obj)
            rel.remove()
            obj.likes = obj.likes - 1
            obj.save()
        except ObjectDoesNotExist:
            return Response({'message': 'could not find comment relation'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'success'}, status=status.HTTP_200_OK)

class GetIfLikedAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, object_type, object_id):
        curr_user, curr_user_profile = utils_get_user_and_profile(request.user.auth_token)
        obj = utils_find_object(object_type, object_id)

        if check_likes_exist(curr_user_profile, obj, object_type):
            return Response({'message': 'success'}, status=status.HTTP_200_OK)
        
        return Response({'message': 'could not find like'}, status=status.HTTP_404_NOT_FOUND)
