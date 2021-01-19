import React, { Component, useState, useEffect } from "react";
import {
  Button,
  Container,
  Dimmer,
  Divider,
  Form,
  Header,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Icon,
  Select,
  Dropdown,
  Table,
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { authAxios } from "../../utils";
import { basketURL } from "./../../constants";
import { connect } from "react-redux";
import { fetchCart } from "./../../store/actions/cart";
import { productDetailURL } from "./../../constants";
import CurrencyDisplay from "./../../hoc/Currency";

var options = [];

for (var i = 1; i < 11; i++) {
  var obj = { key: i, text: i, value: i };
  options.push(obj);
}

const OrderPreview = (props) => {
  var total = 0;
  console.log(options);
  const data = props.cart;
  // const handleFetchCart = () => {
  //   authAxios
  //     .get(basketURL)
  //     .then((res) => {
  //       set;
  //       this.setState({ data: res.data, loading: false });
  //     })
  //     .catch((err) => {
  //       if (err.response.status === 404) {
  //         this.props.history.push("/products");
  //       } else {
  //         this.setState({ error: err, loading: false });
  //       }
  //     });
  // };

  if (props.loading == true) {
    return (
      <Segment>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Image src="/images/wireframe/short-paragraph.png" />
      </Segment>
    );
  }
  const deleteBasketLine = (basketLine) => {
    authAxios
      .get(productDetailURL(basketLine.product.slug) + "remove_from_basket/")
      .then((res) => {
        props.fetchCart();
      });
  };
  const dropOptions = [
    {
      key: 1,
      text: 1,
    },
  ];
  const handleChange = (e, value, basketLine) => {
    authAxios
      .get(productDetailURL(basketLine.product.slug) + "change_quantity/", {
        params: {
          nq: value,
        },
      })
      .then((res) => {
        props.fetchCart();
      });
  };
  console.log(data);
  if (data.basketlines != undefined) {
    return (
      <Container>
        <Table defined>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ textAlign: "center" }}>
                Item Image
              </Table.HeaderCell>
              <Table.HeaderCell>Product(s)</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.basketlines.map((orderItem, i) => {
              total += parseInt(orderItem.total);
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
                  <Table.Cell>
                    {" "}
                    <Dropdown
                      placeholder="Quantity"
                      fluid
                      onChange={(e, { value }) => {
                        handleChange(e, value, orderItem);
                      }}
                      selection
                      options={options}
                      defaultValue={options[orderItem.quantity - 1].value}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <CurrencyDisplay value={orderItem.total} />{" "}
                  </Table.Cell>
                  <Table.Cell>
                    <Icon
                      onClick={() => {
                        deleteBasketLine(orderItem);
                      }}
                      circular
                      link
                      name="delete"
                    />
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
                  <CurrencyDisplay value={total} />
                </b>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <div style={{ textAlign: "end" }}>
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
        </div>
      </Container>
    );
  } else {
    return (
      <Segment>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Image src="/images/wireframe/short-paragraph.png" />
      </Segment>
    );
  }

  // return (
  //   <Container>
  //
  //       <React.Fragment>
  //         <Item.Group relaxed>
  //           {data.basketlines.map((orderItem, i) => {
  //             total += parseInt(orderItem.total);
  //             return (
  //               <Item key={i}>
  //                 <Item.Image
  //                   size="tiny"
  //                   src={orderItem.product.productImage[0].image}
  //                 />
  //                 <Item.Content verticalAlign="middle">
  //                   <Item.Header as="a">
  //                     {orderItem.quantity} x {orderItem.product.name}
  //                   </Item.Header>
  //                   <Item.Extra>
  //                     <Label>${orderItem.total}</Label>
  //                   </Item.Extra>
  //                 </Item.Content>
  //               </Item>
  //             );
  //           })}
  //         </Item.Group>

  //         <Item.Group>
  //           <Item>
  //             <Item.Content>
  //               <Item.Header>Order Total: ${total}</Item.Header>
  //             </Item.Content>
  //           </Item>
  //         </Item.Group>
  //       </React.Fragment>
  //     )}
  //   </Container>
  // );
};

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderPreview);
