
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'

// Theme & Config
import { useTheme } from '../../Context/ThemeContext' 
import { scale, verticalScale, textScale } from '../../Styles/StyleConfig'

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  const { theme } = useTheme(); 

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
    marginTop:verticalScale(8)
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