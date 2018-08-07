import uuid
from django.db import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

# Custom user profile with some dope metadata
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Links all the endpoints to a single restream
# Each nginx-rtmp config has a one-to-one
# relationship with this model.
class Restream(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=140)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    live = models.BooleanField(default=False)
    lastStreamed = models.DateTimeField(null=True)

    @property
    def endpoints(self):
        rEndpoints = StreamEndpoint.objects.filter(restream=self)
        return rEndpoints

    def __str__(self):
        return "{0}/{1} ({2})".format(self.name, self.owner, self.id)

# A stream endpoint that'll be used when generating
# restream configs.
class StreamEndpoint(models.Model):
    url = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(UserProfile, null=True, on_delete=models.CASCADE)
    restream = models.ManyToManyField(Restream)

    @property
    def brand(self):
        brand = "none"
        if "twitch.tv" in self.url:
            brand = "twitch"
        elif "facebook.com" in self.url:
            brand = "facebook"
        elif "youtube.com" in self.url:
            brand = "youtube"
        return brand

    def __str__(self):
        return "{0}@{1}".format(self.url, self.restream.__str__())