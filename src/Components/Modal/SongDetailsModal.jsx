// // import React, { useRef, useEffect, useState } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   Animated,
// //   Modal,
// //   Image,
// //   PanResponder,
// //   ScrollView,
// //   Dimensions
// // } from 'react-native';
// // import Ionicons from '@react-native-vector-icons/ionicons';
// // import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig';
// // import colors from '../../Styles/colors';

// // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // const SongDetailsModal = ({ visible, onClose, song, onPlayNext }) => {
// //   const [isLiked, setIsLiked] = useState(false);
  
// //   // Animation Values
// //   const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
// //   const translateY = useRef(new Animated.Value(0)).current;

// //   // 1. Open/Close Animation
// //   useEffect(() => {
// //     if (visible) {
// //       Animated.timing(slideAnim, {
// //         toValue: 0,
// //         duration: 300,
// //         useNativeDriver: true,
// //       }).start();
      
// //       // Reset drag & like state
// //       translateY.setValue(0);
// //       setIsLiked(false);
// //     } else {
// //       Animated.timing(slideAnim, {
// //         toValue: SCREEN_HEIGHT,
// //         duration: 300,
// //         useNativeDriver: true,
// //       }).start();
// //     }
// //   }, [visible]);

// //   // 2. FIXED PAN RESPONDER (Same logic as Artist Modal)
// //   const panResponder = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => true,

// //       onPanResponderGrant: () => {
// //         translateY.setValue(0);
// //       },

// //       // IMPORTANT FIX HERE:
// //       onPanResponderMove: (e, gestureState) => {
// //         if (gestureState.dy > 0) {
// //            // Sirf neeche drag allow karo (Positive Y)
// //            translateY.setValue(gestureState.dy);
// //         } else {
// //            // Upar mat jane do (Lock at 0)
// //            translateY.setValue(0);
// //         }
// //       },

// //       onPanResponderRelease: (_, gestureState) => {
// //         // Agar jyada niche khicha ya fast swipe kiya
// //         if (gestureState.dy > 120 || gestureState.vy > 1.5) {
// //             closeWithAnimation();
// //         } else {
// //             // Wapas bounce back (Snap to top)
// //             Animated.spring(translateY, {
// //               toValue: 0,
// //               bounciness: 5,
// //               useNativeDriver: true,
// //             }).start();
// //         }
// //       },
// //     })
// //   ).current;

// //   const closeWithAnimation = () => {
// //     Animated.timing(translateY, {
// //         toValue: SCREEN_HEIGHT,
// //         duration: 250,
// //         useNativeDriver: true,
// //     }).start(() => {
// //         onClose();
// //         // Reset transform
// //         translateY.setValue(0); 
// //     });
// //   };

// //   // Helper Functions
// //   const getImageUrl = (img) => {
// //     if (!img) return 'https://via.placeholder.com/150';
// //     return Array.isArray(img) ? (img.find(i => i.quality === '500x500')?.url || img[img.length-1]?.url) : img;
// //   };

// //   const getSubtitle = () => {
// //     if(!song) return "";
// //     const artist = song.artists?.primary?.[0]?.name || song.artist || "Unknown";
// //     const duration = song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')} mins` : "";
// //     return `${artist}  |  ${duration}`;
// //   };

// //   // Menu Items
// //   const menuItems = [
// //     { title: "Play Next", icon: "arrow-forward-circle-outline", action: () => { onPlayNext(song); onClose(); } },
// //     { title: "Add to Playing Queue", icon: "albums-outline" },
// //     { title: "Add to Playlist", icon: "add-circle-outline" },
// //     { title: "Go to Album", icon: "disc-outline" },
// //     { title: "Go to Artist", icon: "person-outline" },
// //     { title: "Details", icon: "information-circle-outline" },
// //     { title: "Set as Ringtone", icon: "call-outline" },
// //     { title: "Add to Blacklist", icon: "close-circle-outline" },
// //     { title: "Share", icon: "paper-plane-outline" },
// //     { title: "Delete from Device", icon: "trash-outline" },
// //   ];

// //   if (!song) return null;

// //   return (
// //     <Modal visible={visible} transparent animationType="none" onRequestClose={closeWithAnimation}>
      
// //       {/* Black Transparent Overlay */}
// //       <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeWithAnimation} />

// //       {/* Main DragSheet Container */}
// //       <Animated.View 
// //         style={[
// //             styles.modalContainer,
// //             // SlideIn Animation + Drag Gesture Animation
// //             { transform: [{ translateY: Animated.add(slideAnim, translateY) }] }
// //         ]}
// //       >
// //           {/* Header Area (With Gesture Handler) */}
// //           <View {...panResponder.panHandlers} style={styles.dragHeader}>
// //                {/* Grey Drag Handle */}
// //                <View style={styles.dragHandle} />
               
// //                {/* Song Info Row */}
// //                <View style={styles.songHeader}>
// //                    {/* Image */}
// //                    <Image 
// //                       source={{ uri: getImageUrl(song.image) }} 
// //                       style={styles.headerImage} 
// //                    />
                   
// //                    {/* Text */}
// //                    <View style={styles.headerTextContainer}>
// //                         <Text style={styles.songTitle} numberOfLines={1}>{song.name}</Text>
// //                         <Text style={styles.songSub} numberOfLines={1}>{getSubtitle()}</Text>
// //                    </View>

// //                    {/* Heart Icon Toggle */}
// //                    <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
// //                        <Ionicons 
// //                          name={isLiked ? "heart" : "heart-outline"} 
// //                          size={moderateScale(28)} 
// //                          color={isLiked ? "#E11D48" : colors.Black}
// //                        />
// //                    </TouchableOpacity>
// //                </View>

// //                <View style={styles.divider} />
// //           </View>

// //           {/* Options Scroll List */}
// //           <ScrollView 
// //             contentContainerStyle={styles.scrollContent} 
// //             showsVerticalScrollIndicator={false}
// //             bounces={false} // List bounce disable kiya taaki modal smooth feel ho
// //           >
// //               {menuItems.map((item, index) => (
// //                   <TouchableOpacity 
// //                     key={index} 
// //                     style={styles.menuRow}
// //                     onPress={() => item.action && item.action()}
// //                     activeOpacity={0.6}
// //                   >
// //                       <Ionicons name={item.icon} size={moderateScale(24)} color={colors.HeadingColor} style={styles.menuIcon} />
// //                       <Text style={styles.menuText}>{item.title}</Text>
// //                   </TouchableOpacity>
// //               ))}
// //           </ScrollView>

// //       </Animated.View>
// //     </Modal>
// //   );
// // };

// // export default SongDetailsModal;

// // const styles = StyleSheet.create({
// //   overlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalContainer: {
// //     height: '80%', // Ye 80% fixed rahegi
// //     width: '100%',
// //     backgroundColor: '#FFFFFF',
// //     borderTopLeftRadius: scale(30),
// //     borderTopRightRadius: scale(30),
// //     position: 'absolute',
// //     bottom: 0,
// //     overflow: 'hidden', 
// //   },
// //   dragHeader: {
// //     paddingHorizontal: scale(25),
// //     paddingTop: verticalScale(15),
// //     backgroundColor: '#FFFFFF',
// //     zIndex: 1,
// //   },
// //   dragHandle: {
// //     width: scale(50),
// //     height: scale(5),
// //     backgroundColor: '#E2E8F0',
// //     borderRadius: scale(10),
// //     alignSelf: 'center',
// //     marginBottom: verticalScale(20),
// //   },
// //   songHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: verticalScale(20),
// //   },
// //   headerImage: {
// //     width: moderateScale(60),
// //     height: moderateScale(60),
// //     borderRadius: scale(12),
// //     backgroundColor: colors.LightGray
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //     marginLeft: scale(15),
// //     justifyContent: 'center',
// //     paddingRight: scale(10)
// //   },
// //   songTitle: {
// //     fontSize: textScale(18),
// //     fontWeight: '700',
// //     color: colors.HeadingColor,
// //     marginBottom: verticalScale(2)
// //   },
// //   songSub: {
// //     fontSize: textScale(12),
// //     color: '#64748B', 
// //     fontWeight: '500'
// //   },
// //   divider: {
// //     height: 1,
// //     backgroundColor: '#F1F5F9', 
// //     width: '100%',
// //     marginBottom: verticalScale(10)
// //   },
// //   scrollContent: {
// //       paddingHorizontal: scale(25),
// //       paddingBottom: verticalScale(50),
// //   },
// //   menuRow: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       paddingVertical: verticalScale(14),
// //   },
// //   menuIcon: {
// //       marginRight: scale(15),
// //       color: colors.HeadingColor,
// //   },
// //   menuText: {
// //       fontSize: textScale(16),
// //       fontWeight: '500',
// //       color: colors.HeadingColor
// //   }
// // });
// import React, { useRef, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Animated,
//   Modal,
//   Image,
//   PanResponder,
//   ScrollView,
//   Dimensions
// } from 'react-native';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig';
// import colors from '../../Styles/colors';

// // Redux Integration
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleFavorite, addSongToPlaylist } from '../../redux/musicSlice';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// const SongDetailsModal = ({ visible, onClose, song, onPlayNext }) => {
//   const dispatch = useDispatch();
  
//   // Redux se favorites list nikaali taaki heart icon ka state pata chale
//   const favorites = useSelector(state => state.music.favorites);
//   const playlists = useSelector(state => state.music.playlists);

//   // Check if current song is in favorites
//   const isLiked = song ? favorites.some(fav => fav.id === song.id) : false;

//   // Animation Values
//   const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
//   const translateY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//       translateY.setValue(0);
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: SCREEN_HEIGHT,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         translateY.setValue(0);
//       },
//       onPanResponderMove: (e, gestureState) => {
//         if (gestureState.dy > 0) {
//           translateY.setValue(gestureState.dy);
//         } else {
//           translateY.setValue(0);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 120 || gestureState.vy > 1.5) {
//           closeWithAnimation();
//         } else {
//           Animated.spring(translateY, {
//             toValue: 0,
//             bounciness: 5,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   const closeWithAnimation = () => {
//     Animated.timing(translateY, {
//       toValue: SCREEN_HEIGHT,
//       duration: 250,
//       useNativeDriver: true,
//     }).start(() => {
//       onClose();
//       translateY.setValue(0);
//     });
//   };

//   // Helper Functions
//   const getImageUrl = (img) => {
//     if (!img) return 'https://via.placeholder.com/150';
//     return Array.isArray(img) ? (img.find(i => i.quality === '500x500')?.url || img[img.length - 1]?.url) : img;
//   };

//   const getSubtitle = () => {
//     if (!song) return "";
//     const artist = song.artists?.primary?.[0]?.name || song.artist || "Unknown";
//     const duration = song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')} mins` : "";
//     return `${artist}  |  ${duration}`;
//   };

//   // Logic: Favorite Toggle
//   const handleFavoritePress = () => {
//     dispatch(toggleFavorite(song));
//   };

//   // Logic: Add to Playlist
//   const handleAddToPlaylist = () => {
//     if (playlists.length > 0) {
//       // Pehli available playlist mein add kar rahe hain (aap ise baad mein popup se change kar sakte hain)
//       dispatch(addSongToPlaylist({ playlistName: playlists[0].name, song: song }));
//       alert(`Added to ${playlists[0].name}`);
//     } else {
//       alert("No playlists found. Please create one first.");
//     }
//     onClose();
//   };

//   const menuItems = [
//     { title: "Play Next", icon: "arrow-forward-circle-outline", action: () => { onPlayNext(song); onClose(); } },
//     { title: "Add to Playing Queue", icon: "albums-outline" },
//     { title: "Add to Playlist", icon: "add-circle-outline", action: handleAddToPlaylist },
//     { title: "Go to Album", icon: "disc-outline" },
//     { title: "Go to Artist", icon: "person-outline" },
//     { title: "Details", icon: "information-circle-outline" },
//     { title: "Set as Ringtone", icon: "call-outline" },
//     { title: "Add to Blacklist", icon: "close-circle-outline" },
//     { title: "Share", icon: "paper-plane-outline" },
//     { title: "Delete from Device", icon: "trash-outline" },
//   ];

//   if (!song) return null;

//   return (
//     <Modal visible={visible} transparent animationType="none" onRequestClose={closeWithAnimation}>
//       <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeWithAnimation} />

//       <Animated.View
//         style={[
//           styles.modalContainer,
//           { transform: [{ translateY: Animated.add(slideAnim, translateY) }] }
//         ]}
//       >
//         <View {...panResponder.panHandlers} style={styles.dragHeader}>
//           <View style={styles.dragHandle} />

//           <View style={styles.songHeader}>
//             <Image
//               source={{ uri: getImageUrl(song.image) }}
//               style={styles.headerImage}
//             />

//             <View style={styles.headerTextContainer}>
//               <Text style={styles.songTitle} numberOfLines={1}>{song.name}</Text>
//               <Text style={styles.songSub} numberOfLines={1}>{getSubtitle()}</Text>
//             </View>

//             {/* Heart Icon linked to Redux */}
//             <TouchableOpacity onPress={handleFavoritePress}>
//               <Ionicons
//                 name={isLiked ? "heart" : "heart-outline"}
//                 size={moderateScale(28)}
//                 color={isLiked ? "#E11D48" : colors.Black}
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.divider} />
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           bounces={false}
//         >
//           {menuItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.menuRow}
//               onPress={() => item.action && item.action()}
//               activeOpacity={0.6}
//             >
//               <Ionicons name={item.icon} size={moderateScale(24)} color={colors.HeadingColor} style={styles.menuIcon} />
//               <Text style={styles.menuText}>{item.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </Animated.View>
//     </Modal>
//   );
// };

// export default SongDetailsModal;

// const styles = StyleSheet.create({
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
//   modalContainer: {
//     height: '80%',
//     width: '100%',
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: scale(30),
//     borderTopRightRadius: scale(30),
//     position: 'absolute',
//     bottom: 0,
//     overflow: 'hidden',
//   },
//   dragHeader: {
//     paddingHorizontal: scale(25),
//     paddingTop: verticalScale(15),
//     backgroundColor: '#FFFFFF',
//     zIndex: 1,
//   },
//   dragHandle: {
//     width: scale(50),
//     height: scale(5),
//     backgroundColor: '#E2E8F0',
//     borderRadius: scale(10),
//     alignSelf: 'center',
//     marginBottom: verticalScale(20),
//   },
//   songHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: verticalScale(20),
//   },
//   headerImage: {
//     width: moderateScale(60),
//     height: moderateScale(60),
//     borderRadius: scale(12),
//     backgroundColor: colors.LightGray
//   },
//   headerTextContainer: {
//     flex: 1,
//     marginLeft: scale(15),
//     justifyContent: 'center',
//     paddingRight: scale(10)
//   },
//   songTitle: {
//     fontSize: textScale(18),
//     fontWeight: '700',
//     color: colors.HeadingColor,
//     marginBottom: verticalScale(2)
//   },
//   songSub: {
//     fontSize: textScale(12),
//     color: '#64748B',
//     fontWeight: '500'
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#F1F5F9',
//     width: '100%',
//     marginBottom: verticalScale(10)
//   },
//   scrollContent: {
//     paddingHorizontal: scale(25),
//     paddingBottom: verticalScale(50),
//   },
//   menuRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: verticalScale(14),
//   },
//   menuIcon: {
//     marginRight: scale(15),
//     color: colors.HeadingColor,
//   },
//   menuText: {
//     fontSize: textScale(16),
//     fontWeight: '500',
//     color: colors.HeadingColor
//   }
// });
import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Modal,
  Image,
  PanResponder,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../Context/ThemeContext';
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, addSongToPlaylist } from '../../redux/musicSlice';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SongDetailsModal = ({ visible, onClose, song, onPlayNext }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  const favorites = useSelector(state => state.music.favorites);
  const playlists = useSelector(state => state.music.playlists);
  const isLiked = song ? favorites.some(fav => fav.id === song.id) : false;

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      translateY.setValue(0);
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setValue(0);
      },
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        } else {
          translateY.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 1.5) {
          closeWithAnimation();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const closeWithAnimation = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      translateY.setValue(0);
    });
  };

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    return Array.isArray(img) ? (img.find(i => i.quality === '500x500')?.url || img[img.length - 1]?.url) : img;
  };

  const getSubtitle = () => {
    if (!song) return "";
    const artist = song.artists?.primary?.[0]?.name || song.artist || "Unknown";
    const duration = song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')} mins` : "";
    return `${artist}  |  ${duration}`;
  };

  const handleFavoritePress = () => {
    dispatch(toggleFavorite(song));
  };

  const handleAddToPlaylist = () => {
    if (playlists.length > 0) {
      dispatch(addSongToPlaylist({ playlistName: playlists[0].name, song: song }));
      Alert.alert("Success", `Added to ${playlists[0].name}`);
    } else {
      Alert.alert("Notice", "No playlists found. Please create one first.");
    }
    onClose();
  };

  const handleDownload = async () => {
    try {
        if (!song.downloadUrl || song.downloadUrl.length === 0) {
            Alert.alert("Error", "Download link not available.");
            return;
        }

        const downloadUrl = song.downloadUrl[song.downloadUrl.length - 1].url;
        const fileName = `${song.id}.mp3`;
        const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        Alert.alert("Download Started", "Check Library later.");

        const options = {
            fromUrl: downloadUrl,
            toFile: localPath,
            background: true,
        };

        const result = await RNFS.downloadFile(options).promise;

        if (result.statusCode === 200) {
            const existingRaw = await AsyncStorage.getItem('offline_songs');
            let offlineSongs = existingRaw ? JSON.parse(existingRaw) : [];

            if (!offlineSongs.find(s => s.id === song.id)) {
                const downloadedSong = {
                    ...song,
                    localPath: localPath,
                    isOffline: true,
                    savedAt: new Date().getTime()
                };
                offlineSongs.push(downloadedSong);
                await AsyncStorage.setItem('offline_songs', JSON.stringify(offlineSongs));
            }
            Alert.alert("Success", "Song downloaded successfully!");
        }
    } catch (error) {
        Alert.alert("Error", "Download failed.");
    }
  };

  const menuItems = [
    { title: "Play Next", icon: "arrow-forward-circle-outline", action: () => { onPlayNext(song); onClose(); } },
    { title: "Add to Playing Queue", icon: "albums-outline" },
    { title: "Add to Playlist", icon: "add-circle-outline", action: handleAddToPlaylist },
    { title: "Go to Album", icon: "disc-outline" },
    { title: "Download for Offline", icon: "download-outline", action: handleDownload},
    { title: "Go to Artist", icon: "person-outline" },
    { title: "Details", icon: "information-circle-outline" },
    { title: "Set as Ringtone", icon: "call-outline" },
    { title: "Share", icon: "paper-plane-outline" },
    { title: "Delete from Device", icon: "trash-outline" },
  ];

  if (!song) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeWithAnimation}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeWithAnimation} />
      <Animated.View
        style={[
          styles.modalContainer,
          { 
            backgroundColor: theme.ModalBackground,
            transform: [{ translateY: Animated.add(slideAnim, translateY) }] 
          }
        ]}
      >
        <View {...panResponder.panHandlers} style={[styles.dragHeader, { backgroundColor: theme.ModalBackground }]}>
          <View style={[styles.dragHandle, { backgroundColor: theme.DragHandle }]} />
          <View style={styles.songHeader}>
            <Image
              source={{ uri: getImageUrl(song.image) }}
              style={[styles.headerImage, { backgroundColor: theme.LightGray }]}
            />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.songTitle, { color: theme.HeadingColor }]} numberOfLines={1}>{song.name}</Text>
              <Text style={[styles.songSub, { color: theme.SecondaryText }]} numberOfLines={1}>{getSubtitle()}</Text>
            </View>
            <TouchableOpacity onPress={handleFavoritePress}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={moderateScale(28)}
                color={isLiked ? theme.HeartRed : theme.HeadingColor}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.Divider }]} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuRow} onPress={() => item.action && item.action()} activeOpacity={0.6}>
              <Ionicons name={item.icon} size={moderateScale(24)} color={theme.HeadingColor} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: theme.HeadingColor }]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default SongDetailsModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContainer: { height: '80%', width: '100%', borderTopLeftRadius: scale(30), borderTopRightRadius: scale(30), position: 'absolute', bottom: 0, overflow: 'hidden' },
  dragHeader: { paddingHorizontal: scale(25), paddingTop: verticalScale(15), zIndex: 1 },
  dragHandle: { width: scale(50), height: scale(5), borderRadius: scale(10), alignSelf: 'center', marginBottom: verticalScale(20) },
  songHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(20) },
  headerImage: { width: moderateScale(60), height: moderateScale(60), borderRadius: scale(12) },
  headerTextContainer: { flex: 1, marginLeft: scale(15), justifyContent: 'center', paddingRight: scale(10) },
  songTitle: { fontSize: textScale(18), fontWeight: '700', marginBottom: verticalScale(2) },
  songSub: { fontSize: textScale(12), fontWeight: '500' },
  divider: { height: 1, width: '100%', marginBottom: verticalScale(10) },
  scrollContent: { paddingHorizontal: scale(25), paddingBottom: verticalScale(50) },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: verticalScale(14) },
  menuIcon: { marginRight: scale(15) },
  menuText: { fontSize: textScale(16), fontWeight: '500' }
});