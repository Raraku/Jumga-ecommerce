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
  addressListURL,
  addressDetailURL,
  paymentListURL,
} from "../../constants";
import { authAxios } from "../../utils";

const countries = [
  { key: "ng", value: "ng", text: "Nigeria" },
  { key: "uk", value: "uk", text: "United Kingdom" },
  { key: "gh", value: "gh", text: "Ghana" },
  { key: "ke", value: "ke", text: "Kenya" },
];

export default class AddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: false,
      formData: {
        type: "",
        address1: "",
        city: "",
        country: "",
        name: "",
        id: "",
        state: "",
        user: 1,
        zip_code: "",
      },
      saving: false,
      success: false,
    };
  }

  componentDidMount() {
    const { address, formType } = this.props;

    if (formType === "UPDATE_FORM") {
      this.setState({ formData: { ...address } });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.address !== this.props.address) {
      if (this.props.address !== undefined) {
        this.setState({ formData: this.props.address });
      }
    }
  }

  handleToggleDefault = () => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      default: !formData.default,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleChange = (e) => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleSelectChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [name]: value,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleSubmit = (e) => {
    this.setState({ saving: true });
    e.preventDefault();
    const { formType } = this.props;
    console.log(formType);
    if (formType === "UPDATE_FORM") {
      this.handleUpdateAddress();
    } else {
      this.handleCreateAddress();
    }
  };

  handleCreateAddress = () => {
    const { userID, activeItem } = this.props;
    const { formData } = this.state;
    authAxios
      .post(addressListURL, {
        ...formData,
        user: userID.id,
        type: activeItem === "billingAddress" ? "BA" : "SA",
      })
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          formData: {
            type: "",
            address1: "",
            city: "",
            country: "",
            name: "",
            id: "",
            state: "",
            user: 1,
            zip_code: "",
          },
        });
        this.props.callback();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true });
      });
  };

  handleUpdateAddress = () => {
    const { userID, activeItem } = this.props;
    const { formData } = this.state;
    authAxios
      .put(addressDetailURL(formData.id), {
        ...formData,
        user: userID.id,
        type: activeItem === "billingAddress" ? "BA" : "SA",
      })
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          formData: {
            type: "",
            address1: "",
            city: "",
            country: "",
            name: "",
            id: "",
            state: "",
            user: 1,
            zip_code: "",
          },
        });
        // this.props.callback();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true });
      });
  };

  render() {
    const { error, success, saving } = this.state;
    console.log(this.props.formType);
    return (
      <Form onSubmit={this.handleSubmit} success={success} error={error}>
        <Form.Input
          required
          name="name"
          placeholder="Full Name"
          onChange={this.handleChange}
          value={this.state.formData.name}
        />
        <Form.Input
          required
          name="address1"
          placeholder="Address"
          onChange={this.handleChange}
          value={this.state.formData.address1}
        />
        <Form.Input
          required
          name="city"
          placeholder="City"
          onChange={this.handleChange}
          value={this.state.formData.city}
        />

        <Form.Input
          required
          name="state"
          placeholder="State/Region"
          onChange={this.handleChange}
          value={this.state.formData.state}
        />
        <Form.Field required>
          <Select
            loading={countries.length < 1}
            fluid
            clearable
            search
            options={countries}
            name="country"
            placeholder="Country"
            onChange={this.handleSelectChange}
            value={this.state.formData.country}
          />
        </Form.Field>
        <Form.Input
          required
          name="zip_code"
          placeholder="Zip code"
          onChange={this.handleChange}
          value={this.state.formData.zip_code}
        />

        {success && (
          <Message success header="Success!" content="Your address was saved" />
        )}
        {error && (
          <Message
            error
            header="There was an error"
            content="Oops, an error occured"
          />
        )}
        <Form.Button disabled={saving} loading={saving} primary>
          Save
        </Form.Button>
      </Form>
    );
  }
}
