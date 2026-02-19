import { 
    StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, 
    SafeAreaView, StatusBar, ActivityIndicator 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

// Imports
import colors from '../Styles/colors'
import { scale, verticalScale, textScale, width, moderateScale } from '../Styles/StyleConfig'
import SongDetailsModal from '../Components/Modal/SongDetailsModal'; 

const AlbamSongList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { albumData } = route.params || {};

  // States
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track Player
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, [albumData]);

  // --- API CALL ---
  const fetchSongs = async () => {
    const artistId = albumData?.artists?.primary?.[0]?.id || albumData?.artists?.all?.[0]?.id;

    if (!artistId) {
        setLoading(false);
        return;
    }
    try {
        const res = await axios.get(`https://saavn.sumit.co/api/artists/${artistId}/songs`);
        if (res.data?.data?.songs) {
            setSongs(res.data.data.songs);
        }
    } catch (error) {
        console.log("Error Fetching Album Songs:", error);
    } finally {
        setLoading(false);
    }
  };

  // --- STORAGE HELPER ---
  const saveQueueToStorage = async (queueData, currentIndex) => {
    try {
        await AsyncStorage.setItem('mini_player_queue', JSON.stringify(queueData));
        await AsyncStorage.setItem('last_played_index', String(currentIndex));
    } catch (error) {
        console.log("Error Saving Queue:", error);
    }
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/300';
    const imgObj = Array.isArray(images) 
        ? (images.find(img => img.quality === '500x500') || images[images.length - 1])
        : images;
    return imgObj?.url;
  };

  const getAudioUrl = (item) => item?.downloadUrl?.[item.downloadUrl.length - 1]?.url;

  const formatDuration = (seconds) => {
     if(!seconds) return "00:00";
     const min = Math.floor(seconds / 60);
     const sec = (seconds % 60).toString().padStart(2, '0');
     return `${min}:${sec}`;
  };

  // --- PLAY LOGIC UPDATED ---

  const handlePlayPause = async (item) => {
    const trackUrl = getAudioUrl(item);
    if (!trackUrl) return;

    if (activeTrack?.id === item.id) {
        // Agar wahi gaana chal raha hai toh sirf navigate karo
        playing ? await TrackPlayer.pause() : await TrackPlayer.play();
        navigation.navigate('MusicPlayer'); 
    } else {
        try {
            // 1. Poore Album ki list taiyar karo
            const tracksToAdd = songs.map(s => ({
                id: s.id,
                url: getAudioUrl(s),
                title: s.name,
                artist: s?.artists?.primary?.[0]?.name || "Unknown",
                artwork: getImageUrl(s.image),
                duration: s.duration
            })).filter(t => t.url);

            // 2. Clicked song ka index nikalo
            const clickedIndex = tracksToAdd.findIndex(t => t.id === item.id);

            await TrackPlayer.reset();
            await TrackPlayer.add(tracksToAdd);
            await TrackPlayer.skip(clickedIndex); // Usi gaane par jump karo jo click hua hai
            await TrackPlayer.play();
            
            // 3. Storage update karo (for MiniPlayer and Persistence)
            saveQueueToStorage(tracksToAdd, clickedIndex);

            // 4. Music Player pe navigate karo
            navigation.navigate('MusicPlayer');

        } catch(e) { console.log("Player Error", e); }
    }
  };

  const handlePlayAll = async () => {
      if(songs.length === 0) return;
      
      const tracksToAdd = songs.map(s => ({
        id: s.id,
        url: getAudioUrl(s),
        title: s.name,
        artist: s.artists?.primary?.[0]?.name || "Unknown",
        artwork: getImageUrl(s.image),
        duration: s.duration
      })).filter(t => t.url);

      if(tracksToAdd.length === 0) return;

      try {
        await TrackPlayer.reset();
        await TrackPlayer.add(tracksToAdd);
        await TrackPlayer.play();
        
        saveQueueToStorage(tracksToAdd, 0);
        navigation.navigate('MusicPlayer'); 

      } catch(e) { console.log(e); }
  };

  const openDetails = (item) => {
    setSelectedSong(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color={colors.Black} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
             <TouchableOpacity style={{ marginRight: 15 }}>
                <Ionicons name="search-outline" size={24} color={colors.Black} />
             </TouchableOpacity>
             <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={colors.Black} />
             </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          <View style={styles.heroSection}>
              <View style={styles.imageShadow}>
                <Image 
                    source={{ uri: getImageUrl(albumData?.image) }} 
                    style={styles.heroImage} 
                />
              </View>

              <Text style={styles.albumTitle} numberOfLines={2}>
                 {albumData?.name || "Unknown Album"}
              </Text>
              
              <View style={styles.metaContainer}>
                  <Text style={styles.metaText}>1 Album</Text>
                  <Text style={styles.metaDivider}>|</Text>
                  <Text style={styles.metaText}>{loading ? '...' : songs.length} Songs</Text>
                  <Text style={styles.metaDivider}>|</Text>
                  <Text style={styles.metaText}>{albumData?.year || "2023"}</Text>
              </View>

              <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.actionButton, styles.btnShuffle]} onPress={handlePlayAll}>
                      <Ionicons name="shuffle" size={20} color="#FFFFFF" style={{marginRight: 8}} />
                      <Text style={styles.btnShuffleText}>Shuffle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionButton, styles.btnPlay]} onPress={handlePlayAll}>
                      <Ionicons name="play-circle" size={22} color="#FF6B00" style={{marginRight: 8}} />
                      <Text style={styles.btnPlayText}>Play</Text>
                  </TouchableOpacity>
              </View>
          </View>

          <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Songs</Text>
              <Text style={styles.seesectionTitle}>See All</Text>
          </View>

          {loading ? (
              <ActivityIndicator size="large" color="#FF6B00" style={{marginTop: 50}} />
          ) : (
            <View style={styles.songsList}>
                {songs.map((song) => {
                     const isCurrent = activeTrack?.id === song.id;
                     const iconName = isCurrent && playing ? "pause-circle" : "play-circle";
                     const titleColor = isCurrent ? "#FF6B00" : "#1E293B";

                     return (
                        <View key={song.id} style={[styles.songRow, isCurrent && { backgroundColor: '#FFF7ED', borderRadius: 10 }]}>
                            <TouchableOpacity onPress={() => handlePlayPause(song)}>
                                <Image 
                                    source={{ uri: getImageUrl(song.image) }} 
                                    style={styles.songImage} 
                                />
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.songInfo} onPress={() => handlePlayPause(song)}>
                                <Text style={[styles.songTitle, { color: titleColor }]} numberOfLines={1}>{song.name}</Text>
                                <Text style={styles.songArtist} numberOfLines={1}>
                                    {song.artists?.primary?.[0]?.name || "Unknown"}  •  {formatDuration(song.duration)}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.songActions}>
                                <TouchableOpacity style={styles.playIconBtn} onPress={() => handlePlayPause(song)}>
                                    <Ionicons name={iconName} size={30} color="#FF6B00" />
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={{ marginLeft: 10, padding: 5 }}
                                    onPress={() => openDetails(song)}
                                >
                                    <Ionicons name="ellipsis-vertical" size={20} color={colors.SecondaryText} />
                                </TouchableOpacity>
                            </View>
                        </View>
                     )
                })}
            </View>
          )}

      </ScrollView>
      
      <SongDetailsModal 
          visible={modalVisible}
          song={selectedSong}
          onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default AlbamSongList;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(20), paddingVertical: verticalScale(15) },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    heroSection: { alignItems: 'center', marginTop: verticalScale(10), paddingHorizontal: scale(20) },
    imageShadow: { elevation: 10, shadowColor: '#FF6B00', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, borderRadius: 25, marginBottom: verticalScale(20) },
    heroImage: { width: width * 0.55, height: width * 0.55, borderRadius: 25, backgroundColor: '#EEE' },
    albumTitle: { fontSize: textScale(22), fontWeight: 'bold', color: colors.HeadingColor || '#000', textAlign: 'center', marginBottom: verticalScale(8), marginTop: verticalScale(10) },
    metaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(25) },
    metaText: { fontSize: textScale(12), color: '#64748B', fontWeight: '500' },
    metaDivider: { marginHorizontal: scale(8), color: '#CBD5E1' },
    buttonRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: verticalScale(30) },
    actionButton: { flex: 0.48, height: verticalScale(50), borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    btnShuffle: { backgroundColor: '#FF6B00', elevation: 5, shadowColor: '#FF6B00', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 4} },
    btnShuffleText: { color: '#FFF', fontSize: textScale(16), fontWeight: '600' },
    btnPlay: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FFEDD5' },
    btnPlayText: { color: '#FF6B00', fontSize: textScale(16), fontWeight: '600' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(20), marginBottom: verticalScale(15) },
    sectionTitle: { fontSize: textScale(16), fontWeight: 'bold', color: '#000' },
    seesectionTitle: { fontSize: textScale(16), fontWeight: 'bold', color:colors.lightornge },
    songsList: { paddingHorizontal: scale(20) },
    songRow: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(15), padding: scale(5) },
    songImage: { width: moderateScale(50), height: moderateScale(50), borderRadius: 12, marginRight: scale(15), backgroundColor: '#f0f0f0' },
    songInfo: { flex: 1 },
    songTitle: { fontSize: textScale(15), fontWeight: 'bold', color: '#1E293B', marginBottom: 3 },
    songArtist: { fontSize: textScale(12), color: '#94A3B8', fontWeight: '500' },
    songActions: { flexDirection: 'row', alignItems: 'center' },
});