from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView

class AuthView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=403)

    def delete(self, request):
        logout(request)
        return HttpResponse(status=200)
