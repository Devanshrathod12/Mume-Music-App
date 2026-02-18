// import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
// import React from 'react'
// import Ionicons from '@react-native-vector-icons/ionicons';
// import colors from '../../Styles/colors'
// import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig'

// // Import Hooks
// import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

// const SongListSection = ({ data }) => {
  
//   // Track Player Hooks
//   const activeTrack = useActiveTrack(); 
//   const { playing } = useIsPlaying();   
  
//   // 1. IMAGE URL HELPER
//   const getImageUrl = (images) => {
//     if (!images || images.length === 0) return 'https://via.placeholder.com/150';
//     const imgObj = images.find(img => img.quality === '500x500') || images[images.length - 1];
//     return imgObj?.url;
//   };

//   // 2. AUDIO URL HELPER (Extract last item from downloadUrl array)
//   const getAudioUrl = (item) => {
//     if (!item?.downloadUrl || item.downloadUrl.length === 0) return null;
//     return item.downloadUrl[item.downloadUrl.length - 1]?.url;
//   };

//   // 3. SUBTITLE HELPER
//   const getSubtitle = (item) => {
//     const artistNames = item?.artists?.primary?.map(a => a.name).join(', ') || item.artist || "Unknown";
//     const duration = item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : "03:00";
//     return `${artistNames}  |  ${duration} mins`;
//   };

//   // 4. MAIN PLAY LOGIC
//   const handlePlayPause = async (item) => {
//       const trackUrl = getAudioUrl(item);
      
//       if (!trackUrl) {
//           console.log("No audio URL found");
//           return;
//       }

//       // Check: Is this song already playing?
//       if (activeTrack?.id === item.id) {
//           if (playing) {
//               await TrackPlayer.pause();
//           } else {
//               await TrackPlayer.play();
//           }
//       } 
//       // Play NEW Song
//       else {
//           try {
//             await TrackPlayer.reset(); 
//             await TrackPlayer.add({
//                 id: item.id,
//                 url: trackUrl,
//                 title: item.name,
//                 artist: item?.artists?.primary?.[0]?.name || "Unknown",
//                 artwork: getImageUrl(item.image),
//             });
//             await TrackPlayer.play();
//           } catch (error) {
//             console.log("Error playing track:", error);
//           }
//       }
//   };

//   const renderItem = ({ item }) => {
//     const isActive = activeTrack?.id === item.id;
//     const iconName = isActive && playing ? "pause-circle" : "play-circle";

//     return (
//       <View style={[styles.songRow, isActive && { backgroundColor: '#F3F4F6', borderRadius: 12 }]}>
         
//          <Image source={{ uri: getImageUrl(item.image) }} style={styles.songRowImage} />
         
//          <View style={styles.songRowText}>
//              <Text 
//                 style={[styles.rowTitle, isActive && { color: colors.Primary }]} 
//                 numberOfLines={1}
//              >
//                  {item.name}
//              </Text>
//              <Text style={styles.rowSub} numberOfLines={1}>{getSubtitle(item)}</Text>
//          </View>

//          <View style={styles.songActions}>
//               <TouchableOpacity onPress={() => handlePlayPause(item)}>
//                   <Ionicons name={iconName} size={32} color={colors.Primary} />
//               </TouchableOpacity>
              
//               <TouchableOpacity style={{ marginLeft: scale(10) }}>
//                   <Ionicons name="ellipsis-vertical" size={20} color={colors.SecondaryText} />
//               </TouchableOpacity>
//          </View>
//       </View>
//     );
//   };

//   return (
//     <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//     />
//   )
// }

// export default SongListSection

// const styles = StyleSheet.create({
//   listContent: { 
//     paddingBottom: verticalScale(100), 
//     paddingHorizontal: scale(20),
//     paddingTop: verticalScale(10)
//   },
//   songRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: verticalScale(20),
//     padding: scale(5)
//   },
//   songRowImage: { 
//     width: moderateScale(55), 
//     height: moderateScale(55), 
//     borderRadius: 15, 
//     backgroundColor: colors.LightGray 
//   },
//   songRowText: { 
//     flex: 1, 
//     marginLeft: scale(15), 
//     justifyContent: 'center' 
//   },
//   songActions: { 
//     flexDirection: 'row', 
//     alignItems: 'center' 
//   },
//   rowTitle: { 
//     fontSize: textScale(16), 
//     fontWeight: 'bold', 
//     color: colors.Black, 
//     marginBottom: 4 
//   },
//   rowSub: { 
//     fontSize: textScale(12), 
//     color: colors.SecondaryText, 
//     fontWeight: '500' 
//   },
// // }) // song esme cha rhaihai hai 