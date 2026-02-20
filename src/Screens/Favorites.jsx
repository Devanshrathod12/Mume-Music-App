
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Theme & Config
import { useTheme } from '../Context/ThemeContext';
import { scale, verticalScale, moderateScale, textScale } from '../Styles/StyleConfig';
import { toggleFavorite } from '../redux/musicSlice';
import TrackPlayer from 'react-native-track-player';

const { width } = Dimensions.get('window');

const Favorites = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  
  const favorites = useSelector((state) => state.music.favorites);

  const handlePlayTrack = async (item) => {
    const trackUrl = item?.downloadUrl?.[item.downloadUrl.length - 1]?.url;
    if (!trackUrl) return;

    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: item.id,
        url: trackUrl,
        title: item.name,
        artist: item?.artists?.primary?.[0]?.name || "Unknown",
        artwork: item?.image?.[item.image.length - 1]?.url || 'https://via.placeholder.com/150',
      });
      await TrackPlayer.play();
    } catch (e) {
      console.log("Error playing favorite track:", e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.songCard, { backgroundColor: theme.CardBackground }]}>
      <TouchableOpacity 
        style={styles.songInfo} 
        onPress={() => handlePlayTrack(item)}
      >
        <Image 
          source={{ uri: item?.image?.[item.image.length - 1]?.url }} 
          style={styles.albumArt} 
        />
        <View style={styles.textContainer}>
          <Text style={[styles.songName, { color: theme.HeadingColor }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.artistName, { color: theme.SecondaryText }]} numberOfLines={1}>
            {item?.artists?.primary?.[0]?.name || "Unknown Artist"}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => dispatch(toggleFavorite(item))}
        style={styles.heartBtn}
      >
        <Ionicons name="heart" size={24} color={theme.HeartRed || "#E11D48"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.WhiteBackground, paddingTop: insets.top }]}>
      <StatusBar 
        barStyle={theme.WhiteBackground === '#FFFFFF' ? "dark-content" : "light-content"} 
        backgroundColor={theme.WhiteBackground} 
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.HeadingColor }]}>My Favorites</Text>
        <Text style={[styles.subTitle, { color: theme.SecondaryText }]}>{favorites.length} Songs</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={80} color={theme.SecondaryText} />
          <Text style={[styles.emptyText, { color: theme.HeadingColor }]}>No Favorites Yet</Text>
          <Text style={[styles.emptySubText, { color: theme.SecondaryText }]}>
            Start liking your favorite songs to see them here.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
  },
  headerTitle: {
    fontSize: textScale(28),
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: textScale(14),
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: 100, 
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    borderRadius: scale(15),
    marginBottom: verticalScale(12),
  },
  songInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumArt: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: scale(10),
    backgroundColor: '#EEE'
  },
  textContainer: {
    marginLeft: scale(12),
    flex: 1,
  },
  songName: {
    fontSize: textScale(16),
    fontWeight: '600',
  },
  artistName: {
    fontSize: textScale(13),
    marginTop: 2,
  },
  heartBtn: {
    padding: scale(5),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: textScale(20),
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: textScale(14),
    textAlign: 'center',
    marginTop: 10,
  }
});