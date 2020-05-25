import React, { Component } from "react";
import { decorate, observable, action, Autobind } from "mobx";
import axios from "axios";

class SwiperStore {
  @observable cards = [];
  @observable likeList = [];
  @observable idx = 0;

  constructor(root) {
    this.root = root;
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
  addList = (cardIndex, like) => {
    /* [
      set_id, created_time, 
      item_list: [{user_id, item_id, like, timestamp},
      {user_id, item_id, like, timestamp},
      {item_id, like, timestamp},
      {item_id, like, timestamp}]
        ]
    *
    */
    const item = this.cards.find((card) => card.id === cardIndex);
    const likeItem = { item, like, id: this.idx++ };
    this.likeList.push(likeItem);
    console.log(this.likeList[this.likeList.length - 1]);
  };

  //@action
  // save likeList
}

export default SwiperStore;
