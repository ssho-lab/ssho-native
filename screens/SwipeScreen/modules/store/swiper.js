import React, { Component } from "react";
import { decorate, observable, action } from "mobx";
import axios from "axios";

let idx = 0;
@Autobind
class SwiperStore {
  @observable itemList = [];
  @observable likeList = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  getItemList = () => {
    axios
      .get(BASE_URL + "/item", {})
      .then((response) => {
        this.itemList = response.data;
        console.log(this.itemList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  @action
  addList = (item) => {
    this.likeList.push(...item, idx++);
  };
}

export default SwiperStore;
