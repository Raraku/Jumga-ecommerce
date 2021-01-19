from django.core.paginator import Page
from rest_framework import viewsets, status
from .serializers import (
    ExchangeRateSerializer,
    ProductInfoSerializer,
    ProductReviewSerializer,
    ProductSerializer,
    TagSerializer,
)
from .models import ExchangeRate, Product, ProductReview
from orders.models import Basket, BasketLine
from rest_framework.response import Response
from rest_framework.decorators import (
    action,
    api_view,
    renderer_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from taggit.models import Tag
from accounts.models import Customer


class ProductInfoViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = ProductInfoSerializer
    pagination_class = PageNumberPagination
    lookup_field = "slug"

    def get_queryset(self):
        lower_limit = self.request.query_params.get("lowerLimit", None)
        upper_limit = self.request.query_params.get("upperLimit", None)
        if lower_limit is not None:
            queryset = Product.objects.filter(
                price__gte=lower_limit, price__lte=upper_limit
            )
        else:
            queryset = Product.objects.all()
        return queryset

    @action(detail=False, methods=["get"])
    def get_all_tags(self, request):
        queryset = Tag.objects.all()
        tags = TagSerializer(queryset, many=True, context={"request", request})
        return Response(tags.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def filter_by_category(self, request):
        tag = request.query_params.get("category")
        lower_limit = request.query_params.get("lowerLimit", None)
        upper_limit = request.query_params.get("upperLimit", None)
        if lower_limit is not None:
            queryset = Product.objects.filter(categories__name__in=[tag]).filter(
                price__gte=lower_limit, price__lte=upper_limit
            )
        else:
            queryset = Product.objects.filter(categories__slug__in=[tag])
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ProductInfoSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_200_OK)

    # Search and searchmini are very similar. The only difference is that search_mini returns a smaller collection of items. This is done because it will run whenever a customer changes their input; whereas search runs only when they press enter.
    @action(detail=False, methods=["get"])
    def search_mini(self, request):
        search_query = request.query_params.get("q")
        queryset = Product.objects.filter(name__icontains=search_query)[:6]
        serializer = ProductInfoSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def search(self, request):
        search_query = request.query_params.get("q")
        lower_limit = request.query_params.get("lowerLimit", None)
        upper_limit = request.query_params.get("upperLimit", None)
        if lower_limit is not None:
            queryset = Product.objects.filter(name__icontains=search_query).filter(
                price__gte=lower_limit, price__lte=upper_limit
            )
        else:
            queryset = Product.objects.filter(name__icontains=search_query)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ProductInfoSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def get_exchange_rate(self, request):
        rate = ExchangeRate.objects.first()
        serialized = ExchangeRateSerializer(rate)
        return Response(data=serialized.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def price_filter(self, request):
        lower_limit = request.query_params.get("lowerLimit", None)
        upper_limit = request.query_params.get("upperLimit", None)
        queryset = Product.objects.filter(
            price__gte=lower_limit, price__lte=upper_limit
        )
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ProductInfoSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ProductViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination
    lookup_field = "slug"

    @action(detail=True, methods=["get"])
    def add_to_basket(self, request, slug):
        product = self.get_object()
        user = Customer.objects.get(user=request.user)
        basket = Basket.objects.get_or_create(user=user)
        basketline, created = BasketLine.objects.get_or_create(
            basket=basket[0], product=product
        )
        if not created:
            if basketline.quantity == 10:
                return Response(
                    data={
                        "error": "You have the maximum number of items for this product"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            basketline.quantity += 1
            basketline.save()
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def remove_from_basket(self, request, slug):
        try:
            product = self.get_object()

            your_basket = Basket.objects.get(user__user=request.user)
            offending_basketline = BasketLine.objects.get(
                basket=your_basket, product=product
            ).delete()
            # your_basket.basketlines.remove(offending_basketline)
            return Response(status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                data={"error": repr(exc)}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["get"])
    def change_quantity(self, request, slug):
        try:
            new_quantity = int(request.query_params.get("nq"))
            if new_quantity <= 10:
                product = self.get_object()
                basket = Basket.objects.get(user__user=request.user)
                offending_basketline = BasketLine.objects.get(
                    basket=basket, product=product
                )
                offending_basketline.quantity = new_quantity
                offending_basketline.save()
                return Response(
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    data={"error": "You can purchase a maximum of 10 of one item"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def get_product_reviews(self, request, slug):
        product = self.get_object()
        queryset = ProductReview.objects.filter(product=product).order_by("-date_added")

        page = self.paginate_queryset(queryset)
        if page is not None:
            serialized_data = ProductReviewSerializer(queryset, many=True)
            return self.get_paginated_response(serialized_data.data)
        return Response(status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def add_review(self, request, slug):
        product = self.get_object()
        review = request.data["review"]
        title = request.data["title"]
        rating = request.data.get("rating", None)
        author = request.user
        try:
            reviewe = ProductReview.objects.create(
                author=author, product=product, review=review, title=title
            )
            if rating != None and rating != 0:
                product.rating += rating
                product.ratingNumbers += 1
                product.save()

            return Response(status=status.HTTP_201_CREATED)
        except Exception as Exc:

            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def find_review_helpful(self, request, slug):
        id = request.query_params.get("id")
        review = ProductReview.objects.get(id=id)
        review.helpful.add(request.user)
        review.save()
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def get_related_products(self, request, slug):
        product = self.get_object()
        queryset = product.categories.similar_objects()
        serialized_data = ProductInfoSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serialized_data.data, status=status.HTTP_200_OK)
