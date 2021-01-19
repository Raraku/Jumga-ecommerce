import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Button,
  Card,
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  Label,
  Loader,
  Menu,
  Message,
  Segment,
  Select,
  Table,
} from "semantic-ui-react";
import {
  countryListURL,
  addressListURL,
  addressDetailURL,
  userIDURL,
  paymentListURL,
} from "../../constants";
import { authAxios } from "../../utils";
import AddressForm from "./AddressForm";
import PaymentHistory from "./PaymentHistory";
import OrderHistory from "./OrderHistory";

const supportedCountries = {
  ng: "Nigeria",
  uk: "United Kingdom",
  ke: "Kenya",
  gh: "Ghana",
};
const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "billingAddress",
      addresses: [],
      selectedAddress: null,
    };
  }
  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchCustomerData();
  }

  handleItemClick = (name) => {
    this.setState({ activeItem: name }, () => {
      this.handleFetchAddresses();
    });
  };

  handleGetActiveItem = () => {
    const { activeItem } = this.state;
    switch (activeItem) {
      case "billingAddress":
        return "Billing Address";
        break;
      case "shippingAddress":
        return "Shipping Address";
        break;
      case "paymentHistory":
        return "Payment History";
        break;
      case "orderHistory":
        return "Order History";
        break;
    }
  };

  handleDeleteAddress = (addressID) => {
    authAxios
      .delete(addressDetailURL(addressID))
      .then((res) => {
        this.handleCallback();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleSelectAddress = (address) => {
    this.setState({ selectedAddress: address });
  };

  handleFetchCustomerData = () => {
    authAxios
      .get(userIDURL)
      .then((res) => {
        this.setState({ userData: res.data[0] });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  // handleFetchCountries = () => {
  //   authAxios
  //     .get(countryListURL)
  //     .then((res) => {
  //       this.setState({ countries: this.handleFormatCountries(res.data) });
  //     })
  //     .catch((err) => {
  //       this.setState({ error: err });
  //     });
  // };

  handleFetchAddresses = () => {
    this.setState({ loading: true });
    authAxios
      .get(addressListURL)
      .then((res) => {
        this.setState({ addresses: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleCallback = () => {
    this.handleFetchAddresses();
    this.setState({ selectedAddress: null });
  };

  render() {
    const { activeItem, error, loading } = this.state;
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    const RenderOptions = () => {
      switch (activeItem) {
        case "billingAddress":
          console.log("h");
          return (
            <RenderAddresses
              activeItem={activeItem}
              selectedAddress={this.state.selectedAddress}
              addresses={this.state.addresses}
              userID={this.state.userData}
              handleSelectAddress={(address) =>
                this.handleSelectAddress(address)
              }
              handleDeleteAddress={(id) => this.handleDeleteAddress(id)}
              handleCallback={this.handleCallback}
            />
          );
          break;
        case "shippingAddress":
          return (
            <RenderAddresses
              activeItem={activeItem}
              selectedAddress={this.state.selectedAddress}
              addresses={this.state.addresses}
              userID={this.state.userData}
              handleSelectAddress={(address) =>
                this.handleSelectAddress(address)
              }
              handleDeleteAddress={(id) => this.handleDeleteAddress(id)}
              handleCallback={this.handleCallback}
            />
          );
          break;
        case "paymentHistory":
          return <PaymentHistory />;
          break;
        case "orderHistory":
          return <OrderHistory {...this.props} />;
          break;
      }
    };

    return (
      <Grid container columns={2} doubling stackable divided>
        <Grid.Row columns={1}>
          <Grid.Column>
            {error && (
              <Message
                error
                header="There was an error"
                content="The application ran into an error. Please try again"
              />
            )}
            {loading && (
              <Segment>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
                <Image src="/images/wireframe/short-paragraph.png" />
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            <Menu pointing vertical fluid>
              <Menu.Item
                name="Billing Address"
                active={activeItem === "billingAddress"}
                onClick={() => this.handleItemClick("billingAddress")}
              />
              <Menu.Item
                name="Shipping Address"
                active={activeItem === "shippingAddress"}
                onClick={() => this.handleItemClick("shippingAddress")}
              />
              <Menu.Item
                name="Payment history"
                active={activeItem === "paymentHistory"}
                onClick={() => this.handleItemClick("paymentHistory")}
              />
              <Menu.Item
                name="Order History"
                active={activeItem === "orderHistory"}
                onClick={() => this.handleItemClick("orderHistory")}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header>{this.handleGetActiveItem()}</Header>
            <Divider />
            <RenderOptions />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Profile);

const RenderAddresses = (props) => {
  console.log(props);
  const { activeItem, addresses, selectedAddress, userID } = props;
  return (
    <React.Fragment>
      <Card.Group>
        {addresses
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
                  <Card.Header>{address.name}</Card.Header>

                  <Card.Meta>
                    {" "}
                    {address.address1}, {address.state}
                  </Card.Meta>
                  <Card.Meta> {address.city}</Card.Meta>
                  <Card.Meta>{supportedCountries[address.country]}</Card.Meta>
                  <Card.Description> {address.zip_code}</Card.Description>
                </Card.Content>
                <Card.Content
                  style={{ display: "flex", justifyContent: "center" }}
                  extra
                >
                  <Button
                    color="yellow"
                    style={{ marginRight: "1em" }}
                    onClick={() => props.handleSelectAddress(address)}
                  >
                    Update
                  </Button>
                  <Button
                    color="red"
                    style={{ marginLeft: "1em" }}
                    onClick={() => props.handleDeleteAddress(address.id)}
                  >
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
      </Card.Group>
      {addresses.length > 0 ? <Divider /> : null}
      {selectedAddress === null ? (
        <AddressForm
          formType={CREATE_FORM}
          activeItem={activeItem}
          countries={supportedCountries}
          userID={userID}
          callback={props.handleCallback}
        />
      ) : (
        <AddressForm
          activeItem={activeItem}
          formType={UPDATE_FORM}
          countries={supportedCountries}
          userID={userID}
          address={selectedAddress}
          callback={props.handleCallback}
        />
      )}
    </React.Fragment>
  );
};
