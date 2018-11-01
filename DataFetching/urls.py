from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'get_data', views.GetCommunityData)
router.register(r'save_data', views.SaveCommunityData)

urlpatterns = router.urls