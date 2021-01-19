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
import { addressListURL } from "./../../constants";

const supportedCountries = {
  ng: "ng",
  uk: "uk",
  ke: "ke",
  gh: "gh",
};

function SelectAddresses(props) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { checked, setChecked } = props;
  const fetchAddresses = () => {
    authAxios
      .get(addressListURL)
      .then((res) => {
        setAddresses(res.data);
        setLoading(false);
      })
      .catch((err) => {});
  };
  useState(() => {
    fetchAddresses();
  }, []);
  const goNext = () => {
    if (
      Object.entries(props.selectedBilling).length > 0 &&
      Object.entries(props.selectedShipping).length > 0
    ) {
      props.setStep(2);
    } else {
      setError("Choose addresses to move to the next step");
      window.scrollTo(0, 0);
    }
  };
  const toggleChecked = () => {
    if (checked) {
      setChecked(false);
      props.changeAddress("BA", {});
    } else {
      if (Object.entries(props.selectedShipping).length > 0) {
        setChecked(true);
        props.changeAddress("BA", { ...props.selectedShipping, type: "BA" });
      } else {
        setError("You need to select a shipping address first");
        window.scrollTo(0, 0);
      }
    }
  };

  if (loading) {
    return (
      <Segment>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Image src="/images/wireframe/short-paragraph.png" />
      </Segment>
    );
  }
  if (addresses == []) {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="search" />
          You have no addresses. Create one in your profile
        </Header>
        <Button onClick={props.history.push("/profile/")} primary>
          Go to Profile
        </Button>
      </Segment>
    );
  }
  return (
    <div>
      {error.length > 0 && (
        <Message
          error
          header="There was some errors with your submission"
          content={JSON.stringify(error)}
        />
      )}
      <div className="expand-address-header">Select a shipping address</div>
      <AddressGroup
        addresses={addresses}
        activeItem="shippingAddress"
        {...props}
        changeAddress={props.changeAddress}
      />
      <div className="checkbo">
        <Form>
          <Form.Field
            control={Checkbox}
            onChange={toggleChecked}
            checked={checked}
            label={{ children: "Use as billing address" }}
          />
        </Form>
      </div>
      <Divider />

      {!checked && (
        <div>
          <div className="expand-address-header">Select a Billing address</div>
          <AddressGroup
            addresses={addresses}
            activeItem="billingAddress"
            {...props}
            changeAddress={props.changeAddress}
          />
          <Divider />
        </div>
      )}
      <div className="horizontal-navigator">
        <Button
          onClick={() => {
            props.history.pop();
          }}
        >
          <Icon name="arrow left" />
          Cancel
        </Button>
        <Button onClick={goNext}>
          Next <Icon name="arrow right" />
        </Button>
      </div>
    </div>
  );
}

const AddressGroup = (props) => {
  return (
    <Card.Group id="address-order" itemsPerRow={3} stackable>
      {props.addresses
        .filter((item) => {
          if (props.activeItem == "billingAddress") {
            return item.type == "BA";
          } else {
            return item.type == "SA";
          }
        })
        .map((address) => {
          return (
            <Card key={address.id}>
              <Card.Content>
                {address.default && (
                  <Label as="a" color="blue" ribbon="right">
                    Default
                  </Label>
                )}
                <Card.Header className="header-address-item">
                  {address.name}
                </Card.Header>

                <Card.Meta>
                  {" "}
                  {address.address1}, {address.city}
                </Card.Meta>
                <Card.Meta>
                  <b>State: </b>
                  {address.state}
                </Card.Meta>
                <Card.Meta>
                  <b>Country:</b>
                  <Flag name={supportedCountries[address.country]} />
                </Card.Meta>
                <Card.Meta>
                  <b>Zip code:</b> {address.zip_code}
                </Card.Meta>
              </Card.Content>

              <Card.Content extra>
                {props.activeItem == "billingAddress" ? (
                  <>
                    {Object.entries(props.selectedBilling).length > 0 &&
                    props.selectedBilling.id == address.id ? (
                      <div className="ui two buttons">
                        <Button id="the-button-to-remember">
                          <Icon name="check" /> Selected
                        </Button>
                      </div>
                    ) : (
                      <div className="ui two buttons">
                        <Button
                          onClick={() => {
                            props.changeAddress("BA", address);
                          }}
                          basic
                          color="green"
                        >
                          Select
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {Object.entries(props.selectedShipping).length > 0 &&
                    props.selectedShipping.id == address.id ? (
                      <div className="ui two buttons">
                        <Button id="the-button-to-remember">
                          <Icon name="check" /> Selected
                        </Button>
                      </div>
                    ) : (
                      <div className="ui two buttons">
                        <Button
                          onClick={() => {
                            props.changeAddress("SA", address);
                          }}
                          basic
                          color="green"
                        >
                          Select
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card.Content>
            </Card>
          );
        })}
    </Card.Group>
  );
};

export default SelectAddresses;
