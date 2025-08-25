from rest_framework import serializers
from photos.models import Photos

class PhotosSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Photos
        fields = ['id', 'create_time', 'longitude', 'latitude', 'address', 'img_url', 'notes']
