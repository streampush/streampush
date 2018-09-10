import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from subprocess import check_output
from django.contrib.auth.models import User, AnonymousUser

def get_pid(name):
    return int(check_output(["pidof","-s",name]))

class StatusView(APIView):
    def get(self, request):
        if len(User.objects.all()) == 0:
            return Response(status=404) # No users in the DB - this will start setup in the browser

        if isinstance(request.user, AnonymousUser):
            return Response(status=403)

        web = "success" # If you can hit this endpoint, we're online
        redis = "success"
        relay = "success"

        try: get_pid("redis-server")
        except: redis = "danger"

        try: get_pid("relay")
        except: redis = "danger"

        return Response({
            "web": web,
            "redis": redis,
            "relay": relay
        })