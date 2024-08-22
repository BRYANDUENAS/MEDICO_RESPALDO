import re
from django.contrib.auth.models import User,Group, Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from .models import Cliente, Empleado,Codigo
from django.contrib.auth.models import User

"""
Maestros y codigos
"""
class CodigoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Codigo
        fields = ['id', 'co_codigo', 'co_nombre', 'co_descripcion', 'co_param1', 'co_param2', 'co_is_active', 'ma_idma']

"""
 Usuarios
"""
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

# Serializer para los permisos
class PermissionSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    

    class Meta:
        model = Permission
        fields = ['id','codename', 'name']

    def get_name(self, obj):
        content_type_app_label = obj.content_type.app_label
        content_type_model = obj.content_type.model
        return f"{content_type_app_label}| {content_type_model} |{ obj.name} "

# Serializer para los grupos
class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ["id",'name', 'permissions']

class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'groups', 'user_permissions']

#cambio de contraseña
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        return value

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La nueva contraseña debe tener al menos 8 caracteres.")
        
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("La nueva contraseña debe contener al menos una letra mayúscula.")
        
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("La nueva contraseña debe contener al menos una letra minúscula.")
        
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("La nueva contraseña debe contener al menos un número.")
        
        # Verifica si contiene al menos un signo especial
        if not re.search(r'[^\w\s]', value):  # Signos especiales: cualquier carácter que no sea una letra, número o espacio
            raise serializers.ValidationError("La nueva contraseña debe contener al menos un signo especial.")

        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

"""
Permisos
"""
class CustomPermissionSerializer(serializers.ModelSerializer):
    content_type = serializers.SerializerMethodField()

    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']

    def get_content_type(self, obj):
        return {
            'app_label': obj.content_type.app_label,
            'model': obj.content_type.model
        }

    def create(self, validated_data):
        content_type, created = ContentType.objects.get_or_create(app_label='custom', model='permission')
        permission = Permission.objects.create(content_type=content_type, **validated_data)
        return permission
    

"""
Permisos - Usuarios
"""
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']

class UserPermissionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    permission = PermissionSerializer()

    class Meta:
        model = User.user_permissions.through
        fields = ["id",'user', 'permission']


"""
Usuarios cliente y empleado
"""

class ClienteSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    group_name = serializers.CharField(write_only=True)

    class Meta:
        model = Cliente
        fields = ["id",'user', 'ficha_medica', 'group_name']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        group_name = validated_data.pop('group_name')

        # Crear el usuario con la contraseña igual al nombre de usuario
        user = User.objects.create(**user_data)
        user.set_password(user.username)
        user.save()

        cliente = Cliente.objects.create(user=user, **validated_data)
        cliente.save(group_name=group_name)
        return cliente

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        group_name = validated_data.pop('group_name')
        user = instance.user

        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update cliente fields
        instance.ficha_medica = validated_data.get('ficha_medica', instance.ficha_medica)
        instance.save(group_name=group_name)
        return instance

class EmpleadoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    group_name = serializers.CharField(write_only=True)

    class Meta:
        model = Empleado
        fields = ["id",'user', 'cargo', 'group_name']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        group_name = validated_data.pop('group_name')

        # Crear el usuario con la contraseña igual al nombre de usuario
        user = User.objects.create(**user_data)
        user.set_password(user.username)
        user.save()

        empleado = Empleado.objects.create(user=user, **validated_data)
        empleado.save(group_name=group_name)
        return empleado

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        group_name = validated_data.pop('group_name')
        user = instance.user

        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update empleado fields
        instance.cargo = validated_data.get('cargo', instance.cargo)
        instance.save(group_name=group_name)
        return instance
