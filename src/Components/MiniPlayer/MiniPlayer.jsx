import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
  useProgress
} from 'react-native-track-player';

import { useTheme } from '../../Context/ThemeContext';
import { scale, verticalScale, textScale } from '../../Styles/StyleConfig';

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
  const navigation = useNavigation();
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();
  const { theme } = useTheme();

  const { position, duration } = useProgress(200);
  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  /* ---------------- LOADER STATE ---------------- */

  const [showLoader, setShowLoader] = useState(true);
  const loaderAnim = useRef(new Animated.Value(-width)).current;

  /* Track change detect */
  useEffect(() => {
    if (!activeTrack) return;

    setShowLoader(true);

    Animated.loop(
      Animated.timing(loaderAnim, {
        toValue: width,
        duration: 900,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      setShowLoader(false);
      loaderAnim.setValue(-width);
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeTrack?.id]);

  if (!activeTrack) return null;

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
      console.log("No more tracks");
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.container,
        {
          backgroundColor: theme.MiniPlayerBackground,
          borderTopColor: theme.MiniPlayerBorder,
        }
      ]}
      onPress={() => navigation.navigate('MusicPlayer')}
    >

      {/* Background Line */}
      <View
        style={[
          styles.progressBackground,
          {
            backgroundColor: theme.Separator,
            opacity: 0.15
          }
        ]}
      />

      {/* ---------- LOADER ---------- */}
      {showLoader ? (
        <Animated.View
          style={[
            styles.loaderLine,
            {
              backgroundColor: theme.Primary,
              transform: [{ translateX: loaderAnim }],
            }
          ]}
        />
      ) : (
        /* ---------- REAL PROGRESS ---------- */
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.Primary,
              width: `${progressPercent}%`,
            }
          ]}
        />
      )}

      <View style={styles.contentRow}>

        <Image
          source={{
            uri: activeTrack?.artwork || 'https://via.placeholder.com/100'
          }}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <Text
            style={[styles.title, { color: theme.HeadingColor }]}
            numberOfLines={1}
          >
            {activeTrack?.title || "Unknown"}
          </Text>

          <Text
            style={[styles.artist, { color: theme.SecondaryText }]}
            numberOfLines={1}
          >
            {activeTrack?.artist || "Offline"}
          </Text>
        </View>

        <View style={styles.controls}>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={(e) => {
              e.stopPropagation();
              togglePlayback();
            }}
          >
            <Ionicons
              name={playing ? "pause" : "play"}
              size={scale(30)}
              color={theme.Primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, { marginLeft: scale(15) }]}
            onPress={(e) => {
              e.stopPropagation();
              handleSkipNext();
            }}
          >
            <Ionicons
              name="play-skip-forward"
              size={scale(24)}
              color={theme.Primary}
            />
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
    borderTopWidth: 0.8,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 60,
    zIndex: 999,
    elevation: 15,

    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  progressBackground: {
    height: 2.5,
    width: '100%',
    position: 'absolute',
    top: 0
  },

  progressFill: {
    height: 2.5,
    position: 'absolute',
    top: 0,
    zIndex: 10
  },

  /* LOADER LINE */
  loaderLine: {
    height: 2.5,
    width: width * 0.35,
    position: 'absolute',
    top: 0,
    borderRadius: 5,
    opacity: 0.9
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
  },

  image: {
    width: scale(42),
    height: scale(42),
    borderRadius: 6,
  },

  textContainer: {
    flex: 1,
    marginLeft: scale(12),
  },

  title: {
    fontSize: textScale(14),
    fontWeight: '700',
  },

  artist: {
    fontSize: textScale(11),
    fontWeight: '500',
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scale(5)
  },

  iconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: scale(30)
  }
});

// last prevgrg