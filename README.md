# Jumga Readme

This is a simple ecommerce site where people can buy and sell their products. It has branches in 4 countries and is miraculously capable of delivering any purchase to any particular location.


# Toolset

This application is written in **Javascript** and **Python **
The frontend is built with a Javascript framework called **React**. It is futuristic, lightweight and fast. It communicates with the backend through API calls to further decentralize the application.

The aforementioned backend server is built exclusively with **Django**. In my opinion, it is quite frankly the best tool for building backend applications because it comes inbuilt with the latest security features. In fact, I was so impressed with it that I decided to attach the seller dashboard to it, i.e a seller modifies their products and view transactions through the secure Inbuilt Admin Portal; specially modified so they can only access what they mean to.

Django can actually be used to build fullstack applications but its frontend is far subpar to something like React and my love for modularity (i.e I can easily attach the frontend to another backend) made me to use it as an API server only).

The example repo is hosted on Heroku for the backend and Netlify for the Frontend, Static Files are hosted on GCP


## ORDER FLOW

The most important part of the application is the order and it goes something like this:
1. Seller Creates a product
2. A user sees the product and adds it to cart.
3. The user submits his cart
4. This hits an api endpoint on the backend which communicates with Flutterwave and returns a form to the user. (It uses Flutterwave Standard)
5. The transaction is created and stored.
6. The user pays for the order 
7. Flutterwave hits our webhook, we verify its authenticity and we give value to the user.
8. The seller and their dispatcher receives their compensation.

# Setup
1. There is a makeProducts management command attached to the project.
2. After creating a superuser, assign the sellershop ability to create products, view their orderlines and see their transactions

Thank you.
