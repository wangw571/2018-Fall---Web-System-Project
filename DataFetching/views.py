from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from . import models
from django.http import JsonResponse
from . import serializers

# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


# Create your views here.
class GetCommunityData(viewsets.ViewSet):
    queryset = models.CommunityConnect.objects.all()
    serializer_class = serializers.CommunityConnectSerializer
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)


    def list(self, request):
        community_data = models.CommunityConnect.objects.using('client_data_online').filter()
        serializers_data = serializers.CommunityConnectSerializer(community_data, many=True)
        return JsonResponse({'community_data': serializers_data.data}, status=201)


# Get your views here
class SaveCommunityData(viewsets.ViewSet):
    queryset = models.CommunityConnect.objects.all()
    serializer_class = serializers.CommunityConnectSerializer


    def list(self, request):
        # Use the absolute path to save data to online server
        models.CommunityConnect.objects.from_csv(r"E:\university of toronto\the_thrid_year\The_first_term\CSCC01\Data\cleaned_Community.csv", using='client_data_online')
        return HttpResponse('success')
