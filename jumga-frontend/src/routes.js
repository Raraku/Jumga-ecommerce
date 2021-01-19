import React from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import ProductList from "./containers/ProductList";
import ProductDetail from "./containers/ProductDetail";
import Checkout from "./containers/Checkout";
import Cart from "./containers/Cart";
import Profile from "./containers/Profile";
import OrderDetail from "./containers/Profile/OrderDetail";
import SellerPage from "./containers/Seller/index";
import Error404 from "./containers/Error404/index";
import PaymentDone from "./containers/Checkout/PaymentDone";

const BaseRouter = () => (
  <Switch>
    <Route exact path="/products/" component={ProductList} />
    <Route exact path="/products/:category/" component={ProductList} />
    <Route
      exact
      path="/search/:query/"
      render={(props) => <ProductList isSearch={true} {...props} />}
    />
    <Route path="/product/:productSlug/" component={ProductDetail} />
    <Route path="/login/" component={Login} />
    <Route path="/signup/" component={Signup} />
    <Route path="/order-detail/:id/" component={OrderDetail} />
    <Route path="/cart/" component={Cart} />
    <Route path="/seller/" component={SellerPage} />
    <Route path="/checkout/" component={Checkout} />
    <Route path="/profile/" component={Profile} />
    <Route path="/status/" component={PaymentDone} />
    <Route exact path="/" component={HomepageLayout} />

    <Route component={Error404} />
  </Switch>
);

export default BaseRouter;
