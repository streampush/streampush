from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from backend.models import Restream, StreamEndpoint

class NotifyAPI(APIView):
    def post(self, request):
        app_id = request.POST.get('app')
        notify_type = request.POST.get('call')
        if not notify_type or not app_id:
            return Response("ERROR", status=403)

        print("Checking for restream with ID {0}".format(app_id))
        cur_restream = get_object_or_404(Restream, id=request.POST.get('app'))
        owner = cur_restream.owner

        endpoints = StreamEndpoint.objects.filter(restream=cur_restream)
        if len(endpoints) == 0:
            return Response("No endpoints configured.", status=400)

        if notify_type == 'publish':
            print("Starting {0}'s restream {1} to {2} endpoints.".format(owner.user.username, cur_restream.name, len(endpoints)))
        else:
            print("{0} on {1} to {2} endpoints".format(notify_type, cur_restream.name, len(endpoints)))

        cur_restream.live = notify_type == 'publish'
        cur_restream.save()

        async_to_sync(get_channel_layer().group_send)("notifications-{0}".format(owner.user.username), {
            'type': notify_type,
            'restreamId': app_id
        })

        return Response("OK", status=200)
        