import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import colors from '../../Styles/colors'
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig'

const ArtistListSection = ({ data }) => {
  
  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    return images[images.length - 1]?.url;
  };

  const renderItem = ({ item }) => (
      <View style={styles.artistRow}>
         <Image source={{ uri: getImageUrl(item.image) }} style={styles.artistRowImage} />
         <View style={styles.artistRowText}>
             <Text style={styles.rowTitle}>{item.name}</Text>
             <Text style={styles.rowSub}>1 Album  |  Songs: N/A</Text>
         </View>
         <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.SecondaryText} />
         </TouchableOpacity>
      </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default ArtistListSection

const styles = StyleSheet.create({
  listContent: { 
    paddingBottom: verticalScale(100), 
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10)
  },
  artistRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: verticalScale(20) 
  },
  artistRowImage: { 
    width: moderateScale(60), 
    height: moderateScale(60), 
    borderRadius: 100, // Circular
    backgroundColor: colors.LightGray 
  },
  artistRowText: { 
    flex: 1, 
    marginLeft: scale(15), 
    justifyContent: 'center' 
  },
  rowTitle: { 
    fontSize: textScale(16), 
    fontWeight: 'bold', 
    color: colors.Black, 
    marginBottom: 4 
  },
  rowSub: { 
    fontSize: textScale(12), 
    color: colors.SecondaryText, 
    fontWeight: '500' 
  },
})