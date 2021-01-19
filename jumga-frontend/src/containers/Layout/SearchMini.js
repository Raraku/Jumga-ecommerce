import React, { useState, useEffect } from "react";
import { Grid, Search, Segment, Header, Icon } from "semantic-ui-react";
import { productListURL } from "./../../constants";
import axios from "axios";
import CurrencyDisplay from "./../../hoc/Currency";

function SearchMini(props) {
  const [loading, setloading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState("");
  //Default last attempt is January, 01 1970. So, it is impossible for this to interfere with the first time a user makes a search query.
  const [lastAttempt, setLastAttempt] = useState(0);
  const handleSearchChange = React.useCallback((e, data) => {
    setValue(data.value);
  }, []);
  useEffect(() => {
    getResults();
  }, [value]);
  const getResults = () => {
    if (value.length > 0) {
      axios
        .get(productListURL + "search_mini/", {
          params: {
            q: value,
          },
        })
        .then((res) => {
          setResults((result) => {
            var theResult = [];
            res.data.map((item) => {
              theResult.push({
                title: item.name,
                description: item.description,
                image: item.productImage[0].image,
                price: <CurrencyDisplay value={item.price} />,
                slug: item.slug,
              });
            });
            return theResult;
          });
        });
    }
  };
  function keyPress(e) {
    if (e.keyCode == 13) {
      props.history.push(`/search/${value}`);
      e.target.blur();
      // put the login here
    }
  }
  return (
    <Search
      className="search-the"
      placeholder="Search catalog"
      fluid
      icon={
        <Icon
          name="search"
          onClick={() => {
            props.history.push(`/search/${value}`);
          }}
        />
      }
      loading={loading}
      onResultSelect={(e, data) =>
        props.history.push(`/product/${data.result.slug}/`)
      }
      onSearchChange={handleSearchChange}
      results={results}
      onKeyDown={keyPress}
      value={value}
    />
  );
}
export default SearchMini;
