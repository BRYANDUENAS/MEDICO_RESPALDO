from django.contrib.auth.models import User,Group, Permission,ContentType
from rest_framework import serializers


"""
 Usuarios
"""
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


# Serializer para los permisos
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['codename', 'name']

# Serializer para los grupos
class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ['name', 'permissions']

class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'groups', 'user_permissions']


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
        fields = ['user', 'permission']