from rest_framework import serializers
import datetime
from image.img_process import ImageEncode, ImageDecode
from accounts.models import Accounts
from users.models import Users, User_Account_Management, User_Book_Management
from books.models import Books
from address.address import Address 

# from vision.image_detect import detect_labels

class UserAccountsSerializer(serializers.ModelSerializer):
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
                # 'user_photo': user_entry.users.photo if user_entry.users.photo else default_user_img,
                'user_photo': ImageEncode(user_entry.users.photos).encode_image_to_base64() if user_entry.users.photo else None,
            }
            for user_entry in user_account_entries
        ]

        # use detection model
        # if account.product_name is None and account.photo is not None:
        #     detected_name, detected_labels = detect_labels(account.photo)

        return {
            'id': account.id,
            'product_name': account.product_name,
            # 'product_name': account.product_name if account.product_name else detected_name,
            # 'name_option': detected_labels,
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
    
class AccountSerializer(serializers.ModelSerializer):
    
    user_email = serializers.EmailField(write_only=True)

    price_list = serializers.ListField(
            child=serializers.FloatField(), allow_empty=True, write_only=True, default=[]
    )
    user_email_list = serializers.ListField(
            child=serializers.EmailField(), allow_empty=True, write_only=True, default=[]
    )

    book_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Accounts
        fields = ['id', 'product_name', 'record_time', 'longitude', 'latitude',
                   'address', 'total_price', 'currents', 'payment', 'photo', 'category', 'notes',
                    'completed', 'user_email', 'price_list', 'user_email_list', 'book_id']
        
    def create(self, validated_data):
        # create account 
        account = Accounts.objects.create(
            account_keeper = validated_data['user_email'],
            longitude = validated_data['longitude'],
            latitude = validated_data['latitude'],
            completed = validated_data['completed'],
        )
        
        # handle account photo
        now = datetime.datetime.now()
        currentTime = now.strftime("%m-%d-%Y-%H-%M-%S")  # get current time as the image name
        imagePath = "image/accounts-" + currentTime

        if 'address' in validated_data.keys():
            account.address = validated_data['address']
        else:
            account.address = Address(account.latitude, account.longitude).get_address()

        if 'product_name' in validated_data.keys():
            account.product_name = validated_data['product_name']
        if 'record_time' in validated_data.keys():
            account.record_time = validated_data['record_time']
        if 'total_price' in validated_data.keys():
            account.total_price = validated_data['total_price']
        if 'currents' in validated_data.keys():
            account.currents = validated_data['currents']
        if 'payment' in validated_data.keys():
            account.payment = validated_data['payment']
        if 'category' in validated_data.keys():
            account.category = validated_data['category']
        if 'notes' in validated_data.keys():
            account.notes = validated_data['notes']
        if 'photo' in validated_data.keys():
            image_process = ImageDecode(validated_data['photo'], imagePath)
            img_name = image_process.decode_base64_to_image()
            account.photo = img_name
        
        # # use detection model
        # if 'product_name' not in validated_data.keys() and 'photo' in validated_data.keys():
        #     detected_name, detected_labels = detect_labels(account.photo)
        #     account.product_name = detected_name

        account.save()

        # create user relation
        user_emails = validated_data['user_email_list']
        prices = validated_data['price_list']

        if len(user_emails) == 0:
            user_emails.append(validated_data['user_email'])
            if 'total_price' in validated_data.keys():
                prices.append(validated_data['total_price'])   
            else:
                prices.append(-1)

        # create book relation
        book_id = validated_data['book_id']
        try:
            book = Books.objects.get(id=book_id)
            book.account.add(account)
        except:
            raise serializers.ValidationError(f"The book with ID '{book_id}' does not exist.")

        for price, email in zip(prices, user_emails):
            try:
                user = Users.objects.get(email=email)
                User_Account_Management.objects.create(users=user, accounts=account, price=price)

                # update book expense
                book_user_relation = User_Book_Management.objects.get(users=user, books=account.book_belong)
                book_user_relation.expense += price
                book_user_relation.save()
            except:
                raise serializers.ValidationError(f"User with email '{email}' does not exist.")
        
        

        return account
    
    def update(self, instance, validated_data):
        
        # Check if the user is account keeper
        email = validated_data['user_email']
        if instance.account_keeper != email:
            raise serializers.ValidationError(f"User with email '{email}' cannot edit this account.")
        
        # handle account photo
        now = datetime.datetime.now()
        currentTime = now.strftime("%m-%d-%Y-%H-%M-%S")  # get current time as the image name
        imagePath = "image/accounts-" + currentTime

        if 'product_name' in validated_data.keys():
            instance.product_name = validated_data['product_name']
        if 'record_time' in validated_data.keys():
            instance.record_time = validated_data['record_time']
        if 'longitude' in validated_data.keys():
            instance.longitude = validated_data['longitude']
        if 'latitude' in validated_data.keys():
            instance.latitude = validated_data['latitude']
        if 'address' in validated_data.keys():
            instance.address = validated_data['address']
        if 'total_price' in validated_data.keys():
            instance.total_price = validated_data['total_price']
        if 'currents' in validated_data.keys():
            instance.currents = validated_data['currents']
        if 'payment' in validated_data.keys():
            instance.payment = validated_data['payment']
        if 'category' in validated_data.keys():
            instance.category = validated_data['category']
        if 'notes' in validated_data.keys():
            instance.notes = validated_data['notes']
        if 'completed' in validated_data.keys():
            instance.completed = validated_data['completed']

        if 'photo' in validated_data.keys():
            image_process = ImageDecode(validated_data['photo'], imagePath)
            img_name = image_process.decode_base64_to_image()
            instance.photo = img_name

        # # use detection model
        # if instance.product_name is None and 'product_name' not in validated_data.keys() and 'photo' in validated_data.keys():
        #     detected_name, detected_labels = detect_labels(instance.photo)
        #     instance.product_name = detected_name

        instance.save()

        """
        Handle the User-Account Relation
            1. The relation is already exist: edit the price
            2. The relation is not exist: create new relation
            3. Delete the relation when the user is not in the split list after update 
        """

        # get the user list. if the list is empty, append the keeper into the list
        if 'user_email_list' in validated_data.keys():
            user_emails = validated_data['user_email_list']
        else:
            user_emails = []
        if 'price_list' in validated_data.keys():
            prices = validated_data['price_list']
        else:
            prices = []

        if len(user_emails) == 0:
            user_emails.append(validated_data['user_email'])
            if 'total_price' in validated_data.keys():
                prices.append(validated_data['total_price'])   
            else:
                prices.append(-1)

        # check if the user is exist
        for email, price in zip(user_emails, prices):
            user = Users.objects.get(email=email)
            try:
                relation = User_Account_Management.objects.get(users=user, accounts=instance)
                relation.users = user
                relation.accounts = instance
                relation.price = price
                relation.save()
            except:
                User_Account_Management.objects.create(users=user, accounts=instance, price=price)

            # update book expense
            book_user_relation = User_Book_Management.objects.get(users=user, books=instance.book_belong)
            book_user_relation.expense += price
            book_user_relation.save()

        # Delete the relation which its user is not in the split list
        user_account_entries = User_Account_Management.objects.filter(accounts=instance)
        for entry in user_account_entries:

            book_user_relation = User_Book_Management.objects.get(users=entry.users, books=instance.book_belong)
            book_user_relation.expense -= price
            book_user_relation.save()

            if entry.users.email not in user_emails:  
                entry.delete()

        return instance
    

#######################################################
# For Debugging
class AccountsDebugSerializer(serializers.HyperlinkedModelSerializer):   # For debbugging
    class Meta:
        model = Accounts
        fields = ['id', 'product_name', 'record_time', 'longitude', 'latitude', 'address', 'total_price', 'currents', 'payment', 'notes', 'completed']
