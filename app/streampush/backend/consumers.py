from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from backend.models import Restream
import json

class NotifyConsumer(WebsocketConsumer):
    def connect(self):
        print(dir(self.scope))
        print(self.scope.keys())

        user = self.scope['user']
        if not user.is_authenticated:
            self.close()
        else:
            self.accept()

            async_to_sync(self.channel_layer.group_add)("notifications-{0}".format(user.username), self.channel_name)

            self.scope['session']['channel_name'] = self.channel_name
            self.scope['session'].save()

    def disconnect(self, close_code):
        user = self.scope['user']
        if user.is_authenticated:
            self.channel_layer.group_discard("notifications-{0}".format(user.username), user.username)

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': message
        }))

    def publish(self, event):
        restreamId = event['restreamId']



        self.send(text_data=json.dumps({
            'type': 'publish',
            'restreamId': restreamId
        }))

    def publish_done(self, event):
        restreamId = event['restreamId']
        self.send(text_data=json.dumps({
            'type': 'publish_done',
            'restreamId': restreamId
        }))