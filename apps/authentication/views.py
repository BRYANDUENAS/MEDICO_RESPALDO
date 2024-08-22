from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User,Permission,Group
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializer import LoginSerializer,UserSerializer,CustomPermissionSerializer,ChangePasswordSerializer,GroupSerializer
from .serializer import UserPermissionSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Cliente, Empleado,Codigo
from .serializer import ClienteSerializer, EmpleadoSerializer,CodigoSerializer
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny


"""
Maestros y códigos
"""
class CodigoListView(generics.ListAPIView):
    """
    Retrieve a list of `Codigo` filtered by the `ma_codigo` of the `Maestro`.
    """
    serializer_class = CodigoSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ma_codigo = self.kwargs['ma_codigo']  # Obtener el código del maestro de los parámetros de URL
        return Codigo.objects.filter(ma_idma__ma_codigo=ma_codigo)

"""
Login
"""
class LoginAPIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]  # Permitir a cualquier usuario acceder a esta vista

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
Cambio de contraseña
"""
class ChangePasswordView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Contraseña cambiada con éxito."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""
get grupos
"""
class GroupListView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]  # Restringir acceso solo a usuarios autenticados

"""
Crud permisos
"""
# Vista para listar y crear permisos
class CustomPermissionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Permission.objects.filter()
    serializer_class = CustomPermissionSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]  # Restringir acceso solo a usuarios autenticados

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

# Vista para recuperar, actualizar y eliminar un permiso específico
class CustomPermissionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Permission.objects.filter()
    serializer_class = CustomPermissionSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]  # Restringir acceso solo a usuarios autenticados

"""
Crud permisos - usuarios
"""

class UserPermissionViewSet(viewsets.ModelViewSet):
    serializer_class = UserPermissionSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
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

"""
Usuarios cliente y empleado 
"""

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]  # Restringir acceso solo a usuarios autenticados

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]  # Restringir acceso solo a usuarios autenticados