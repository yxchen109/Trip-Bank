from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager
from accounts.models import Accounts
from books.models import Books

# Create your models here.
class Users(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True, default=None)
    username = models.CharField(max_length=20, default='tmp_user')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    # photo = models.ImageField(upload_to='image/', blank=True, null=True)
    photo = models.TextField(blank=True, null=True)
    
    account = models.ManyToManyField(Accounts,
                                    through='User_Account_Management', through_fields=('users', 'accounts'))
    book = models.ManyToManyField(Books,
                                      through='User_Book_Management', through_fields=('users', 'books'))

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
class User_Account_Management(models.Model):
    users = models.ForeignKey(Users, on_delete=models.CASCADE)
    accounts = models.ForeignKey(Accounts, on_delete=models.CASCADE)

    price = models.FloatField(default=0.0)

    def __str__(self):
        return f'{self.user} {self.account} price: {self.price}'
    
    class Meta:
        db_table = 'user_account_management'

class User_Book_Management(models.Model):
    users = models.ForeignKey(Users, on_delete=models.CASCADE)
    books = models.ForeignKey(Books, on_delete=models.CASCADE)

    budget = models.FloatField(default=0.0)
    expense = models.FloatField(default=0.0)

    def __str__(self):
        return f'{self.users} {self.books} budget: {self.budget}, expense: {self.expense}'
    
    class Meta:
        db_table = 'user_book_management'

