import React, { Component, useState, useEffect } from "react";

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
  Rating,
  Input,
  Loader,
  Flag,
  TextArea,
  Message,
  Segment,
  Select,
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { authAxios } from "../../utils";
import { orderDetailURL, productDetailURL } from "../../constants";
import CurrencyDisplay from "./../../hoc/Currency";

const supportedCountries = {
  ng: "ng",
  uk: "uk",
  ke: "ke",
  gh: "gh",
};
const status = {
  10: "New",
  20: "Processing",
  30: "Delivered",
  40: "Cancelled",
};
const orderStatus = {
  10: "New",
  20: "Processing",
  30: "Delivered",
};

const OrderDetail = (props) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [idForReview, selectForReview] = useState(null);
  const [review, setReview] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  var total = 0;
  var delivery_total = 0;
  useEffect(() => {
    authAxios.get(orderDetailURL(props.match.params.id)).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);
  const handleRate = (e, { rating, maxRating }) => setRating(rating);
  function sendForReview() {
    if (title.length > 75) {
      return setError("Title is too long.");
    }
    if (rating == 0) {
      return setError("Rating must be greater than zero.");
    }
    if (review.lengt < 10) {
      return setError("Review is too short. Try again.");
    }
    authAxios.post(productDetailURL(idForReview) + "add_review/", {
      review: review,
      title: title,
      rating: rating,
    });
  }
  if (loading == true) {
    return (
      <Segment>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Image src="/images/wireframe/short-paragraph.png" />
      </Segment>
    );
  }
  console.log(data);
  return (
    <Container>
      <div>
        <Container text fluid>
          <br />
          <Divider horizontal>
            <div className="expand-address-header">
              {" "}
              <Icon name="tag" />
              Shipping Address
            </div>
          </Divider>
          <p>{data.shipping_name}</p>
          <p>
            {data.shipping_address1} {data.shipping_city}
          </p>
          <p>
            <b>State:</b>
            {data.shipping_state}
          </p>

          <p>
            <b>Country:</b>{" "}
            <Flag name={supportedCountries[data.shipping_country]} />
          </p>
          <p>
            <b>Zip code: </b> {data.shipping_zip_code}
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
          <p>{data.billing_name}</p>
          <p>
            {data.billing_address1} {data.billing_city}
          </p>
          <p>
            <b>State:</b>
            {data.billing_state}
          </p>
          <p>
            <b>Country:</b>{" "}
            <Flag name={supportedCountries[data.billing_country]} />
          </p>
          <p>
            <b>Zip code: </b> {data.billing_zip_code}
          </p>
        </Container>
      </div>
      <br />
      <div className="in-the-middle">
        <div className="middle-left-order">Current Status:</div>
        <div className="middle-right-order">{orderStatus[data.status]}</div>
      </div>
      <br />
      <Divider horizontal>
        <div className="expand-address-header">
          {" "}
          <Icon name="tag" />
          Order Items
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
              Price
              <div>(+delivery fee)</div>
            </Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.lines.map((orderItem, i) => {
            total += parseFloat(orderItem.total);
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
                <Table.Cell> {status[orderItem.status]}</Table.Cell>
                {orderItem.status == 10 && (
                  <Table.Cell>
                    <Button
                      className="be-green"
                      onClick={() => {
                        selectForReview(orderItem.product.slug);
                      }}
                    >
                      Leave Review
                    </Button>
                  </Table.Cell>
                )}
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
      {error && (
        <Message
          error
          header="There was some errors with your submission"
          content={JSON.stringify(error)}
        />
      )}
      {idForReview != null && (
        <Form>
          <Form.Group>
            <Form.Field
              control={Input}
              onChange={(e, { value }) => {
                setTitle(value);
              }}
              label="Review Title"
              value={title}
            />
          </Form.Group>
          <Form.Field
            value={review}
            control={TextArea}
            onChange={(e, { value }) => {
              setReview(value);
            }}
            label="Review"
            placeholder="Enter your review"
          />
          <b>
            {" "}
            <label>Rating</label>
          </b>
          <br />
          <Rating rating={rating} maxRating={5} onRate={handleRate} />
          <Button
            className="be-green"
            onClick={() => {
              sendForReview();
            }}
          >
            Leave Review
          </Button>
        </Form>
      )}
    </Container>
  );
};
export default OrderDetail;

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
