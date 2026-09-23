from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import SalaryStructure, Payslip
from .serializers import SalaryStructureSerializer, PayslipSerializer


class SalaryStructureViewSet(viewsets.ModelViewSet):
    queryset = SalaryStructure.objects.select_related('employee__user').all()
    serializer_class = SalaryStructureSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']


class PayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.select_related('employee__user').all()
    serializer_class = PayslipSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'year', 'month']
