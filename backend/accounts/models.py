from django.db import models
from django.utils import timezone

# Create your models here.
class Accounts(models.Model):
    CURRENTS_CHOICE = (
        ("USD", "USD"),
        ("EUR", "EUR"),
        ("TWD", "TWD"),
        ("KRW", "KRW"),
        ("JPY", "JPY"),
        ("THB", "THB"),
    )
    PAYMENT_CHOICE = (
        ("信用卡", "Card"),
        ("現金", "Cash"),
    )
    CATEGORY_CHOICE = {
        ("食物", "Food"),
        ("交通", "Trans"),
        ("娛樂", "ent"),
        ("衣服", "Clothes"),
        ("其他", "Other")
    }

    product_name = models.TextField(blank=True, null=True)
    record_time = models.DateTimeField(default=timezone.now)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    address = models.TextField(default='', blank=True, null=True)
    total_price = models.FloatField(blank=True, null=True)
    currents = models.CharField(max_length=3, choices=CURRENTS_CHOICE, default="TWD")
    payment = models.CharField(max_length=5, choices=PAYMENT_CHOICE, default="現金")
    photo = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICE, default="其他")
    notes = models.TextField(blank=True, null=True)
    account_keeper = models.EmailField(default=None)  # the person who record the account
    completed = models.BooleanField(default=False)
    book_belong = models.ForeignKey(
        'books.Books',
        on_delete=models.PROTECT,
        null=True,
        related_name='account'
    )


    class Meta:
        ordering = ['record_time']