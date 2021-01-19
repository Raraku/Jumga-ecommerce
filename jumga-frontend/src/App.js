import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import BaseRouter from "./routes";
import * as actions from "./store/actions/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import CustomLayout from "./containers/Layout";
import { fetchExchangeRate } from "./store/actions/cart";
import "./mobile.css";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
    this.props.getExchangeRate();
  }

  render() {
    return (
      <Router>
        <CustomLayout {...this.props}>
          <BaseRouter />
        </CustomLayout>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    getExchangeRate: () => dispatch(fetchExchangeRate()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
