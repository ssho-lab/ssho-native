import React, { Component } from "react";
import {
  decorate,
  observable,
  action,
  Autobind,
  toJS,
  asyncAction,
} from "mobx";

import SwiperRepository from "../repositories/SwiperRepository";
import CardModel from "../models/CardModel";

const swiperRepository = new SwiperRepository();

class SwiperStore {
  constructor(root) {
    this.root = root;
  }

  @observable cards = [];
  @observable swipedAllCards = false;
  @observable swipeDirection = "";
  @observable cardIndex = 0;
  @observable swipeList = [];
  @observable swipeLogs = {
    startTime: "",
    swipeList: [],
  };

  @action // api를 통해 itemList 가져오기
  async getCardList(params) {
    const response = await swiperRepository.getItemList();
    const data = response.data.slice(0, 10);
    this.cards = data.map((card) => new CardModel(card));
  }

  @action // swipeLog startTime 저장
  // moment.js 사용
  setStartTime = () => {
    const startTime = new Date().toLocaleString();
    this.swipeLogs.startTime = startTime;
    console.log("startTime is " + startTime);
  };

  @action // Swipe할때마다 로그 저장하기
  addSwipeLog = (cardIndex, score) => {
    const itemId = this.cards[cardIndex].id;
    const swipeTime = new Date().toLocaleString();
    const swipe = {
      userId: 1,
      itemId: itemId,
      score: score,
      swipeTime: swipeTime,
    };
    //console.log(swipe);
    //this.swipeList.push(swipe);
    this.swipeLogs.swipeList.push(swipe);
    console.log(this.swipeLogs);
  };

  @action // save likeList
  saveSwipeLogs = () => {
    swiperRepository.saveSwipeLogs(this.swipeLogs);
  };
}

export default SwiperStore;
