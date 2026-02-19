// import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
// import React, { useState } from 'react'
// import Ionicons from '@react-native-vector-icons/ionicons'
// import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Added
// import colors from '../../Styles/colors'
// import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig'

// // Track Player Imports
// import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

// // NEW: IMPORT MODAL
// import SongDetailsModal from '../../Components/Modal/SongDetailsModal';

// const SongListSection = ({ data }) => {
//   const activeTrack = useActiveTrack();
//   const { playing } = useIsPlaying();
  
//   // -- STATES FOR MODAL --
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedSong, setSelectedSong] = useState(null);

//   // --- STORAGE HELPER (Consistent with Album/Artist) ---
//   const saveQueueToStorage = async (queueData, currentIndex) => {
//     try {
//         await AsyncStorage.setItem('mini_player_queue', JSON.stringify(queueData));
//         await AsyncStorage.setItem('last_played_index', String(currentIndex));
        
//         // Agar aap Redux use kar rahe hain toh yahan dispatch bhi kar sakte hain:
//         // dispatch(setGlobalQueue(queueData)); 
//     } catch (error) {
//         console.log("Error Saving Section Queue:", error);
//     }
//   };

//   // --- HELPERS ---
//   const getImageUrl = (images) => {
//     if (!images || images.length === 0) return 'https://via.placeholder.com/150';
//     return images.find(img => img.quality === '500x500')?.url || images[images.length - 1]?.url;
//   };

//   const getAudioUrl = (item) => item?.downloadUrl?.[item.downloadUrl.length - 1]?.url;

//   const getSubtitle = (item) => {
//     const artistNames = item?.artists?.primary?.map(a => a.name).join(', ') || item.artist || "Unknown";
//     const duration = item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : "03:00";
//     return `${artistNames}  |  ${duration} mins`;
//   };

//   // --- PLAY/PAUSE LOGIC (With Queue Persistence) ---
//   const handlePlayPause = async (item) => {
//       const trackUrl = getAudioUrl(item);
//       if (!trackUrl) return;

//       if (activeTrack?.id === item.id) {
//           playing ? await TrackPlayer.pause() : await TrackPlayer.play();
//       } else {
//           try {
//             // 1. Convert current list data to TrackPlayer format
//             const tracksToAdd = data.map(s => ({
//                 id: s.id,
//                 url: getAudioUrl(s),
//                 title: s.name,
//                 artist: s?.artists?.primary?.[0]?.name || "Unknown",
//                 artwork: getImageUrl(s.image),
//                 duration: s.duration
//             })).filter(t => t.url);

//             // 2. Clicked song ka index dhoondo
//             const clickedIndex = tracksToAdd.findIndex(t => t.id === item.id);

//             await TrackPlayer.reset();
//             await TrackPlayer.add(tracksToAdd);
//             await TrackPlayer.skip(clickedIndex); // Seedha clicked song par jump
//             await TrackPlayer.play();

//             // 3. Save to Storage for Next/Previous functionality
//             saveQueueToStorage(tracksToAdd, clickedIndex);

//           } catch(e) { console.log("Section Player Error:", e); }
//       }
//   };

//   // --- LOGIC: HANDLE "PLAY NEXT" ---
//   const handlePlayNext = async (songItem) => {
//       const trackUrl = getAudioUrl(songItem);
//       if(!trackUrl) return;
      
//       const newTrack = {
//         id: songItem.id,
//         url: trackUrl,
//         title: songItem.name,
//         artist: songItem.artists?.primary?.[0]?.name || "Unknown",
//         artwork: getImageUrl(songItem.image),
//         duration: songItem.duration
//       };

//       try {
//         const currentIndex = await TrackPlayer.getActiveTrackIndex();
//         if (currentIndex !== undefined && currentIndex !== null) {
//             await TrackPlayer.add(newTrack, currentIndex + 1);
//             console.log("Added to Play Next:", songItem.name);
            
//             // Note: Storage update optional here, usually done on major queue changes
//         } else {
//             handlePlayPause(songItem);
//         }
//       } catch (error) {
//           console.log("Error in Play Next", error);
//       }
//   };

//   const openDetails = (item) => {
//       setSelectedSong(item);
//       setModalVisible(true);
//   };

//   const renderItem = ({ item }) => {
//     const isActive = activeTrack?.id === item.id;
//     const iconName = isActive && playing ? "pause-circle" : "play-circle";

//     return (
//       <View style={[styles.songRow, isActive && { backgroundColor: '#F3F4F6', borderRadius: 12 }]}>
//          <TouchableOpacity 
//             style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
//             onPress={() => handlePlayPause(item)} 
//          >
//             <Image source={{ uri: getImageUrl(item.image) }} style={styles.songRowImage} />
            
//             <View style={styles.songRowText}>
//                 <Text style={[styles.rowTitle, isActive && { color: colors.Primary }]} numberOfLines={1}>{item.name}</Text>
//                 <Text style={styles.rowSub} numberOfLines={1}>{getSubtitle(item)}</Text>
//             </View>
//          </TouchableOpacity>

//          <View style={styles.songActions}>
//               <TouchableOpacity onPress={() => handlePlayPause(item)}>
//                   <Ionicons name={iconName} size={32} color={colors.Primary} />
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                  style={{ marginLeft: scale(15), padding: 5 }} 
//                  onPress={() => openDetails(item)}
//               >
//                   <Ionicons name="ellipsis-vertical" size={20} color={colors.SecondaryText} />
//               </TouchableOpacity>
//          </View>
//       </View>
//     );
//   };

//   return (
//     <>
//         <FlatList
//             data={data}
//             renderItem={renderItem}
//             keyExtractor={item => item.id.toString()}
//             contentContainerStyle={styles.listContent}
//             showsVerticalScrollIndicator={false}
//         />

//         <SongDetailsModal 
//             visible={modalVisible}
//             song={selectedSong}
//             onClose={() => setModalVisible(false)}
//             onPlayNext={handlePlayNext}
//         />
//     </>
//   )
// }

// export default SongListSection;

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
// });
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Theme & Config
import { useTheme } from '../../Context/ThemeContext';
import colors from '../../Styles/colors'
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig'

// Track Player Imports
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

// Modal
import SongDetailsModal from '../../Components/Modal/SongDetailsModal';

const SongListSection = ({ data }) => {
  const { theme } = useTheme(); // 👈 Theme Access
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  // --- STORAGE HELPER ---
  const saveQueueToStorage = async (queueData, currentIndex) => {
    try {
        await AsyncStorage.setItem('mini_player_queue', JSON.stringify(queueData));
        await AsyncStorage.setItem('last_played_index', String(currentIndex));
    } catch (error) {
        console.log("Error Saving Section Queue:", error);
    }
  };

  // --- HELPERS ---
  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    return images.find(img => img.quality === '500x500')?.url || images[images.length - 1]?.url;
  };

  const getAudioUrl = (item) => item?.downloadUrl?.[item.downloadUrl.length - 1]?.url;

  const getSubtitle = (item) => {
    const artistNames = item?.artists?.primary?.map(a => a.name).join(', ') || item.artist || "Unknown";
    const duration = item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : "03:00";
    return `${artistNames}  |  ${duration} mins`;
  };

  // --- PLAY/PAUSE LOGIC ---
  const handlePlayPause = async (item) => {
      const trackUrl = getAudioUrl(item);
      if (!trackUrl) return;

      if (activeTrack?.id === item.id) {
          playing ? await TrackPlayer.pause() : await TrackPlayer.play();
      } else {
          try {
            const tracksToAdd = data.map(s => ({
                id: s.id,
                url: getAudioUrl(s),
                title: s.name,
                artist: s?.artists?.primary?.[0]?.name || "Unknown",
                artwork: getImageUrl(s.image),
                duration: s.duration
            })).filter(t => t.url);

            const clickedIndex = tracksToAdd.findIndex(t => t.id === item.id);

            await TrackPlayer.reset();
            await TrackPlayer.add(tracksToAdd);
            await TrackPlayer.skip(clickedIndex);
            await TrackPlayer.play();

            saveQueueToStorage(tracksToAdd, clickedIndex);
          } catch(e) { console.log("Section Player Error:", e); }
      }
  };

  // --- HANDLE "PLAY NEXT" ---
  const handlePlayNext = async (songItem) => {
      const trackUrl = getAudioUrl(songItem);
      if(!trackUrl) return;
      
      const newTrack = {
        id: songItem.id,
        url: trackUrl,
        title: songItem.name,
        artist: songItem.artists?.primary?.[0]?.name || "Unknown",
        artwork: getImageUrl(songItem.image),
        duration: songItem.duration
      };

      try {
        const currentIndex = await TrackPlayer.getActiveTrackIndex();
        if (currentIndex !== undefined && currentIndex !== null) {
            await TrackPlayer.add(newTrack, currentIndex + 1);
        } else {
            handlePlayPause(songItem);
        }
      } catch (error) {
          console.log("Error in Play Next", error);
      }
  };

  const openDetails = (item) => {
      setSelectedSong(item);
      setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const isActive = activeTrack?.id === item.id;
    const iconName = isActive && playing ? "pause-circle" : "play-circle";

    return (
      <View style={[
        styles.songRow, 
        isActive && { backgroundColor: theme.CardBackground, borderRadius: 12 } // 👈 Highlighting active track
      ]}>
         <TouchableOpacity 
            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
            onPress={() => handlePlayPause(item)} 
         >
            <Image 
              source={{ uri: getImageUrl(item.image) }} 
              style={[styles.songRowImage, { backgroundColor: theme.LightGray }]} 
            />
            
            <View style={styles.songRowText}>
                <Text style={[
                  styles.rowTitle, 
                  { color: isActive ? theme.Primary : theme.HeadingColor } // 👈 Orange if active
                ]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.rowSub, { color: theme.SecondaryText }]} numberOfLines={1}>
                  {getSubtitle(item)}
                </Text>
            </View>
         </TouchableOpacity>

         <View style={styles.songActions}>
              <TouchableOpacity onPress={() => handlePlayPause(item)}>
                  <Ionicons name={iconName} size={32} color={theme.Primary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                 style={{ marginLeft: scale(15), padding: 5 }} 
                 onPress={() => openDetails(item)}
              >
                  <Ionicons name="ellipsis-vertical" size={20} color={theme.SecondaryText} />
              </TouchableOpacity>
         </View>
      </View>
    );
  };

  return (
    <>
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={[styles.listContent, { backgroundColor: theme.WhiteBackground }]}
            showsVerticalScrollIndicator={false}
        />

        <SongDetailsModal 
            visible={modalVisible}
            song={selectedSong}
            onClose={() => setModalVisible(false)}
            onPlayNext={handlePlayNext}
        />
    </>
  )
}

export default SongListSection;

const styles = StyleSheet.create({
  listContent: { 
    paddingBottom: verticalScale(100), 
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10)
  },
  songRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: verticalScale(12),
    padding: scale(8)
  },
  songRowImage: { 
    width: moderateScale(55), 
    height: moderateScale(55), 
    borderRadius: 12, 
  },
  songRowText: { 
    flex: 1, 
    marginLeft: scale(15), 
    justifyContent: 'center' 
  },
  songActions: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  rowTitle: { 
    fontSize: textScale(16), 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  rowSub: { 
    fontSize: textScale(12), 
    fontWeight: '500' 
  },
});