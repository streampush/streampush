import requests

from xml.etree import ElementTree

from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response

from backend.models import Restream, StreamEndpoint
from backend.helpers import getBrand

import random

class BitrateView(APIView):
    def post(self, request):
        if not "restreamId" in request.data:
            return Response({"err": "restreamId must be provided"})

        restream = get_object_or_404(Restream, pk=request.data['restreamId'])
        restream_id = str(restream.id)

        r = requests.get("http://127.0.0.1:8888/api/stats")
        data = r.json()

        restream_data = data[restream_id]
        restream_stats = restream_data["stats"]

        if not restream_stats:
            return Response({
                "error": "no stats available"
            })    

        return Response({
            "name": restream.name,
            "id": restream.id,
            "in": restream_stats["bitrate"],
            "endpoints": restream_data["endpoints"],
            "events": restream_data["events"]
        })