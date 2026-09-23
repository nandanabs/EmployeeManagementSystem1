from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ProjectAssignmentViewSet

router = DefaultRouter()
router.register('assignments', ProjectAssignmentViewSet, basename='project-assignment')
router.register('', ProjectViewSet, basename='project')

urlpatterns = router.urls
