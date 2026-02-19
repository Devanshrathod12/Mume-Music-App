import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale, textScale } from '../Styles/StyleConfig'; // Path check kar lena
import colors from '../Styles/colors';
import { toggleFavorite } from '../redux/musicSlice';
import TrackPlayer from 'react-native-track-player';

const { width } = Dimensions.get('window');

const Favorites = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  // Redux se favorites list mangwayi
  const favorites = useSelector((state) => state.music.favorites);

  // Gaana chalane ke liye helper
  const handlePlayTrack = async (item) => {
    const trackUrl = item?.downloadUrl?.[item.downloadUrl.length - 1]?.url;
    if (!trackUrl) return;

    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: item.id,
      url: trackUrl,
      title: item.name,
      artist: item?.artists?.primary?.[0]?.name || "Unknown",
      artwork: item?.image?.[item.image.length - 1]?.url || 'https://via.placeholder.com/150',
    });
    await TrackPlayer.play();
  };

  const renderItem = ({ item }) => (
    <View style={styles.songCard}>
      <TouchableOpacity 
        style={styles.songInfo} 
        onPress={() => handlePlayTrack(item)}
      >
        <Image 
          source={{ uri: item?.image?.[item.image.length - 1]?.url }} 
          style={styles.albumArt} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.songName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {item?.artists?.primary?.[0]?.name || "Unknown Artist"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Remove from Favorite */}
      <TouchableOpacity 
        onPress={() => dispatch(toggleFavorite(item))}
        style={styles.heartBtn}
      >
        <Ionicons name="heart" size={24} color="#E11D48" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.subTitle}>{favorites.length} Songs</Text>
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
          <Ionicons name="heart-dislike-outline" size={80} color={colors.SecondaryText} />
          <Text style={styles.emptyText}>No Favorites Yet</Text>
          <Text style={styles.emptySubText}>Start liking your favorite songs to see them here.</Text>
        </View>
      )}
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WhiteBackground || '#FFFFFF',
  },
  header: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
  },
  headerTitle: {
    fontSize: textScale(28),
    fontWeight: 'bold',
    color: colors.HeadingColor || '#000',
  },
  subTitle: {
    fontSize: textScale(14),
    color: colors.SecondaryText || 'grey',
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: 100, // MiniPlayer ke liye jagah
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
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
  },
  textContainer: {
    marginLeft: scale(12),
    flex: 1,
  },
  songName: {
    fontSize: textScale(16),
    fontWeight: '600',
    color: colors.Black || '#1E293B',
  },
  artistName: {
    fontSize: textScale(13),
    color: colors.SecondaryText || '#64748B',
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
    color: colors.HeadingColor,
    marginTop: 20,
  },
  emptySubText: {
    fontSize: textScale(14),
    color: colors.SecondaryText,
    textAlign: 'center',
    marginTop: 10,
  }
});