from django.db import models

# Create your models here.
class Books(models.Model):
    name = models.TextField(max_length=50, default='')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # cover_img = models.ImageField(upload_to='images/', blank=True, null=True)
    cover_img = models.TextField(blank=True, null=True)
    group_expense = models.FloatField(default=0.0)
    notes = models.TextField(max_length=100, default='', blank=True, null=True)


    class Meta:
        ordering = ['start_time']