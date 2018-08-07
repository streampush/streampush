from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^ws/notify', consumers.NotifyConsumer),
    # url(r'^ws/notify/(?P<room_name>[^/]+)/$', consumers.NotifyConsumer),
]