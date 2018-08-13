import requests

from xml.etree import ElementTree

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
        restream_id = restream.id

        r = requests.get("http://127.0.0.1/stat/")
        data = r.json()

        restream_stats = [x for x in data['rtmp']['servers'][0] if str(restream_id) in x['name']]

        if len(restream_stats) == 0:
            return Response([])

        if len(restream_stats[0]['live']['streams']) == 0:
            return Response([])

        stats = []
        stats.append({
            "name": restream.name,
            "id": restream.id,
            "in": restream_stats[0]['live']['streams'][0]['bw_in']
        })            

        return Response(stats)