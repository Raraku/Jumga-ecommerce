from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status
from .models import Transaction, SellerCommission, JumgaCommission, DispatchCommission
from accounts.models import SellerShop
import requests
from django.conf import settings

jumga_flutterwave = requests.Session()
jumga_flutterwave.headers.update(
    {"Authorization": "Bearer " + settings.FLUTTERWAVE_SECRET_KEY}
)


def process_successful_transaction(transaction_object, request=None):
    if transaction_object.type == "purchase":
        try:
            transaction_object.successful = True
            transaction_object.save()
            order = transaction_object.order
            for line in order.lines.all():
                line.status = 20
                line.save()
                SellerCommission.objects.create(
                    shop=line.product.shop, orderline=line, amount=line.total * 0.975
                )
                JumgaCommission.objects.create(
                    shop=line.product.shop,
                    orderline=line,
                    amount=line.total * 0.025 + line.delivery_fee * 0.2,
                )
                DispatchCommission.objects.create(
                    shop=line.product.shop,
                    orderline=line,
                    amount=line.delivery_fee * 0.8,
                )
            order.status = 20
            order.save()
        except Exception as e:
            # Can't recommend using raise here.
            raise e

    if transaction_object.type == "registration":
        try:
            user_profile = transaction_object.initiated_by_seller
            user_profile.paid_reg_fee = True
            user_profile.save()

        except:
            pass
    # Scrapped code for dispatch
    # elif transaction_object.type == "withdrawal":
    #     try:
    #         print(transaction_object.__dict__)
    #         user = User.objects.get(id=transaction_object.initiated_by.id)
    #         user.withdrawn = float(user.withdrawn) + float(transaction_object.amount)
    #         user.balance = float(user.balance) - float(transaction_object.amount)
    #         user.save()
    #         transaction_object.successful = True
    #         transaction_object.save()

    #     except User.DoesNotExist:
    #         pass


class ReceiveWebHook(APIView):
    """API View for Flutterwave Webhook"""

    @staticmethod
    def post(request):
        """

        :param request:
        :return:
        """
        data = request.data
        if data.get("data").get("status") == "successful":
            transfer_data = data.get("data")
            transaction_reference = transfer_data.get("tx_ref")
            transaction = Transaction.objects.get(reference_code=transaction_reference)
            transaction.flutterwave_reference = transfer_data.get("flw_ref")
            verify = jumga_flutterwave.get(
                f"https://api.flutterwave.com/v3/transactions/{transaction_reference}/verify"
            )
            try:
                verify = verify.json()
                verify = verify["data"]
                if (
                    verify["status"] == "successful"
                    and verify["currency"] == transaction.currency
                ):
                    process_successful_transaction(transaction, request)
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_200_OK)
