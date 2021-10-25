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

class RetrieveAssignmentMarkAPIView(APIView):

    def get(self, request, id, mid, pid):
        try:
            course = Course.objects.get(id=id)
            module = course.modules.get(id=mid)
            item = module.items.get(id=pid)
        except ObjectDoesNotExist:
            return Response({'message': 'invalid module/course/module item id'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.user_type == 'INSTR':
            serializer = AssignmentMarkSerializer(data=item.assignment)
        else:
            if not item.assignment.mark_visible:
                Response({'message': 'mark not visible'}, status=status.HTTP_204_NO_CONTENT)

            mark = item.assignment.marks.get(student=request.user)
            serializer = MarkSerializer(data=mark)

        serializer.is_valid()
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateAssignmentMarkAPIView(UpdateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentMarkSerializer

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            course = Course.objects.get(id=kwargs['id'])
            module = course.modules.get(id=kwargs['mid'])
            item = module.items.get(id=kwargs['pid'])
        except ObjectDoesNotExist:
            return Response({'message': 'invalid module/course/module item id'}, status=status.HTTP_400_BAD_REQUEST)

        if item.type == 'ASN':
            assignment = item.assignment
            assignment.mark_visible = serializer.data['mark_visible']
            for new_mark in serializer.data['marks']:
                if new_mark.student in course.enrolled_students:
                    mark = assignment.marks.get(student=new_mark.student)
                    mark.mark = new_mark.mark
                    mark.save()

            assignment.save()
            return Response({'message': 'mark updated success'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'invalid module item type'}, status=status.HTTP_400_BAD_REQUEST)

        