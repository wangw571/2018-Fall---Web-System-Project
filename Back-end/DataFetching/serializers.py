from . import models
from rest_framework import serializers

class CommunityConnectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CommunityConnect
        fields = '__all__'