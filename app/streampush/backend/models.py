import uuid
from django.db import models
from django.contrib.auth.models import User

# Custom user profile with some dope metadata
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

# Links all the endpoints to a single restream
# Each nginx-rtmp config has a one-to-one
# relationship with this model.
class Restream(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=140)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return "{0}/{1} ({2})".format(self.name, self.owner, self.id)

# A stream endpoint that'll be used when generating
# restream configs.
class StreamEndpoint(models.Model):
    url = models.CharField(max_length=200)
    restream = models.ForeignKey(Restream, on_delete=models.CASCADE)

    def __str__(self):
        return "{0}@{1}".format(self.url, self.restream.__str__())