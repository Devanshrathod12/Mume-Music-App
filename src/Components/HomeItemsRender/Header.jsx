
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import { useNavigation } from '@react-navigation/native'

import { useTheme } from '../../Context/ThemeContext'
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig'
import NavigationString from '../../Navigation/NavigationString'

const Header = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()

  return (
    <View style={[styles.header, { backgroundColor: theme.WhiteBackground }]}>
      <View style={styles.logoRow}>
        <Ionicons name="musical-notes" size={moderateScale(28)} color={theme.Primary} />
        <Text style={[styles.logoText, { color: theme.HeadingColor }]}>Mume</Text>
      </View>

      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => navigation.navigate(NavigationString.SearchingScreen)} 
      >
        <Ionicons 
          name="search-outline" 
          size={moderateScale(24)} 
          color={theme.HeadingColor} 
        />
      </TouchableOpacity>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10), 
  },
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  logoText: { 
    fontSize: textScale(22),
    fontWeight: 'bold', 
    marginLeft: scale(8) 
  },
})