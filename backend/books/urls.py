from django.urls import path
from books.views import NewBookView, AllBooksView, DetailsView, MapsView, AccountsView, DailyCostView, BooksDebugViewSet, AllPhotosView, DailyPhotosView

new_book = NewBookView.as_view()
all_books = AllBooksView.as_view()
details = DetailsView.as_view()
maps = MapsView.as_view()
accounts = AccountsView.as_view()
daily_cost = DailyCostView.as_view()
all_photos = AllPhotosView.as_view()
daily_photos = DailyPhotosView.as_view()

# for debugging
debug = BooksDebugViewSet.as_view({'get': 'list'})

urlpatterns = [
    path('all_books/', all_books, name='all_books'),
    path('new_book/', new_book, name='new_book'),
    path('details/', details, name='details'),
    path('maps/', maps, name='maps'),
    path('accounts/', accounts, name='accounts'),
    path('daily_cost/', daily_cost, name='daily_cost'),
    path('all_photos/', all_photos, name='all_photos'),
    path('daily_photos/', daily_photos, name='daily_photos'),
    path('debug/', debug, name='debug')
]