
import React, { useEffect, useState } from 'react';
import { 
    StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, 
    SafeAreaView, StatusBar, ActivityIndicator 
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

// Styling & Theme
import { useTheme } from '../Context/ThemeContext';
import { scale, verticalScale, textScale, width, moderateScale } from '../Styles/StyleConfig';
import SongDetailsModal from '../Components/Modal/SongDetailsModal'; 

const ArtistSongList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  
  const { artistData } = route.params || {};

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    if (artistData?.id) {
        fetchSongs();
    }
  }, [artistData]);

  const fetchSongs = async () => {
    try {
        const res = await axios.get(`https://saavn.sumit.co/api/artists/${artistData.id}/songs`);
        if (res.data?.data?.songs) {
            setSongs(res.data.data.songs);
        }
    } catch (error) {
        console.log("Error Fetching Artist Songs:", error);
    } finally {
        setLoading(false);
    }
  };

  const saveQueueToStorage = async (queueData, currentIndex) => {
    try {
        await AsyncStorage.setItem('mini_player_queue', JSON.stringify(queueData));
        await AsyncStorage.setItem('last_played_index', String(currentIndex));
    } catch (error) {
        console.log("Error Saving Artist Queue:", error);
    }
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/300';
    const imgObj = Array.isArray(images) 
        ? (images.find(img => img.quality === '500x500') || images[images.length - 1])
        : images;
    return imgObj?.url || images;
  };

  const getAudioUrl = (item) => item?.downloadUrl?.[item.downloadUrl.length - 1]?.url;

  const formatDuration = (seconds) => {
     if(!seconds) return "00:00";
     const min = Math.floor(seconds / 60);
     const sec = (seconds % 60).toString().padStart(2, '0');
     return `${min}:${sec}`;
  };

  const handlePlayPause = async (item) => {
    const trackUrl = getAudioUrl(item);
    if (!trackUrl) return;

    if (activeTrack?.id === item.id) {
        playing ? await TrackPlayer.pause() : await TrackPlayer.play();
        navigation.navigate('MusicPlayer');
    } else {
        try {
            const tracksToAdd = songs.map(s => ({
                id: s.id,
                url: getAudioUrl(s),
                title: s.name,
                artist: artistData?.name || "Unknown",
                artwork: getImageUrl(s.image),
                duration: s.duration
            })).filter(t => t.url);

            const clickedIndex = tracksToAdd.findIndex(t => t.id === item.id);

            await TrackPlayer.reset();
            await TrackPlayer.add(tracksToAdd);
            await TrackPlayer.skip(clickedIndex);
            await TrackPlayer.play();
            
            saveQueueToStorage(tracksToAdd, clickedIndex);
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
        artist: artistData?.name || "Unknown",
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

  const handlePlayNext = async (songItem) => {
    const trackUrl = getAudioUrl(songItem);
    if (!trackUrl) return;
    try {
        const newTrack = {
            id: songItem.id,
            url: trackUrl,
            title: songItem.name,
            artist: artistData?.name || "Unknown",
            artwork: getImageUrl(songItem.image),
            duration: songItem.duration
        };
        const currentIndex = await TrackPlayer.getActiveTrackIndex();
        if (currentIndex !== undefined && currentIndex !== null) {
            await TrackPlayer.add(newTrack, currentIndex + 1);
        } else {
            handlePlayPause(songItem);
        }
    } catch (e) { console.log("Play Next Error:", e); }
  };

  const openDetails = (item) => {
    setSelectedSong(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.WhiteBackground }]}>
      <StatusBar 
        barStyle={theme.WhiteBackground === '#FFFFFF' ? "dark-content" : "light-content"} 
        backgroundColor={theme.WhiteBackground} 
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={theme.Black} />
        </TouchableOpacity>
        <Text style={[styles.headerCenterTitle, { color: theme.HeadingColor }]} numberOfLines={1}>
            {artistData?.name}
        </Text>
        <View style={styles.headerRight}>
             <TouchableOpacity>
                <Ionicons name="search-outline" size={24} color={theme.Black} />
             </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: verticalScale(120) }}>
          
          <View style={styles.heroSection}>
              <View style={[styles.imageShadow, { shadowColor: theme.Primary }]}>
                <Image 
                    source={{ uri: getImageUrl(artistData?.image) }} 
                    style={[styles.heroImage, { backgroundColor: theme.LightGray }]} 
                />
              </View>

              <Text style={[styles.artistName, { color: theme.HeadingColor }]} numberOfLines={1}>
                 {artistData?.name || "Artist Name"}
              </Text>
              
              <View style={styles.statsRow}>
                  <Text style={[styles.statsTxt, { color: theme.SecondaryText }]}>Artist</Text>
                  <Text style={[styles.statsSeparator, { color: theme.Separator }]}>|</Text>
                  <Text style={[styles.statsTxt, { color: theme.SecondaryText }]}>{loading ? '...' : songs.length} Songs</Text>
              </View>

              <View style={styles.actionBtnRow}>
                  <TouchableOpacity 
                    style={[styles.mainBtn, { backgroundColor: theme.Primary }]} 
                    onPress={handlePlayAll}
                  >
                      <Ionicons name="shuffle" size={20} color="#FFFFFF" />
                      <Text style={styles.btnTxtWhite}>Shuffle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.mainBtn, { backgroundColor: theme.CardBackground, borderWidth: 1, borderColor: theme.Separator }]} 
                    onPress={handlePlayAll}
                  >
                      <Ionicons name="play-circle" size={22} color={theme.Primary} />
                      <Text style={[styles.btnTxtOrange, { color: theme.Primary }]}>Play</Text>
                  </TouchableOpacity>
              </View>
          </View>

          <View style={styles.listSubHeader}>
              <Text style={[styles.listTitleText, { color: theme.HeadingColor }]}>Songs</Text>
              <Text style={[styles.SeelistTitleText, { color: theme.Primary }]}>See All</Text>
          </View>

          {loading ? (
              <ActivityIndicator size="large" color={theme.Primary} style={{marginTop: 50}} />
          ) : (
            <View style={styles.songListContainer}>
                {songs.map((song) => {
                     const isPlayingCurrent = activeTrack?.id === song.id;
                     return (
                        <View key={song.id} style={[
                            styles.trackRow, 
                            isPlayingCurrent && { backgroundColor: theme.CardBackground, borderRadius: 12 }
                        ]}>
                            <TouchableOpacity onPress={() => handlePlayPause(song)}>
                                <Image source={{ uri: getImageUrl(song.image) }} style={styles.rowImg} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.trackInfo} onPress={() => handlePlayPause(song)}>
                                <Text style={[
                                    styles.trackNameText, 
                                    { color: isPlayingCurrent ? theme.Primary : theme.HeadingColor }
                                ]} numberOfLines={1}>
                                    {song.name}
                                </Text>
                                <Text style={[styles.trackSubText, { color: theme.SecondaryText }]} numberOfLines={1}>
                                   {formatDuration(song.duration)} mins  •  Album: {song.album?.name || "Unknown"}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.rowActions}>
                                <TouchableOpacity onPress={() => handlePlayPause(song)}>
                                    <Ionicons 
                                        name={isPlayingCurrent && playing ? "pause-circle" : "play-circle"} 
                                        size={32} 
                                        color={theme.Primary} 
                                    />
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={{ marginLeft: 15, padding: 5 }}
                                    onPress={() => openDetails(song)}
                                >
                                    <Ionicons name="ellipsis-vertical" size={20} color={theme.SecondaryText} />
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
          onPlayNext={handlePlayNext}
      />
    </SafeAreaView>
  );
};

export default ArtistSongList;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(20), paddingVertical: verticalScale(15) },
    headerCenterTitle: { flex: 1, fontSize: textScale(18), fontWeight: 'bold', textAlign: 'center', marginHorizontal: 15 },
    headerRight: { width: 30 },
    heroSection: { alignItems: 'center', marginTop: 15, paddingHorizontal: scale(20) },
    imageShadow: { 
        elevation: 10, 
        shadowOffset: { width: 0, height: 8 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        borderRadius: 25, 
        marginBottom: 20 
    },
    heroImage: { width: width * 0.55, height: width * 0.55, borderRadius: 25 },
    artistName: { fontSize: textScale(22), fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    statsTxt: { fontSize: textScale(12), fontWeight: '500' },
    statsSeparator: { marginHorizontal: 10 },
    actionBtnRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 25 },
    mainBtn: { flex: 0.48, height: verticalScale(50), borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    btnTxtWhite: { color: '#FFF', fontSize: textScale(16), fontWeight: '600' },
    btnTxtOrange: { fontSize: textScale(16), fontWeight: '600' },
    listSubHeader: { paddingHorizontal: scale(25), marginBottom: 15, flexDirection: "row", justifyContent: "space-between" },
    listTitleText: { fontSize: textScale(18), fontWeight: 'bold' },
    SeelistTitleText: { fontSize: textScale(14), fontWeight: 'bold' },
    songListContainer: { paddingHorizontal: scale(20) },
    trackRow: { flexDirection: 'row', alignItems: 'center', padding: scale(8), marginBottom: 8 },
    rowImg: { width: moderateScale(50), height: moderateScale(50), borderRadius: 12, marginRight: 15 },
    trackInfo: { flex: 1 },
    trackNameText: { fontSize: textScale(16), fontWeight: '600', marginBottom: 3 },
    trackSubText: { fontSize: textScale(11) },
    rowActions: { flexDirection: 'row', alignItems: 'center' }
});