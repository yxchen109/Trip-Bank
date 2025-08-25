from django.shortcuts import render
from photos.models import Photos
from photos.serializers import PhotosSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class PhotosViewSet(viewsets.ModelViewSet):
    queryset = Photos.objects.all().order_by('create_time')
    serializer_class = PhotosSerializer
    permission_classes = (IsAuthenticated,)
