import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native'; // Added Navigation Hook
import colors from '../../Styles/colors';
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig';
import ArtistDetailsModal from '../../Components/Modal/ArtistDetailsModal';

const ArtistItem = ({ item, onOpenDetails }) => {
  const [songCount, setSongCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`https://saavn.sumit.co/api/artists/${item.id}/songs`);
        // Using length of songs array (e.g. 10)
        const count = res.data?.data?.songs?.length || 0;
        setSongCount(count);
      } catch (e) { setSongCount(0); }
    };
    fetchCount();
  }, [item.id]);

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://cdn.pixabay.com/photo/2023/02/16/03/43/music-player-7792956_1280.jpg';
    return images[images.length - 1]?.url;
  };

  return (
    <View style={styles.artistRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Image source={{ uri: getImageUrl(item.image) }} style={styles.artistRowImage} />
        <View style={styles.artistRowText}>
          <Text style={styles.rowTitle}>{item.name}</Text>
          <Text style={styles.rowSub}>
            Artist  |  Songs: {songCount === null ? "..." : songCount}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={{ padding: 10 }} onPress={() => onOpenDetails(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.SecondaryText} />
      </TouchableOpacity>
    </View>
  );
};

const ArtistListSection = ({ data }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const openDetails = (item) => {
    setSelectedArtist(item);
    setModalVisible(true);
  };

  // Navigates to Artist Detail Page
  const goToArtistPage = () => {
    if(selectedArtist) {
        setModalVisible(false);
        navigation.navigate('ArtistSongList', {
            artistData: selectedArtist
        });
    }
  };

  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item }) => <ArtistItem item={item} onOpenDetails={openDetails} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <ArtistDetailsModal 
        visible={modalVisible} 
        artist={selectedArtist} 
        onClose={() => setModalVisible(false)}
        onPlayPress={goToArtistPage} // NAVIGATION TRIGGER HERE
      />
    </>
  );
};

export default ArtistListSection;

const styles = StyleSheet.create({
  listContent: { paddingBottom: verticalScale(100), paddingHorizontal: scale(20), paddingTop: verticalScale(10) },
  artistRow: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(20), justifyContent: 'space-between' },
  artistRowImage: { width: moderateScale(60), height: moderateScale(60), borderRadius: 100, backgroundColor: colors.LightGray },
  artistRowText: { flex: 1, marginLeft: scale(15), justifyContent: 'center' },
  rowTitle: { fontSize: textScale(16), fontWeight: 'bold', color: colors.Black, marginBottom: 4 },
  rowSub: { fontSize: textScale(12), color: colors.SecondaryText, fontWeight: '500' },
});