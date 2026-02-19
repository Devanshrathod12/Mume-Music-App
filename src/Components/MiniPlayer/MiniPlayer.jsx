import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

// Apne styles import karo
import colors from '../../Styles/colors'; 
import { scale, verticalScale, textScale } from '../../Styles/StyleConfig'; 

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
  const navigation = useNavigation();
  const activeTrack = useActiveTrack(); // Kaunsa gana chal raha hai
  const { playing } = useIsPlaying(); // Play hai ya Pause

  // Agar koi gaana nahi hai, to kuch mat dikhao (Hidden)
  if (!activeTrack) return null;

  // Functions
  const togglePlayback = async () => {
      if (playing) {
          await TrackPlayer.pause();
      } else {
          await TrackPlayer.play();
      }
  };

  const handleSkipNext = async () => {
      await TrackPlayer.skipToNext();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.container}
      // Pura strip click karne par MusicPlayer page khulega
      onPress={() => navigation.navigate('MusicPlayer')}
    >
      
      {/* 1. Play Progress Bar (Optional Top Line - Orange) */}
      <View style={{height: 2, backgroundColor: '#FF6B00', width: '20%'}} />

      <View style={styles.contentRow}>
          
          {/* Song Image */}
          <Image 
             source={{ uri: activeTrack?.artwork || 'https://via.placeholder.com/100' }} 
             style={styles.image}
          />

          {/* Title & Artist */}
          <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {activeTrack?.title || "Unknown Title"}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {activeTrack?.artist || "Unknown Artist"}
              </Text>
          </View>

          {/* Controls Right Side */}
          <View style={styles.controls}>
              
              {/* Play/Pause Button */}
              <TouchableOpacity onPress={(e) => { e.stopPropagation(); togglePlayback(); }}>
                  <Ionicons 
                    name={playing ? "pause" : "play"} 
                    size={28} 
                    color={"#FF6B00"} 
                  />
              </TouchableOpacity>

              {/* Next Button */}
              <TouchableOpacity 
                style={{ marginLeft: 15 }} 
                onPress={(e) => { e.stopPropagation(); handleSkipNext(); }}
              >
                  <Ionicons name="play-skip-forward" size={28}  color={"#FF6B00"} />
              </TouchableOpacity>

          </View>
      </View>

    </TouchableOpacity>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', // Ya halka sa grey '#F9FAFB'
    width: '100%',
    height: verticalScale(65),
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0', // Thin border line above tabs
    justifyContent: 'center',
    elevation: 10, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 }, // Shadow goes up
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'absolute', // Ye important hai "floating" feel ke liye
    bottom: 65, // BottomTab ki height jitna upar (tabBarStyle.height)
    zIndex: 100 // Sabse upar dikhne ke liye
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
    borderRadius: 8,
    backgroundColor: '#eee'
  },
  textContainer: {
    flex: 1,
    marginLeft: scale(12),
    justifyContent: 'center'
  },
  title: {
    fontSize: textScale(14),
    fontWeight: '600',
    color: colors.HeadingColor || '#000',
    marginBottom: 2
  },
  artist: {
    fontSize: textScale(12),
    color: '#64748B' // Grey
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(5)
  }
});