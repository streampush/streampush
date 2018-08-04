from django.contrib import admin

from .models import Restream, UserProfile, StreamEndpoint

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    pass

@admin.register(Restream)
class RestreamAdmin(admin.ModelAdmin):
    pass

@admin.register(StreamEndpoint)
class EndpointAdmin(admin.ModelAdmin):
    pass