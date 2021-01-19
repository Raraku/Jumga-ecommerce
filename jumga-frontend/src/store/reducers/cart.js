import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  UPDATE_EXCHANGE_RATE,
  CHANGE_LOCALE,
} from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  shoppingCart: [],
  exchangeRates: [],
  locale: "ng",
  error: null,
  loading: false,
};

const cartStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const cartSuccess = (state, action) => {
  return updateObject(state, {
    shoppingCart: action.data,
    error: null,
    loading: false,
  });
};

const cartFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};
const setExchangeRate = (state, action) => {
  return updateObject(state, {
    exchangeRates: action.rate,
  });
};
const changeLocale = (state, action) => {
  return updateObject(state, {
    locale: action.locale,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_START:
      return cartStart(state, action);
    case CART_SUCCESS:
      return cartSuccess(state, action);
    case CART_FAIL:
      return cartFail(state, action);
    case UPDATE_EXCHANGE_RATE:
      return setExchangeRate(state, action);
    case CHANGE_LOCALE:
      return changeLocale(state, action);
    default:
      return state;
  }
};

export default reducer;
