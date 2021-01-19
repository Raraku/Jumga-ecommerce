from rest_framework import serializers
from .choices import transaction_type_choices
from .models import Transaction, Order
from utils import get_random_alphanumeric_string
from accounts.models import User, Customer, SellerShop
import requests
import json
from main.models import Product
from django.conf import settings
from dotenv import load_dotenv
import os

load_dotenv(verbose=True)
# from .views import ReceiveWebHook

jumga_flutterwave = requests.Session()
jumga_flutterwave.headers.update(
    {"Authorization": "Bearer " + settings.FLUTTERWAVE_SECRET_KEY}
)
host_url = os.getenv("JUMGA_FRONTEND_REDIRECT_URL")


class OrderPaymentSerializer(serializers.Serializer):
    # cardno = serializers.CharField(max_length=16, required=True)
    # cvv = serializers.CharField(max_length=3, required=True)
    # expirymonth = serializers.CharField(max_length=2, required=True)
    # expiryyear = serializers.CharField(max_length=2, required=True)
    currency = serializers.CharField(max_length=3, default="NGN")
    amount = serializers.CharField(max_length=10, required=True)
    email = serializers.EmailField(required=True)
    # phonenumber = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=90)
    type = serializers.ChoiceField(transaction_type_choices, default="purchase")

    def initialise_payment(self, order):
        if self.is_valid():
            while True:
                ref = f"JUMGA-{get_random_alphanumeric_string(10)}"
                if not Transaction.objects.filter(reference_code=ref):
                    break
            self.validated_data["tx_ref"] = ref
            self.validated_data["customer"] = {
                "email": self.validated_data["email"],
                # "phonenumber": self.validated_data["phonenumber"],
                "name": self.validated_data["name"],
            }
            self.validated_data["customizations"] = {
                "title": "Jumga",
                "description": "Getting you the things you need ... now.",
            }
            self.validated_data["payment_options"] = "card"
            self.validated_data["redirect_url"] = host_url
            subaccounts = []
            if order != None:
                for line in order.lines.all():
                    seller = line.product.shop
                    subaccounts.append(
                        {
                            "id": seller.subaccount_id,
                            "transaction_charge_type": "flat_subaccount",
                            "transaction_charge": line.total * 0.975,
                        }
                    )
                self.validated_data["subaccounts"] = subaccounts
            res = jumga_flutterwave.post(
                "https://api.flutterwave.com/v3/payments",
                json=dict(self.validated_data),
                timeout=20,
            )
            res = json.loads(res.text)
            res["tx_ref"] = ref
            return res
        else:
            return self.errors

    def process_transaction(self, user_profile, order=None):
        payment_serializer = OrderPaymentSerializer(data=self.validated_data)
        payment_serializer_response = payment_serializer.initialise_payment(order)
        tx_ref = payment_serializer_response.get("tx_ref")

        if payment_serializer_response.get("status") == "success" and self.is_valid():
            if self.validated_data.get("type") == "registration":
                to_be_sent = self.validated_data
                to_be_sent["amount"] = float(to_be_sent["amount"])
                to_be_sent["type"] = self.validated_data.get("type")
                to_be_sent["reference_code"] = tx_ref

                transaction = TransactionSerializer(data=to_be_sent)

                if transaction.is_valid():
                    transaction.save(
                        initiated_by_seller=user_profile,
                    )
                    return payment_serializer_response
                else:
                    return transaction.errors

            elif self.validated_data.get("type") == "purchase":
                to_be_sent = self.validated_data
                to_be_sent["amount"] = float(to_be_sent["amount"])
                to_be_sent["type"] = self.validated_data.get("type")
                to_be_sent["reference_code"] = tx_ref
                transaction = TransactionSerializer(data=to_be_sent)

                if transaction.is_valid():
                    transaction.save(
                        initiated_by=user_profile,
                        order=order,
                    )
                    return payment_serializer_response
                else:
                    return transaction.errors

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


# class ConfirmPaymentSerializer(serializers.Serializer):
#     transaction_reference = serializers.CharField(required=True)
#     otp = serializers.CharField(required=True)

#     def create(self, validated_data):
#         pass

#     def update(self, instance, validated_data):
#         pass

#     def confirm(self):
#         transaction_reference = self.validated_data["transaction_reference"]
#         otp = self.validated_data["otp"]
#         response = flutterwave.validate_payment_with_card(transaction_reference, otp)
#         return response


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"


# class WithdrawMoneySerializer(serializers.Serializer):
#     amount = serializers.IntegerField(required=True)
#     password = serializers.CharField(max_length=50, required=True)

#     def withdraw(self, user):
#         if self.is_valid():
#             while True:
#                 ref = f"SELLAF-{get_random_alphanumeric_string(10)}"
#                 if not Transaction.objects.filter(reference_code=ref):
#                     break
#             to_be_sent = {
#                 "account_bank": user.bank_code,
#                 "account_number": user.account_number,
#                 "amount": self.validated_data.get("amount"),
#                 "currency": "NGN",
#                 "narration": f"{user.first_name} Withdrew NGN {self.validated_data.get('amount')} from Sellaf",
#                 "reference": ref,
#             }
#             response = flutterwave.transfer_to_bank(to_be_sent)

#             if response.get("status") == "success":
#                 transaction = Transaction()
#                 transaction.initiated_by = user
#                 transaction.type = "withdrawal"
#                 transaction.reference_code = response.get("data").get("reference")
#                 transaction.flutterwave_reference = response["data"].get("id")
#                 transaction.amount = response.get("data").get("amount")
#                 transaction.charge_type = "debit"
#                 transaction.save()

#             return response
#         else:
#             return self.errors

#     def update(self, instance, validated_data):
#         pass

#     def create(self, validated_data):
#         pass
