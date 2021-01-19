from jumga.utils import IsCustomerOr404, IsCustomerOrReadOnly
from django.db.models import query
from orders.apps import OrdersConfig
from rest_framework import serializers, viewsets
from main.models import Product
from rest_framework import viewsets, status
from .serializers import (
    OrderDetailSerializer,
    OrderInfoSerializer,
    OrderLineSerializer,
    OrderSerializer,
    BasketLineSerializer,
    BasketSerializer,
)
from payments.serializers import OrderPaymentSerializer
from .models import Basket, BasketLine, Order, OrderLine
from rest_framework.response import Response
from rest_framework.decorators import (
    action,
    api_view,
    renderer_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS
from taggit.models import Tag
from main.models import ExchangeRate

currencyConverter = {"ng": "NGN", "uk": "GBP", "gh": "GHS", "ke": "KES"}
exchangeRateConverter = {"ng": 1, "uk": "GBP", "gh": "GHS", "ke": "KES"}


def getOrder(currency, total):
    current_rate = ExchangeRate.objects.first()

    if currency == "ng":
        return total
    if currency == "uk":
        return total / int(current_rate.NGN) * int(current_rate.GBP)
    if currency == "gh":
        return total / int(current_rate.NGN) * int(current_rate.GHS)
    if currency == "ke":
        return total / int(current_rate.NGN) * int(current_rate.KES)


class OrderInfoViewset(viewsets.ModelViewSet):
    serializer_class = OrderInfoSerializer
    permission_classes = [IsCustomerOr404]

    def get_queryset(self):
        return Order.objects.filter(user__user=self.request.user)


class OrderDetailViewset(viewsets.ModelViewSet):
    serializer_class = OrderDetailSerializer
    permission_classes = [IsCustomerOr404]

    def get_queryset(self):
        return Order.objects.filter(user__user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsCustomerOr404]

    def get_queryset(self):
        return Order.objects.filter(user__user=self.request.user)

    @action(detail=True, methods=["get"])
    def pay(self, request, pk):
        order = self.get_object()
        customer = order.user
        order_total_convert = getOrder(order.billing_country, order.total)
        data = {
            "currency": currencyConverter[order.billing_country],
            "amount": order_total_convert,
            "email": customer.user.email,
            # "phonenumber": order.billing_number,
            "name": order.billing_name,
        }
        serializer = OrderPaymentSerializer(data=data)
        if serializer.is_valid():
            response = serializer.process_transaction(customer, order)
            return Response(data=response, status=status.HTTP_200_OK)
        else:
            return Response(
                data={"detail": "invalid serializer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # if payment_serializer_response.get("status") == "success" and self.is_valid():
        #     if self.validated_data.get("type") == "registration":
        #         to_be_sent = self.validated_data
        #         to_be_sent["amount"] = float(to_be_sent["amount"])
        #         to_be_sent["type"] = self.validated_data.get("type")
        #         to_be_sent["reference_code"] = tx_ref
        #         transaction = TransactionSerializer(data=to_be_sent)

        #         if transaction.is_valid():
        #             transaction.save(shop=user_profile, charge_type="debit")
        #             return payment_serializer_response
        #         else:
        #             return transaction.errors

        #     elif self.validated_data.get("type") == "purchase":
        #         to_be_sent = self.validated_data
        #         to_be_sent["amount"] = float(to_be_sent["amount"])
        #         to_be_sent["delivery_fee"] = float(to_be_sent["delivery_fee"])
        #         to_be_sent["type"] = self.validated_data.get("type")
        #         to_be_sent["reference_code"] = tx_ref
        #         transaction = TransactionSerializer(data=to_be_sent)
        #         # affiliate_code = self.validated_data.get("affiliate_code")
        #         # if User.objects.filter(affiliate_code=affiliate_code):
        #         #     referred_by = User.objects.get(affiliate_code=affiliate_code)

        #         if transaction.is_valid():
        #             transaction.save(
        #                 initiated_by=user_profile,
        #             )
        #             return payment_serializer_response
        #         else:
        #             return transaction.errors


class BasketViewset(viewsets.ModelViewSet):
    serializer_class = BasketSerializer
    permission_classes = [IsCustomerOr404]

    def get_queryset(self):
        return Basket.objects.filter(user__user=self.request.user)

    @action(detail=True, methods=["get", "post"])
    def create_order(self, request, pk=None):
        basket = self.get_object()
        billing_address = request.data["billing_address"]
        shipping_address = request.data["shipping_address"]
        id = basket.create_order(billing_address, shipping_address, request.user)
        return Response(data={"id": id}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def count_basket(self, request):
        basket = self.get_object()
        count = basket.count()
        return Response({"no": count}, status=status.HTTP_200_OK)
