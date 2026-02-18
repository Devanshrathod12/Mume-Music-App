import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import colors from '../../Styles/colors'
import { scale, verticalScale, textScale, width } from '../../Styles/StyleConfig'

const AlbamListSection = ({ data }) => {
    console.log(data,"Albam ka data")
  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    const imgObj = images.find(img => img.quality === '500x500') || images[images.length - 1];
    return imgObj?.url;
  };

  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
        <Image source={{ uri: getImageUrl(item.image) }} style={styles.gridImage} />
        <View style={styles.gridTextContainer}>
            <Text style={styles.gridTitle} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.gridSub} numberOfLines={1}>{item.language || 'Music'} | {item.year || '2023'}</Text>
            <Text style={styles.gridSubSmall}>Top Hits</Text>
        </View>
        <TouchableOpacity style={styles.gridMenu}>
            <Ionicons name="ellipsis-vertical" size={16} color={colors.SecondaryText} />
        </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
        data={data}
        numColumns={2}
        key={'albums-grid'}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: scale(20) }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
    />
  )
}

export default AlbamListSection

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: verticalScale(100), 
    paddingTop: verticalScale(10) 
  },
  gridItem: { 
    width: (width - scale(50)) / 2, 
    marginBottom: verticalScale(20) 
  },
  gridImage: { 
    width: '100%', 
    aspectRatio: 1, 
    borderRadius: 20, 
    marginBottom: verticalScale(10), 
    backgroundColor: colors.LightGray 
  },
  gridTextContainer: { 
    paddingRight: scale(10) 
  },
  gridTitle: { 
    fontSize: textScale(16), 
    fontWeight: 'bold', 
    color: colors.Black, 
    marginBottom: 2 
  },
  gridSub: { 
    fontSize: textScale(12), 
    color: colors.SecondaryText 
  },
  gridSubSmall: { 
    fontSize: textScale(10), 
    color: colors.SecondaryText, 
    marginTop: 2 
  },
  gridMenu: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    backgroundColor: 'rgba(255,255,255,0.7)', 
    padding: 4, 
    borderRadius: 20 
  },
})