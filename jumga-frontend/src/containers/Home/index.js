import React from "react";
import {
  Container,
  Menu,
  Divider,
  Grid,
  Header,
  Image,
  Icon,
  Segment,
} from "semantic-ui-react";
import Main from "./../artwork/Maine.svg";
import Food from "./../artwork/food.svg";
import MobileApp from "./../artwork/phone.jpg";
import Carousel from "react-bootstrap/Carousel";
import { productListURL } from "../../constants";
import AllProducts from "./AllProducts";

const HomepageLayout = (props) => {
  const handleItemClick = (e, { name }) => {
    props.history.push(`products/${name}/`);
    console.log(name);
  };
  const categories = [
    {
      name: "Automobile",
      icon: "car",
      id: 2,
      slug: "automobile",
    },
    {
      name: "Supermarket",
      icon: "shopping basket",
      id: 3,
      slug: "supermarket",
    },
    {
      name: "Health & Beauty",
      id: 4,
      icon: "medkit",
      slug: "health-beauty",
    },
    {
      name: "Home & Office",
      id: 5,
      icon: "home",
      slug: "home-office",
    },
    {
      name: "Phones & Tablets",
      id: 6,
      icon: "tablet alternate",
      slug: "phones-tablets",
    },
    {
      name: "Computing",
      id: 7,
      icon: "computer",
      slug: "computing",
    },
    {
      name: "Electronics",
      id: 8,
      icon: "camera retro",
      slug: "electronics",
    },
    {
      name: "Fashion",
      id: 9,
      icon: "pied piper hat",
      slug: "fashion",
    },
    {
      name: "Baby Products",
      id: 10,
      icon: "child",
      slug: "baby-products",
    },
    {
      name: "Gaming",
      id: 11,
      icon: "game",
      slug: "gaming",
    },
    {
      name: "Sporting Goods",
      icon: "football ball",
      id: 12,
      slug: "sporting-goods",
    },
  ];
  return (
    <Container>
      <Segment className="mt-4" vertical>
        <Grid doubling container stackable>
          <Grid.Row>
            <Grid.Column className="the-jumga-header" width={16}>
              <div className="the-jumga-texte">Jumga</div>
              <div className="desktop">
                <Icon className="for-the-culture" name="camera retro" />
                <Icon className="for-the-culture" name="game" />
                <Icon className="for-the-culture" name="pied piper hat" />
                <Icon className="for-the-culture" name="tablet alternate" />

                <Icon className="for-the-culture" name="food" />
              </div>
              <div className="the-jumga-text">Quality for All...</div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={5}>
              <Menu className="bigger" vertical>
                <Menu.Item>
                  <Menu.Header>Product Categories</Menu.Header>
                </Menu.Item>
                {categories.map((cat) => (
                  <Menu.Item name={cat.slug} onClick={handleItemClick}>
                    <span>
                      {" "}
                      <Icon name={cat.icon} />
                      {cat.name}
                    </span>
                    <Icon name="caret right" />
                  </Menu.Item>
                ))}
              </Menu>
            </Grid.Column>
            <Grid.Column
              width={11}
              style={{
                backgroundImage: `url(${Main})`,
              }}
              className="image-col"
            >
              <div className="side-div"></div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment style={{ padding: "0em" }} vertical>
        <Grid doubling celled="internally" columns="equal" stackable>
          <Grid.Row textAlign="center">
            <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
              <Header
                as="h3"
                className="change-a-bit"
                style={{ fontSize: "2em" }}
              >
                "With offices in Ghana, Kenya, Nigeria and the United Kingdom"
              </Header>
              <p style={{ fontSize: "1.33em" }}>
                Jumga can deliver your products anywhere.
              </p>
            </Grid.Column>
            <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
              <Header
                as="h3"
                className="change-a-bit"
                style={{ fontSize: "2em" }}
              >
                "Whether you want to buy, sell or window shop"
              </Header>
              <p style={{ fontSize: "1.33em" }}>
                <Icon name="user circle outline" />
                <b>Jumga</b> is the place for it
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment style={{ padding: "2em 0em" }} vertical>
        <Grid doubling stackable centered>
          <Grid.Row>
            <Grid.Column width={8}>
              <p style={{ fontSize: "1.33em" }}>
                <Image src={MobileApp} />
              </p>
            </Grid.Column>
            <Grid.Column width={8} className="workkd">
              <Header
                as="h3"
                className="change-a-bit text-center"
                style={{ fontSize: "1.7em" }}
              >
                It's more fun to order on mobile. Stay alert, our mobile app
                will be released soon.
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Divider
          as="h4"
          className="header change-a-bit"
          horizontal
          style={{ margin: "3em 0em", textTransform: "uppercase" }}
        >
          All Products
        </Divider>
        <AllProducts {...props} match={{ params: { category: undefined } }} />
      </Segment>
    </Container>
  );
};
export default HomepageLayout;
