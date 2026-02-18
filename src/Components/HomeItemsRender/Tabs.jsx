import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '../../Styles/colors'
import { scale, verticalScale, textScale } from '../../Styles/StyleConfig'

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <View style={styles.tabsWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollTabs}>
        {tabs.map((tab, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
             <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
             {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default Tabs

const styles = StyleSheet.create({
  tabsWrapper: { 
    borderBottomWidth: 1, 
    borderBottomColor: colors.LightGray 
  },
  scrollTabs: { 
    paddingHorizontal: scale(10) 
  },
  tabItem: { 
    marginHorizontal: scale(12), 
    paddingBottom: verticalScale(10), 
    alignItems: 'center' 
  },
  tabText: { 
    fontSize: textScale(16), 
    fontWeight: '600', 
    color: colors.SecondaryText 
  },
  activeTabText: { 
    color: colors.Primary 
  },
  activeLine: { 
    position: 'absolute', 
    bottom: 0, 
    width: '60%', 
    height: 3, 
    backgroundColor: colors.Primary, 
    borderRadius: 2 
  },
})