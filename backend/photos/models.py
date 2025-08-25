from django.db import models

# Create your models here.
class Photos(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    address = models.TextField(default='', blank=True, null=True)
    img_url = models.URLField()
    notes = models.TextField(default='', blank=True, null=True)
    account_id = models.ForeignKey(
        'accounts.Accounts',
        on_delete=models.PROTECT,
        blank=True, null=True
    )
    book_id = models.ForeignKey(
        'books.Books',
        on_delete=models.PROTECT,
        blank=True, null=True
    )

    class Meta:
        ordering = ['create_time']