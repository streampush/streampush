from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response

from backend.models import Restream, StreamEndpoint

import random

class BitrateView(APIView):
    def post(self, request):
        if not "restreamId" in request.data:
            return Response({"err": "restreamId must be provided"})

        restream = get_object_or_404(Restream, pk=request.data['restreamId'])
        endpoints = StreamEndpoint.objects.filter(restream=restream)

        fake_data = []
        for endpoint in endpoints:
            fake_data.append({
                "name": endpoint.name,
                "id": endpoint.id,
                "in": random.randint(1500, 2500),
                "out": random.randint(1500, 2500),
            })

        return Response(fake_data)