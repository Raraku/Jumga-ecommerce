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
  addressCreateURL,
  addressUpdateURL,
  addressDeleteURL,
  userIDURL,
  paymentListURL,
} from "../../constants";
import { authAxios } from "../../utils";

export default class PaymentHistory extends React.Component {
  state = {
    payments: [],
    loading: true,
  };

  componentDidMount() {
    this.handleFetchPayments();
  }

  handleFetchPayments = () => {
    this.setState({ loading: true });
    authAxios
      .get(paymentListURL)
      .then((res) => {
        this.setState({
          loading: false,
          payments: res.data,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { payments } = this.state;
    if (this.state.loading == true) {
      return (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          <Image src="/images/wireframe/short-paragraph.png" />
        </Segment>
      );
    }
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {payments.map((p) => {
            return (
              <Table.Row key={p.id}>
                <Table.Cell>{p.id}</Table.Cell>
                <Table.Cell>${p.amount}</Table.Cell>
                <Table.Cell>{new Date(p.timestamp).toUTCString()}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
