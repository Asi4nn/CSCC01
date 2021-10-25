from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from api.permissions import CanDelete
import api.models as my_models
from api.utils import *


class DeleteObjectAPIView(DestroyAPIView):
    permission_classes = [IsAuthenticated | CanDelete]

    def get_queryset(self):
        type_object = getattr(my_models, self.kwargs['object_type'])
        return type_object.objects.all()

    def delete(self, request, object_type, object_id):
        obj = utils_find_object(object_type, object_id)
        obj.delete()
        return Response({'message': 'success'}, status=status.HTTP_200_OK)
