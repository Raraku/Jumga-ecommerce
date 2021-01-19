import React, { useState, useEffect } from "react";
import {
  Header,
  Select,
  Divider,
  Link,
  Segment,
  Dimmer,
  Loader,
  Icon,
  Form,
  Image,
  Message,
  Label,
  Button,
  Flag,
  Checkbox,
  Card,
} from "semantic-ui-react";
import { authAxios } from "./../../utils";
import { basketDetailURL, orderURL } from "./../../constants";

function PaymentPage(props) {
  const [redirectURL, setRedirectURL] = useState("");
  const [transactionReference, setTransactionReference] = useState("");

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
  console.log(transactionReference);
  useEffect(() => {
    authAxios
      .post(basketDetailURL(props.id) + "create_order/", {
        billing_address: props.selectedBilling,
        shipping_address: props.selectedShipping,
      })
      .then((res) => {
        console.log(res.data);
        authAxios.get(orderURL(res.data.id) + "pay/").then((ress) => {
          console.log(ress.data);
          setTransactionReference(ress.data.tx_ref);
          openInNewTab(ress.data.data.link);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div id="main-container">
      {" "}
      <Loader active size="large">
        Processing Transaction.
        {transactionReference.length > 0 && (
          <p>
            <b>Transaction Reference Number:</b>
            {transactionReference}
          </p>
        )}
      </Loader>
    </div>
  );
}
export default PaymentPage;
