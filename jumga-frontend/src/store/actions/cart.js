import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  CHANGE_LOCALE,
  UPDATE_EXCHANGE_RATE,
} from "./actionTypes";
import { authAxios } from "../../utils";
import { basketURL, productListURL } from "../../constants";

export const cartStart = () => {
  return {
    type: CART_START,
  };
};

export const cartSuccess = (data) => {
  return {
    type: CART_SUCCESS,
    data,
  };
};

export const cartFail = (error) => {
  return {
    type: CART_FAIL,
    error: error,
  };
};
export const updateCart = (rate) => {
  return {
    type: UPDATE_EXCHANGE_RATE,
    rate,
  };
};
export const fetchExchangeRate = () => {
  return (dispatch) => {
    authAxios.get(productListURL + "get_exchange_rate/").then((res) => {
      dispatch(updateCart(res.data));
    });
  };
};
export const changeLocale = (locale) => {
  return {
    type: CHANGE_LOCALE,
    locale,
  };
};

export const fetchCart = () => {
  return (dispatch) => {
    dispatch(cartStart());
    authAxios
      .get(basketURL)
      .then((res) => {
        dispatch(cartSuccess(res.data[0]));
      })
      .catch((err) => {
        dispatch(cartFail(err));
      });
  };
};
