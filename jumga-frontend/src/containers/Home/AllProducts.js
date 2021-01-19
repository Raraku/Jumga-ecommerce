import React, { createRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  Container,
  Dimmer,
  Image,
  Item,
  Label,
  Loader,
  Pagination,
  Icon,
  Message,
  Card,
  Grid,
  CardGroup,
  Rating,
  Form,
  Sticky,
  Segment,
  Divider,
} from "semantic-ui-react";
import { productListURL, addToCartURL } from "../../constants";
import { fetchCart } from "../../store/actions/cart";
import { authAxios } from "../../utils";
import { GetDataInfo } from "./../../hoc/pagination";
import Slider from "@material-ui/core/Slider";
import CurrencyDisplay from "./../../hoc/Currency";

function valuetext(value) {
  return ` &#8358;${value}`;
}

class AllProducts extends React.Component {
  state = {
    error: null,
    // data: [],
  };
  componentDidUpdate(prevProps) {
    if (prevProps.match.params != this.props.match.params) {
      this.handlePaginationChange(undefined, { activePage: 1 });
    }
  }
  // handleChange = (event, newValue) => {
  //   this.setState({ currentValue: newValue });
  // };

  // componentDidMount() {
  //   axios
  //     .get(productListURL)
  //     .then((res) => {
  //       this.setState({ data: res.data, loading: false });
  //     })
  //     .catch((err) => {
  //       this.setState({ error: err, loading: false });
  //     });
  // }
  handlePaginationChange = (e, { activePage }) => {
    this.props.setPage(activePage);
    window.scrollTo(0, 0);
  };
  // componentDidUpdate(prevProps) {
  //   if (prevProps !== this.props) {
  //     this.changeMedia(this.props.type, this.state.filterTags);
  //   }
  // }
  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    authAxios
      .get(addToCartURL(slug))
      .then((res) => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };
  applyFilter = () => {
    if (this.state.lowerLimit == 0 && this.state.upperLimit == 0) {
      this.setState({ error: "You need to add filter values" });
      return window.scrollTo(0, 0);
      return;
    }
    if (this.state.upperLimit < this.state.lowerLimit) {
      this.setState({
        error: "Upperlimit can't be less than the lower limit.",
      });
      return window.scrollTo(0, 0);
    }
    this.props.applyFilter(this.state.lowerLimit, this.state.upperLimit);
    return window.scrollTo(0, 0);
  };
  handleChange = (e, { name, value }) => {
    if (isNaN(parseFloat(value))) {
      return this.setState({ [name]: 0 });
    }

    this.setState({ [name]: parseFloat(value) });
  };

  render() {
    console.log(this.props);
    const { error, loading } = this.state;
    const { data } = this.props;
    console.log(this.state);
    return (
      <Container className="product-cont" fluid>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {this.props.loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Card.Group doubling itemsPerRow={5} stackable>
                {data.map((item) => {
                  return (
                    <Card
                      id="override-one"
                      raised
                      link
                      onClick={() =>
                        this.props.history.push(`/product/${item.slug}/`)
                      }
                      centered
                      key={item.id}
                    >
                      <Image
                        src={item.productImage[0].image}
                        wrapped
                        ui={false}
                      />

                      <Card.Content className="relative">
                        <Card.Header>{item.name}</Card.Header>
                        <Card.Meta className="meta">
                          <span className="cinema">{item.categories}</span>
                        </Card.Meta>
                        <Card.Description
                          className="alignPrice"
                          textAlign="right"
                        >
                          {" "}
                          <div>
                            <Rating
                              rating={item.rating / item.ratingNumbers}
                              maxRating={5}
                              disabled
                            />
                          </div>
                          <div className="the-price-text">
                            <CurrencyDisplay value={item.price} />
                          </div>
                        </Card.Description>
                        {/* <Item.Extra> */}
                        {/* <Button
                      primary
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={() => this.handleAddToCart(item.slug)}
                    >
                      Add to cart
                      <Icon name="cart plus" />
                    </Button> */}
                        {/* {item.discount_price && (
                      <Label
                        color={
                          item.label === "primary"
                            ? "blue"
                            : item.label === "secondary"
                            ? "green"
                            : "olive"
                        }
                      >
                        {item.label}
                      </Label>
                    )} */}
                        {/* </Item.Extra> */}
                      </Card.Content>
                    </Card>
                  );
                })}
                <Card id="promo-card">
                  <Card.Content>
                    <Icon name="thumbs up" size="big" className="mb-3" />
                    <div className="text-center dww">
                      Oops, hopefully what you're searching for is on the next
                      page.
                    </div>
                  </Card.Content>
                </Card>
              </Card.Group>
              <br />
              <div className="left-page desktop">
                <Pagination
                  onPageChange={this.handlePaginationChange}
                  activePage={this.props.page}
                  totalPages={Math.ceil(this.props.count / 24)}
                />
              </div>
              <div className="right-page mobile">
                <Pagination
                  onPageChange={this.handlePaginationChange}
                  activePage={this.props.page}
                  siblingRange={0}
                  showFirstAndLastNav={false}
                  showEllipsis={false}
                  boundaryRange={0}
                  totalPages={Math.ceil(this.props.count / 24)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(GetDataInfo(AllProducts));
