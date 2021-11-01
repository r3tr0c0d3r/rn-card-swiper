import React, {ReactElement} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import type Animated from 'react-native-reanimated';
import Card, {CardRef} from './Card';


const DEFAULT_OFFSET_DIRECTION = 'Top';
const DEFAULT_OFFSET_SPACE = 10;
const DEFAULT_SCALE_RATIO = 0.8;
const DEFAULT_STACK_SIZE = 4;
const DEFAULT_START_INDEX = 0;
const DEFAULT_INFINITE = true;

const {width, height} = Dimensions.get('window');
// const snapPoints = [-width, 0, width];
// let positions: number[] = [];

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
      springConstants,
      ...rest
    } = props;

    //const step = 0.25 //(1 / (stackSize - 1));
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
    const [currentIndex, setCurrentIndex] = React.useState(startIndex!);
    const animatingRef = React.useRef(false);
    // const animatedIndexRef = React.useRef(currentIndex);
    // const currentIndexRef = React.useRef(currentIndex);
    

    // const {width, height} = useOrientation();
    console.log(`CARD SWIPER:: width: ${width} height: ${height} `);

    console.log(
      `CardSwiper:: render!! currentIndex: ${currentIndex} cardsData: ${JSON.stringify(
        cardsData,
      )}`,
    );

    React.useImperativeHandle(ref, () => ({swipeLeft, swipeRight, swipeTop, swipeBottom, resetSwiper}));
    const cardRef = React.useRef<CardRef>(null);

    React.useEffect(() => {
      const {onSwipedAll} = props;
      if (currentIndex === cardsData.length) {
        onSwipedAll && onSwipedAll();
      }
      
      animatingRef.current = false;

      // console.log(
      //   `UPDATED TO :: currentIndex: : ${currentIndex} currentIndexRef: ${currentIndexRef.current} animatedIndex: ${animatedIndex}`,
      // );
    }, [currentIndex]);

    const swipeLeft = () => {
      console.log(`SWIPER: swipeLeft`);
      if (!animatingRef.current) {
        if (cardRef.current) {
          animatingRef.current = true;
          cardRef.current.swipeLeft();
        }
      }
    };

    const swipeRight = () => {
      console.log(`SWIPER: swipeRight`);
      if (!animatingRef.current) {
        if (cardRef.current) {
          animatingRef.current = true;
          cardRef.current.swipeRight();
        }
      }
    };

    const swipeTop = () => {
      console.log(`SWIPER: swipeTop`);
      if (!animatingRef.current) {
        if (cardRef.current) {
          animatingRef.current = true;
          cardRef.current.swipeTop();
        }
      }
    };

    const swipeBottom = () => {
      console.log(`SWIPER: swipeBottom`);
      if (!animatingRef.current) {
        if (cardRef.current) {
          animatingRef.current = true;
          cardRef.current.swipeBottom();
        }
      }
    };

    const resetSwiper = () => {
      setCurrentIndex(0);
      // setAnimatedIndex(0);
      // currentIndexRef.current = 0;
      // animatedIndexRef.current  = 0;
    }

    const onCardSwiped = (index: number) => {

      // onCardSwiped!(index);
      console.log(`onCardSwiped: index : ${index}`);

      if (infinite) {
        console.log(`onSwipe: currentIndex : ${currentIndex}`);
        if (currentIndex === cardsData.length - 1) {
          setCurrentIndex(0);
          // animatedIndexRef.current  = 0;
        } else {
          setCurrentIndex(preIndex => preIndex + 1);
        }
      } else {
        setCurrentIndex(preIndex => preIndex + 1);
      }
    };

    const makeCard = (
      cardStyle: StyleProp<ViewStyle>,
      stackIndex: number,
      currentIndex: number,
      stackSize: number,
      renderCard: (item: any) => ReactElement,
      cardsData: Array<any>,
    ) => {
      let cardIndex = currentIndex + stackIndex;
      if (cardIndex >= cardsData.length) {
        cardIndex = cardIndex % cardsData.length;
      }
      const isTopCard = stackIndex === 0;
      // const isLastCard = stackIndex === stackSize - 1;
      // const isLastData = cardIndex === cardsData.length - 1;

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
          onSwiped={onCardSwiped}
          cardStyle={cardStyle}
          offsetDirection={offsetDirection}
          offsetSpace={offsetSpace}
          scaleRatio={scaleRatio}
          {...rest}
        />
      );
    };

    const makeCardStack = (
      cardStyle: StyleProp<ViewStyle>,
      currentIndex: number,
      stackSize: number,
      renderCard: (item: any) => ReactElement,
      cardsData: Array<any>,
      infinite: boolean,
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
            cardStyle,
            i,
            currentIndex,
            stackSize,
            renderCard,
            cardsData,
          ),
        );
      }
      console.log(
        `makeDeck:: stack: ${stack.length} _stackSize: ${_stackSize} currentIndex: ${currentIndex}`,
      );
      return stack;
    };

    //   const { currentIndex } = this.state

    const measureLayout = async (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      console.log(`measureLayout:: width: ${width} height: ${height}`);
      const { width: w, height: h } = dimensions;
      if (w !== width || h !== height) {
        // console.log(`measureLayout:SET: width: ${width} height: ${height}`);
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
          cardStyle,
          currentIndex,
          stackSize,
          renderCard,
          cardsData,
          infinite,
        )}
      </View>
    );
  },
);

export default CardSwiper;

export type OffsetDirection = 'Left' | 'Right' | 'Top' | 'Bottom';

interface CardSwiperProps extends CommonProps {
  infinite: boolean;
  startIndex?: number;
  onSwipedAll?: () => void;
  springConstants?: Animated.SpringConfig;
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
  onSwipeStart?: (index: number) => void;
  onSwipeEnd?: (index: number) => void;
  onSwipedLeft?: (index: number) => void;
  onSwipedRight?: (index: number) => void;
  onSwipedTop?: (index: number) => void;
  onSwipedBottom?: (index: number) => void;
  onReset?: (index: number) => void;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  disableTopSwipe?: boolean;
  disableBottomSwipe?: boolean;
  disableSwipe?: boolean;
  horizontalSwipe?: boolean;
  verticalSwipe?: boolean;
  onlyTopSwipeable?: boolean;
};

CardSwiper.defaultProps = {
  stackSize: DEFAULT_STACK_SIZE,
  infinite: DEFAULT_INFINITE,
  startIndex: DEFAULT_START_INDEX,
  onSwipeStart: (index: number) => {},
  onSwipeEnd: (index: number) => {},
  onSwipedLeft: (index: number) => {},
  onSwipedRight: (index: number) => {},
  onSwipedTop: (index: number) => {},
  onSwipedBottom: (index: number) => {},
  onReset: (index: number) => {},
  onSwipedAll: () => {},
  disableLeftSwipe: false,
  disableRightSwipe: false,
  disableTopSwipe: false,
  disableBottomSwipe: false,
  disableSwipe: false,
  horizontalSwipe: true,
  verticalSwipe: true,
  onlyTopSwipeable: false,
  // springConstants: {
  //   stiffness: 50,
  //   damping: 30,
  //   mass: 0.5,
  // },
  cardStyle: {},
  containerStyle: {},
  offsetDirection: DEFAULT_OFFSET_DIRECTION,
  offsetSpace: DEFAULT_OFFSET_SPACE,
  scaleRatio: DEFAULT_SCALE_RATIO,
  // currentIndex: 0,
};


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#dcffcd',
  },
  noMoreCards: {
    fontSize: 24,
    color: '#424242',
  }
});
