// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
// import React from 'react'
// import Ionicons from '@react-native-vector-icons/ionicons'
// import colors from '../../Styles/colors'
// import { scale, verticalScale, moderateScale, fontScale } from '../../Styles/StyleConfig'
// import { useNavigation } from '@react-navigation/native'
// import NavigationString from '../../Navigation/NavigationString'

// const  Header = () => {
//   const navigation = useNavigation()
//   return (
//     <View style={styles.header}>
//       <View style={styles.logoRow}>
//         <Ionicons name="musical-notes" size={moderateScale(28)} color={colors.Primary} />
//         <Text style={styles.logoText}>Mume</Text>
//       </View>
//       <TouchableOpacity onPress={()=>navigation.navigate(NavigationString.SearchingScreen)} >
//         <Ionicons name="search-outline" size={moderateScale(24)} color={colors.HeadingColor} />
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default Header

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: scale(20),
//     marginTop: verticalScale(10),
//     marginBottom: verticalScale(10),
//   },
//   logoRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center' 
//   },
//   logoText: { 
//     fontSize: fontScale(22), 
//     fontWeight: 'bold', 
//     color: colors.HeadingColor, 
//     marginLeft: scale(5) 
//   },
// })
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import { useNavigation } from '@react-navigation/native'

// Theme & Config Imports
import { useTheme } from '../../Context/ThemeContext' // 👈 Theme Access
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig'
import NavigationString from '../../Navigation/NavigationString'

const Header = () => {
  const navigation = useNavigation()
  const { theme } = useTheme() // 👈 Theme data access

  return (
    <View style={[styles.header, { backgroundColor: theme.WhiteBackground }]}>
      <View style={styles.logoRow}>
        {/* Logo Icon - Hamesha Primary Orange rahega */}
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
          color={theme.HeadingColor} // 👈 Search icon ab text ke sath match karega
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
    alignItems: 'center', // Added for vertical alignment
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10), // Consolidated padding
  },
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  logoText: { 
    fontSize: textScale(22), // Using consistent textScale
    fontWeight: 'bold', 
    marginLeft: scale(8) 
  },
})