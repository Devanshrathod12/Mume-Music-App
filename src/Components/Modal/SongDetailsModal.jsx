import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Modal,
  Image,
  PanResponder,
  ScrollView,
  Dimensions
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig';
import colors from '../../Styles/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SongDetailsModal = ({ visible, onClose, song, onPlayNext }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  // Animation Values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Gesture State
  const lastDy = useRef(0).current;

  // 1. Open/Close Animation
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Reset like state on new song open
      setIsLiked(false);
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // 2. PanResponder (Drag Down Gesture Logic)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
         // Only activate if dragging DOWN significantly
         return gestureState.dy > 5;
      },
      onPanResponderGrant: () => {
        translateY.setOffset(lastDy);
        translateY.setValue(0);
      },
      onPanResponderMove: Animated.event(
        [null, { dy: translateY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        // Agar user ne jada neeche khich diya (drag > 150) ya fast swipe kiya
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
            closeWithAnimation();
        } else {
            // Wapas upar bounce karega
            Animated.spring(translateY, {
              toValue: 0,
              bounciness: 5,
              useNativeDriver: true,
            }).start();
        }
      },
    })
  ).current;

  const closeWithAnimation = () => {
    Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
    }).start(() => {
        onClose();
        // Reset transform for next open
        setTimeout(() => translateY.setValue(0), 100); 
    });
  };

  // Helper Functions (Same as in List)
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    return Array.isArray(img) ? (img.find(i => i.quality === '500x500')?.url || img[img.length-1]?.url) : img;
  };

  const getSubtitle = () => {
    if(!song) return "";
    const artist = song.artists?.primary?.[0]?.name || song.artist || "Unknown";
    // Dummy Duration conversion logic if seconds provided, else default string
    const duration = song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')} mins` : "";
    return `${artist}  |  ${duration}`;
  };

  // List of Menu Items (From Screenshot)
  const menuItems = [
    { title: "Play Next", icon: "arrow-forward-circle-outline", action: () => { onPlayNext(song); onClose(); } },
    { title: "Add to Playing Queue", icon: "albums-outline" },
    { title: "Add to Playlist", icon: "add-circle-outline" },
    { title: "Go to Album", icon: "disc-outline" },
    { title: "Go to Artist", icon: "person-outline" },
    { title: "Details", icon: "information-circle-outline" },
    { title: "Set as Ringtone", icon: "call-outline" },
    { title: "Add to Blacklist", icon: "close-circle-outline" },
    { title: "Share", icon: "paper-plane-outline" },
    { title: "Delete from Device", icon: "trash-outline" },
  ];

  if (!song) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeWithAnimation}>
      
      {/* Black Transparent Overlay - closes modal on tap */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeWithAnimation} />

      {/* Main DragSheet Container */}
      <Animated.View 
        style={[
            styles.modalContainer,
            { transform: [{ translateY: Animated.add(slideAnim, translateY) }] }
        ]}
      >
          {/* Header Area (With Gesture Handler) */}
          <View {...panResponder.panHandlers} style={styles.dragHeader}>
               {/* Grey Drag Bar */}
               <View style={styles.dragHandle} />
               
               {/* Song Info Row */}
               <View style={styles.songHeader}>
                   {/* Image */}
                   <Image 
                      source={{ uri: getImageUrl(song.image) }} 
                      style={styles.headerImage} 
                   />
                   
                   {/* Text */}
                   <View style={styles.headerTextContainer}>
                        <Text style={styles.songTitle} numberOfLines={1}>{song.name}</Text>
                        <Text style={styles.songSub} numberOfLines={1}>{getSubtitle()}</Text>
                   </View>

                   {/* Heart Icon Toggle */}
                   <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                       <Ionicons 
                         name={isLiked ? "heart" : "heart-outline"} 
                         size={moderateScale(28)} 
                         color={isLiked ? "#E11D48" : colors.Black} // Red when liked
                       />
                   </TouchableOpacity>
               </View>

               {/* Subtle Divider */}
               <View style={styles.divider} />
          </View>

          {/* Options Scroll List */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {menuItems.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.menuRow}
                    onPress={() => item.action && item.action()}
                    activeOpacity={0.6}
                  >
                      <Ionicons name={item.icon} size={moderateScale(24)} color={colors.HeadingColor} style={styles.menuIcon} />
                      <Text style={styles.menuText}>{item.title}</Text>
                  </TouchableOpacity>
              ))}
          </ScrollView>

      </Animated.View>
    </Modal>
  );
};

export default SongDetailsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    height: '80%', // 80-85% height jaisa screenshot me hai
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden', // Corners ke liye
  },
  // Drag & Header
  dragHeader: {
    paddingHorizontal: scale(25),
    paddingTop: verticalScale(15),
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  dragHandle: {
    width: scale(50),
    height: scale(5),
    backgroundColor: '#E2E8F0', // Light Grey Bar
    borderRadius: scale(10),
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },
  songHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  headerImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: scale(12),
    backgroundColor: colors.LightGray
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: scale(15),
    justifyContent: 'center',
    paddingRight: scale(10)
  },
  songTitle: {
    fontSize: textScale(18),
    fontWeight: '700',
    color: colors.HeadingColor,
    marginBottom: verticalScale(2)
  },
  songSub: {
    fontSize: textScale(12),
    color: '#64748B', // Grey text for Artist | Time
    fontWeight: '500'
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9', // Very light divider line
    width: '100%',
    marginBottom: verticalScale(10)
  },
  // List
  scrollContent: {
      paddingHorizontal: scale(25),
      paddingBottom: verticalScale(50), // Bottom safe space
  },
  menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: verticalScale(14),
  },
  menuIcon: {
      marginRight: scale(15),
      color: colors.HeadingColor,
  },
  menuText: {
      fontSize: textScale(16),
      fontWeight: '500',
      color: colors.HeadingColor
  }
});