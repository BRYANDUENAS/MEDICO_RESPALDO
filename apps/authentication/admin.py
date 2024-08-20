from django.contrib import admin
from django.contrib.auth.models import Group, Permission,User
from django.contrib.contenttypes.models import ContentType


# Register your models here.
admin.site.register(Permission)
admin.site.register(ContentType)
