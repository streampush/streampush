import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from subprocess import check_output

def get_pid(name):
    return int(check_output(["pidof","-s",name]))

class StatusView(APIView):
    def get(self, request):
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