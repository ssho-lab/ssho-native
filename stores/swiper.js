import React, { Component } from "react";
import { decorate, observable, action, Autobind, toJS } from "mobx";
import SwiperRepository from "../repositories/SwiperRepository";

const swiperRepository = new SwiperRepository();

class SwiperStore {
  constructor(root) {
    this.root = root;
  }
  @observable cards = [];
  @observable swipeList = [];
  @observable swipeLogs = {
    startTime: "",
    swipeList: this.swipeList,
  }
  
  @action // api를 통해 itemList 가져오기
  getCardList = () => {
    swiperRepository
      .getItemList()
      .then((response) => {
        // 10개만
        this.cards = response.data.slice(0, 10);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    const result = toJS(this.cards);
    return result;
  };

  @action // swipeLog startTime 저장
  setStartTime = () => {
    const startTime = new Date().toLocaleString();
    this.swipeLogs.startTime = startTime;
  };

  @action // Swipe할때마다 로그 저장하기
  addSwipeLog = (card, score) => {
    const itemId = card;
    const swipeTime = new Date().toLocaleString();
    const swipe = {
      userId: 1,
      itemId: itemId,
      score: score,
      swipeTime: swipeTime,
    };
    //console.log(swipe);
    this.swipeList.push(swipe);
    console.log(card+' 상품 '+score+'점 로그 저장 완료');
  };

  @action // save likeList
  saveSwipeLogs = () => {
    swiperRepository.saveSwipeLogs(this.swipeLogs);
    console.log(this.swipeLogs);
  };
}

export default SwiperStore;