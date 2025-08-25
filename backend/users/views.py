from django.shortcuts import render
from image.img_process import ImageEncode
from users.models import Users, User_Book_Management
from users.serializers import UsersSerializer, AllBuddySerializer, UsersDebugSerializer
from books.models import Books
from rest_framework import viewsets
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def all_users(self, request, *args, **kwargs):
        try:
            queryset = Users.objects.all()
            serializer = UsersSerializer(queryset, many=True)
            default_img_path = "image/default_user.webp"  # use default image
            for item in serializer.data:
                item['photo'] = ImageEncode(default_img_path).encode_image_to_base64()
            return Response({'all_users': serializer.data})
        except:
            return Response({'error': 'Fail to get the user list.'}, status=400)
    

class AllBuddyView(generics.ListAPIView):
    serializer_class = AllBuddySerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def get_queryset(self):
        try:
            user_email = self.request.GET.get('user_email')
            book_id = self.request.GET.get('book_id')
            user = Users.objects.get(email=user_email)
            book = Books.objects.get(id=book_id)
            # get the book of the user (avoid getting multiple same books)
            return User_Book_Management.objects.filter(books=book, users=user)

        except:
            return User_Book_Management.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'buddy_list': serializer.data[0]["buddy_list"]})
        
# For debugging
class UserDebugViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersDebugSerializer
    permission_classes = (IsAdminUser,)