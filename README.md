# rn-card-swiper

A card swiper library using Reanimated 2

## Preview

![@screenshot-rn-card-swiper](https://github.com/emu075/rn-card-swiper/blob/master/screenshots/screenshot-rn-card-swiper.gif?raw=true)

## Installation

```sh
npm install rn-card-swiper
```

or

```sh
yarn add rn-card-swiper
```

## Usage

```js
import { CardSwiper } from 'rn-card-swiper';

// ...
const Data = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }];

const _renderCard = (item: any) => {
    return (
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
        <Text
          style={{
            fontSize: 400,
            fontWeight: 'bold',
            color: '#C7E2FF',
            right: -40,
            bottom: -20,
          }}>
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
// ...
<CardSwiper
  stackSize={5}
  cardsData={Data}
  renderCard={_renderCard}
  renderEmptyView={_renderEmptyMessage}/>;
// ...
```

## Component props

| prop                | type           | default       | description                                                                               |
| ------------------- | -------------- | ------------- | ----------------------------------------------------------------------------------------- |
| cardsData           | array          | []            | array of data for the cards to be rendered                                                                                 |
| renderCard          | func           |               | renders the card based on the data                                                                                     |
| renderEmptyView     | func           |               | renders the view to be shown after swiped last card                                                                                        |
| stackSize           | number         | 5             | number of cards to be shown         |
| startIndex          | number         | 0             | initial card index                                                                                     |
| infinite            | boolean        | true          | keep swiping indefinitely                                                              |
| cardStyle           | object         |               | Ooverride default card style                                                |
| containerStyle      | object         |               | override default container style                                                                             |
| offsetDirection     | object         | "Top"         | which way cards offsets will be shown                                                                     |
| offsetSpace         | number         | 8             | distance between cards                                                           |
| scaleRatio          | number         | 0.8           | cards scale ratio in stack  |
| disableLeftSwipe    | boolean        | false         | disable left swipe                                                                  |
| disableRightSwipe   | boolean        | false         | disable right swipe                                                          |
| disableTopSwipe     | boolean        | false         | disable top swipe                                                           |
| disableBottomSwipe  | boolean        | false         | disable bottom swipe                                    |
| disableSwipe        | boolean        | false         | disable swipe in all directions                                                                 |
| horizontalSwipe     | boolean        | true          | swipe cards horizontally                                                     |
| verticalSwipe       | boolean        | true          | swipe cards vertically |                                                                  |
| onlyTopSwipeable    | boolean        | false         | only top card can be swiped |                                                                  |
| touchInset          | number         | 10            | card's touch range from the edge|                                                                  |
| onSwipeStart        | func           |               | function to be called when a card swipe starts                                                     |
| onSwipeEnd          | func           |               | function to be called when a card swipe ends (card is released)                                                      |
| onSwipedAll         | func           |               | function to be called when the last card is swiped                                            |
| onSwiped            | func           |               | function to be called when a card is swiped |                                              |
| onTap               | func           |               | function to be called when a card is tapped |                                              |
| onReset             | func           |               | function to be called when a card is released back to it's original position |                                              |
| onSwipedLeft        | func           |               | function to be called when a card swiped left |                                              |
| onSwipedRight       | func           |               | function to be called when a card is swiped right |                                              |
| onSwipedTop         | func           |               | function to be called when a card is swiped top |                                              |
| onSwipedBottom      | func           |               | function to be called when a card is swiped bottom |                                              |

## License

MIT
