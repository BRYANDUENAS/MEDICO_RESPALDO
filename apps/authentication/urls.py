
from django.urls import path,include
from rest_framework import routers
from apps.authentication import views
from rest_framework.documentation import include_docs_urls


#router=routers.DefaultRouter()
#router.register(r'authentication',views.LoginAPIView,'authentication')
#
#urlpatterns=[
#
#     path("login/",include(router.urls)),
#     
#]

from django.urls import path
from .views import LoginAPIView

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='api_login'),
    path("docs/",include_docs_urls(title="Centro medico APIS")),
]
