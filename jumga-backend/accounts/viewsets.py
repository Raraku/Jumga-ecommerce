from payments.serializers import OrderPaymentSerializer
from main.models import Product
from django.utils.text import slugify
from jumga.utils import IsCustomerOr404
from accounts.models import Address
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet, GenericViewSet
from rest_framework.decorators import (
    action,
)
from django.conf import settings
from .models import Address, Customer, Dispatcher, SellerShop, User
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from main.serializers import ShopSerializer
from .serializers import CustomerSerializer, UserViewSerializer, AddressSerializer
import requests
from main.models import ExchangeRate
import random

jumga_flutterwave = requests.Session()
jumga_flutterwave.headers.update(
    {"Authorization": "Bearer " + settings.FLUTTERWAVE_SECRET_KEY}
)


class DontListModelViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet,
):
    """
    A viewset that provides default `create()`, `retrieve()`, `update()`,
    `partial_update()`, `destroy()` actions.
    """

    pass


currencyConverter = {"ng": "NGN", "uk": "GBP", "gh": "GHS", "ke": "KES"}


def getDollarOrder(currency, total):
    current_rate = ExchangeRate.objects.first()
    if currency == "ng":
        return total / int(current_rate.USD) * int(current_rate.NGN)
    if currency == "uk":
        return total / int(current_rate.USD) * int(current_rate.GBP)
    if currency == "gh":
        return total / int(current_rate.USD) * int(current_rate.GHS)
    if currency == "ke":
        return total / int(current_rate.USD) * int(current_rate.KES)


class CustomerDetailsView(ReadOnlyModelViewSet):

    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_queryset(self):
        return Customer.objects.filter(user=self.request.user)


class AddressDetailsView(ModelViewSet):
    permission_classes = [IsCustomerOr404]
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(user__user=self.request.user)


class ShopViewSet(DontListModelViewSet):
    # def get_permissions(self):
    #     """
    #     Instantiates and returns the list of permissions that this view requires.
    #     """
    #     if self.action == "list":
    #         permission_classes = [IsAdminUser]
    #     else:
    #         permission_classes = []
    #     return [permission() for permission in permission_classes]
    serializer_class = ShopSerializer

    def get_queryset(self):
        return SellerShop.objects.filter(user=self.request.user)

    def create(self, request):
        user = request.user
        name = request.data["name"]
        slug = slugify(name)
        random_idx = random.randint(0, Dispatcher.objects.count() - 1)
        random_object = Dispatcher.objects.all()[random_idx]
        # Subaccount implementation soon
        data = {
            "user": user,
            "name": name,
            "slug": slug,
            "account_bank": request.data["account_bank"],
            "account_number": request.data["account_number"],
            "country": request.data["country"],
            "phone_number": request.data["phone_number"],
            "dispatcher": random_object,
        }
        real_data = {
            "account_bank": data["account_bank"],
            "account_number": data["account_number"],
            "business_name": data["name"],
            "country": data["country"],
            # This is for show
            "split_value": 0.5,
            "business_mobile": data["phone_number"],
            "business_email": user.email,
        }
        subaccount = jumga_flutterwave.post(
            "https://api.flutterwave.com/v3/subaccounts", json=real_data
        )
        response = subaccount.json()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data["user"] = request.user
        serializer.validated_data["subaccount_id"] = response["data"]["subaccount_id"]

        self.perform_create(serializer)
        user.is_staff = True
        user.save()
        # Could just modify data but that's more likely to have bugs

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @action(detail=True, methods=["get"])
    def pay_fee(self, request, pk):
        shop = self.get_object()
        order_total_convert = getDollarOrder(shop.country.lower(), 20)
        data = {
            "currency": currencyConverter[shop.country.lower()],
            "amount": order_total_convert,
            "email": shop.user.email,
            "name": shop.name,
            "type": "registration",
        }
        serializer = OrderPaymentSerializer(data=data)

        if serializer.is_valid():
            response = serializer.process_transaction(shop)
            return Response(data=response, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def get_banks(self, request):
        country = request.query_params.get("country")
        banks = jumga_flutterwave.get(
            f"https://api.flutterwave.com/v3/banks/{country.upper()}"
        )
        return Response(data=banks.json(), status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def get_shop(self, request):
        try:
            shop = SellerShop.objects.get(user=request.user)
            serialized_data = ShopSerializer(shop)
            return Response(data=serialized_data.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
