from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views

from backend import restreams, users, notify, endpoints, bitrate, status, auth

router = DefaultRouter()
router.register(r'restreams', restreams.RestreamViewSet, base_name='restream')
router.register(r'users', users.UserProfileViewSet, base_name='userprofile')
router.register(r'endpoints', endpoints.EndpointViewSet, base_name='endpoint')

urlpatterns = [
    url('notify/{0}', notify.NotifyAPI.as_view()),
    url('restreams/me', restreams.RestreamsMeView.as_view()),
    url('restreams/create', restreams.RestreamsCreateView.as_view()),
    url('endpoints/me', endpoints.EndpointsMeView.as_view()),
    url('endpoints/create', endpoints.EndpointCreateView.as_view()),
    url('users/me', users.UsersMeView.as_view()),
    url('bitrate/', bitrate.BitrateView.as_view()),
    url('token', views.obtain_auth_token),
    url('status', status.StatusView.as_view()),
    url('auth', auth.AuthView.as_view()),
    url('setup', auth.SetupView.as_view())
] + router.urls

# urlpatterns = [
#     url('restreams/', restreams.RestreamsAPI.as_view())
# ]

# urlpatterns = format_suffix_patterns(urlpatterns)