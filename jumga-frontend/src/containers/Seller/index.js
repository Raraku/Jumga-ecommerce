import React, { useState, useEffect } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Form,
  Grid,
  Step,
  Header,
  Icon,
  Message,
  Image,
} from "semantic-ui-react";
import { authAxios } from "./../../utils";
import { endpoint, shopURL, shopCreateURL } from "./../../constants";
import SellImage from "./../artwork/sellImage.jpg";
const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

function SellerPage(props) {
  const [sell, setSell] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [bank, setBank] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const [shop, setShop] = useState(null);
  //   if (!props.isAuthenticated) {
  //     return <Redirect to="/products/" />;
  //   }
  console.log(name, country, bank, bankAccount);
  useEffect(() => {
    getSeller();
  }, []);
  const getSeller = () => {
    authAxios.get(shopCreateURL + "get_shop/").then((res) => {
      setShop(res.data);
    });
  };
  const submitForm = () => {
    if (
      name.length == 0 ||
      country.length == 0 ||
      bank.length == 0 ||
      bankAccount.length == 0 ||
      phoneNumber.length == 0
    ) {
      return setError("All fields are required.");
    }
    authAxios
      .post(shopCreateURL, {
        name: name,
        country: country,
        account_bank: bank,
        account_number: bankAccount,
        phone_number: phoneNumber,
      })
      .then((res) => getSeller());
  };
  if (shop) {
    return <ForASeller shop={shop} />;
  }
  return (
    <Container className="mt-5">
      <BecomeASeller
        sell={sell}
        name={name}
        setName={setName}
        country={country}
        setCountry={setCountry}
        bank={bank}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        setBank={setBank}
        bankAccount={bankAccount}
        setBankAccount={setBankAccount}
        setSell={setSell}
        error={error}
        submitForm={submitForm}
      />
    </Container>
  );
}
const countries = [
  { key: "ng", value: "ng", text: "Nigeria" },
  { key: "gh", value: "gh", text: "Ghana" },
  { key: "ke", value: "ke", text: "Kenya" },
];
const BecomeASeller = (props) => {
  const [bankOptions, setBankOptions] = useState([]);
  useEffect(() => {}, []);
  return (
    <Grid doubling stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <Image src={SellImage} />
        </Grid.Column>
        <Grid.Column width={8}>
          <Header as="h2">Become a Jumga Seller</Header>
          <div>
            Reach an audience spanning countries with over 300 million potential
            customers (and more countries to come)
          </div>
          <Button
            className="be-green mt-3 mb-3"
            floated="center"
            icon
            fluid
            labelPosition="right"
            onClick={() => {
              props.setSell(true);
            }}
          >
            Sell on Jumga
            <Icon name="send" />
          </Button>
        </Grid.Column>
      </Grid.Row>
      {props.error && (
        <Message
          error
          header="There were some errors with your submission"
          content={props.error}
        />
      )}
      {props.sell && (
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h3">Sign up</Header>
            <Form onSubmit={props.submitForm}>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  value={props.name}
                  onChange={(e, { value }) => {
                    props.setName(value);
                  }}
                  label="Business Name"
                  placeholder="Your Seller Name"
                />
                <Form.Select
                  fluid
                  label="Country"
                  onChange={(e, { value }) => {
                    props.setCountry(value);
                    authAxios
                      .get(endpoint + `/shop/get_banks/?country=${value}`)
                      .then((res) => {
                        var bankArray = [];
                        console.log(res.data);
                        res.data.data.map((dat) => {
                          bankArray.push({
                            key: dat.id,
                            value: dat.code,
                            text: dat.name,
                          });
                        });
                        setBankOptions(bankArray);
                      });
                  }}
                  options={countries}
                  placeholder="Select Country"
                />
                <Form.Select
                  fluid
                  loading={bankOptions.length == 0}
                  label="Bank"
                  onChange={(e, { value }) => {
                    props.setBank(value);
                  }}
                  options={bankOptions}
                  placeholder="Select your bank"
                />
                <Form.Input
                  fluid
                  value={props.bankAccount}
                  label="Account Number"
                  onChange={(e, { value }) => {
                    props.setBankAccount(value);
                  }}
                  type="number"
                  placeholder="Account number"
                />
                <Form.Input
                  fluid
                  value={props.phoneNumber}
                  label="Business Number"
                  onChange={(e, { value }) => {
                    props.setPhoneNumber(value);
                  }}
                  type="number"
                  placeholder="Business No"
                />
              </Form.Group>
              <Form.Button color="black">Submit</Form.Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      )}
      <Grid.Row>
        <Divider horizontal>
          <Header>How it works</Header>
        </Divider>
        <Step.Group size="small" attached="top">
          <Step>
            <Icon name="truck" id="highlight-iteme" />
            <Step.Content>
              <Step.Title>Sign Up</Step.Title>
              <Step.Description>Join our platform</Step.Description>
            </Step.Content>
          </Step>
          <Step>
            <Icon name="info" id="highlight-iteme" />
            <Step.Content>
              <Step.Title>Pay our token fee</Step.Title>
              <Step.Description>Verification</Step.Description>
            </Step.Content>
          </Step>
          <Step>
            <Icon name="payment" id="highlight-iteme" />
            <Step.Content>
              <Step.Title>Upload your products</Step.Title>
              <Step.Description></Step.Description>
            </Step.Content>
          </Step>
          <Step>
            <Icon name="payment" id="highlight-iteme" />
            <Step.Content>
              <Step.Title>Get ready to receive orders</Step.Title>
              <Step.Description></Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>
      </Grid.Row>
    </Grid>
  );
};
const ForASeller = (props) => {
  const [warning, setWarning] = useState(null);
  const [working, setWorking] = useState(null);
  console.log(props);
  const pay = () => {
    authAxios.get(shopURL(props.shop.id) + "pay_fee/").then((res) => {
      openInNewTab(res.data.data.link);
      setWorking("heyyo");
    });
  };
  return (
    <Container className="mt-5">
      <Grid doubling stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            {" "}
            <Image src={SellImage} />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h2">Good Day, {props.shop.name}.</Header>
            <div>Visit the admin site to manage your catalogue.</div>
            <Button
              className="be-green mt-3 mb-3"
              floated="center"
              icon
              labelPosition="right"
              onClick={() => {
                if (props.shop.paid_reg_fee) {
                } else {
                  setWarning("ouch");
                }
              }}
            >
              Go to Admin
              <Icon name="send" />
            </Button>
            {!props.shop.paid_reg_fee && (
              <Button
                className="be-green mt-3 mb-3"
                floated="center"
                icon
                labelPosition="right"
                onClick={pay}
              >
                Pay $20
                <Icon name="credit card" />
              </Button>
            )}
          </Grid.Column>
        </Grid.Row>
        {working && (
          <Message
            warning
            header="Transaction Processing"
            content="Reload the page when transaction is finished to see changes"
          />
        )}
        {warning && (
          <Message
            warning
            header="Oops"
            content="You need to pay the registration fee to access the admin site"
          />
        )}
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(SellerPage);
