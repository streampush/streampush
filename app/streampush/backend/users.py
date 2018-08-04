from .models import UserProfile
from rest_framework import serializers, permissions, viewsets, mixins
from django.contrib.auth.models import User

from django.db.models.signals import post_save
from django.dispatch import receiver

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'last_login', 'is_staff', 'date_joined', 'email',)

class UserProfileSerializer(serializers.ModelSerializer):
    metadata = UserSerializer(source='user')

    class Meta:
        model = UserProfile
        fields = ('id', 'metadata')
        depth = 2

class UserPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user

class UserProfileViewSet(mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin,
                         mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated, UserPermission,)

    def get_queryset(self):
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        else:
            userProfile = get_object_or_404(UserProfile, user=self.request.user)
            return UserProfile.objects.filter(owner=userProfile)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)