from backend.models import StreamEndpoint, UserProfile
from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

class StreamEndpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = StreamEndpoint
        fields = ('id', 'name', 'url', 'brand')

class StreamEndpointOwnerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.owner == request.user

class EndpointsMeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        userprofile = get_object_or_404(UserProfile, user=request.user)
        endpoints_objs = StreamEndpoint.objects.filter(owner=userprofile)
        serializer = StreamEndpointSerializer(endpoints_objs, many=True)
        return Response(serializer.data)

class EndpointViewSet(viewsets.ModelViewSet):
    queryset = StreamEndpoint.objects.all()
    serializer_class = StreamEndpointSerializer
    permission_classes = (permissions.IsAuthenticated, StreamEndpointOwnerPermission,)

    def get_queryset(self):
        if self.request.user.is_staff:
            return StreamEndpoint.objects.all()
        else:
            user_profile = get_object_or_404(UserProfile, user=self.request.user)
            return StreamEndpoint.objects.filter(owner=userProfile)