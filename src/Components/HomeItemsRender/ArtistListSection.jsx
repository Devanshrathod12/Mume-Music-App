
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../Context/ThemeContext';
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig';
import ArtistDetailsModal from '../../Components/Modal/ArtistDetailsModal';
import { MusicApiSearch } from '../../Api/MusicApi';

const ArtistItem = ({ item, onOpenDetails, onNavigate, theme }) => {
  const [songCount, setSongCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await MusicApiSearch(item.name);
        setSongCount(res?.length || 0);
      } catch (e) { setSongCount(0); }
    };
    fetchCount();
  }, [item.name]);

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    if (typeof images === 'string') return images;
    return images.find(img => img.quality === '500x500')?.url || images[images.length - 1]?.url;
  };

  return (
    <View style={styles.artistRow}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => onNavigate(item)}>
        <Image 
          source={{ uri: getImageUrl(item.image) }} 
          style={[styles.artistRowImage, { backgroundColor: theme.LightGray }]} 
        />
        <View style={styles.artistRowText}>
          <Text style={[styles.rowTitle, { color: theme.HeadingColor }]}>{item.name}</Text>
          <Text style={[styles.rowSub, { color: theme.SecondaryText }]}>
            Artist  |  Songs: {songCount === null ? "..." : songCount}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{ padding: 10 }} 
        onPress={() => onOpenDetails(item)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color={theme.SecondaryText} />
      </TouchableOpacity>
    </View>
  );
};

const ArtistListSection = ({ data }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const openDetails = (item) => {
    setSelectedArtist(item);
    setModalVisible(true);
  };

  const goToArtistPage = () => {
    if(selectedArtist) {
        setModalVisible(false);
        navigation.navigate('ArtistSongList', {
            artistData: selectedArtist
        });
    }
  };

  const navigateToArtist = (item) => {
    navigation.navigate('ArtistSongList', {
        artistData: item
    });
  };

  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ArtistItem item={item} onOpenDetails={openDetails} onNavigate={navigateToArtist} theme={theme} />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        backgroundColor={theme.WhiteBackground}
      />
      <ArtistDetailsModal 
        visible={modalVisible} 
        artist={selectedArtist} 
        onClose={() => setModalVisible(false)}
        onPlayPress={goToArtistPage} 
      />
    </>
  );
};

export default ArtistListSection;

const styles = StyleSheet.create({
  listContent: { 
    paddingBottom: verticalScale(100), 
    paddingHorizontal: scale(20), 
    paddingTop: verticalScale(10) 
  },
  artistRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: verticalScale(20), 
    justifyContent: 'space-between' 
  },
  artistRowImage: { 
    width: moderateScale(60), 
    height: moderateScale(60), 
    borderRadius: 100, 
  },
  artistRowText: { 
    flex: 1, 
    marginLeft: scale(15), 
    justifyContent: 'center' 
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