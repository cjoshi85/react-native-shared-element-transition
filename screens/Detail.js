import React from 'react';
import { SafeAreaView, View, TouchableOpacity, FlatList, ScrollView, Text, Animated } from 'react-native';
import { ICON_DATA } from "../config/travel";
import BackIcon from "../components/BackIcon";
import { ICON_SIZE, SPACING, width } from "../config/theme";
import Icon from "../components/Icon";
import { SharedElement } from "react-navigation-shared-element";

const Detail = ({navigation, route}) => {
  const {item} = route.params;
  const ref = React.useRef();
  const selectedItemIndex = ICON_DATA.findIndex(i => i.id == item.id);
  const mountedAnimated = React.useRef(new Animated.Value(0)).current;
  const activeIndex = React.useRef(new Animated.Value(selectedItemIndex)).current;
  const activeIndexAnimation = React.useRef(new Animated.Value(selectedItemIndex)).current;

  const animation = (toValue, delay) => (
    Animated.timing(mountedAnimated, {
      toValue,
      duration: 500,
      delay,
      useNativeDriver: true
    })
  );
  React.useEffect(() => {
    console.log('component didmount');
    Animated.parallel([
      Animated.timing(activeIndexAnimation, {
        toValue: activeIndex,
        duration: 300,
        useNativeDriver: true
      }),
      animation(1, 500)
    ]).start(() => console.log('Fired Event'));
  }, []);
  console.log({mountedAnimated});
  const translateY = mountedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });
  const size = ICON_SIZE + SPACING * 2;
  const translateX = activeIndexAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [size, 0, -size]
  })
  return (
    <SafeAreaView style={{flex: 1}}>
      <BackIcon onPress={() => {
        animation(0).start(() => {
          navigation.goBack()
        });
      }}/>
      <Animated.View style={{
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginVertical: 20,
        marginLeft: width / 2 - ICON_SIZE / 2 - SPACING,
        transform: [{translateX}],
        overflow: 'visible'
      }}>
        {ICON_DATA.map((item, index) => {
          const inputRange = [index - 1, index, index + 1];
          const opacity = activeIndexAnimation.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          })
          return (
            <TouchableOpacity style={{padding: SPACING,}} key={item.id} onPress={() => {
              console.log('On pressed');
              activeIndex.setValue(index)
              ref.current.scrollToIndex({
                index,
                animated: true
              })
            }}>
              <Animated.View style={{opacity, alignItems: 'center'}}>
                <SharedElement id={`item.${item.id}.icon`}>
                  <Icon uri={item.imageUri}/>
                </SharedElement>
                <Text style={{fontSize: 10}}>{item.title}</Text>
              </Animated.View>
            </TouchableOpacity>
          )
        })}
      </Animated.View>
      <Animated.FlatList
        style={{opacity: mountedAnimated, transform: [{translateY}]}}
        ref={ref}
        data={ICON_DATA}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        initialScrollIndex={selectedItemIndex}
        nestedScrollEnabled
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev => {
          const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
          console.log({newIndex}, ev.nativeEvent.contentOffset.x, width);
          activeIndex.setValue(newIndex);
        }}
        renderItem={({item}) => {
          return (
            <ScrollView style={{
              width: width - SPACING * 2,
              margin: SPACING,
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: 16
            }}>
              <View style={{padding: SPACING}}>
                <Text style={{fontSize: 16}}>{Array(50).fill(`${item.title} inner text \n`)}</Text>
              </View>
            </ScrollView>
          )
        }}
      />
    </SafeAreaView>
  )
};

Detail.sharedElements = (route, otherRoute, showing) => {
  return ICON_DATA.map(item => `item.${item.id}.icon`);
  // const {item} = route.params;
  // return [`item.${item.id}.icon`];
}

export default Detail;
