import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
  

const SafeScreen = ({children}) => {
    const inset = useSafeAreaInsets();// save screen from being hidden from notch , curves, navigator etc

  return (
    <View
    style={{
        paddingTop:inset.top,
        flex:1,
        backgroundColor:COLORS.backgroundColor,
    }}>
      {children}
    </View>
  )
}

export default SafeScreen

