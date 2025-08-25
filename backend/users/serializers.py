from rest_framework import serializers
from image.img_process import ImageEncode
from users.models import Users, User_Book_Management

class UsersSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'email', 'username', 'photo']

class AllBuddySerializer(serializers.ModelSerializer):
    buddy_list = serializers.SerializerMethodField()

    class Meta:
        model = User_Book_Management
        fields = ['buddy_list']
    
    def get_buddy_list(self, obj):
        default_user_img = "image/default_user.webp"

        book = obj.books
        user = obj.users
        user_book_entries = User_Book_Management.objects.filter(books=book)

        # Extract user info
        user_list = [
            {
                'email': user_entry.users.email,
                'username': user_entry.users.username,
                'user_photo': ImageEncode(user_entry.users.photo).encode_image_to_base64() if user_entry.users.photo else ImageEncode(default_user_img).encode_image_to_base64(),
            }
            for user_entry in user_book_entries
            if user_entry.users.email != user.email  # exclude the user, so the request will only return his buddies
        ]
        return user_list
    
class UsersDebugSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'email', 'username', 'is_staff', 'is_active', 'is_superuser', 'date_joined']