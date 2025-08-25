from rest_framework import serializers
import datetime
from image.img_process import ImageDecode, ImageEncode
from accounts.models import Accounts
from books.models import Books
from users.models import Users
from users.models import User_Book_Management, User_Account_Management

class NewBookSerializer(serializers.ModelSerializer):
    budget = serializers.FloatField(write_only=True)
    user_email_list = serializers.ListField(
            child=serializers.EmailField(), allow_empty=True, write_only=True
    )
    
    class Meta:
        model = Books
        fields = ('id', 'name', 'start_time', 'end_time', 'cover_img', 'budget', 'notes', 'user_email_list')
    
    def create(self, validated_data):
        personal_budget = validated_data.pop('budget', 0)
        # print(personal_budget)

        # # process cover image
        # image_data = validated_data['cover_img']  # base64-encoded image
        # now = datetime.datetime.now()
        # currentTime = now.strftime("%m-%d-%Y-%H-%M-%S")  # get current time as the image name
        # imagePath = "image/books-" + currentTime
        # image_process = ImageDecode(image_data, imagePath)
        # img_name = image_process.decode_base64_to_image()  # decode the given base64 image, and store it in the folder

        # create new book
        book = Books.objects.create(
            name=validated_data['name'],
            start_time=validated_data['start_time'],
            end_time=validated_data['end_time'],
            # cover_img = img_name
        )

        if 'cover_img' in validated_data.keys():
            # process cover image
            image_data = validated_data['cover_img']  # base64-encoded image
            now = datetime.datetime.now()
            currentTime = now.strftime("%m-%d-%Y-%H-%M-%S")  # get current time as the image name
            imagePath = "image/books-" + currentTime
            image_process = ImageDecode(image_data, imagePath)
            img_name = image_process.decode_base64_to_image()  # decode the given base64 image, and store it in the folder
            book.cover_img = img_name

        if 'notes' in validated_data.keys():
            book.notes = validated_data['notes']
        
        book.save()

        # address user email list
        user_emails = validated_data['user_email_list']
        for email in user_emails:
            try:
                user = Users.objects.get(email=email)
                User_Book_Management.objects.create(users=user, books=book, budget=personal_budget)
            except:
                raise serializers.ValidationError(f"User with email '{email}' does not exist.")
        
        return book


class AllBooksSerializer(serializers.ModelSerializer):
    book_details = serializers.SerializerMethodField()

    class Meta:
        model = User_Book_Management
        fields = ['users', 'books', 'budget', 'expense', 'book_details']

    def get_book_details(self, obj):
        default_user_img = "image/default_user.webp"
        default_cover_img = "image/default_cover.jpeg"

        book = obj.books
        user_book_entries = User_Book_Management.objects.filter(books=book)
        # Extract user details for each user associated with the book
        user_list = [
            {
                'email': user_entry.users.email,
                'username': user_entry.users.username,
                # 'user_photo': user_entry.users.photo if user_entry.users.photo else default_user_img,
                'user_photo': ImageEncode(user_entry.users.photos).encode_image_to_base64() if user_entry.users.photo else ImageEncode(default_user_img).encode_image_to_base64(),
            }
            for user_entry in user_book_entries
        ]

        return {
            'name': book.name,
            'start_time': book.start_time,
            'end_time': book.end_time,
            # 'cover_img': book.cover_img.url if book.cover_img else default_cover_img,
            'cover_img': ImageEncode(book.cover_img).encode_image_to_base64() if book.cover_img else ImageEncode(default_cover_img).encode_image_to_base64(),
            'group_expense': book.group_expense,
            'notes': book.notes,
            'user_list': user_list,
        }


class DetailsSerializer(serializers.ModelSerializer):
    book_info = serializers.SerializerMethodField()

    class Meta:
        model = User_Book_Management
        fields = ['book_info']
    
    def add_account_to_categoryInfo(self, category_info, catagory_type, price):
        if price != -1 and price is not None:
            category_info[catagory_type]['total_price'] += price
        category_info[catagory_type]['count'] += 1
    
    def get_book_info(self, obj):
        default_user_img = "image/default_user.webp"
        default_cover_img = "image/default_cover.jpeg"
        book = obj.books
        user = obj.users

        # construct user list (buddies)
        user_book_entries = User_Book_Management.objects.filter(books=book)
        user_list = [
            {
                'email': user_entry.users.email,
                'username': user_entry.users.username,
                # 'user_photo': user_entry.users.photo if user_entry.users.photo else default_user_img,
                'user_photo': ImageEncode(user_entry.users.photo).encode_image_to_base64 if user_entry.users.photo else ImageEncode(default_user_img).encode_image_to_base64(),
            }
            for user_entry in user_book_entries
            if user_entry.users.email != user.email
        ]

        # construct money info
        money_info = {
            'budget': obj.budget,
            'expense': obj.expense,
        }

        # construct catagory info
        user_account_entries = User_Account_Management.objects.filter(users=user)
        account_list = [
            {
                'catagory_name': account_entry.accounts.category,
                'price': account_entry.accounts.total_price
            }
            for account_entry in user_account_entries
            if account_entry.accounts.book_belong.id == book.id
        ]
        category_info = {}
        for account in account_list:
            if account['catagory_name'] in category_info:
                self.add_account_to_categoryInfo(category_info, account['catagory_name'], account['price'])
            else:
                category_info[account['catagory_name']] = {
                    'total_price': 0.0,
                    'count': 0
                }
                self.add_account_to_categoryInfo(category_info, account['catagory_name'], account['price'])

        print("book cover image:")
        print(book.cover_img)

        return {
            'book_name': book.name,
            'start_time': book.start_time, 
            'end_time': book.end_time,
            # 'cover_img': ImageEncode(book.cover_img).encode_image_to_base64() if book.cover_img else ImageEncode(default_cover_img).encode_image_to_base64(),
            'cover_img': ImageEncode(book.cover_img).encode_image_to_base64() if book.cover_img else None,
            'user_list': user_list, 
            'money_info': money_info,
            'category_info': category_info,
        }


class MapsSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()

    class Meta:
        model = User_Account_Management
        fields = ['location']
    
    def get_location(self, obj):
        account = obj.accounts

        return {
            'longitude': account.longitude,
            'latitude': account.latitude,
            'address': account.address,
        }


class AccountsSerializer(serializers.ModelSerializer):
    account_details = serializers.SerializerMethodField()

    class Meta:
        model = User_Account_Management
        fields = ['users', 'accounts', 'price', 'account_details']

    def get_account_details(self, obj):
        account = obj.accounts
        user_account_entries = User_Account_Management.objects.filter(accounts=account)
        # Extract user details for each user associated with the book
        user_list = [
            {
                'email': user_entry.users.email,
                'username': user_entry.users.username,
                'split_price': user_entry.price,
                'user_photo': ImageEncode(user_entry.users.photos).encode_image_to_base64() if user_entry.users.photo else None,
            }
            for user_entry in user_account_entries
        ]
        return {
            'id': account.id,
            'product_name': account.product_name,
            'record_time': account.record_time,
            'longitude': account.longitude,
            'latitude': account.latitude,
            'address': account.address,
            'total_price': account.total_price,
            'currents': account.currents,
            'payment': account.payment,
            'category': account.category,
            'photo': ImageEncode(account.photo).encode_image_to_base64() if account.photo else None,
            'notes': account.notes,
            'account_keeper': account.account_keeper,
            'completed': account.completed,
            'book_id': account.book_belong.id,
            'user_list': user_list
        }
    

class DailyCostSerializer(serializers.ModelSerializer):
    total_cost = serializers.SerializerMethodField()

    class Meta:
        model = User_Account_Management
        fields = ['total_cost']
    
    def get_total_cost(self, obj):
        print(obj.price)
        return obj.price


class AllPhotosSerializer(serializers.ModelSerializer):
    photo_list = serializers.SerializerMethodField()

    class Meta:
        model = Accounts
        fields = ['photo_list']
    
    def get_photo_list(self, obj):
        return {
            'product_name': obj.product_name,
            'date': obj.record_time,
            'photo_base64': ImageEncode(obj.photo).encode_image_to_base64() if obj.photo else ImageEncode("image/default_cover.jpeg").encode_image_to_base64(),
        }


class DailyPhotosSerializer(serializers.ModelSerializer):
    photo_base64 = serializers.SerializerMethodField()

    class Meta:
        model = Accounts
        fields = ['product_name', 'longitude', 'latitude', 'address', 'total_price', 'currents', 'payment', 'photo_base64', 'category', 'notes']
    
    def get_photo_base64(self, obj):
        if obj.photo:
            return ImageEncode(obj.photo).encode_image_to_base64()
        else:
            ImageEncode("image/default_cover.jpeg").encode_image_to_base64()

#################################################################
# For Debugging
class BooksDebugSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Books
        fields = ['id', 'name', 'start_time', 'end_time', 'cover_img', 'group_expense', 'notes']