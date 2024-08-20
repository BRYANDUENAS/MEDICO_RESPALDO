from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User,Permission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializer import LoginSerializer,UserSerializer,CustomPermissionSerializer
from .serializer import UserPermissionSerializer
from rest_framework.permissions import IsAuthenticated



"""
Login
"""
class LoginAPIView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get("username")
            password = serializer.data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                
                # Serializar los datos completos del usuario
                user_serializer = UserSerializer(user)
                
                return Response({
                    "detail": "Successfully logged in",
                    "user": user_serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
"""
Crud permisos
"""
# Vista para listar y crear permisos
class CustomPermissionListCreateAPIView(ListCreateAPIView):
    queryset = Permission.objects.filter()
    serializer_class = CustomPermissionSerializer

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


# Vista para recuperar, actualizar y eliminar un permiso específico
class CustomPermissionDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Permission.objects.filter()
    serializer_class = CustomPermissionSerializer


"""
Crud permisos - usuarios
"""

class UserPermissionViewSet(viewsets.ModelViewSet):
    serializer_class = UserPermissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.user_permissions.through.objects.all()

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        permission_id = request.data.get('permission')

        try:
            user = User.objects.get(pk=user_id)
            permission = Permission.objects.get(pk=permission_id)
        except (User.DoesNotExist, Permission.DoesNotExist) as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        user.user_permissions.add(permission)
        return Response({'detail': 'Permission added successfully'}, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        # Obtener el ID de la relación
        relation_id = kwargs.get('pk')
        try:
            # Obtener la relación usando el ID
            relation = User.user_permissions.through.objects.get(pk=relation_id)
            user = relation.user
            permission = relation.permission
        except User.user_permissions.through.DoesNotExist as e:
            return Response({'detail': str(e)}, status=status.HTTP_404_NOT_FOUND)

        # Eliminar el permiso del usuario
        user.user_permissions.remove(permission)
        return Response({'detail': 'Permission removed successfully'}, status=status.HTTP_204_NO_CONTENT)