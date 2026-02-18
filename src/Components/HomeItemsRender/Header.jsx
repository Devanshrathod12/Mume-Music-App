import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import colors from '../../Styles/colors'
import { scale, verticalScale, moderateScale, fontScale } from '../../Styles/StyleConfig'

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <Ionicons name="musical-notes" size={moderateScale(28)} color={colors.Primary} />
        <Text style={styles.logoText}>Mume</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="search-outline" size={moderateScale(24)} color={colors.HeadingColor} />
      </TouchableOpacity>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  logoText: { 
    fontSize: fontScale(22), 
    fontWeight: 'bold', 
    color: colors.HeadingColor, 
    marginLeft: scale(5) 
  },
})