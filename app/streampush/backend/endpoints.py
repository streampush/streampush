from backend.models import StreamEndpoint, UserProfile
from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

class StreamEndpointSerializer(serializers.ModelSerializer):
    def validate_owner(self, value):
        '''
        If the user isn't staff, don't let them create
        an endpoint with an owner other than themself.
        '''
        if self.context['request'].user.is_staff:
            return value
        userprofile = get_object_or_404(UserProfile, user=self.context['request'].user)
        return userprofile

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

class EndpointCreateView(APIView):
    def post(self, request):
        if not "name" in request.data or not "url" in request.data:
            return Response({"err": "Name is missing"}, status=400)
        
        owner = get_object_or_404(UserProfile, user=request.user)

        new_endpoint = StreamEndpoint();
        new_endpoint.name = request.data["name"]
        new_endpoint.url = request.data["url"]
        new_endpoint.owner = owner
        new_endpoint.save()

        serializer = StreamEndpointSerializer(new_endpoint)
        return Response(serializer.data)