import React from 'react';
import { AntDesign } from '@expo/vector-icons';

export default function BackIcon({onPress}) {
  return (
    <AntDesign
      name='arrowleft'
      size={24}
      style={{padding: 12}}
      color='#333'
      onPress={onPress}
    />
  )
}
