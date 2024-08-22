
from django.urls import path,include
from rest_framework import routers
from apps.authentication import views
from rest_framework.documentation import include_docs_urls
from .views import CustomPermissionListCreateAPIView, CustomPermissionDetailAPIView,UserPermissionViewSet
from django.urls import path
from .views import LoginAPIView
from rest_framework.routers import DefaultRouter

#router=routers.DefaultRouter()
#router.register(r'authentication',views.LoginAPIView,'authentication')
#
#urlpatterns=[
#
#     path("login/",include(router.urls)),
#     
#]

router = DefaultRouter()
router.register(r'user-permissions', UserPermissionViewSet, basename='user-permissions')



urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginAPIView.as_view(), name='api_login'),
    path("docs/",include_docs_urls(title="Centro medico APIS")),
    path('permisos/', CustomPermissionListCreateAPIView.as_view(), name='permisos-list-create'),
    path('permisos/<int:pk>/', CustomPermissionDetailAPIView.as_view(), name='permisos-detail'),
]
