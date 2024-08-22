from django.db import models
from django.contrib.auth.models import  Group,User

# Create your models here.
"""
Maestros
"""
class Maestro (models.Model):
    id = models.AutoField(primary_key=True)
    ma_codigo = models.CharField(max_length=50)
    ma_nombre = models.CharField(max_length=100)
    ma_descripcion = models.TextField(blank=True, null=True )
    ma_is_active = models.BooleanField(default=True)
    def __str__(self):
        return f"maestro {self.id} - {self.ma_nombre}"
    
class Codigo (models.Model):
    id = models.AutoField(primary_key=True)
    co_codigo = models.CharField(max_length=50)
    co_nombre = models.CharField(max_length=100)
    co_descripcion = models.TextField(blank=True, null=True )
    co_param1 = models.CharField(max_length=100, null=True, blank=True)
    co_param2 = models.CharField(max_length=100, null=True, blank=True)
    co_is_active = models.BooleanField(default=True)
    ma_idma = models.ForeignKey(Maestro,null=False,blank=False,on_delete=models.RESTRICT)
    def __str__(self):
        return self.co_nombre

"""
 Usuarios 
"""

class Cliente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ficha_medica = models.TextField()

    def save(self, *args, **kwargs):
        group_name = 'Paciente'
        super().save(*args, **kwargs)

        # Asigna el grupo de 'Paciente' al cliente
        group, _ = Group.objects.get_or_create(name=group_name)
        self.user.groups.clear()
        self.user.groups.add(group)

    def __str__(self):
        return f"{self.user.username} - Cliente"

class Empleado(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cargo = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        group_name = kwargs.pop('group_name', None)
        super().save(*args, **kwargs)

        if group_name:
            # Remover al usuario de todos los grupos
            self.user.groups.clear()

            # Asignar el grupo recibido desde el frontend
            group, _ = Group.objects.get_or_create(name=group_name)
            self.user.groups.add(group)

    def __str__(self):
        return f"{self.user.username} - Empleado"
    

"""
Menu 
"""
class MenuItem(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=200, blank=True, null=True)
    nivel = models.PositiveIntegerField(default=1)  # Nivel en la jerarquía del menú
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    groups = models.ManyToManyField(Group, related_name='menu_items')
    order = models.PositiveIntegerField(default=0)
    icon = models.CharField(max_length=50, blank=True, null=True, help_text="Clase CSS para el ícono (por ejemplo, 'fa fa-home').")
    is_active = models.BooleanField(default=True, help_text="Indica si el elemento del menú está activo o no.")

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['nivel', 'order']
