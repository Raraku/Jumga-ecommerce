import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Icon, Table } from "semantic-ui-react";
import { orderInfoURL, paymentListURL } from "../../constants";
import { authAxios } from "../../utils";

const status = {
  10: "New",
  20: "Processing",
  30: "Delivered",
};

export default class PaymentHistory extends React.Component {
  state = {
    orders: [],
    loading: false,
  };

  componentDidMount() {
    this.handleFetchOrders();
  }

  handleFetchOrders = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderInfoURL)
      .then((res) => {
        this.setState({
          loading: false,
          orders: res.data,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { orders } = this.state;
    console.log(orders);
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.map((p) => {
            return (
              <Table.Row key={p.id}>
                <Table.Cell>{p.id}</Table.Cell>
                <Table.Cell>{p.total}</Table.Cell>
                <Table.Cell>{new Date(p.date_added).toUTCString()}</Table.Cell>
                <Table.Cell>{status[p.status]}</Table.Cell>
                <Table.Cell>
                  <Icon
                    onClick={() => {
                      this.props.history.push(`/order-detail/${p.id}/`);
                    }}
                    circular
                    link
                    name="arrow right"
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
