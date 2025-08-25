from django.urls import path
from users.views import UsersViewSet, AllBuddyView, UserDebugViewSet

all_users = UsersViewSet.as_view({'get': 'all_users'})
all_buddy = AllBuddyView.as_view()
debug = UserDebugViewSet.as_view({'get': 'list'})

urlpatterns = [
    path('all_users/', all_users, name='all_users'),
    path('all_buddy/', all_buddy, name='all_buddy'),
    path('debug/', debug, name='debug')
]