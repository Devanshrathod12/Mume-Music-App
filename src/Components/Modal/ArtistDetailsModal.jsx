import React, { useRef, useEffect } from 'react';
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

const ArtistDetailsModal = ({ visible, onClose, artist }) => {
  // Animation Values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // Entry animation
  const translateY = useRef(new Animated.Value(0)).current; // Drag gesture value

  // 1. Open/Close Animation (Jab modal khulega tab niche se upar aayega)
  useEffect(() => {
    if (visible) {
      // Modal open animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Reset drag value on open
      translateY.setValue(0);
    } else {
      // Modal close animation
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // 2. PanResponder (Sirf NICHE drag karne ki logic)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      
      // Grant: Touch shuru hote hi offset set nahi karenge taaki complex na ho, bas current value lenge
      onPanResponderGrant: () => {
        translateY.setValue(0);
      },

      // Move: Yahan fix kiya hai logic
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
           // Agar gesture niche ki taraf hai (positive), toh modal ko move karo
           translateY.setValue(gestureState.dy);
        } else {
           // Agar gesture upar ki taraf hai (negative), toh modal ko 0 par lock rakho (upar mat jane do)
           translateY.setValue(0);
        }
      },

      // Release: Chodne par kya hoga
      onPanResponderRelease: (e, gestureState) => {
        // Agar bhot tezi se niche swip kiya ya 100px se jyada niche khich liya
        if (gestureState.dy > 120 || gestureState.vy > 1.5) {
            closeWithAnimation();
        } else {
            // Wapas apni jagah bounce back karo (Open state me)
            Animated.spring(translateY, {
              toValue: 0,
              bounciness: 5,
              useNativeDriver: true,
            }).start();
        }
      },
    })
  ).current;

  // Custom Close Helper
  const closeWithAnimation = () => {
    Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
    }).start(() => {
        onClose();
        // Resetting just in case
        translateY.setValue(0);
    });
  };

  // Helper: Get Image URL
  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    return Array.isArray(images) 
      ? (images.find(img => img.quality === '500x500')?.url || images[images.length - 1]?.url)
      : images;
  };

  // Menu Items Array
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
      
      {/* 1. Dark Background Overlay (Touches here close modal) */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeWithAnimation} />

      {/* 2. Main Sheet Container */}
      <Animated.View 
        style={[
            styles.modalContainer,
            // Apply both Entry Animation + Drag Animation
            { transform: [{ translateY: Animated.add(slideAnim, translateY) }] }
        ]}
      >
          {/* Header Area (Is par drag gesture apply kiya hai) */}
          <View {...panResponder.panHandlers} style={styles.dragHeader}>
               <View style={styles.dragHandle} />
               
               {/* Artist Info Row */}
               <View style={styles.artistHeader}>
                   <Image 
                      source={{ uri: getImageUrl(artist.image) }} 
                      style={styles.headerImage} 
                   />
                   
                   <View style={styles.headerTextContainer}>
                        <Text style={styles.artistTitle} numberOfLines={1}>{artist.name}</Text>
                        <Text style={styles.artistSub}>1 Album  |  20 Songs</Text> 
                   </View>
               </View>

               <View style={styles.divider} />
          </View>

          {/* List Options */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            bounces={false} // List bounce band kiya taaki modal hilne na lage
          >
              {menuItems.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.menuRow}
                    activeOpacity={0.6}
                    onPress={() => {
                        console.log("Clicked:", item.title);
                        closeWithAnimation(); 
                    }}
                  >
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Darken background
  },
  modalContainer: {
    height: '56%', // FIX HEIGHT: Ye fixed rahegi, isse upar drag nahi hoga
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
  },
  dragHeader: {
    paddingHorizontal: scale(25),
    paddingTop: verticalScale(15),
    backgroundColor: '#FFFFFF',
    // zIndex zruri hai taaki header touch receive kare
    zIndex: 1,
  },
  dragHandle: {
    width: scale(50),
    height: scale(5),
    backgroundColor: '#E2E8F0',
    borderRadius: scale(10),
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },
  artistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  headerImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: 100, // Round
    backgroundColor: colors.LightGray
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: scale(15),
    justifyContent: 'center',
  },
  artistTitle: {
    fontSize: textScale(18),
    fontWeight: '700',
    color: colors.HeadingColor,
    marginBottom: verticalScale(4)
  },
  artistSub: {
    fontSize: textScale(12),
    color: '#64748B', 
    fontWeight: '500'
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
    marginBottom: verticalScale(10)
  },
  scrollContent: {
      paddingHorizontal: scale(25),
      paddingBottom: verticalScale(30),
  },
  menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: verticalScale(15),
  },
  menuIcon: {
      marginRight: scale(20),
      color: colors.HeadingColor,
  },
  menuText: {
      fontSize: textScale(16),
      fontWeight: '600',
      color: colors.HeadingColor
  }
});