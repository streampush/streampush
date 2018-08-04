from django.shortcuts import get_object_or_404

from rest_framework import serializers, viewsets, permissions

from backend import configs
from backend.models import Restream, StreamEndpoint, UserProfile
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class RestreamSerializer(serializers.ModelSerializer):
    def validate_owner(self, value):
        if self.context['request'].user.is_staff:
            return value
        userprofile = get_object_or_404(UserProfile, user=self.context['request'].user)
        return userprofile

    class Meta:
        model = Restream
        fields = ('id', 'name', 'owner')

class RestreamOwnerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.owner == request.user

class RestreamViewSet(viewsets.ModelViewSet):
    queryset = Restream.objects.all()
    serializer_class = RestreamSerializer
    permission_classes = (permissions.IsAuthenticated, RestreamOwnerPermission,)

    def get_queryset(self):
        if self.request.user.is_staff:
            return Restream.objects.all()
        else:
            user_profile = get_object_or_404(UserProfile, user=self.request.user)
            return Restream.objects.filter(owner=userProfile)

@receiver(post_save, sender=Restream)
def save_restream_model(sender, instance, **kwargs):
    configs.gen_configs_for_restream(instance)

@receiver(post_save, sender=StreamEndpoint)
@receiver(post_delete, sender=StreamEndpoint)
def save_restream_model_by_endpoint(sender, instance, **kwargs):
    configs.gen_configs_for_restream(instance.restream)