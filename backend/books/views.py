from django.shortcuts import render
from django.db.models import Q, Min, Max
from accounts.models import Accounts
from books.models import Books
from users.models import Users, User_Book_Management, User_Account_Management
from books.serializers import NewBookSerializer, AllBooksSerializer, DetailsSerializer, MapsSerializer, AccountsSerializer, DailyCostSerializer, BooksDebugSerializer, AllPhotosSerializer, DailyPhotosSerializer
from rest_framework import viewsets
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response


class NewBookView(generics.CreateAPIView):
    serializer_class = NewBookSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

class AllBooksView(generics.ListAPIView):
    serializer_class = AllBooksSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def get_queryset(self):
        try:
            user_email = self.request.GET.get('user_email')
            user = Users.objects.get(email=user_email)
            return User_Book_Management.objects.filter(users=user)
        except (KeyError, Users.DoesNotExist):
            return User_Book_Management.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'book_list': serializer.data})


# GET /books/details: get the gerneral information of the book
class DetailsView(generics.ListAPIView):
    serializer_class = DetailsSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def get_queryset(self):
        try:
            user_email = self.request.GET.get('user_email')
            book_id = self.request.GET.get('book_id')
            user = Users.objects.get(email=user_email)
            book = Books.objects.get(id=book_id)
            return User_Book_Management.objects.filter(users=user, books=book)
        except (KeyError, Users.DoesNotExist):
            return User_Book_Management.objects.none()
        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        if serializer.data:
            return Response({'book_info': serializer.data[0]['book_info']})
        else:
            return Response({'book_info': serializer.data})


# GET /books/maps: get the daily maps of accounts
class MapsView(generics.ListAPIView):
    serializer_class = MapsSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def get_queryset(self):
        try:
            user_email = self.request.GET.get('user_email')
            book_id = self.request.GET.get('book_id')
            date = self.request.GET.get('date')
            user = Users.objects.get(email=user_email)
            book = Books.objects.get(id=book_id)
            account = Accounts.objects.filter(record_time__date=date, book_belong=book)
            return User_Account_Management.objects.filter(users=user, accounts__in=account)
        except (KeyError, Users.DoesNotExist):
            return User_Account_Management.objects.none()
        except (KeyError, Accounts.DoesNotExist):
            return User_Account_Management.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'map_info': serializer.data})


# GET /books/accounts: get the account details list based on the 'pie' or 'line' query
class AccountsView(generics.ListAPIView):
    serializer_class = AccountsSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def get_query_list(self):
        try:
            user_email = self.request.GET.get('user_email')
            book_id = self.request.GET.get('book_id')
            user = Users.objects.get(email=user_email)
            book = Books.objects.get(id=book_id)
            accounts = Accounts.objects.filter(book_belong=book)

            management_list = []
            for account in accounts:
                queryset = User_Account_Management.objects.filter(users=user, accounts=account)
                management_list.append(queryset)
            return management_list

        except (KeyError, Accounts.DoesNotExist):
            return Accounts.objects.none()
        
    def list(self, request, *args, **kwargs):
        account_item_list = []
        query_list = self.get_query_list()
        for queryset in query_list:
            serializer = self.get_serializer(queryset, many=True)
            if serializer.data:
                account_item_list.append(serializer.data[0])
        return Response({'account_list': account_item_list})


# GET /books/daily_cost: get the total_cost of a user of the given day
class DailyCostView(generics.ListAPIView):
    serializer_class = DailyCostSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def get_queryset(self):
        try:
            user_email = self.request.GET.get('user_email')
            book_id = self.request.GET.get('book_id')
            date = self.request.GET.get('date')
            user = Users.objects.get(email=user_email)
            book = Books.objects.get(id=book_id)
            account = Accounts.objects.filter(record_time__date=date, book_belong=book)
            print("@@@")
            return User_Account_Management.objects.filter(users=user, accounts__in=account)  # use accounts__in because there might be multiple accounts

        except:
            print("none")
            return User_Account_Management.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        total_cost = sum([entry['total_cost'] for entry in serializer.data if entry['total_cost'] != -1])
        return Response({'total_cost': total_cost})

# GET /books/all_photos: get the photos of a trip, one photo per date
class AllPhotosView(generics.ListAPIView):
    serializer_class = AllPhotosSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def get_queryset(self):
        try:
            user_email = self.request.GET.get('user_email')
            book_id = self.request.GET.get('book_id')
            user = Users.objects.get(email=user_email)
            book = Books.objects.get(id=book_id)
            return Accounts.objects.filter(  # filter the accounts recorded in this book
                book_belong=book,
                user_account_management__users=user  # reverse filter
            )

        except:
            return Accounts.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        photo_every_date = {}
        for entry in reversed(serializer.data):  # get the latest image of one day
            date = str(entry['photo_list']['date'].date())
            if date not in photo_every_date:
                date_photo = {
                    'product_name': entry['photo_list']['product_name'],
                    'photo': entry['photo_list']['photo_base64']
                }
                photo_every_date[date] = date_photo

        return Response({'photo_list': photo_every_date})


# GET /books/daily_photos: get the daily photos (of accounts)
class DailyPhotosView(generics.ListAPIView):
    serializer_class = DailyPhotosSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def get_queryset(self):
        try:
            user_email = self.request.GET.get('user_email')
            book_id = self.request.GET.get('book_id')
            date = self.request.GET.get('date')
            book = Books.objects.get(id=book_id)
            account = Accounts.objects.filter(
                    record_time__date=date, 
                    account_keeper=user_email,
                    book_belong=book
            )
            return account
        
        except:
            return Accounts.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'photo_list': serializer.data})

#################################################################
# For Debugging
class BooksDebugViewSet(viewsets.ModelViewSet):
    queryset = Books.objects.all()
    serializer_class = BooksDebugSerializer
    permission_classes = (IsAdminUser,)