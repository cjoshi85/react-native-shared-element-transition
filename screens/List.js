import React from 'react';
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import MarketingSlider from "../components/MarketingSlider";
import { ICON_DATA } from "../config/travel";
import { SPACING } from "../config/theme";
import Icon from "../components/Icon";
import { SharedElement } from "react-navigation-shared-element";

export default function List({navigation}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <MarketingSlider/>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginVertical: 20}}>
        {ICON_DATA.map((item) => {
          return (
            <TouchableOpacity
              key={item.id}
              style={{padding: SPACING}}
              onPress={() => {
                navigation.push('Detail', {item})
              }}
            >
              <SharedElement id={`item.${item.id}.icon`}>
                <Icon uri={item.imageUri}/>
              </SharedElement>
            </TouchableOpacity>
          )
        })}
      </View>
    </SafeAreaView>
  )
}
