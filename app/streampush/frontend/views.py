from django.shortcuts import render

# Create your views here.
def app_view(request):
    return render(request, 'app.html')