
from django.urls import path,include
from rest_framework import routers
from apps.authentication import views
from rest_framework.documentation import include_docs_urls
from .views import CustomPermissionListCreateAPIView, CustomPermissionDetailAPIView,UserPermissionViewSet
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LoginAPIView,ClienteViewSet, EmpleadoViewSet,ChangePasswordView,GroupListView,CodigoListView,MenuItemViewSet



"""
routers
"""
router = DefaultRouter()
router.register(r'user-permissions', UserPermissionViewSet, basename='user-permissions')
router.register(r'clientes', ClienteViewSet)
router.register(r'empleados', EmpleadoViewSet)
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')



urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginAPIView.as_view(), name='api_login'),
   
    path('permisos/', CustomPermissionListCreateAPIView.as_view(), name='permisos-list-create'),
    path('permisos/<int:pk>/', CustomPermissionDetailAPIView.as_view(), name='permisos-detail'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
     path('groups/', GroupListView.as_view(), name='group-list'),
     path('codigos/<str:ma_codigo>/', CodigoListView.as_view(), name='codigo-list'),
    
]
