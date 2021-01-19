from django.core.management.base import BaseCommand, CommandError
from main.models import Product, ProductImage, ProductReview
import json
import lxml
from bs4 import BeautifulSoup
import requests
from datetime import datetime
import concurrent.futures
import threading
import time
import json
from accounts.models import Customer, SellerShop, User
from PIL import Image
from tempfile import NamedTemporaryFile
from django.core.files.base import ContentFile
from django.core.files import File
from django.core.files.images import ImageFile
from io import BytesIO
import random

thread_local = threading.local()


class Command(BaseCommand):
    help = "Scrapes the Amazon website for products from all categories"

    def handle(self, *args, **options):
        try:
            try:
                user = User.objects.get(username="Jumga")
            except:
                user = User.objects.create_superuser(
                    username="Jumga", email="sales@jumga.com", password="ilovejumga"
                )
            seller = SellerShop.objects.get_or_create(
                user=user, name="Jumga", paid_reg_fee=True
            )
            scrapeAmazon(seller[0])
        except Exception as exc:
            raise CommandError("Error", exc)


def get_session():
    if not hasattr(thread_local, "session"):
        thread_local.session = requests.Session()
    return thread_local.session


def scrapeAmazon(seller):
    session = get_session()
    session.headers.update(
        {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
        }
    )
    jumia_home = session.get("https://www.jumia.com")
    jumia_home = BeautifulSoup(jumia_home.content, "lxml")
    category_list = jumia_home.find(class_="flyout")
    category_list = category_list.find_all("a")
    category_list.pop()
    categories = []
    category_names = []
    for index, category in enumerate(category_list):
        categories.append("https://www.jumia.com.ng" + category["href"])
        category_names.append(category.get_text())
    categories[0] = "https://www.jumia.com.ng/groceries/"
    for index, category_link in enumerate(categories):
        page_link = session.get(category_link)
        jumia_soup = BeautifulSoup(page_link.content, "lxml")
        try:
            jumia_soup = jumia_soup.find_all(class_="core", limit=39)
            for ingredient in jumia_soup:
                sesh = session.get(f"https://www.jumia.com.ng{ingredient['href']}")
                mini_soup = BeautifulSoup(sesh.content, "lxml")
                images = mini_soup.find(id="imgs")
                images_list = []
                try:
                    for image in images.find_all("a"):
                        images_list.append(image["href"])
                    name = mini_soup.find("h1").get_text()
                    price = mini_soup.find("span", dir="ltr").get_text()
                    try:
                        price = int(price[2:].replace(",", "").strip())
                    except:
                        price = 1000 * random.randint(3, 30)
                    description = mini_soup.find("div", class_="markup").get_text()
                    product_data = {
                        "name": name,
                        "seller": seller,
                        "description": description,
                        "price": price,
                    }
                    product = Product.objects.get_or_create(**product_data)
                    product[0].categories.add(category_names[index])
                    images_list = images_list[0:5]
                    for indexb, image in enumerate(images_list):
                        headers = {
                            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
                        }
                        img_temp = NamedTemporaryFile(delete=True)
                        req = requests.get(image, headers=headers)
                        img_temp.write(req.content)
                        img_temp.flush()
                        image = Image.open(img_temp)
                        image = image.convert("RGB")
                        temp_thumb = BytesIO()
                        image.save(temp_thumb, "PNG")
                        temp_thumb.seek(0)
                        saved_image = ProductImage.objects.create(product=product[0])
                        saved_image.image.save(
                            saved_image.product.slug
                            + str(saved_image.id)
                            + str(indexb)
                            + ".png",
                            ContentFile(temp_thumb.read()),
                            save=True,
                        )
                        saved_image.save()
                        temp_thumb.close()
                except:
                    pass
        except:
            pass
