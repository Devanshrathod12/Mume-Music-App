// import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
// import React from 'react'
// import Ionicons from '@react-native-vector-icons/ionicons'
// import { useNavigation } from '@react-navigation/native' // 1. Import Navigation
// import colors from '../../Styles/colors'
// import { scale, verticalScale, textScale, width } from '../../Styles/StyleConfig'
// import NavigationString from '../../Navigation/NavigationString'

// const AlbamListSection = ({ data }) => {
//   const navigation = useNavigation(); // 2. Hook initialize

//   const getImageUrl = (images) => {
//     if (!images || images.length === 0) return 'https://via.placeholder.com/150';
//     const imgObj = images.find(img => img.quality === '500x500') || images.find(img => img.quality === '150x150') || images[images.length - 1];
//     return imgObj?.url;
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.gridItem}>
        
//         {/* 1. Image Click -> Navigate to Details */}
//         <TouchableOpacity 
//             activeOpacity={0.8}
//             onPress={() => navigation.navigate(NavigationString.AlbamSongList, { albumData: item })} 
//         >
//             <Image source={{ uri: getImageUrl(item.image) }} style={styles.gridImage} />
//         </TouchableOpacity>

//         {/* 2. Text + Dots */}
//         <View style={styles.infoRow}>
//             <View style={styles.gridTextContainer}>
//                 <Text style={styles.gridTitle} numberOfLines={1}>{item.name}</Text>
//                 <Text style={styles.gridSub} numberOfLines={1}>
//                     {item.language || 'Music'}  •  {item.year || '2023'}
//                 </Text>
//             </View>
//             <TouchableOpacity style={styles.gridMenuBtn}>
//                 <Ionicons name="ellipsis-vertical" size={18} color={colors.SecondaryText} />
//             </TouchableOpacity>
//         </View>

//     </View>
//   );

//   return (
//     <FlatList
//         data={data}
//         numColumns={2}
//         key={'albums-grid'}
//         renderItem={renderItem}
//         columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: scale(20) }}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//     />
//   )
// }

// export default AlbamListSection

// const styles = StyleSheet.create({
//   listContent: {
//     paddingBottom: verticalScale(100), 
//     paddingTop: verticalScale(10) 
//   },
//   gridItem: { 
//     width: (width / 2) - scale(28), 
//     marginBottom: verticalScale(20) 
//   },
//   gridImage: { 
//     width: '100%', 
//     aspectRatio: 1, 
//     borderRadius: 20, 
//     marginBottom: verticalScale(10), 
//     backgroundColor: colors.LightGray 
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center', 
//   },
//   gridTextContainer: { 
//     flex: 1, 
//     marginRight: scale(5) 
//   },
//   gridTitle: { 
//     fontSize: textScale(15), 
//     fontWeight: '700', 
//     color: colors.Black, 
//     marginBottom: 2 
//   },
//   gridSub: { 
//     fontSize: textScale(11), 
//     color: colors.SecondaryText,
//     textTransform: 'capitalize' 
//   },
//   gridMenuBtn: { 
//     padding: 5,
//   },
// })
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import { useNavigation } from '@react-navigation/native'

// Theme & Config Imports
import { useTheme } from '../../Context/ThemeContext'
import { scale, verticalScale, textScale, width } from '../../Styles/StyleConfig'
import NavigationString from '../../Navigation/NavigationString'

const AlbamListSection = ({ data }) => {
  const navigation = useNavigation();
  const { theme } = useTheme(); // 👈 Theme data access

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    const imgObj = images.find(img => img.quality === '500x500') || images.find(img => img.quality === '150x150') || images[images.length - 1];
    return imgObj?.url;
  };

  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
        
        {/* 1. Image Click -> Navigate to Details */}
        <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.navigate(NavigationString.AlbamSongList, { albumData: item })} 
        >
            <Image 
              source={{ uri: getImageUrl(item.image) }} 
              style={[styles.gridImage, { backgroundColor: theme.LightGray }]} 
            />
        </TouchableOpacity>

        {/* 2. Text + Dots Row */}
        <View style={styles.infoRow}>
            <View style={styles.gridTextContainer}>
                <Text style={[styles.gridTitle, { color: theme.HeadingColor }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.gridSub, { color: theme.SecondaryText }]} numberOfLines={1}>
                    {item.language || 'Music'}  •  {item.year || '2023'}
                </Text>
            </View>
            <TouchableOpacity style={styles.gridMenuBtn}>
                <Ionicons name="ellipsis-vertical" size={18} color={theme.SecondaryText} />
            </TouchableOpacity>
        </View>

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
        // Taaki scroll karte waqt background ke saath match kare
        backgroundColor={theme.WhiteBackground} 
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
    width: (width / 2) - scale(28), 
    marginBottom: verticalScale(20) 
  },
  gridImage: { 
    width: '100%', 
    aspectRatio: 1, 
    borderRadius: 20, 
    marginBottom: verticalScale(10), 
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  gridTextContainer: { 
    flex: 1, 
    marginRight: scale(5) 
  },
  gridTitle: { 
    fontSize: textScale(15), 
    fontWeight: '700', 
    marginBottom: 2 
  },
  gridSub: { 
    fontSize: textScale(11), 
    textTransform: 'capitalize' 
  },
  gridMenuBtn: { 
    padding: 5,
  },
})