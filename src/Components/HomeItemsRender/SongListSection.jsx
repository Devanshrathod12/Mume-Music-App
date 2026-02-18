import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react' // Import useState
import Ionicons from '@react-native-vector-icons/ionicons'
import colors from '../../Styles/colors'
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig'

// Track Player Imports
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

// NEW: IMPORT MODAL
import SongDetailsModal from '../../Components/Modal/SongDetailsModal';

const SongListSection = ({ data }) => {
  
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();
  
  // -- STATES FOR MODAL --
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  // --- HELPERS (Same as before) ---
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

  // --- PLAY/PAUSE LOGIC (Direct on Song Row) ---
  const handlePlayPause = async (item) => {
      const trackUrl = getAudioUrl(item);
      if (!trackUrl) return;

      if (activeTrack?.id === item.id) {
          playing ? await TrackPlayer.pause() : await TrackPlayer.play();
      } else {
          try {
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: item.id,
                url: trackUrl,
                title: item.name,
                artist: item?.artists?.primary?.[0]?.name || "Unknown",
                artwork: getImageUrl(item.image),
            });
            await TrackPlayer.play();
          } catch(e) { console.log(e); }
      }
  };

  // --- LOGIC: HANDLE "PLAY NEXT" from Modal ---
  // Simple logic: insert song at next index
  const handlePlayNext = async (songItem) => {
      const trackUrl = getAudioUrl(songItem);
      if(!trackUrl) return;
      
      const newTrack = {
        id: songItem.id,
        url: trackUrl,
        title: songItem.name,
        artist: songItem.artists?.primary?.[0]?.name || "Unknown",
        artwork: getImageUrl(songItem.image),
      };

      try {
        // Current index ke baad insert karo
        const currentIndex = await TrackPlayer.getActiveTrackIndex();
        if (currentIndex !== undefined) {
            await TrackPlayer.add(newTrack, currentIndex + 1);
            console.log("Added to Play Next:", songItem.name);
        } else {
            // Agar kuch play nahi ho raha to directly play kar do
            handlePlayPause(songItem);
        }
      } catch (error) {
          console.log("Error in Play Next", error);
      }
  };

  // --- OPEN MODAL HANDLER ---
  const openDetails = (item) => {
      setSelectedSong(item); // Song ka data set kiya
      setModalVisible(true); // Modal dikhaya
  };

  const renderItem = ({ item }) => {
    const isActive = activeTrack?.id === item.id;
    const iconName = isActive && playing ? "pause-circle" : "play-circle";

    return (
      <View style={[styles.songRow, isActive && { backgroundColor: '#F3F4F6', borderRadius: 12 }]}>
         
         {/* Row Click -> Plays Music (Optional) */}
         <TouchableOpacity 
            style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
            onPress={() => handlePlayPause(item)} 
         >
            <Image source={{ uri: getImageUrl(item.image) }} style={styles.songRowImage} />
            
            <View style={styles.songRowText}>
                <Text style={[styles.rowTitle, isActive && { color: colors.Primary }]} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{getSubtitle(item)}</Text>
            </View>
         </TouchableOpacity>

         {/* Actions Area */}
         <View style={styles.songActions}>
              <TouchableOpacity onPress={() => handlePlayPause(item)}>
                  <Ionicons name={iconName} size={32} color={colors.Primary} />
              </TouchableOpacity>
              
              {/* Three Dots -> Opens DETAILS MODAL */}
              <TouchableOpacity 
                 style={{ marginLeft: scale(15), padding: 5 }} 
                 onPress={() => openDetails(item)}
              >
                  <Ionicons name="ellipsis-vertical" size={20} color={colors.SecondaryText} />
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
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />

        {/* MODAL CALL (Screen ke neeche mounted hai) */}
        <SongDetailsModal 
            visible={modalVisible}
            song={selectedSong}
            onClose={() => setModalVisible(false)}
            onPlayNext={handlePlayNext}
        />
    </>
  )
}

export default SongListSection

const styles = StyleSheet.create({
  listContent: { 
    paddingBottom: verticalScale(100), 
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10)
  },
  songRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: verticalScale(20),
    padding: scale(5)
  },
  songRowImage: { 
    width: moderateScale(55), 
    height: moderateScale(55), 
    borderRadius: 15, 
    backgroundColor: colors.LightGray 
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
    color: colors.Black, 
    marginBottom: 4 
  },
  rowSub: { 
    fontSize: textScale(12), 
    color: colors.SecondaryText, 
    fontWeight: '500' 
  },
})