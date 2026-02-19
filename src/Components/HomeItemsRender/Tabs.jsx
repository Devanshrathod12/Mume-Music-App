// import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
// import React from 'react'
// import colors from '../../Styles/colors'
// import { scale, verticalScale, textScale } from '../../Styles/StyleConfig'

// const Tabs = ({ activeTab, setActiveTab, tabs }) => {
//   return (
//     <View style={styles.tabsContainer}>
//       {/* 1. Yeh hai woh continuous gray line jo background mein rahegi */}
//       <View style={styles.backgroundLine} />

//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false} 
//         contentContainerStyle={styles.scrollTabs}
//       >
//         {tabs && tabs.map((tab, index) => {
//           const isActive = activeTab === tab;
//           return (
//             <TouchableOpacity 
//               key={index} 
//               style={styles.tabItem}
//               onPress={() => setActiveTab(tab)}
//               activeOpacity={0.7}
//             >
//               <Text style={[styles.tabText, isActive && styles.activeTabText]}>
//                 {tab}
//               </Text>
              
//               {/* 2. Yeh orange line sirf active tab ke liye hai */}
//               {isActive && <View style={styles.activeLineIndicator} />}
//             </TouchableOpacity>
//           )
//         })}
//       </ScrollView>
//     </View>
//   )
// }

// export default Tabs

// const styles = StyleSheet.create({
//   tabsContainer: { 
//     backgroundColor: colors.WhiteBackground,
//     position: 'relative', // Background line ko position karne ke liye
//   },
//   backgroundLine: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: scale(1.5), // Patli gray line
//     backgroundColor: "#ff6a0021", // Pure width par gray line
//   },
//   scrollTabs: { 
//     paddingHorizontal: scale(10) 
//   },
//   tabItem: { 
//     marginHorizontal: scale(12), 
//     paddingBottom: verticalScale(12), 
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabText: { 
//     fontSize: textScale(16), 
//     fontWeight: '600', 
//     color: colors.SecondaryText 
//   },
//   activeTabText: { 
//     color: colors.Primary // Orange color
//   },
//   activeLineIndicator: { 
//     position: 'absolute', 
//     bottom: 0, 
//     width: '100%', 
//     height: 3, // Thodi moti orange line
//     backgroundColor: colors.Primary, 
//     borderRadius: 2,
//     zIndex: 1, // Gray line ke upar dikhne ke liye
//   },
// })
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'

// Theme & Config
import { useTheme } from '../../Context/ThemeContext' // 👈 Theme Access
import { scale, verticalScale, textScale } from '../../Styles/StyleConfig'

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  const { theme } = useTheme(); // 👈 Context se theme liya

  return (
    <View style={[styles.tabsContainer, { backgroundColor: theme.WhiteBackground }]}>
      
      {/* 1. Background Line: Jo poori width par dikhti hai */}
      <View style={[styles.backgroundLine, { backgroundColor: theme.Separator }]} />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollTabs}
      >
        {tabs && tabs.map((tab, index) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.tabItem}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText, 
                { color: isActive ? theme.Primary : theme.SecondaryText }
              ]}>
                {tab}
              </Text>
              
              {/* 2. Active Indicator: Orange line sirf active tab ke liye */}
              {isActive && (
                <View style={[styles.activeLineIndicator, { backgroundColor: theme.Primary }]} />
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default Tabs

const styles = StyleSheet.create({
  tabsContainer: { 
    position: 'relative', 
  },
  backgroundLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(1.5), 
  },
  scrollTabs: { 
    paddingHorizontal: scale(10) 
  },
  tabItem: { 
    marginHorizontal: scale(12), 
    paddingBottom: verticalScale(12), 
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: { 
    fontSize: textScale(16), 
    fontWeight: '600', 
  },
  activeLineIndicator: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: 3, 
    borderRadius: 2,
    zIndex: 1, 
  },
})