import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Animated, {
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

const timingConfig = {
  duration: 300,
};

const animConfig = timingConfig;

const TIMING_DURATION_VER = 600;
const TIMING_DURATION_HOR = 400;

type AnimatedGHContext = {
  startX: number;
  startY: number;
  pointX: number;
  pointY: number;
};

export interface CardRef {
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeTop: () => void;
  swipeBottom: () => void;
}

const Card = React.forwardRef((props: CardProps, ref: React.Ref<CardRef>) => {
  const {
    dimensions,
    cardStyle,
    stackSize,
    stackIndex,
    cardsData,
    cardIndex,
    renderCard,
    isTopCard,
    offsetDirection,
    offsetSpace,
    scaleRatio,
    onReset,
    onSwipedCard,
    onTap,
    disableLeftSwipe,
    disableRightSwipe,
    disableTopSwipe,
    disableBottomSwipe,
    disableSwipe,
    horizontalSwipe,
    verticalSwipe,
    onlyTopSwipeable,
    touchInset,
  } = props;
  const cardTranslateX = useSharedValue(0);
  const cardTranslateY = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const animatedIndex = useSharedValue(stackIndex * stepper);
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

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

  const offset = offsetSpace! * (offsetSpace! * (1 - scaleRatio!));
  let horOffset = 0;
  let verOffset = 0;

  if (cardHeight === cardWidth) {
    horOffset = offset * (stackSize - 1);
    verOffset = offset * (stackSize - 1);
  } else if (cardHeight > cardWidth) {
    horOffset = offset * (stackSize - 1);
    verOffset = offset * (stackSize - 1) * (cardHeight / cardWidth);
  } else {
    horOffset = offset * (stackSize - 1) * (cardWidth / cardHeight);
    verOffset = offset * (stackSize - 1);
  }

  React.useEffect(() => {
    const value = stackIndex * stepper;
    animatedIndex.value = withTiming(value);
    cardOpacity.value = withTiming(1);
  }, [stackIndex]);

  const resetCard = () => {
    cardOpacity.value = 0;
    cardTranslateX.value = 0;
    cardTranslateY.value = 0;
    positionX.value = 0;
    positionY.value = 0;
  };

  const moveCardX = (
    destination: number,
    index: number,
    callback: boolean,
    config?: any
  ) => {
    'worklet';
    cardTranslateX.value = withTiming(destination, config, (_) => {
      if (callback) {
        if (destination !== 0) {
          if (destination < 0) {
            runOnJS(onSwipedCard!)(index, 'Left');
          }
          if (destination > 0) {
            runOnJS(onSwipedCard!)(index, 'Right');
          }
          runOnJS(resetCard)();
        }
      }
    });
  };

  const moveCardY = (
    destination: number,
    index: number,
    callback: boolean,
    config?: any
  ) => {
    'worklet';
    cardTranslateY.value = withTiming(destination, config, (_) => {
      if (callback) {
        if (destination !== 0) {
          if (destination < 0) {
            runOnJS(onSwipedCard!)(index, 'Top');
          }
          if (destination > 0) {
            runOnJS(onSwipedCard!)(index, 'Bottom');
          }
          runOnJS(resetCard)();
        }
      }
    });
  };

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (event, context) => {
      if (onlyTopSwipeable && !isTopCard) {
        return;
      }
      if (disableSwipe) {
        return;
      }
      context.startX = horizontalSwipe ? cardTranslateX.value : 0;
      context.startY = verticalSwipe ? cardTranslateY.value : 0;
      context.pointX = event.x;
      context.pointY = event.y;
    },
    onActive: (event, context) => {
      if (onlyTopSwipeable && !isTopCard) {
        return;
      }
      if (disableSwipe) {
        return;
      }
      cardTranslateX.value = horizontalSwipe
        ? event.translationX + context.startX
        : 0;
      cardTranslateY.value = verticalSwipe
        ? event.translationY + context.startY
        : 0;
      positionX.value = event.absoluteX - width / 2;
      positionY.value = event.absoluteY - height / 2;
    },
    onEnd: ({ velocityX, velocityY }, context) => {
      if (onlyTopSwipeable && !isTopCard) {
        return;
      }
      if (disableSwipe) {
        return;
      }

      const horizontalDest = snapPoint(
        cardTranslateX.value,
        velocityX,
        horSnapPoints
      );
      const verticalDest = snapPoint(
        cardTranslateY.value,
        velocityY,
        verSnapPoints
      );

      let validPoint = false;
      if (
        context.pointX > touchInset! &&
        context.pointX < cardWidth - touchInset! &&
        context.pointY > touchInset! &&
        context.pointY < cardHeight - touchInset!
      ) {
        validPoint = true;
      }

      if (
        (horizontalDest < 0 && disableLeftSwipe) ||
        (horizontalDest > 0 && disableRightSwipe) ||
        (verticalDest < 0 && disableTopSwipe) ||
        (verticalDest > 0 && disableBottomSwipe) ||
        (horizontalDest === 0 && verticalDest === 0) ||
        (stackIndex > 0 && !validPoint)
      ) {
        cardTranslateX.value = withSpring(0, { velocity: velocityX });
        cardTranslateY.value = withSpring(0, { velocity: velocityY }, () => {
          runOnJS(onReset!)(cardIndex);
        });
        return;
      }

      if (horizontalDest !== 0 && verticalDest === 0) {
        moveCardX(horizontalDest, cardIndex, true, animConfig);
      }

      if (verticalDest !== 0 && horizontalDest === 0) {
        moveCardY(verticalDest, cardIndex, true, animConfig);
      }

      if (horizontalDest !== 0 && verticalDest !== 0) {
        moveCardX(horizontalDest, cardIndex, true, animConfig);
        moveCardY(verticalDest, cardIndex, false, animConfig);
      }
    },
  });

  const onTapCard = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      if (stackIndex === 0) {
        runOnJS(onTap!)(cardIndex)
      }
    }
  };

  const rotaion = useDerivedValue(() => {
    const rotate =
      (positionX.value * cardTranslateY.value -
        positionY.value * cardTranslateX.value) /
      180;
    return interpolate(rotate, [-width * 2, width * 2], [-30, 30]);
  });

  const cardAnimStyle = useAnimatedStyle(() => {
    let dx = 0;
    let dy = 0;

    switch (offsetDirection) {
      case 'Left':
        dx = mixValue(animatedIndex.value, 0, -horOffset);
        break;
      case 'Right':
        dx = mixValue(animatedIndex.value, 0, horOffset);
        break;
      case 'Top':
        dy = mixValue(animatedIndex.value, 0, -verOffset);
        break;
      case 'Bottom':
        dy = mixValue(animatedIndex.value, 0, verOffset);
        break;
    }

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
    cardTranslateX.value = withTiming(
      -width * 1.5,
      { duration: TIMING_DURATION_HOR },
      () => {
        runOnJS(resetCard)();
        runOnJS(onSwipedCard!)(cardIndex, 'Left');
      }
    );
    positionY.value = withTiming(getRandomValue(-100, 100), {
      duration: TIMING_DURATION_HOR / 2,
    });
  };

  const swipeRight = () => {
    cardTranslateX.value = withTiming(
      width * 1.5,
      { duration: TIMING_DURATION_HOR },
      () => {
        runOnJS(resetCard)();
        runOnJS(onSwipedCard!)(cardIndex, 'Right');
      }
    );
    positionY.value = withTiming(getRandomValue(-100, 100), {
      duration: TIMING_DURATION_HOR / 2,
    });
  };

  const swipeTop = () => {
    cardTranslateY.value = withTiming(
      -height * 1.5,
      { duration: TIMING_DURATION_VER },
      () => {
        runOnJS(resetCard)();
        runOnJS(onSwipedCard!)(cardIndex, 'Top');
      }
    );
    positionX.value = withTiming(getRandomValue(-100, 100), {
      duration: TIMING_DURATION_VER / 2,
    });
  };

  const swipeBottom = () => {
    cardTranslateY.value = withTiming(
      height * 1.5,
      { duration: TIMING_DURATION_VER },
      () => {
        runOnJS(resetCard)();
        runOnJS(onSwipedCard!)(cardIndex, 'Bottom');
      }
    );
    positionX.value = withTiming(getRandomValue(-100, 100), {
      duration: TIMING_DURATION_VER / 2,
    });
  };

  const cardDynamicStyle = {
    ...styles.card,
    width: cardWidth,
    height: cardHeight,
    zIndex: cardsData.length + 100 - stackIndex,
  };

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View style={[cardDynamicStyle, cardStyle, cardAnimStyle]}>
        <TapGestureHandler onHandlerStateChange={onTapCard}>
          <Animated.View>
            {renderCard(cardsData[cardIndex])}
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
});

export default Card;

interface CardProps extends CommonProps {
  isTopCard: boolean;
  stackIndex: number;
  cardIndex: number;
  dimensions: { width: number; height: number };
  onSwipedCard: (index: number, direction: string) => void;
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
