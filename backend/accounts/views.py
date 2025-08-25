from django.shortcuts import render
from accounts.serializers import *
from users.models import Users, User_Account_Management
from accounts.models import Accounts
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response

# for exchange
import json
from google_currency import convert

class AccountsOfDayView(generics.ListAPIView):
    serializer_class = UserAccountsSerializer
    # permission_classes = (IsAuthenticated,)
    permission_classes = [AllowAny,]

    def get_query_list(self):
        try:
            user_email = self.request.GET.get('user_email')
            date = self.request.GET.get('date')
            user = Users.objects.get(email=user_email)
            accounts = Accounts.objects.filter(record_time__date=date) # __date: take the date of the datetime field
            
            mangement_list = []
            for account in accounts:
                queryset = User_Account_Management.objects.filter(users=user, accounts=account)
                mangement_list.append(queryset)

            return mangement_list
        except (KeyError, Users.DoesNotExist):
            return User_Account_Management.objects.none()
        
    def list(self, request, *args, **kwargs):
        
        account_item_list = []
        query_list = self.get_query_list()
        for queryset in query_list:
            serializer = self.get_serializer(queryset, many=True)
            if serializer.data:
                account_item_list.append(serializer.data[0])
        return Response({'account_item_list': account_item_list})
    
class OneAccountView(generics.ListAPIView):
    serializer_class = UserAccountsSerializer
    # permission_classes = (IsAuthenticated,)
    permission_classes = [AllowAny,]

    def get_queryset(self):
        try:
            user_email = self.request.GET.get('user_email')
            account_id = self.request.GET.get('account_id')
            user = Users.objects.get(email=user_email)
            account = Accounts.objects.get(id=account_id) # __date: take the date of the datetime field
            return User_Account_Management.objects.filter(users=user, accounts=account)
        except (KeyError, Users.DoesNotExist):
            return User_Account_Management.objects.none()
        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data[0])
    
class NewAccountView(generics.CreateAPIView):
    serializer_class = AccountSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

class EditAccountView(generics.UpdateAPIView):
    serializer_class = AccountSerializer
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]
        
    def get_object(self):
        try:
            account_id = self.request.data['account_id']
            account = Accounts.objects.get(id=account_id) # __date: take the date of the datetime field
            return account
        except (KeyError, Users.DoesNotExist):
            return Accounts.objects.none()
        
    def update(self, request, *args, **kwargs):
        # queryset = self.get_queryset()
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=self.request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'Edited account': serializer.data})
        else:
            return Response({"error": serializer.errors})

        # return Response({'Edited account': serializer.data})
    

class ExchangeView(generics.ListAPIView):
    # permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]

    def list(self, request, *args, **kwargs):

        price = self.request.GET.get('price')
        from_curr = self.request.GET.get('from_curr')
        to_curr = self.request.GET.get('to_curr')

        converted_str = convert(from_curr, to_curr, float(price))
        converted_price = json.loads(converted_str)["amount"]

        exchange_message = {
            "price": float(price),
            "from_curr": from_curr,
            "to_curr": to_curr,
            "converted_price": float(converted_price)
        }

        return Response(exchange_message)


#######################################################
# For Debugging
class AccountsViewSet(viewsets.ModelViewSet):   # For debugging
    queryset = Accounts.objects.all()
    serializer_class = AccountsDebugSerializer
    permission_classes = (IsAdminUser,)

    


