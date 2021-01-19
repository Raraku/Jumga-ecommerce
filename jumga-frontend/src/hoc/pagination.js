import React, { useState, useEffect } from "react";
import axios from "axios";
import { productListURL } from "./../constants";

export const GetDataInfo = (WrappedComponent, props) => {
  class GetDataInfo extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        loading: true,
        count: null,
        page: 1,
      };
    }

    getData = (page, lowerLimit = undefined, upperLimit = undefined) => {
      //I intended to add filters to the app. But, there was no time. Right now, the only filters are by category
      // var link = null;
      this.setState({ loading: true });
      var link = productListURL;
      if (this.props.isSearch != undefined) {
        console.log("ah");
        return axios
          .get(link + "search/", {
            params: {
              q: this.props.match.params.query,
              page: page,
              lowerLimit: lowerLimit,
              upperLimit: upperLimit,
            },
          })
          .then((res) => {
            this.setState({
              data: res.data.results,
              count: res.data.count,
              loading: false,
              page: page,
            });
          });
      }
      if (this.props.match.params.category != undefined) {
        axios
          .get(link + "filter_by_category/", {
            params: {
              page: page,
              category: this.props.match.params.category,
              lowerLimit: lowerLimit,
              upperLimit: upperLimit,
            },
          })
          .then((res) => {
            this.setState({
              data: res.data.results,
              count: res.data.count,
              loading: false,
              page: page,
            });
          });
      } else {
        axios
          .get(link, {
            params: {
              page: page,
              lowerLimit: lowerLimit,
              upperLimit: upperLimit,
            },
          })
          .then((res) => {
            this.setState({
              data: res.data.results,
              count: res.data.count,
              loading: false,
              page: page,
            });
          });
      }
    };
    applyFilter = (lowerLimit, upperLimit) => {
      this.getData(1, lowerLimit, upperLimit);
    };

    componentDidMount() {
      console.log(this.props);

      this.getData(this.state.page);
    }

    // loadNext = () => {
    //   this.setState({ loading: true, page: this.state.page + 1 });
    // };
    // loadPrevious = () => {
    //   if (this.state.page != 1) {
    //     this.setState({ loading: true, page: this.state.page - 1 });
    //   }
    // };
    setPage = (page) => {
      this.getData(page);
    };
    render() {
      console.log(this.props);
      return (
        <WrappedComponent
          loading={this.state.loading}
          data={this.state.data}
          count={this.state.count}
          page={this.state.page}
          setPage={this.setPage}
          changeMedia={this.getData}
          applyFilter={this.applyFilter}
          {...this.props}
        />
      );
    }
  }
  return GetDataInfo;
};
