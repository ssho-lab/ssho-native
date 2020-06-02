import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { Component } from "react";
import { Button, StyleSheet, Text, View, Image, RefreshControl } from "react-native";

import Swiper from 'react-native-deck-swiper';
import {
  RectButton,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import axios from 'axios';
import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';
import { WebView } from 'react-native-webview';

// mobx
import { inject, observer } from "mobx-react";
import { observable } from "mobx";

// carousel
import Carousel from 'react-native-snap-carousel';

@inject("swiperStore")
@observer
export default class SwipeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 스와이프 카드를 위한 state들
      cards: [], // 카드 컨텐츠 리스트
      swipedAllCards: false,
      swipeDirection: "",
      allSwipedCheck: false,
      startCard: 0, // 카드 시작 인덱스


      cardIndex: 0, // 카드 아이디를 위한 인덱스
      refreshing: false,
      
    };
  }

  makeRefresh = () => {
    this.setState({...this.state, refreshing: true})
    console.log('button click');
    console.log(this.state.refreshing);
  }

  // refresh를 위한 함수, 현재 작동하지 않음
  _onRefresh = () => {
    console.log('want make refresh');
    this.fetchData().then(() => {
      this.setState({...this.state, refreshing: false});
    })
  };

  // 컴포넌트 마운트 직후
  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = () => {
    const SwiperStore = this.props.swiperStore;
    const cardList = SwiperStore.getCardList();
    this.setState({
      ...this.state,
      cards: this.state.cards.concat(cardList),
    });
  }

  // state 변화 발생 후 업데이트 직전
  shouldComponentUpdate = (nextState) => {
    if (this.state.cards !== nextState.cards) {
      // cards 변화 비교
      return true; // 재렌더링 실행
    }
    else if (this.state.refreshing) return true;
  };

  // Carousel 아이템을 위한 함수
  _renderItem = ({item, index}) => {
    return (
      <View style={{width: "100%", height: "100%"}}>
        
        <Image style={{width: "100%", height: "100%"}}
        source={{uri: item}}/>
      </View>
    )
  }

  // swipe 개별 card 생성을 위한 함수 props
  renderCard = ( card , index ) => {
    return (
       card != undefined ? // card 데이터가 없을 땐 빈 카드만 먼저 렌더링 됨
          <View style={styles.card}>
              
                <Carousel
                  ref={(c) => { this._carousel = c;}}
                  data={card.productExtra.extraImageUrlList}
                  renderItem={this._renderItem}
                  sliderWidth={370}
                  itemWidth={370}
                  enableSnap={true}
                  autoplay={true}
                />
              <Text onPress={() => { this._carousel.snapToNext(); }}>
                next image
              </Text>
              <Text style={styles.text} onPress={() => { 
                // 앱의 내비게이션은 사라지는 문제
                WebBrowser.openBrowserAsync(card.link)}}>
              [{card.mallNm}] {card.title}</Text>
            <Text style={styles.text}> {card.price}원 </Text>
          </View>
      : <View style={styles.card}></View>
    )
  };

  // shopWebView = (link) => { // 왜 안되는지 모르겠음
  //   return <WebView source={{uri: link}} style={styles.container}></WebView>
  // }

  onSwiped = (type) => { // 스와이프 방향별 처리를 위한 함수 props
    const cardIndex = this.state.cardIndex;
    const cardId = this.state.cards[cardIndex].id;
    const SwiperStore = this.props.swiperStore;

    switch(type){
      case 'top': 
        console.log('슈퍼라이크');
        SwiperStore.addSwipeLog(cardId, 2); // 2이면 슈퍼라이크
        this.setState({...this.state, cardIndex : this.state.cardIndex + 1});
        break;
      case 'left':
        console.log('웩');
        SwiperStore.addSwipeLog(cardId, 0); // 0이면 싫어요
        this.setState({...this.state, cardIndex : this.state.cardIndex + 1});
        break;
      case 'right':
        console.log('내꺼');
        SwiperStore.addSwipeLog(cardId, 1); // 1이면 좋아요
        this.setState({...this.state, cardIndex : this.state.cardIndex + 1});
        break;
      // case 'swiped':
      //   break
      default: 
        break;
    }
  }

  onSwipedAllCards = () => { // 스와이프 카드 한 덱이 종료되었을 때 호출되는 메소드로 보임
    const SwiperStore = this.props.swiperStore;
    this.setState({
      ...this.state,
      swipedAllCards: true,
      cardIndex: 0,
    });
    console.log('Swipe End')
    SwiperStore.saveSwipeLogs();
  };


  render () {
    return (
      <View refreshControl={
        <RefreshControl refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}/>
      }>
        { this.state.cardIndex < this.state.cards.length &&
        <React.Fragment>
        <View style={styles.container} 
            refreshControl={
            <RefreshControl refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}/>
            }
        >
          <Swiper
            ref={swiper => {
              this.swiper = swiper
            }}
            allSwipedCheck
            onSwiped={() => {this.onSwiped('swiped')}}
            onSwipedLeft={() => this.onSwiped('left')}
            onSwipedRight={() => this.onSwiped('right')}
            onSwipedTop={() => this.onSwiped('top')}
            cards={this.state.cards}
            cardIndex={this.state.startCard}
            cardVerticalMargin={80}
            verticalSwipe={true}
            disableBottomSwipe={true}
            renderCard={this.renderCard}
            infinite={false}
            onSwipedAll={this.onSwipedAllCards}
            stackSize={2}
            stackSeparation={20}
            overlayLabels={{
              left: {
                title: '웩',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30
                  }
                }
              },
              right: {
                title: '내꺼',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30
                  }
                }
              },
              top: {
                title: 'SuperLike',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }
              }
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
            outputRotationRange={["-20deg", "0deg", "20deg"]}
          >
          </Swiper>
        </View>
        <View style={styles.buttonGroup}>
          <Button
            title="싫어요"
            color="coral"
            style={styles.buttons}
            onPress={()=>{this.swiper.swipeLeft()}}
          />
          <Button
            title="뒤로가기"
            color="coral"
            style={styles.buttons}
            onPress={()=>{this.swiper.swipeBack()}}
          />
          <Button
            title="좋아요"
            color="coral"
            style={styles.buttons}
            onPress={()=>{this.swiper.swipeRight()}}
          />
        </View>
        </React.Fragment>
        }
        { this.state.swipedAllCards &&
        <View refreshControl={
          <RefreshControl refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}/>
        }>
          <Button
            title="Do you want more swipe?"
            color="coral"
            style={styles.buttons}
            onPress={()=>{this.makeRefresh();}}
          />
        </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  card: {
    marginTop: -50,
    height: "80%",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  image: {
    marginLeft: "5%",
    width: "90%",
    height: "80%"
  },
  buttonGroup: {
    marginTop: 650,
    flexDirection: "row",
    justifyContent: 'space-between',
    margin: 50
  },
  buttons: {
    width: 400,
    height: 100,
    backgroundColor: 'black',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'coral',
    backgroundColor: 'transparent',
    margin: "2%"
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'coral',
    backgroundColor: 'transparent',
    margin: "30%"
  }
})
