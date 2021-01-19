import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Icon,
  Header,
  Image,
  Label,
  List,
  Menu,
  Segment,
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../store/actions/auth";
import { changeLocale, fetchCart } from "../../store/actions/cart";
import SearchMini from "./SearchMini";

const countryOptions = [
  { key: "ng", value: "ng", flag: "ng" },
  { key: "uk", value: "uk", flag: "uk" },
  { key: "gh", value: "gh", flag: "gh" },
  { key: "ke", value: "ke", flag: "ke" },
];

class CustomLayout extends React.Component {
  componentDidMount() {
    this.props.fetchCart();
  }
  handleChange = (e, { value }) => {
    this.props.updateLocale(value);
  };

  render() {
    const { authenticated, cart, loading } = this.props;

    return (
      <div className="overlord-div">
        <Menu stackable inverted>
          <Container className="fatten-menu">
            <Link to="/">
              <Menu.Item header>Home</Menu.Item>
            </Link>
            <Link to="/products">
              <Menu.Item header>Products</Menu.Item>
            </Link>
            <Menu.Menu style={{ width: "100%" }}>
              <SearchMini {...this.props} />
            </Menu.Menu>

            {authenticated ? (
              <React.Fragment>
                <Menu.Menu position="right">
                  <Link to="/profile/">
                    <Menu.Item>Profile</Menu.Item>
                  </Link>
                  <Link to="/cart/">
                    <Menu.Item>
                      <Icon name="shopping cart" />{" "}
                      {cart.basketlines !== undefined && (
                        <>{`${
                          cart.basketlines.length > 0
                            ? cart.basketlines.length
                            : 0
                        }`}</>
                      )}
                    </Menu.Item>
                  </Link>
                  <Menu.Menu className="pl-2">
                    <Dropdown
                      defaultValue={countryOptions[0].value}
                      className="nav-flag"
                      search
                      selection
                      onChange={this.handleChange}
                      fluid
                      options={countryOptions}
                    />
                  </Menu.Menu>
                  <Menu.Item header onClick={() => this.props.logout()}>
                    Logout
                  </Menu.Item>
                </Menu.Menu>
              </React.Fragment>
            ) : (
              <Menu.Menu position="right">
                <Link to="/login">
                  <Menu.Item header>Login</Menu.Item>
                </Link>
                <Link to="/signup">
                  <Menu.Item header>Signup</Menu.Item>
                </Link>
                <Menu.Menu className="pl-2">
                  <Dropdown
                    defaultValue={countryOptions[0].value}
                    className="nav-flag"
                    search
                    selection
                    onChange={this.handleChange}
                    fluid
                    options={countryOptions}
                  />
                </Menu.Menu>
              </Menu.Menu>
            )}
          </Container>
        </Menu>

        {this.props.children}

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Make Money with Jumia" />
                <List link inverted>
                  <List.Item
                    onClick={() => {
                      this.props.history.push("/seller/");
                    }}
                    as="a"
                  >
                    Sell on Jumga
                  </List.Item>
                  <List.Item as="a">Jumga Logistics Partner</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header inverted as="h4" content="Help" />
                <List link inverted>
                  <List.Item as="a">Delivery Timelines</List.Item>
                  <List.Item as="a">How to shop on Jumga?</List.Item>
                  <List.Item as="a">How to return a product?</List.Item>
                  <List.Item as="a">Bulk Purchases</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header inverted as="h4" content="Our Partners" />
                <p>
                  Payment Partner:{" "}
                  <b>
                    <a href="https://www.flutterwave.com">
                      {" "}
                      Flutterwave — Accept payments anywhere
                    </a>
                  </b>
                </p>
                <a href="https://www.freepik.com/vectors/banner">
                  Banner vector created by katemangostar - www.freepik.com
                </a>
                <a href="https://www.freepik.com/vectors/website">
                  Website vector created by stories - www.freepik.com
                </a>
              </Grid.Column>
            </Grid>

            <Divider inverted section />
            <div>
              {" "}
              <Icon name="shopping cart" />
            </div>
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart()),
    updateLocale: (locale) => dispatch(changeLocale(locale)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);
