from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView

from django.contrib.auth.models import User


class AuthView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response(status=200)
        else:
            return Response(status=403)

    def delete(self, request):
        logout(request)
        return Response(status=200)

class SetupView(APIView):
    def post(self, request):
        if len(User.objects.all()) == 0:
            username = request.data.get("username")
            password = request.data.get("password")
            email = request.data.get("email")

            newUser = User.objects.create_superuser(username, email, password)
            if newUser is not None:
                return Response(status=200)
            else:
                return Response(status=500)
        else:
            return Response(status=403)