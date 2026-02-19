import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Modal, Image, PanResponder, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import Ionicons from '@react-native-vector-icons/ionicons';
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig';
import colors from '../../Styles/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ArtistDetailsModal = ({ visible, onClose, artist, onPlayPress }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Song count fetch from array length logic
  const [songCount, setSongCount] = useState('...');

  useEffect(() => {
    if (visible && artist?.id) {
        fetchDataCount(artist.id);
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        translateY.setValue(0);
    } else {
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible, artist?.id]);

  const fetchDataCount = async (id) => {
      try {
          const res = await axios.get(`https://saavn.sumit.co/api/artists/${id}/songs`);
          // ARRAY KI LENGTH (Jitne songs list me mile, e.g. 10)
          const currentArrayCount = res.data?.data?.songs?.length || 0;
          setSongCount(currentArrayCount);
      } catch (error) {
          setSongCount(0);
      }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
        else translateY.setValue(0);
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 1.5) closeWithAnimation();
        else {
            Animated.spring(translateY, { toValue: 0, bounciness: 5, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const closeWithAnimation = () => {
    Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }).start(() => {
        onClose();
        translateY.setValue(0);
    });
  };

  // Naya handler menu items ke liye
  const handleItemPress = (itemTitle) => {
    if (itemTitle === "Play") {
        onPlayPress(); // Trigger navigation callback in parent
        onClose(); // Modal band karo
    } else {
        console.log("Clicked:", itemTitle);
        closeWithAnimation();
    }
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    return Array.isArray(images) 
      ? (images.find(img => img.quality === '500x500')?.url || images[images.length - 1]?.url)
      : images;
  };

  const menuItems = [
    { title: "Play", icon: "play-circle-outline" },
    { title: "Play Next", icon: "arrow-forward-circle-outline" },
    { title: "Add to Playing Queue", icon: "albums-outline" },
    { title: "Add to Playlist", icon: "add-circle-outline" },
    { title: "Share", icon: "paper-plane-outline" },
  ];

  if (!artist) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeWithAnimation}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeWithAnimation} />
      <Animated.View style={[styles.modalContainer, { transform: [{ translateY: Animated.add(slideAnim, translateY) }] }]}>
          <View {...panResponder.panHandlers} style={styles.dragHeader}>
               <View style={styles.dragHandle} />
               <View style={styles.artistHeader}>
                   <Image source={{ uri: getImageUrl(artist.image) }} style={styles.headerImage} />
                   <View style={styles.headerTextContainer}>
                        <Text style={styles.artistTitle} numberOfLines={1}>{artist.name}</Text>
                        <Text style={styles.artistSub}>Artist  |  {songCount} Songs</Text> 
                   </View>
               </View>
               <View style={styles.divider} />
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
              {menuItems.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.menuRow} activeOpacity={0.6} onPress={() => handleItemPress(item.title)}>
                      <Ionicons name={item.icon} size={moderateScale(26)} color={colors.HeadingColor} style={styles.menuIcon} />
                      <Text style={styles.menuText}>{item.title}</Text>
                  </TouchableOpacity>
              ))}
          </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default ArtistDetailsModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { height: '56%', width: '100%', backgroundColor: '#FFFFFF', borderTopLeftRadius: scale(30), borderTopRightRadius: scale(30), position: 'absolute', bottom: 0, overflow: 'hidden' },
  dragHeader: { paddingHorizontal: scale(25), paddingTop: verticalScale(15), backgroundColor: '#FFFFFF', zIndex: 1 },
  dragHandle: { width: scale(50), height: scale(5), backgroundColor: '#E2E8F0', borderRadius: scale(10), alignSelf: 'center', marginBottom: verticalScale(20) },
  artistHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(20) },
  headerImage: { width: moderateScale(60), height: moderateScale(60), borderRadius: 100, backgroundColor: colors.LightGray },
  headerTextContainer: { flex: 1, marginLeft: scale(15), justifyContent: 'center' },
  artistTitle: { fontSize: textScale(18), fontWeight: '700', color: colors.HeadingColor, marginBottom: verticalScale(4) },
  artistSub: { fontSize: textScale(12), color: '#64748B', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', width: '100%', marginBottom: verticalScale(10) },
  scrollContent: { paddingHorizontal: scale(25), paddingBottom: verticalScale(30) },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: verticalScale(15) },
  menuIcon: { marginRight: scale(20) },
  menuText: { fontSize: textScale(16), fontWeight: '600', color: colors.HeadingColor }
});