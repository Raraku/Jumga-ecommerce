import React, { useState, useEffect } from "react";

import {
  Button,
  Container,
  Dimmer,
  Divider,
  Form,
  Header,
  Image,
  Item,
  Step,
  Label,
  Loader,
  Message,
  Segment,
  Icon,
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
import OrderPreview from "./Review";
import { connect } from "react-redux";
import SelectAddresses from "./SelectAddress";
import PaymentPage from "./Payment";

function CheckoutForm(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState({});
  const [selectedBilling, setSelectedBilling] = useState({});
  const [checked, setChecked] = useState(false);
  console.log(selectedBilling, selectedShipping);
  // const handleFetchBillingAddresses = () => {
  //   this.setState({ loading: true });
  //   authAxios
  //     .get(addressListURL("B"))
  //     .then((res) => {
  //       this.setState({
  //         billingAddresses: res.data.map((a) => {
  //           return {
  //             key: a.id,
  //             text: `${a.street_address}, ${a.apartment_address}, ${a.country}`,
  //             value: a.id,
  //           };
  //         }),
  //         selectedBillingAddress: this.handleGetDefaultAddress(res.data),
  //         loading: false,
  //       });
  //     })
  //     .catch((err) => {
  //       setError(err);
  //       setLoading(false);
  //     });
  // };

  // const handleSelectChange = (e, { name, value }) => {
  //   this.setState({ [name]: value });
  // };

  const { cart } = props;
  function changeAddress(type, newAddress) {
    if (type == "BA") {
      setSelectedBilling(newAddress);
    } else {
      setSelectedShipping(newAddress);
    }
  }

  if (cart.length <= 0) {
    return (
      <Segment>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Image src="/images/wireframe/short-paragraph.png" />
      </Segment>
    );
  }
  function setTheStep(newStep) {
    setStep(newStep);
  }
  function setTheCheck() {
    setChecked(!checked);
  }
  return (
    <Container id="main-container">
      {error && (
        <Message
          error
          header="There were some errors with your submission"
          content={error}
        />
      )}
      <Step.Group attached="top">
        <Step active={step == 1} completed={step > 1} disabled={step > 1}>
          <Icon name="truck" id="highlight-item" />
          <Step.Content>
            <Step.Title>Shipping/Billing</Step.Title>
            <Step.Description>Choose your shipping options</Step.Description>
          </Step.Content>
        </Step>
        <Step active={step == 2} completed={step > 2} disabled={step > 2}>
          <Icon name="info" id="highlight-item" />
          <Step.Content>
            <Step.Title>Review Cart</Step.Title>
            <Step.Description>Review your cart</Step.Description>
          </Step.Content>
        </Step>
        <Step active={step == 3} completed={step > 3} disabled={step > 3}>
          <Icon name="payment" id="highlight-item" />
          <Step.Content>
            <Step.Title>Payment</Step.Title>
            <Step.Description>Enter billing information</Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
      <Segment attached>
        <RenderStep
          step={step}
          checked={checked}
          setChecked={setTheCheck}
          selectedShipping={selectedShipping}
          selectedBilling={selectedBilling}
          setStep={setTheStep}
          cart={cart}
          changeAddress={changeAddress}
          {...props}
        />
      </Segment>

      <Divider />
    </Container>
  );
}
const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading,
  };
};

export default connect(mapStateToProps)(CheckoutForm);

const RenderStep = (props) => {
  switch (props.step) {
    case 1:
      return <SelectAddresses {...props} />;
      break;
    case 2:
      return <OrderPreview {...props} data={props.cart} />;
      break;
    case 3:
      return <PaymentPage {...props} id={props.cart.id} />;
  }
};

// submit = (ev) => {
//   ev.preventDefault();
//   this.setState({ loading: true });
//   if (this.props.stripe) {
//     this.props.stripe.createToken().then((result) => {
//       if (result.error) {
//         this.setState({ error: result.error.message, loading: false });
//       } else {
//         this.setState({ error: null });
//         const {
//           selectedBillingAddress,
//           selectedShippingAddress,
//         } = this.state;
//         authAxios
//           .post(checkoutURL, {
//             stripeToken: result.token.id,
//             selectedBillingAddress,
//             selectedShippingAddress,
//           })
//           .then((res) => {
//             this.setState({ loading: false, success: true });
//           })
//           .catch((err) => {
//             this.setState({ loading: false, error: err });
//           });
//       }
//     });
//   } else {
//     console.log("Stripe is not loaded");
//   }
// };
