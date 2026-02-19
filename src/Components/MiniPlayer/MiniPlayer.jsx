import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

// Theme Context & Config
import { useTheme } from '../../Context/ThemeContext'; 
import { scale, verticalScale, textScale } from '../../Styles/StyleConfig'; 

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
  const navigation = useNavigation();
  const activeTrack = useActiveTrack(); 
  const { playing } = useIsPlaying(); 
  const { theme } = useTheme(); // 👈 Theme data access

  if (!activeTrack) return null;

  // --- Functions ---
  const togglePlayback = async () => {
      if (playing) {
          await TrackPlayer.pause();
      } else {
          await TrackPlayer.play();
      }
  };

  const handleSkipNext = async () => {
      try {
          await TrackPlayer.skipToNext();
      } catch (error) {
          console.log("End of queue");
      }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.95} 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.MiniPlayerBackground, // Dynamic BG
          borderTopColor: theme.MiniPlayerBorder // Dynamic Border
        }
      ]}
      onPress={() => navigation.navigate('MusicPlayer')}
    >
      
      {/* 1. Play Progress Bar (Halka Orange line) */}
      <View style={{height: 2, backgroundColor: theme.Primary, width: '100%', opacity: 0.3, position: 'absolute', top: 0}} />
      <View style={{height: 2, backgroundColor: theme.Primary, width: '35%', position: 'absolute', top: 0}} />

      <View style={styles.contentRow}>
          
          {/* Song Image */}
          <Image 
             source={{ uri: activeTrack?.artwork || 'https://via.placeholder.com/100' }} 
             style={styles.image}
          />

          {/* Title & Artist */}
          <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.HeadingColor }]} numberOfLines={1}>
                {activeTrack?.title || "Unknown Title"}
              </Text>
              <Text style={[styles.artist, { color: theme.SecondaryText }]} numberOfLines={1}>
                {activeTrack?.artist || "Unknown Artist"}
              </Text>
          </View>

          {/* Controls Right Side */}
          <View style={styles.controls}>
              
              {/* Play/Pause Button */}
              <TouchableOpacity 
                style={styles.iconBtn}
                onPress={(e) => { e.stopPropagation(); togglePlayback(); }}
              >
                  <Ionicons 
                    name={playing ? "pause" : "play"} 
                    size={28} 
                    color={theme.Primary} 
                  />
              </TouchableOpacity>

              {/* Next Button */}
              <TouchableOpacity 
                style={[styles.iconBtn, { marginLeft: scale(10) }]} 
                onPress={(e) => { e.stopPropagation(); handleSkipNext(); }}
              >
                  <Ionicons name="play-skip-forward" size={24} color={theme.Primary} />
              </TouchableOpacity>

          </View>
      </View>

    </TouchableOpacity>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: verticalScale(65),
    borderTopWidth: 1,
    justifyContent: 'center',
    elevation: 20, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    position: 'absolute', 
    bottom: 65, // Tab bar ke theek upar
    zIndex: 999 
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    width: '100%',
    height: '100%'
  },
  image: {
    width: scale(45),
    height: scale(45),
    borderRadius: 12, // Thoda zyada rounded for modern look
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  textContainer: {
    flex: 1,
    marginLeft: scale(12),
    justifyContent: 'center'
  },
  title: {
    fontSize: textScale(14),
    fontWeight: '700', // Thoda bold
    marginBottom: 2
  },
  artist: {
    fontSize: textScale(11),
    fontWeight: '500'
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
      padding: scale(5),
      justifyContent: 'center',
      alignItems: 'center'
  }
});