import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { CardSwiper, CardSwiperRef, OffsetDirection  } from 'rn-card-swiper';
import Button from './Button';

const Data = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }];
// const Data = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];

export default function App() {
  const [offset, setOffset] = React.useState<OffsetDirection | undefined>();
  const swiperRef = React.useRef<CardSwiperRef>(null);

  const handleLeftPress = () => {
    console.log(`handlePrevPress::`);
    // setCurrentIndex(prev => prev + 1);
    if (swiperRef.current) {
      swiperRef.current.swipeLeft();
    }
  };
  const handleRightPress = () => {
    console.log(`handleNextPress::`);
    // setCurrentIndex(prev => prev + 1);
    if (swiperRef.current) {
      swiperRef.current.swipeRight();
    }
  };
  const handleTopPress = () => {
    console.log(`handleTopPress::`);
    // setCurrentIndex(prev => prev + 1);
    if (swiperRef.current) {
      swiperRef.current.swipeTop();
    }
  };
  const handleBottomPress = () => {
    console.log(`handleBottomPress::`);
    // setCurrentIndex(prev => prev + 1);
    if (swiperRef.current) {
      swiperRef.current.swipeBottom();
    }
  };
  const handleResetPress = () => {
    console.log(`handleResetPress::`);
    if (swiperRef.current) {
      swiperRef.current.resetSwiper();
    }
  };
  const _renderCard = (item: any) => {
    return (
      <View
        style={{
          // width: 300,
          // height: 400,
          // borderRadius: 15,
          // flex: 1,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          // backgroundColor: 'pink',
        }}
      >
        <Text
          style={{
            fontSize: 400,
            fontWeight: 'bold',
            color: '#C7E2FF',
            right: -40,
            bottom: -20,
          }}
        >
          {item.id}
        </Text>
      </View>
    );
  };

  const _renderEmptyMessage = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#C7E2FF',
          }}
        >
          No more cards...
        </Text>
      </View>
    );
  };

  const handleOnSwiped = () => {
    // console.log(
    //   `handleOnSwiped: currentIndex : ${currentIndex}`,
    // );
    // if (infiniteSwipe) {
    //   if (currentIndex === Data.length - 1) {
    //     setCurrentIndex(0);
    //   } else {
    //     setCurrentIndex(preIndex => preIndex + 1);
    //   }
    // } else {
    //   setCurrentIndex(preIndex => preIndex + 1);
    // }
  };
  const handleOnSwipedAll = () => {
    console.log(`handleOnSwipedAll`);
  };
  const handleOnSwipeStart = (index: number) => {
    console.log(`handleOnSwipe index: ${index}`);
  };
  const handleOnSwipeEnd = (index: number) => {
    console.log(`handleOnSwipeEnd index: ${index}`);
  };
  const handleChangeOffset = (direction: OffsetDirection) => {
    console.log(`handleChangeOffset:: ${direction}`);
    setOffset(direction);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header]}>
        <Text style={styles.title}>RN CARD SWIPER</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="L"
          style={styles.miniButton}
          textStyle={styles.buttonText}
          onPress={() => handleChangeOffset('Left')}
        />

        <Button
          title="T"
          style={styles.miniButton}
          textStyle={styles.buttonText}
          onPress={() => handleChangeOffset('Top')}
        />

        <Button
          title="R"
          style={styles.miniButton}
          textStyle={styles.buttonText}
          onPress={() => handleChangeOffset('Right')}
        />

        <Button
          title="B"
          style={styles.miniButton}
          textStyle={styles.buttonText}
          onPress={() => handleChangeOffset('Bottom')}
        />
      </View>

      <View style={{ flex: 1, width: '100%', zIndex: 100 }}>
        <CardSwiper
          ref={swiperRef}
          offsetDirection={offset}
          infinite={true}
          stackSize={5}
          cardsData={Data}
          renderCard={_renderCard}
          renderEmptyView={_renderEmptyMessage}
          onlyTopSwipeable={false}
          // onSwipeStart={handleOnSwipeStart}
          // onSwipeEnd={handleOnSwipeEnd}
          onSwipedAll={handleOnSwipedAll}
          // disableTopSwipe={true}
          // disableBottomSwipe={true}
          // disableLeftSwipe={true}

          // containerStyle={{
          //   // width: '100%',
          //   // height: '100%',
          //   flex: 1,
          //   alignItems: 'center',
          //   justifyContent: 'center',
          //   // backgroundColor: 'pink',
          //   padding: 10,
          // }}
          cardStyle={{
            // margin: 20,

            backgroundColor: 'white',
            borderColor: '#0095FF',
            borderWidth: 1,
            // height: 300,
            // width: 300,
            // borderRadius: 5,
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <View>
          <Button
            title="Top"
            style={styles.ltButton}
            textStyle={styles.buttonText}
            onPress={handleTopPress}
          />
          <View style={{ height: 1, backgroundColor: '#29a2ff' }} />
          <Button
            title="Left"
            style={styles.lbButton}
            textStyle={styles.buttonText}
            onPress={handleLeftPress}
          />
        </View>
        <View style={{ width: 1, height: 105, backgroundColor: '#29a2ff' }} />
        <Button
          title="Reset"
          style={styles.middleButton}
          textStyle={styles.buttonText}
          onPress={handleResetPress}
        />
        <View style={{ width: 1, height: 105, backgroundColor: '#29a2ff' }} />
        <View>
          <Button
            title="Bottom"
            style={styles.rtButton}
            textStyle={styles.buttonText}
            onPress={handleBottomPress}
          />
          <View style={{ height: 1, backgroundColor: '#29a2ff' }} />
          <Button
            title="Right"
            style={styles.rbButton}
            textStyle={styles.buttonText}
            onPress={handleRightPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#88cdfa'
  },
  header: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#88cdfa'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0095FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 105,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    // backgroundColor: '#88cdfa'
  },
  ltButton: {
    width: 88,
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  lbButton: {
    width: 88,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 26,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rtButton: {
    width: 88,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 26,
    borderBottomRightRadius: 0,
  },
  rbButton: {
    width: 88,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 26,
  },
  middleButton: {
    width: 84,
    height: 105,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  miniButton: {
    width: 50,
    margin: 5,
    // backgroundColor: '#88cdfa'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FAFAFA',
  },
});
