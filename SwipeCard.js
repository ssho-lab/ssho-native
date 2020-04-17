import React, { Component } from 'react';
import { Button, StyleSheet, Text, ScrollView, View, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';

// demo purposes only
function * range (start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

export default class SwipeCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cards: [...range(1, 30)],
      swipedAllCards: false,
      swipeDirection: '',
      allSwipedCheck: false,
      cardIndex: 0
    }
  }

  renderCard = (card, index) => {
    return (
      <View style={styles.card}>
        <Image style={styles.image} source={require('/Users/yoojinkim/Desktop/Ssho-native/assets/image.jpg')}/>
        <Text style={styles.text}>상품번호 [ {card} ]</Text>
      </View>
    )
  };

  onSwiped = (type) => {
    switch(type){
      case 'top': 
        console.log('모르겠음');
        break;
      case 'left':
        console.log('웩');
        break;
      case 'right':
        console.log('내꺼');
        break;
      default: 
    }
  }

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    })
  };

  render () {
    return (
      <View style={styles.container}>
          <Swiper
            ref={swiper => {
              this.swiper = swiper
            }}
            allSwipedCheck
            onSwiped={() => {}}
            onSwipedLeft={() => this.onSwiped('left')}
            onSwipedRight={() => this.onSwiped('right')}
            cards={this.state.cards}
            cardIndex={this.state.cardIndex}
            cardVerticalMargin={80}
            verticalSwipe={false}
            renderCard={this.renderCard}
            onSwipedAll={this.onSwipedAllCards}
            stackSize={3}
            stackSeparation={15}
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
                title: '모르겠음',
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
          >
          </Swiper>
          <Button
            title="내꺼"
            color="#841584"
            accessibilityLabel="내꺼입니다"
          />
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
    height: "80%",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  image: {
    marginLeft: "2.5%",
    width: "95%",
    height: "90%"
  },
  button: {
    width: 200,
    height: 100,
    backgroundColor: 'black'
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'coral',
    backgroundColor: 'transparent'
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent'
  }
})