from rest_framework.routers import DefaultRouter
from .views import SalaryStructureViewSet, PayslipViewSet

router = DefaultRouter()
router.register('salary-structures', SalaryStructureViewSet, basename='salary-structure')
router.register('payslips', PayslipViewSet, basename='payslip')

urlpatterns = router.urls
