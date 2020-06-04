import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { Component } from "react";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import Swiper from "react-native-deck-swiper";
import {
  RectButton,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import axios from "axios";
import { FA5Style } from "@expo/vector-icons/build/FontAwesome5";
import { WebView } from "react-native-webview";

// mobx
import { inject, observer } from "mobx-react";
import { observable, toJS } from "mobx";

// carousel
import Carousel from 'react-native-snap-carousel';

@inject("swiperStore")
@observer
export default class SwipeScreen extends Component {
  constructor(props) {
    super(props);
  }

  // 컴포넌트 마운트 직후
  componentDidMount = () => {
    // API 호출 , Fetch Data
    const SwiperStore = this.props.swiperStore;
    SwiperStore.getCardList();
    console.log("get Card List");
    SwiperStore.setStartTime();
  };

  // state 변화 발생 후 업데이트 직전
  shouldComponentUpdate = (nextState) => {
    if (this.state.cards !== nextState.cards) {
      // cards 변화 비교
      return true; // 재렌더링 실행
    }
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
  renderCard = (card, index) => {
    return card != undefined ? ( // card 데이터가 없을 땐 빈 카드만 먼저 렌더링 됨
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
        <Text style={styles.text}>{card.title}</Text>
        <Button
          title="링크"
          onPress={() => {
            WebBrowser.openBrowserAsync(card.link); // 앱의 내비게이션은 사라짐
          }}
        ></Button>
      </View>
    ) : (
      <View style={styles.card}></View>
    );
  };


  onSwiped = (type, cardIndex) => {
    const SwiperStore = this.props.swiperStore;
    // 스와이프 방향별 처리를 위한 함수 props
    switch (type) {
      case "top":
        console.log("슈퍼라이크");
        SwiperStore.addSwipeLog(cardIndex, 2); // like 2이면 슈퍼라이크
        break;
      case "left":
        SwiperStore.addSwipeLog(cardIndex, 0); // like 0이면 싫어요
        console.log("싫어요");
        break;
      case "right":
        SwiperStore.addSwipeLog(cardIndex, 1); // like 1이면 좋아요
        console.log("좋아요");
        break;
      // case 'swiped':
      //   break
      default:
        break;
    }
  };

  onSwipedAllCards = () => { // 스와이프 카드 한 덱이 종료되었을 때 호출되는 메소드로 보임
    const SwiperStore = this.props.swiperStore;
    SwiperStore.saveSwipeLogs();
    console.log("Swipe End");
  };

  render() {
    const SwiperStore = this.props.swiperStore;
    const { cards, cardIndex, swipeDirection } = SwiperStore;
    const isLoading = cards.length === 0 ? true : false;

    return (
      <View style={styles.container}>
        {!isLoading ? (
          <Swiper
            style={styles.swiper}
            ref={(swiper) => {
              this.swiper = swiper;
            }}
            allSwipedCheck
            onSwiped={() => {
              this.onSwiped("swiped");
            }}
            onSwipedLeft={(cardIndex) => this.onSwiped("left", cardIndex)}
            onSwipedRight={(cardIndex) => this.onSwiped("right", cardIndex)}
            onSwipedTop={() => this.onSwiped('top', cardIndex)}
            cards={cards.slice()}
            cardIndex={cardIndex}
            cardVerticalMargin={80}
            verticalSwipe={true}
            renderCard={this.renderCard}
            onSwipedAll={() => this.onSwipedAllCards()}
            stackSize={2}
            stackSeparation={10}
            overlayLabels={{
              left: {
                title: "웩",
                style: {
                  label: {
                    backgroundColor: "black",
                    borderColor: "black",
                    color: "white",
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: "내꺼",
                style: {
                  label: {
                    backgroundColor: "black",
                    borderColor: "black",
                    color: "white",
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
              top: {
                title: "Super Like",
                style: {
                  label: {
                    backgroundColor: "black",
                    borderColor: "black",
                    color: "white",
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
              },
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
            outputRotationRange={["-20deg", "0deg", "20deg"]}
            useViewOverflow={Platform.OS === "ios"}
          ></Swiper>
        ) : (
          <Text style={styles.text}>Loading....</Text>
        )}
        <View style={styles.buttonGroup}>
          <Button
            title="싫어요"
            color="coral"
            style={styles.buttons}
            onPress={() => {
              this.swiper.swipeLeft();
            }}
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
            onPress={() => {
              this.swiper.swipeRight();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  swiper: {
    height: 200,
  },
  card: {
    marginTop: -50,
    height: "80%",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
  },
  image: {
    marginLeft: "2.5%",
    width: "95%",
    height: "90%",
  },
  buttonGroup: {
    flex: 1,
    marginTop: 600,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 50,
  },
  buttons: {
    width: 400,
    height: 100,
    backgroundColor: "black",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "coral",
    backgroundColor: "transparent",
  },
  done: {
    textAlign: "center",
    fontSize: 30,
    color: "white",
    backgroundColor: "transparent",
  },
});
