import json, subprocess, requests

from django.shortcuts import get_object_or_404

from rest_framework import serializers, viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

from backend import configs
from backend.models import Restream, StreamEndpoint, UserProfile
from backend.endpoints import StreamEndpointSerializer
from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver

class RestreamSerializer(serializers.ModelSerializer):
    endpoints = StreamEndpointSerializer(many=True, read_only=True)

    def validate_owner(self, value):
        '''
        If the user isn't staff, don't let them create a restream
        with an owner other than themself.
        '''
        if self.context['request'].user.is_staff:
            return value
        userprofile = get_object_or_404(UserProfile, user=self.context['request'].user)
        return userprofile

    def update(self, instance, validated_data):


        return instance

    class Meta:
        model = Restream
        fields = ('id', 'name', 'owner', 'live', 'endpoints')

class RestreamOwnerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.owner == request.user

class RestreamsMeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        userprofile = get_object_or_404(UserProfile, user=request.user)
        restreams_objs = Restream.objects.filter(owner=userprofile)
        serializer = RestreamSerializer(restreams_objs, many=True)
        return Response(serializer.data)

class RestreamsCreateView(APIView):
    def post(self, request):
        if not "name" in request.data:
            return Response({"err": "Name is missing"}, status=400)
        
        owner = get_object_or_404(UserProfile, user=request.user)

        new_restream = Restream();
        new_restream.name = request.data["name"]
        new_restream.owner = owner

        new_restream.save()

        for endpoint_data in request.data["endpoints"]:
            endpoint = StreamEndpoint.objects.get(pk=endpoint_data['id'])
            new_restream.endpoints.add(endpoint)

        serializer = RestreamSerializer(new_restream)
        return Response(serializer.data)

class RestreamViewSet(viewsets.ModelViewSet):
    queryset = Restream.objects.all()
    serializer_class = RestreamSerializer
    permission_classes = (permissions.IsAuthenticated, RestreamOwnerPermission,)

    def get_queryset(self):
        if self.request.user.is_staff:
            return Restream.objects.all()
        else:
            user_profile = get_object_or_404(UserProfile, user=self.request.user)
            return Restream.objects.filter(owner=user_profile)

    def update(self, request, pk=None):
        cur_restream = get_object_or_404(Restream, id=pk)
        cur_restream.endpoints.clear()

        for endpoint in request.data['endpoints']:
            dbEndpoint = get_object_or_404(StreamEndpoint, pk=endpoint['id'])
            cur_restream.endpoints.add(dbEndpoint)

        return super(RestreamViewSet, self).update(request, pk)

class RestreamMeLiveView(APIView):
    def get(self, request):
        userprofile = get_object_or_404(UserProfile, user=request.user)
        # Get my restreams
        # Parse output from /stat, look for my restreams
        # Store the data somehow
        

@receiver(post_save, sender=Restream)
def save_restream_model(sender, instance, **kwargs):
    print("~~ A restream was just saved ~~")

    configs.gen_configs_for_restream(instance)
    requests.get("http://127.0.0.1:8888/api/reload")

@receiver(post_delete, sender=Restream)
def delete_orphans(sender, instance, **kwargs):
    configs.del_orphan_configs()
    requests.get("http://127.0.0.1:8888/api/reload")

@receiver(post_save, sender=StreamEndpoint)
def save_restream_model_by_endpoint(sender, instance, **kwargs):
    for restream in Restream.objects.filter(endpoints__in=[instance]):
        configs.gen_configs_for_restream(restream)
    requests.get("http://127.0.0.1:8888/api/reload")