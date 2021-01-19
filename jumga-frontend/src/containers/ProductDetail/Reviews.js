import React, { useState, useEffect } from "react";
import { Item, Button, Icon } from "semantic-ui-react";
import axios from "axios";
import { productDetailURL } from "./../../constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authAxios } from "./../../utils";

dayjs.extend(relativeTime);

const Reviews = (props) => {
  const [reviewSet, setReviewSet] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [count, setCount] = useState(0);
  const [foundHelpful, setFoundHelpful] = useState(false);
  console.log(reviewSet);
  useEffect(() => {
    axios
      .get(productDetailURL(props.productSlug) + "get_product_reviews/")
      .then((res) => {
        setReviewSet(res.data.results);
        setNext(res.data.next);
        setPrevious(res.data.previous);
        setCount(res.data.count);
      });
  }, []);
  const getPage = (page) => {
    axios.get(page).then((res) => {
      setReviewSet(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
      setCount(res.data.count);
    });
  };
  const findHelpful = (id) => {
    authAxios
      .get(productDetailURL(props.productSlug) + "find_review_helpful/", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setFoundHelpful(true);
      });
  };
  if (reviewSet.length == 0) {
    return (
      <div className="text-center">
        No reviews yet. Visit your order summary page to leave a review
      </div>
    );
  }
  return (
    <div style={{ width: "100%" }}>
      <Item.Group divided>
        {reviewSet.map((review) => (
          <Item id={review.id}>
            <Item.Content>
              <Item.Header as="a">{review.title}</Item.Header>
              <Item.Meta className="text-right">
                <span className="cinema">
                  {dayjs(review.date_added).fromNow()}
                </span>
              </Item.Meta>
              <Item.Meta>{review.author}</Item.Meta>
              <Item.Description>{review.review}</Item.Description>
              <Item.Extra className="text-right">
                {review.helpful} person(s) found this helpful |{" "}
                {foundHelpful ? (
                  <Icon name="check" />
                ) : (
                  <a
                    onClick={() => {
                      findHelpful(review.id);
                    }}
                  >
                    Find Helpful
                  </a>
                )}
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
      <div className="horizontal-navigator">
        <Button
          style={{ backgroundColor: "#00ae68", color: "white" }}
          onClick={() => {
            getPage(previous);
          }}
          disabled={previous == null}
        >
          <Icon name="arrow left" />
          Cancel
        </Button>
        <Button
          disabled={next == null}
          style={{ backgroundColor: "#00ae68", color: "white" }}
          onClick={() => {
            getPage(next);
          }}
        >
          Next <Icon name="arrow right" />
        </Button>
      </div>
    </div>
  );
};
export default Reviews;
