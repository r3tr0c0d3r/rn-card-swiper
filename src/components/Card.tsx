import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { CommonProps } from './CardSwiper';
import { getRandomValue, mixValue, snapPoint } from './Utils';


const { width, height } = Dimensions.get('window');
const horSnapPoints = [-width, 0, width];
const verSnapPoints = [-height, 0, height];
const stepper = 0.25;
// let cardWidth = width * 0.8;
// let cardHeight = height * 0.45;

const springConfig = {
  overshootClamping: true,
  restSpeedThreshold: 100,
  restDisplacementThreshold: 100,
}

const TIMING_DURATION_VER = 600;
const TIMING_DURATION_HOR = 400;
const timingConfig = {
  duration: 300,
}

type AnimatedGHContext = {
  startX: number;
  startY: number;
};

export interface CardRef {
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeTop: () => void;
  swipeBottom: () => void;
}

const Card = React.forwardRef(
  (props: CardProps, ref: React.Ref<CardRef>) => {
    const {
      dimensions,
      cardStyle,
      stackSize,
      stackIndex,
      cardsData,
      cardIndex,
      renderCard,
      onSwiped,
      isTopCard,
      offsetDirection,
      offsetSpace,
      scaleRatio,
      onSwipeStart,
      onSwipeEnd,
      onSwipedLeft,
      onSwipedRight,
      onSwipedTop,
      onSwipedBottom,
      onReset,
      disableLeftSwipe,
      disableRightSwipe,
      disableTopSwipe,
      disableBottomSwipe,
      disableSwipe,
      horizontalSwipe,
      verticalSwipe,
      onlyTopSwipeable,
    } = props;
    const cardTranslateX = useSharedValue(0);
    const cardTranslateY = useSharedValue(0);
    const cardOpacity = useSharedValue(1);
    // const cardScale = useSharedValue(1);
    // const cardRotation = useSharedValue(0);
    const animatedIndex = useSharedValue(stackIndex * stepper);
    const positionX = useSharedValue(0);
    const positionY = useSharedValue(0);

    const gestureDisabled = useSharedValue(disableSwipe);

    
    let cardWidth = dimensions.width * 0.8;
    let cardHeight = dimensions.height * 0.85;

    if (cardStyle !== undefined) {
      let cWidth = StyleSheet.flatten(cardStyle).width;
      let cHeight = StyleSheet.flatten(cardStyle).height;
      if (cWidth !== undefined) {
        cardWidth = Number(cWidth);
      }
      if (cHeight !== undefined) {
        cardHeight = Number(cHeight);
      }
    }

    const space = 7.8;
    const ratio = 0.8;
    const offset = space! * (space! * (1 - ratio!));
    let horOffset = 0;
    let verOffset = 0;

    if (cardHeight === cardWidth) {
      horOffset = offset * (stackSize - 1)
      verOffset = offset * (stackSize - 1)
    } else if (cardHeight > cardWidth) {
      horOffset = offset * (stackSize - 1)
      verOffset = offset * (stackSize - 1) * (cardHeight / cardWidth)
    } else {
      horOffset = offset * (stackSize - 1) * (cardWidth / cardHeight)
      verOffset = offset * (stackSize - 1)
    }
    // console.log(`CARD:: width: ${width} height: ${height} stackSize: ${stackSize}`);
    console.log(`CARD:: cardWidth: ${cardWidth} cardHeight: ${cardHeight} horOffset: ${horOffset} verOffset: ${verOffset}`);

    React.useEffect(() => {
      const value = stackIndex * stepper;
      console.log(
        `position:: stackIndex: ${stackIndex} value: ${value} cardIndex: ${cardIndex} cardsData: ${JSON.stringify(
          cardsData[cardIndex]
        )}`
      );

      animatedIndex.value =  withTiming(value);
      cardOpacity.value = withTiming(1);
      // console.log(`zIndex: ${cardsData.length + 100 - (stackIndex)}`)
    }, [stackIndex]);


    const reset = () => {
      console.log(`reset: gestureDisabled -> ${gestureDisabled.value}`)
      cardOpacity.value = 0;
      cardTranslateX.value = 0;
      cardTranslateY.value = 0;
      positionX.value = 0;
      positionY.value = 0;
    };

    const moveCardX = (destination: number, index: number, callback: boolean, config?: any) => {
      'worklet';
      cardTranslateX.value = withSpring(
        destination, 
        config, 
        (finished) => {
          console.log(`HORIZONTAL -> finished: ${finished} destination: ${destination} index: ${index}`);
          if (callback) {
            if (destination < 0) {
              runOnJS(onSwipedLeft!)(cardIndex);
            }
            if (destination > 0) {
              runOnJS(onSwipedRight!)(cardIndex);
            } 
            if (destination !== 0) {
              runOnJS(reset)();
              runOnJS(onSwiped)(cardIndex);
            }
          }
        }
      ); 
    }
  
    const moveCardY = (destination: number, index: number, callback: boolean, config?: any) => {
      'worklet';
      cardTranslateY.value = withSpring(
        destination, 
        config, 
        (finished) => {
          console.log(`VERTICAL -> finished: ${finished} destination: ${destination} index: ${index}`);
          if (callback) {
            if (destination < 0) {
              runOnJS(onSwipedTop!)(index);
            } 
            if (destination > 0)  {
              runOnJS(onSwipedBottom!)(index);
            }
            if (destination !== 0) {
              runOnJS(reset)();
              runOnJS(onSwiped)(index);
            }
          }
        }
      ); 
    }

    const panGestureHandler = useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      AnimatedGHContext
    >({
      onStart: (_, context) => {
        if (onlyTopSwipeable && !isTopCard) {
          return;
        }
        if (gestureDisabled.value) {
          return;
        }
        context.startX = horizontalSwipe ? cardTranslateX.value : 0;
        context.startY = verticalSwipe ? cardTranslateY.value : 0;
        // console.log(`onStart:: ok startX: ${context.startX} startY: ${context.startY}`);

        // runOnJS(onSwipeStart!)(cardIndex);
      },
      onActive: (event, context) => {
        if (onlyTopSwipeable && !isTopCard) {
          return;
        }
        if (gestureDisabled.value) {
          return;
        }
        cardTranslateX.value = horizontalSwipe ? event.translationX + context.startX : 0;
        cardTranslateY.value = verticalSwipe ? event.translationY + context.startY : 0;
        positionX.value = event.absoluteX - (width / 2)
        positionY.value = event.absoluteY - (height / 2)
      },
      onEnd: ({ velocityX, velocityY }) => {
        if (onlyTopSwipeable && !isTopCard) {
          return;
        }
        if (gestureDisabled.value) {
          return;
        }

        // gestureDisabled.value = true;
        //  runOnJS(onSwipeEnd!)(cardIndex);

        const horizontalDest = snapPoint(cardTranslateX.value, velocityX, horSnapPoints);
        const verticalDest = snapPoint(cardTranslateY.value, velocityY, verSnapPoints);
        console.log(`verticalDest: ${verticalDest} horizontalDest: ${horizontalDest} cardIndex: ${cardIndex}`);

        if ((horizontalDest < 0 && disableLeftSwipe) || 
        (horizontalDest > 0 && disableRightSwipe) || 
        (verticalDest < 0 && disableTopSwipe) || 
        (verticalDest > 0 && disableBottomSwipe) || 
        (horizontalDest === 0 && verticalDest === 0)) {
          cardTranslateX.value = withSpring(0, {velocity: velocityX,});
          cardTranslateY.value = withSpring(0, {velocity: velocityY,}, () => {
            console.log(`verticalDest: ${verticalDest} horizontalDest: ${horizontalDest} disableSwipe: ${disableSwipe}`);
            runOnJS(onReset!)(cardIndex);
          });
          if (!disableSwipe) {
            gestureDisabled.value = false;
          }
          return;
        }

        if (horizontalDest !== 0 && verticalDest === 0) {
          moveCardX(horizontalDest, cardIndex, true, springConfig);
        }

        if (verticalDest !== 0 && horizontalDest === 0) {
          moveCardY(verticalDest, cardIndex, true, springConfig);
        }
        
        if (horizontalDest !== 0 && verticalDest !== 0) {
          moveCardX(horizontalDest, cardIndex, true, springConfig);
          moveCardY(verticalDest, cardIndex, false, springConfig);
        }
        
      },
    });

    const rotaion = useDerivedValue(() => {
      const rotate = (positionX.value * cardTranslateY.value - positionY.value * cardTranslateX.value) / 360;
      return interpolate(rotate, [-width * 2, width * 2], [-45, 45]);
    })

    /* const scale = useDerivedValue(() => {
      return interpolate(
        animatedIndex.value,
        [0, 1.5],
        [1, scaleRatio!],
        Extrapolate.EXTEND
      );
    });  */

    /* const space = 7.0;
    const ratio = 0.8;
    const offset = space! * (space! * (1 - ratio!));

    const dx = useDerivedValue(() => {
      let dx = 0;
      switch (offsetDirection) {
        case 'Left':
          dx = interpolate(
            animatedIndex.value,
            [0, stepper * (stackSize - 1)],
            [0, -offset * (stackSize - 1)]);
          break;
        case 'Right':
          dx = interpolate(
            animatedIndex.value,
            [0, stepper * (stackSize - 1)],
            [0, offset * (stackSize - 1)]);
          break;
      }
      return dx;
    });

    const dy = useDerivedValue(() => {
      let dy = 0;
      switch (offsetDirection) {
        case 'Top':
          dy = interpolate(
            animatedIndex.value,
            [0, stepper * (stackSize - 1)],
            [0, -offset * (stackSize - 1) * (cardHeight / cardWidth)]);
          break;
        case 'Bottom':
          dy = interpolate(
            animatedIndex.value,
            [0, stepper * (stackSize - 1)],
            [0, offset * (stackSize - 1) * (cardHeight / cardWidth)]);
          break;
      }
      return dy;
    }) */

   

    
    const cardAnimStyle = useAnimatedStyle(() => {
      // cardRotation.value = interpolate(
      //   (cardTranslateY.value),
      //   [-width * 2, width * 2],
      //   [-45, 45]
      // );

      
      // cardRotation.value = rotaion.value;
      
      // const cardScale = interpolate(
      //   animatedIndex.value,
      //   [0, 1.5],
      //   [1, scaleRatio!],
      //   Extrapolate.CLAMP
      // );

      let dx = 0;
      let dy = 0;
      
      switch (offsetDirection) {
        case 'Left':
          console.log(`CARD:: LEFT: ${horOffset}`);
          dx = mixValue(animatedIndex.value, 0, -horOffset);
          // dx = mixValue(animatedIndex.value, 0, -offset * (stackSize - 1));
          break;
        case 'Right':
          dx = mixValue(animatedIndex.value, 0, horOffset);
          // dx = mixValue(animatedIndex.value, 0, offset * (stackSize - 1));
          break;
        case 'Top':
          console.log(`CARD:: TOP: ${verOffset}`);
          dy = mixValue(animatedIndex.value, 0, -verOffset);
          // dy = mixValue(animatedIndex.value, 0, -offset * (stackSize - 1) * (cardHeight / cardWidth));
          break;
        case 'Bottom':
          dy = mixValue(animatedIndex.value, 0, verOffset);
          // dy = mixValue(animatedIndex.value, 0, offset * (stackSize - 1) * (cardHeight / cardWidth));
          break;
      }

      // let dx = mixValue(animatedIndex.value, 0, -45);
      // let dy = mixValue(animatedIndex.value, 0, -offset * (stackSize - 1) * (cardHeight / cardWidth));
      let scale = mixValue(animatedIndex.value, 1, scaleRatio!);

      return {
        transform: [
          { translateX: cardTranslateX.value + dx },
          { translateY: cardTranslateY.value + dy },
          { scale: scale },
          { rotate: `${rotaion.value}deg` },
        ],
        opacity: cardOpacity.value,        
      };
    });

    React.useImperativeHandle(ref, () => ({
      swipeLeft,
      swipeRight,
      swipeTop,
      swipeBottom,
    }));

     const swipeLeft = () => {
      console.log(`CARD: swipeLeft: topCard: ${isTopCard}`);
      cardTranslateX.value = withTiming(-width * 1.5, { duration: TIMING_DURATION_HOR }, (finished) => {
        console.log(`CARD: swipeLeft: finished: ${finished}`);
        runOnJS(reset)();
        runOnJS(onSwipedLeft!)(cardIndex);
        runOnJS(onSwiped)(cardIndex);
      });
      positionY.value = withTiming(getRandomValue(-100, 100), { duration: TIMING_DURATION_HOR / 2 });
    };

    const swipeRight = () => {
      console.log(`CARD: swipeRight: topCard: ${isTopCard}`);
      cardTranslateX.value = withTiming(width * 1.5, { duration: TIMING_DURATION_HOR }, () => {
        runOnJS(reset)();
        runOnJS(onSwipedRight!)(cardIndex);
        runOnJS(onSwiped)(cardIndex);
      });
      positionY.value = withTiming(getRandomValue(-100, 100), { duration: TIMING_DURATION_HOR / 2 });
    };

    const swipeTop = () => {
      console.log(`CARD: swipeTop: topCard: ${isTopCard}`);
      
      cardTranslateY.value = withTiming(-height * 1.5, { duration: TIMING_DURATION_VER }, () => {
        runOnJS(reset)();
        runOnJS(onSwipedTop!)(cardIndex);
        runOnJS(onSwiped)(cardIndex);
      });
      positionX.value = withTiming(getRandomValue(-100, 100), { duration: TIMING_DURATION_VER / 2 });
    };

    const swipeBottom = () => {
      console.log(`CARD: swipeBottom: topCard: ${isTopCard}`);
      cardTranslateY.value = withTiming(height * 1.5, { duration: TIMING_DURATION_VER }, () => {
        runOnJS(reset)();
        runOnJS(onSwipedBottom!)(cardIndex);
        runOnJS(onSwiped)(cardIndex);
      });
      positionX.value = withTiming(getRandomValue(-100, 100), { duration: TIMING_DURATION_VER / 2 });
    };

    const cardDynamicStyle = {
      ...styles.card,
      width: cardWidth,
      height: cardHeight,
      zIndex: 100 - stackIndex,
    };

    return (
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View
          style={[
            cardDynamicStyle,
            cardStyle,
            cardAnimStyle,
          ]}>
          {renderCard(cardsData[cardIndex])}
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

export default Card;

interface CardProps extends CommonProps {
  isTopCard: boolean;
  stackIndex: number;
  cardIndex: number;
  dimensions: {width: number, height: number};
  onSwiped: (index: number) => void;
}

Card.defaultProps = {};

const DEFAULT_BORDER_RADIUS = 15;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
});
