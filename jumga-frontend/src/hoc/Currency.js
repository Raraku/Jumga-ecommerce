import React from "react";
import { connect } from "react-redux";

function CurrencyDisplay(props) {
  const { value, exchangeRates, locale } = props;
  switch (locale) {
    case "ng":
      return <span> &#8358; {value}</span>;
    case "uk":
      return (
        <span>
          &#163; {((value / exchangeRates.NGN) * exchangeRates.GBP).toFixed(2)}
        </span>
      );
    case "gh":
      return (
        <span>
          &#8373; {((value / exchangeRates.NGN) * exchangeRates.GHS).toFixed(2)}
        </span>
      );
    case "ke":
      return (
        <span>
          KSh {((value / exchangeRates.NGN) * exchangeRates.KES).toFixed(2)}
        </span>
      );
  }
  return <>{props.value}</>;
}

const mapStateToProps = (state) => {
  return {
    locale: state.cart.locale,
    exchangeRates: state.cart.exchangeRates,
  };
};
export default connect(mapStateToProps)(CurrencyDisplay);
