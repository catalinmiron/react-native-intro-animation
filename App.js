import React, { Component } from 'react';
import {
  Alert,
  StatusBar,
  Easing,
  Animated,
  Dimensions,
  Text,
  View,
  StyleSheet
} from 'react-native';
import { Constants } from 'expo';

const { width, height } = Dimensions.get('window');

const dark = '#403F39';
const light = '#666';
const bg = '#F5CF3A';
const white = '#FFFFF7';
const SPACING = 30;

const items = Array(4).join(' ').split(' ').map((_, i) => i);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.widthTransition = new Animated.Value(0);
    this.heightTransition = new Animated.Value(height / 10);
    this.translateTransition = new Animated.Value(0);
    this.formInputWidth = new Animated.Value(0);
    this.itemsAnimations = [];
    items.forEach(
      value => (this.itemsAnimations[value] = new Animated.Value(0))
    );

    this.state = {
      finished: false
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);

    this.animateAll();
  }

  animateAll() {
    const { finished } = this.state;
    let animation;

    if (finished) {
      animation = Animated.sequence([
        Animated.delay(1000),
        Animated.stagger(
          140,
          items.map(i =>
            Animated.timing(this.itemsAnimations[items.length - 1 - i], {
              toValue: 0,
              easing: Easing.inOut(Easing.ease),
              duration: 1000
            })
          )
        ),
        Animated.timing(this.translateTransition, {
          toValue: finished ? 0 : 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.delay(200),
        Animated.timing(this.heightTransition, {
          toValue: finished ? height / 10 : height,
          duration: 300,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.delay(200),
        Animated.timing(this.widthTransition, {
          toValue: finished ? 0 : width,
          duration: Math.round(Math.random() * 7 + 1) * 1000
        })
      ]);
    } else {
      animation = Animated.sequence([
        Animated.delay(3000),
        Animated.timing(this.widthTransition, {
          toValue: finished ? 0 : width,
          duration: Math.round(Math.random() * 7 + 1) * 1000
        }),

        Animated.timing(this.heightTransition, {
          toValue: finished ? height / 10 : height,
          duration: 300,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.delay(200),
        Animated.timing(this.translateTransition, {
          toValue: finished ? 0 : 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.stagger(
          200,
          items.map(anim =>
            Animated.timing(this.itemsAnimations[anim], {
              toValue: 1,
              easing: Easing.inOut(Easing.ease),
              duration: 1800
            })
          )
        )
      ]);
    }

    animation.start(() => {
      this.setState(
        {
          finished: !this.state.finished
        },
        () => {
          this.animateAll();
        }
      );
    });
  }

  render() {
    const inputRange = [height / 10, height / 3, height];
    const xxx = this.heightTransition.interpolate({
      inputRange,
      outputRange: [0, 0, -height / 2 + height / 10]
    });

    const opacity = this.heightTransition.interpolate({
      inputRange,
      outputRange: [1, 0, 0]
    });

    const scale = this.heightTransition.interpolate({
      inputRange,
      outputRange: [1, 1, 0.5]
    });

    const color = this.heightTransition.interpolate({
      inputRange,
      outputRange: ['#000', '#000', '#fff']
    });
    const bgColor = this.translateTransition.interpolate({
      inputRange: [0, 0.02, 1],
      outputRange: [bg, white, white]
    });

    const translate = this.translateTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -6 * height / 10]
    });

    return (
      <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
        <Animated.View
          style={[
            styles.syncingOverlay,
            {
              width: this.widthTransition,
              height: this.heightTransition,
              transform: [
                {
                  translateY: translate
                }
              ]
            }
          ]}
        />
        <View
          style={{
            flex: 1,
            width: width,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            position: 'absolute',
            height: height
          }}>
          {['Welcome', 'Name', 'Phone', 'Password'].map((val, i) => {
            const widthT = this.itemsAnimations[i].interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: [0, width - SPACING * 2, width - SPACING * 2]
            });

            const translateY = this.itemsAnimations[i].interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [10, 0.5, 0]
            });

            if (val === 'Welcome') {
              return (
                <View
                  key={i}
                  style={{
                    height: height / 2 - height / 10,
                    marginBottom: SPACING,
                    alignItems: 'center',
                    paddingTop: height / 2 - height / 10 - SPACING * 3
                  }}>

                  <Animated.Text
                    style={{
                      fontSize: 32,
                      fontWeight: '700',
                      backgroundColor: 'transparent',
                      opacity: this.itemsAnimations[i],
                      width: width,
                      color: 'white',
                      textAlign: 'center',
                      transform: [
                        {
                          translateY: translateY
                        }
                      ]
                    }}>
                    {val.toUpperCase()}
                  </Animated.Text>

                </View>
              );
            }
            return (
              <View
                key={i}
                style={{
                  marginLeft: SPACING,
                  marginBottom: SPACING
                }}>
                <Animated.Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    backgroundColor: 'transparent',
                    opacity: this.itemsAnimations[i],
                    width: width - SPACING * 2,
                    textAlign: 'center',
                    paddingVertical: SPACING,
                    transform: [
                      {
                        translateY: translateY
                      }
                    ]
                  }}>
                  {val.toUpperCase()}
                </Animated.Text>
                <Animated.View
                  style={{
                    height: 2,
                    width: widthT,
                    backgroundColor: 'rgba(0,0,0,0.3)'
                  }}
                />
              </View>
            );
          })}
        </View>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                {
                  translateY: xxx
                },
                { scale: scale }
              ]
            }
          ]}>
          <Animated.Text
            style={{
              fontSize: 52,
              fontWeight: '900',
              backgroundColor: 'transparent',
              color: color
            }}>
            EXPO
          </Animated.Text>
        </Animated.View>
        <Animated.View style={[styles.syncing, { opacity: opacity }]}>
          <Text
            style={{
              fontWeight: '500',
              color: light,
              backgroundColor: 'transparent',
              letterSpacing: 3
            }}>
            SYNCING...
          </Text>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: bg
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  syncing: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  syncingOverlay: {
    backgroundColor: dark,
    position: 'absolute',
    flex: 0.1,
    width: 0,
    height: height / 10,
    bottom: 0,
    left: 0,
    right: 0
  }
});
