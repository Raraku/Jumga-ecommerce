import React from "react";
import { Container, Icon, Header } from "semantic-ui-react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function PaymentDone(props) {
  let query = useQuery();
  var a = query.get("tx_ref");
  var b = query.get("transaction_id");
  var c = query.get("status");
  console.log(a, b, c);
  return (
    <Container className="trans-cont">
      <div className="text-center">
        {c == "successful" ? (
          <>
            <Icon name="check circle" className="trans-ds" size="huge" />

            <Header as="h2">
              Transaction {c.charAt(0).toUpperCase() + c.slice(1)}
            </Header>
          </>
        ) : (
          <>
            {" "}
            <Icon name="cancel" color="red" size="huge" />
            <Header as="h2">
              Transaction {c.charAt(0).toUpperCase() + c.slice(1)}
            </Header>
          </>
        )}
        <div>Reference Number: {a}</div>
      </div>
    </Container>
  );
}
export default PaymentDone;
