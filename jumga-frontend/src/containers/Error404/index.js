import React from "react";
import { Container, Image, Header } from "semantic-ui-react";
import The404 from "./../artwork/the404.jpg";

export default function Error404() {
  return (
    <Container>
      <Image src={The404} />
      <Header className="text-center" as="h2">
        Oops, page not found.
      </Header>
    </Container>
  );
}
