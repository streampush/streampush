from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter

from backend import restreams, users

router = DefaultRouter()
router.register(r'restreams', restreams.RestreamViewSet, base_name='restream')
router.register(r'users', users.UserProfileViewSet, base_name='userprofile')
urlpatterns = router.urls

# urlpatterns = [
#     url('restreams/', restreams.RestreamsAPI.as_view())
# ]

# urlpatterns = format_suffix_patterns(urlpatterns)