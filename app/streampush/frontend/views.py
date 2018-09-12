from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def app_view(request):
    # `index.html` is built by `ng build`
    return render(request, 'index.html')