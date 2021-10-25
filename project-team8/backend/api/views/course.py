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
from ..serializers import *
from ..models import *
from ..permissions import *


class CreateCourseAPIView(CreateAPIView):
    serializer_class = CreateCourseSerializer
    permission_classes = [IsAuthenticated & CanCreateCourse]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_course = Course(course_name=serializer.data['course_name'], professor=request.user,
                            course_code=serializer.data['course_code'], password=serializer.data['password'], calendar_link=serializer.data["calendar_link"])
        new_course.save()
        return Response({'message': 'course created success'}, status=status.HTTP_201_CREATED)


class RetrieveAllCourseListAPIView(ListAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class RetrieveCourseListAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    def get(self, request, *args, **kwargs):
        if request.user.user_type == "INSTR":
            # get all courses which the instructor owns
            courses = Course.objects.filter(professor=request.user)
            serializer = self.get_serializer(data=courses, many=True)
            serializer.is_valid()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # get all courses which the user is enrolled in
            courses = Course.objects.filter(enrolled_students=request.user.id)
            serializer = self.get_serializer(data=courses, many=True)
            serializer.is_valid()
            return Response(serializer.data, status=status.HTTP_200_OK)


class CreateCourseAPIView(CreateAPIView):
    serializer_class = CreateCourseSerializer
    permission_classes = [IsAuthenticated & CanCreateCourse]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(auth_token=request.user.auth_token)
        new_course = Course(course_name=serializer.data['course_name'], professor=user,
                            course_code=serializer.data['course_code'], password=serializer.data['password'], calendar_link=serializer.data["calendar_link"])
        new_course.save()
        return Response({'message': 'course created success'}, status=status.HTTP_201_CREATED)


class RetrieveCourseDetailsAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    lookup_field = "id"


class EnrollInCourseAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated & IsStudent]
    serializer_class = EnrollInCourseSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        course = Course.objects.get(id=kwargs['id'])
        if request.user in course.enrolled_students.all():
            return Response({'detail': 'Student Already Enrolled in Course'}, status=status.HTTP_400_BAD_REQUEST)
        elif course.password == serializer.data['password']:
            course.enrolled_students.add(request.user)
            course.save()
            return Response({'message': 'Enrolled Student in Course'}, status=status.HTTP_200_OK)
        else:
            return Response({'password': ['Bad password']}, status=status.HTTP_400_BAD_REQUEST)


class UnEnrollCourseAPIView(DestroyAPIView):
    permission_classes = [IsAuthenticated & IsInCourse]

    def delete(self, request, course_id):
        course = utils_find_object("Course", course_id)
        course.enrolled_students.remove(request.user.id)
        return Response({'message': 'success'}, status=status.HTTP_200_OK)


class RetrieveModuleListAPIView(RetrieveAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

    def validateInCourse(self, request, course):
        return request.user in course.enrolled_students.all() or request.user == course.professor

    def get(self, request, *args, **kwargs):
        try:
            course = Course.objects.get(id=kwargs['id'])
        except ObjectDoesNotExist:
            return Response({'message': 'invalid course id'}, status=status.HTTP_400_BAD_REQUEST)

        if not self.validateInCourse(request, course):
            return Response({'message': 'permission denied'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=course.modules.all(), many=True)
        serializer.is_valid()
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateModuleAPIView(CreateAPIView):
    permission_classes = [CanCreateCourse]
    queryset = Module.objects.all()
    serializer_class = PartialModuleSerializer

    def validateInCourse(self, request, course):
        return request.user in course.enrolled_students.all() or request.user == course.professor

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            course = Course.objects.get(id=kwargs['id'])
        except ObjectDoesNotExist:
            return Response({'message': 'invalid course id'}, status=status.HTTP_400_BAD_REQUEST)

        new_module = Module(name=serializer.data['name'], description=serializer.data['description'])
        new_module.save()
        course.modules.add(new_module)
        course.save()
        return Response({'message': 'module created success'}, status=status.HTTP_201_CREATED)


class ModuleAPIView(UpdateAPIView, DestroyAPIView):
    permission_classes = [CanCreateCourse]
    queryset = Module.objects.all()
    serializer_class = PartialModuleSerializer

    def delete(self, request, *args, **kwargs):
        module = Module.objects.get(id=kwargs['mid'])

        items = module.items.all()
        items.delete()
        module.delete()
        return Response({'message': 'module deleted success'}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            course = Course.objects.get(id=kwargs['id'])
            module = course.modules.get(id=kwargs['mid'])
        except ObjectDoesNotExist:
            return Response({'message': 'invalid course id'}, status=status.HTTP_400_BAD_REQUEST)

        module.name = serializer.data['name']
        module.description = serializer.data['description']
        module.save()
        return Response({'message': 'module updated success'}, status=status.HTTP_200_OK)


class CreateModuleItemAPIView(CreateAPIView):
    permission_classes = [CanCreateCourse]
    queryset = ModuleItem.objects.all()
    serializer_class = ModuleItemSerializer

    def create_student_marks(self, course, assignment):
        for student in course.enrolled_students.all():
            mark = Mark(student=student)
            assignment.marks.add(mark)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            print(kwargs['id'], kwargs['mid'])
            course = Course.objects.get(id=kwargs['id'])
            module = course.modules.get(id=kwargs['mid'])
        except ObjectDoesNotExist:
            return Response({'message': 'invalid module/course id'}, status=status.HTTP_400_BAD_REQUEST)

        module_item = ModuleItem(name=serializer.data['name'], type=serializer.data['type'],
                                 date=serializer.data['date'])

        if serializer.data['type'] == 'ASN':
            asn = Assignment(notes=serializer.data['assignment']['notes'])
            self.create_student_marks(course, asn)
            asn.save()
            module_item.assignment = asn
        elif serializer.data['type'] == 'LEC':
            lec = Lecture(video=serializer.data['lecture']['video'], notes=serializer.data['lecture']['notes'])
            lec.save()
            module_item.lecture = lec
        else:
            return Response({'message': 'invalid module item type'}, status=status.HTTP_400_BAD_REQUEST)

        module_item.save()
        module.items.add(module_item)
        module.save()
        return Response({'message': 'module item created success'}, status=status.HTTP_201_CREATED)


class ModuleItemAPIView(UpdateAPIView, DestroyAPIView):
    permission_classes = [CanCreateCourse]
    queryset = ModuleItem.objects.all()
    serializer_class = EditModuleItemSerializer

    def delete(self, request, *args, **kwargs):
        try:
            course = Course.objects.get(id=kwargs['id'])
            module = course.modules.get(id=kwargs['mid'])
            item = module.items.get(id=kwargs['pid'])
        except ObjectDoesNotExist:
            return Response({'message': 'invalid module/course id'}, status=status.HTTP_400_BAD_REQUEST)

        item.delete()
        return Response({'message': 'module deleted success'}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            course = Course.objects.get(id=kwargs['id'])
            module = course.modules.get(id=kwargs['mid'])
            item = module.items.get(id=kwargs['pid'])
        except ObjectDoesNotExist:
            return Response({'message': 'invalid module/course/module item id'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.data['type'] == 'ASN':
            item.assignment.notes = serializer.data['assignment']['notes']
            item.date = serializer.data['date']
        elif serializer.data['type'] == 'LEC':
            item.lecture.video = serializer.data['lecture']['video']
            item.lecture.notes = serializer.data['lecture']['notes']
            item.date = serializer.data['date']
        else:
            return Response({'message': 'invalid module item type'}, status=status.HTTP_400_BAD_REQUEST)

        item.name = serializer.data['name']
        item.save()
        return Response({'message': 'module item updated success'}, status=status.HTTP_200_OK)
