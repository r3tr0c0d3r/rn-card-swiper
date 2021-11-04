import React, {ReactElement} from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Card, {CardRef} from './Card';

const DEFAULT_OFFSET_DIRECTION = 'Top';
const DEFAULT_OFFSET_SPACE = 8;
const DEFAULT_SCALE_RATIO = 0.8;
const DEFAULT_STACK_SIZE = 5;
const DEFAULT_START_INDEX = 0;
const DEFAULT_TOUCH_RANGE_PADDING = 10;
const DEFAULT_INFINITE = true;
export interface CardSwiperRef {
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeTop: () => void;
  swipeBottom: () => void;
  resetSwiper: () => void;
}

const CardSwiper = React.forwardRef(
  (props: CardSwiperProps, ref: React.Ref<CardSwiperRef> | undefined) => {
    const {
      stackSize,
      renderCard,
      renderEmptyView,
      cardsData,
      cardStyle,
      containerStyle,
      infinite,
      offsetDirection,
      offsetSpace,
      scaleRatio,
      startIndex,
      onSwiped,
      onSwipedLeft,
      onSwipedRight,
      onSwipedTop,
      onSwipedBottom,
      ...rest
    } = props;

    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
    const [currentIndex, setCurrentIndex] = React.useState(startIndex!);
    const animatingRef = React.useRef(false);

    React.useImperativeHandle(ref, () => ({swipeLeft, swipeRight, swipeTop, swipeBottom, resetSwiper}));
    const cardRef = React.useRef<CardRef>(null);

    React.useEffect(() => {
      const {onSwipedAll} = props;
      if (currentIndex === cardsData.length) {
        onSwipedAll && onSwipedAll();
      }
      animatingRef.current = false;
    }, [currentIndex]);

    const swipeLeft = () => {
      if (!animatingRef.current) {
        if (cardRef.current) {
          animatingRef.current = true;
          cardRef.current.swipeLeft();
        }
      }
    };

    const swipeRight = () => {
      if (!animatingRef.current) {
        if (cardRef.current) {
          animatingRef.current = true;
          cardRef.current.swipeRight();
        }
      }
    };

    const swipeTop = () => {
      if (!animatingRef.current) {
        if (cardRef.current) {
          animatingRef.current = true;
          cardRef.current.swipeTop();
        }
      }
    };

    const swipeBottom = () => {
      if (!animatingRef.current) {
        if (cardRef.current) {
          animatingRef.current = true;
          cardRef.current.swipeBottom();
        }
      }
    };

    const resetSwiper = () => {
      setCurrentIndex(0);
    }

    const onSwipedCard = (index: number, direction: string) => {

      onSwiped && onSwiped(index);
      
      switch (direction) {
        case 'Left':
          onSwipedLeft && onSwipedLeft(index);
          break;
        case 'Right':
          onSwipedRight && onSwipedRight(index);
          break;
        case 'Top':
          onSwipedTop && onSwipedTop(index);
          break;
        case 'Bottom':
          onSwipedBottom && onSwipedBottom(index);
          break;
      }

      if (infinite) {
        if (currentIndex === cardsData.length - 1) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(preIndex => preIndex + 1);
        }
      } else {
        setCurrentIndex(preIndex => preIndex + 1);
      }
    };

    const makeCard = (
      currentIndex: number,
      stackIndex: number,
      stackSize: number,
      cardsData: Array<any>,
      cardStyle: StyleProp<ViewStyle>,
      renderCard: (item: any) => ReactElement,
    ) => {
      let cardIndex = currentIndex + stackIndex;
      if (cardIndex >= cardsData.length) {
        cardIndex = cardIndex % cardsData.length;
      }
      const isTopCard = stackIndex === 0;
      // const isLastCard = stackIndex === stackSize - 1;

      // console.log(`makeCard :: stackIndex: ${stackIndex} currentIndex: ${currentIndex} cardIndex: ${cardIndex} isTopCard: ${isTopCard}`);

      return (
        <Card
          ref={isTopCard ? cardRef : null}
          key={cardIndex}
          dimensions={dimensions}
          isTopCard={isTopCard}
          cardsData={cardsData}
          renderCard={renderCard}
          cardIndex={cardIndex}
          stackIndex={stackIndex}
          stackSize={stackSize}
          onSwipedCard={onSwipedCard}
          cardStyle={cardStyle}
          offsetDirection={offsetDirection}
          offsetSpace={offsetSpace}
          scaleRatio={scaleRatio}
          {...rest}
        />
      );
    };

    const makeCardStack = (
      infinite: boolean,
      currentIndex: number,
      stackSize: number,
      cardsData: Array<any>,
      cardStyle: StyleProp<ViewStyle>,
      renderCard: (item: any) => ReactElement,
    ) => {
      let _stackSize = stackSize;
      if (!infinite) {
        const isOutOfBound = currentIndex + stackSize > cardsData.length;
        if (isOutOfBound) {
          _stackSize = cardsData.length - currentIndex;
        }
      }

      let stack = [];
      for (let i = 0; i < _stackSize; i++) {
        stack.push(
          makeCard(
            currentIndex,
            i,
            stackSize,
            cardsData,
            cardStyle,
            renderCard,
          ),
        );
      }
      console.log(
        `makeDeck:: stack: ${stack.length} _stackSize: ${_stackSize} currentIndex: ${currentIndex}`,
      );
      return stack;
    };

    const measureLayout = async (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      // console.log(`measureLayout:: width: ${width} height: ${height}`);
      const { width: w, height: h } = dimensions;
      if (w !== width || h !== height) {
        setDimensions({ width, height });
      }
    };

    return (
      <View 
      onLayout={event => measureLayout(event)}
        style={[styles.container, containerStyle]}>
          {!infinite && 
          currentIndex === cardsData.length && 
          (renderEmptyView ? renderEmptyView() : <Text style={styles.noMoreCards}>No more cards...</Text>)}
        {makeCardStack(
          infinite!,
          currentIndex,
          stackSize,
          cardsData,
          cardStyle,
          renderCard,
        )}
      </View>
    );
  },
);

export default CardSwiper;

export type OffsetDirection = 'Left' | 'Right' | 'Top' | 'Bottom';

interface CardSwiperProps extends CommonProps {
  infinite?: boolean;
  startIndex?: number;
  onSwipedAll?: () => void;
  onSwipedLeft?: (index: number) => void;
  onSwipedRight?: (index: number) => void;
  onSwipedTop?: (index: number) => void;
  onSwipedBottom?: (index: number) => void;
  onSwiped?: (index: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  renderEmptyView?: () => React.ReactElement;
};

export interface CommonProps {
  cardsData: Array<any>;
  stackSize: number;
  offsetDirection?: OffsetDirection;
  offsetSpace?: number;
  scaleRatio?: number;
  cardStyle?: StyleProp<ViewStyle>;
  renderCard: (item: any) => React.ReactElement;
  onReset?: (index: number) => void;
  onTap?: (index: number) => void;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  disableTopSwipe?: boolean;
  disableBottomSwipe?: boolean;
  disableSwipe?: boolean;
  horizontalSwipe?: boolean;
  verticalSwipe?: boolean;
  onlyTopSwipeable?: boolean;
  touchInset?: number;
};

CardSwiper.defaultProps = {
  stackSize: DEFAULT_STACK_SIZE,
  infinite: DEFAULT_INFINITE,
  startIndex: DEFAULT_START_INDEX,
  onSwipedLeft: (index: number) => {},
  onSwipedRight: (index: number) => {},
  onSwipedTop: (index: number) => {},
  onSwipedBottom: (index: number) => {},
  onReset: (index: number) => {},
  onTap: (index: number) => {},
  onSwipedAll: () => {},
  disableLeftSwipe: false,
  disableRightSwipe: false,
  disableTopSwipe: false,
  disableBottomSwipe: false,
  disableSwipe: false,
  horizontalSwipe: true,
  verticalSwipe: true,
  onlyTopSwipeable: false,

  cardStyle: {},
  containerStyle: {},
  offsetDirection: DEFAULT_OFFSET_DIRECTION,
  offsetSpace: DEFAULT_OFFSET_SPACE,
  scaleRatio: DEFAULT_SCALE_RATIO,
  touchInset: DEFAULT_TOUCH_RANGE_PADDING,
};


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCards: {
    fontSize: 24,
    color: '#424242',
  }
});
