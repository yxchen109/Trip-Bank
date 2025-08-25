from django.urls import path
from accounts.views import AccountsOfDayView, OneAccountView, NewAccountView, EditAccountView, AccountsViewSet, ExchangeView

one_account = OneAccountView.as_view()
account_ofday = AccountsOfDayView.as_view()
add_account = NewAccountView.as_view()
edit_account = EditAccountView.as_view()
exchange = ExchangeView.as_view()
debug_get = AccountsViewSet.as_view({'get': 'list'})

urlpatterns = [
    path('view/', account_ofday, name='view'),
    path('view_account/', one_account, name='view_account'),
    path('add_account/', add_account, name='add_account'),
    path('edit_account/', edit_account, name='edit_account'),
    path('exchange/', exchange, name='exchange'),
    path('debug/', debug_get, name='debug')
]