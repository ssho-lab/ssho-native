import React, { Component } from "react";
import { decorate, observable, action, Autobind } from "mobx";
import axios from "axios";

let idx = 0;

class SwiperStore {
  @observable cards = [];
  @observable likeList = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  getCardList = () => {
    const BASE_URL = "http://13.124.59.2:8081"; // 서버 통신을 위한 base url

    axios
      .get(BASE_URL + "/item", {})
      .then((response) => {
        this.cards = response.data;
        console.log(this.cards);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  @action
  addList = (item) => {
    this.likeList.push(...item, idx++);
    console.log(this.likeList[this.likeList.length - 1]);
  };
}

export default SwiperStore;
