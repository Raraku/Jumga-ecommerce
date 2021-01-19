export const localhost = "https://jumgaapi.herokuapp.com";

const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;

export const productListURL = `${endpoint}/productinfo/`;
export const productDetailURL = (slug) => `${endpoint}/products/${slug}/`;
export const addToCartURL = (slug) =>
  `${endpoint}/products/${slug}/add_to_basket/`;
export const orderInfoURL = `${endpoint}/orderinfo/`;
export const orderURL = (id) => `${endpoint}/orders/${id}/`;
export const orderDetailURL = (id) => `${endpoint}/orderdetail/${id}/`;
export const basketURL = `${endpoint}/baskets/`;
export const basketDetailURL = (id) => `${endpoint}/baskets/${id}/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const countryListURL = `${endpoint}/countries/`;
export const userIDURL = `${endpoint}/accounts/`;
export const addressListURL = `${endpoint}/addresses/`;
export const addressDetailURL = (id) => `${endpoint}/addresses/${id}/`;
export const shopURL = (id) => `${endpoint}/shop/${id}/`;
export const shopCreateURL = `${endpoint}/shop/`;
export const paymentListURL = `${endpoint}/payments/`;
