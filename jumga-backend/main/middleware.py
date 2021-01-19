from datetime import datetime
from main.models import ExchangeRate
from dotenv import load_dotenv
import os
import requests

load_dotenv(verbose=True)
fixer_api_key = os.getenv("FIXER_API_KEY")

jumga_fixer = requests.Session()


class ExchangeRateMiddleware:
    def __init__(self, get_response):

        self.get_response = get_response

    def __call__(self, request, *args, **kwargs):
        self.checkExchangeRate()
        response = self.get_response(request)
        return response

    @staticmethod
    def checkExchangeRate():
        rate = ExchangeRate.objects.all()
        if len(rate) > 0:
            rate = rate[0]
            if rate.last_updated == datetime.today().date():
                return
            else:
                new_rate = jumga_fixer.get(
                    f"http://data.fixer.io/api/latest?access_key={fixer_api_key}&symbols=GBP,KES,GHS,NGN,USD"
                )
                new_rate = new_rate.json()
                new_rate = new_rate["rates"]
                rate.GBP = new_rate["GBP"]
                rate.KES = new_rate["KES"]
                rate.GHS = new_rate["GHS"]
                rate.NGN = new_rate["NGN"]
                rate.USD = new_rate["USD"]
                rate.save()
                return
        else:
            new_rate = jumga_fixer.get(
                f"http://data.fixer.io/api/latest?access_key={fixer_api_key}&symbols=GBP,KES,GHS,NGN"
            )
            new_rate = new_rate.json()
            new_rate = new_rate["rates"]
            ExchangeRate.objects.create(**new_rate)