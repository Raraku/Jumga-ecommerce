import React, { Component } from "react";

import {
  Button,
  Container,
  Dimmer,
  Divider,
  Form,
  Table,
  Icon,
  Header,
  Image,
  Item,
  Label,
  Loader,
  Flag,
  Message,
  Segment,
  Select,
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { authAxios } from "../../utils";
import {
  checkoutURL,
  orderSummaryURL,
  addCouponURL,
  addressListURL,
} from "../../constants";
import CurrencyDisplay from "./../../hoc/Currency";

const supportedCountries = {
  ng: "ng",
  uk: "uk",
  ke: "ke",
  gh: "gh",
};

const OrderPreview = (props) => {
  const { data } = props;
  var total = 0;
  var delivery_total = 0;
  console.log(props);
  const goNext = () => {
    props.setStep(3);
  };
  const goBack = () => {
    props.setStep(1);
  };
  return (
    <Container>
      <div>
        <Container text fluid>
          <Divider horizontal>
            <div className="expand-address-header">
              {" "}
              <Icon name="tag" />
              Shipping Address
            </div>
          </Divider>
          <p>{props.selectedShipping.name}</p>
          <p>
            {props.selectedShipping.address1} {props.selectedShipping.city}
          </p>
          <p>
            <b>State:</b>
            {props.selectedShipping.state}
          </p>

          <p>
            <b>Country:</b>{" "}
            <Flag name={supportedCountries[props.selectedShipping.country]} />
          </p>
          <p>
            <b>Zip code: </b> {props.selectedShipping.zip_code}
          </p>
        </Container>

        <Container text>
          <Divider horizontal>
            <div className="expand-address-header">
              {" "}
              <Icon name="tag" />
              Billing Address
            </div>
          </Divider>
          <p>{props.selectedBilling.name}</p>
          <p>
            {props.selectedBilling.address1} {props.selectedBilling.city}
          </p>
          <p>
            <b>State:</b>
            {props.selectedBilling.state}
          </p>
          <p>
            <b>Country:</b>{" "}
            <Flag name={supportedCountries[props.selectedBilling.country]} />
          </p>
          <p>
            <b>Zip code: </b> {props.selectedBilling.zip_code}
          </p>
        </Container>
      </div>
      <br />
      <br />
      <Divider horizontal>
        <div className="expand-address-header">
          {" "}
          <Icon name="tag" />
          Order Review
        </div>
      </Divider>
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ textAlign: "center" }}>
              Item Image
            </Table.HeaderCell>
            <Table.HeaderCell>Product(s)</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>
              Price <div>(+delivery fee)</div>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.basketlines.map((orderItem, i) => {
            total += parseInt(orderItem.total);
            delivery_total += parseFloat(orderItem.delivery_fee);
            return (
              <Table.Row>
                <Table.Cell>
                  <Header as="h2" textAlign="center">
                    <Image src={orderItem.product.productImage[0].image} />
                  </Header>
                </Table.Cell>
                <Table.Cell singleLine>
                  <b>{orderItem.product.name}</b>
                </Table.Cell>
                <Table.Cell>{orderItem.quantity}</Table.Cell>
                <Table.Cell>
                  <CurrencyDisplay value={orderItem.total} />

                  <div className="dim-a-bit">
                    + <CurrencyDisplay value={orderItem.delivery_fee} />
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell>
              <b>Total</b>
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell>
              <b>
                {" "}
                <CurrencyDisplay value={total + delivery_total} />
              </b>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <div className="horizontal-navigator">
        <Button onClick={goBack}>
          <Icon name="arrow left" />
          Cancel
        </Button>
        <Button onClick={goNext}>
          Next <Icon name="arrow right" />
        </Button>
      </div>
    </Container>
  );
};
export default OrderPreview;

{
  /* <div style={{ textAlign: "end" }}>
   <Button
     onClick={() => {
       props.history.push("/checkout/");
     }}
     style={{ backgroundColor: "#00ae68", color: "white" }}
     animated
   >
     <Button.Content visible>Proceed to Checkout</Button.Content>
     <Button.Content hidden>
       <Icon name="arrow right" />
     </Button.Content>
   </Button>
 </div>; */
}
