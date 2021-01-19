import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Rating,
  Segment,
  Statistic,
  Select,
  Divider,
} from "semantic-ui-react";
import { productDetailURL, addToCartURL } from "../../constants";
import { fetchCart } from "../../store/actions/cart";
import { authAxios } from "../../utils";
import Reviews from "./Reviews";
import CurrencyDisplay from "./../../hoc/Currency";

class ProductDetail extends React.Component {
  state = {
    loading: true,
    error: null,
    formVisible: false,
    data: [],
    message: null,
    formData: {},
    currentImage: 0,
  };

  componentDidMount() {
    this.handleFetchItem();
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible,
    });
  };

  handleFetchItem = () => {
    axios
      .get(productDetailURL(this.props.match.params.productSlug))
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  // handleFormatData = (formData) => {
  //   // convert {colour: 1, size: 2} to [1,2] - they're all variations
  //   return Object.keys(formData).map((key) => {
  //     return formData[key];
  //   });
  // };

  //This piece of code is to enable update whenever a user switches to a new item while on this page
  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.productSlug != this.props.match.params.productSlug
    ) {
      this.handleFetchItem();
    }
  }

  handleAddToCart = () => {
    this.setState({ loading: true });
    const { formData } = this.state;
    authAxios
      .get(addToCartURL(this.props.match.params.productSlug))
      .then((res) => {
        this.props.refreshCart();
        this.setState({
          loading: false,
          message: "Item has been added to cart",
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    this.setState({ formData: updatedFormData });
  };
  capitalizeFirstLetter(word) {
    try {
      word.toLowerCase();
      const words = word.split(" ");

      return words
        .map((word) => {
          return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ");
    } catch {
      return word;
    }
  }
  changeImage = (index) => {
    this.setState({ currentImage: index });
  };

  render() {
    const { data, error, formData, formVisible, loading, message } = this.state;
    const item = data;
    return (
      <Container className="container-grid-productDetail">
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {message && <Message success header="Success" content={message} />}
        {loading ? (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        ) : (
          <Grid stackable doubling>
            <Grid.Row className="product-detail-container" id="no-padding">
              <Grid.Column id="product-images-div" width={5}>
                <Image
                  className="product-image"
                  src={item.productImage[this.state.currentImage].image}
                />{" "}
              </Grid.Column>
              <Grid.Column id="div-productDetail" width={6}>
                <p className="product-name">
                  {this.capitalizeFirstLetter(item.name)}
                </p>
                <p className="product-brand">
                  <b>Brand:</b> {item.shop.name}
                </p>
                <div>
                  <Rating
                    rating={item.rating / item.ratingNumbers}
                    maxRating={5}
                    disabled
                  />{" "}
                  {item.ratingNumbers} rating(s)
                </div>
                <Divider />

                <Button
                  className="be-green"
                  floated="center"
                  icon
                  labelPosition="right"
                  onClick={this.handleAddToCart}
                >
                  Add to cart
                  <Icon name="cart plus" />
                </Button>
              </Grid.Column>
              <Grid.Column width={5} id="order-column">
                <div className="item-price">
                  <CurrencyDisplay value={item.price} />
                </div>
                <div className="color-change">
                  <div className="product-order-header">
                    Delivery information
                  </div>
                  <Divider />
                  <div>
                    {" "}
                    Normally delivered between Monday 11 Jan and Tuesday 12 Jan.
                    Please check exact dates in the Checkout page.See more
                  </div>
                </div>
                <div className="color-change">
                  <div className="product-order-header">Return Policy</div>
                  <Divider />
                  <div>
                    All items can be returned within 7 days of delivery and
                    orders can be cancelled before delivery
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <div className="thumbnail-div">
              {item.productImage.map((thisImage, index) => (
                <div
                  key={index}
                  onClick={() => {
                    this.changeImage(index);
                  }}
                  className={
                    index == this.state.currentImage ? "selected-image" : ""
                  }
                >
                  <Image
                    className="thumbnail-image"
                    src={thisImage.thumbnail}
                  />
                </div>
              ))}
            </div>
            <Grid.Row className="desc-container">
              <div className="grid-b-desc">
                <Divider horizontal>Description</Divider>
              </div>
              <div className="product-detail-container grid-b-proDeit">
                {item.description}
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="grid-b-desc">
                <Divider horizontal>Product Reviews</Divider>
              </div>
              <Reviews productSlug={item.slug} />
            </Grid.Row>
          </Grid>
        )}
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));

// {
//   item.category;
// }
// {
//   item.discount_price && (
//     <Label
//       color={
//         item.label === "primary"
//           ? "blue"
//           : item.label === "secondary"
//           ? "green"
//           : "olive"
//       }
//     >
//       {item.label}
//     </Label>
//   );
// }

{
  /* <Grid.Column width={4}>
  <Header as="h2">Try different variations</Header>
  {data.variations &&
    data.variations.map((v) => {
      return (
        <React.Fragment key={v.id}>
          <Header as="h3">{v.name}</Header>
          <Item.Group divided>
            {v.item_variations.map((iv) => {
              return (
                <Item key={iv.id}>
                  {iv.attachment && (
                    <Item.Image
                      size="tiny"
                      src={`http://127.0.0.1:8000${iv.attachment}`}
                    />
                  )}
                  <Item.Content verticalAlign="middle">{iv.value}</Item.Content>
                </Item>
              );
            })}
          </Item.Group>
        </React.Fragment>
      );
    })}
</Grid.Column>; */
}

//  {
//    data.variations.map((v) => {
//      const name = v.name.toLowerCase();
//      return (
//        <Form.Field key={v.id}>
//          <Select
//            name={name}
//            onChange={this.handleChange}
//            placeholder={`Select a ${name}`}
//            fluid
//            selection
//            options={v.item_variations.map((item) => {
//              return {
//                key: item.id,
//                text: item.value,
//                value: item.id,
//              };
//            })}
//            value={formData[name]}
//          />
//        </Form.Field>
//      );
//    });
//  }
