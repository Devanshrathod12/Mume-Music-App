import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react' // Import useState
import Ionicons from '@react-native-vector-icons/ionicons'
import colors from '../../Styles/colors'
import { scale, verticalScale, moderateScale, textScale } from '../../Styles/StyleConfig'

// IMPORT NEW MODAL
import ArtistDetailsModal from '../../Components/Modal/ArtistDetailsModal';

const ArtistListSection = ({ data }) => {
    
  // --- STATE FOR MODAL ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/150';
    return images[images.length - 1]?.url;
  };

  // --- OPEN MODAL FUNCTION ---
  const openDetails = (item) => {
      setSelectedArtist(item);
      setModalVisible(true);
  };

  const renderItem = ({ item }) => (
      <View style={styles.artistRow}>
         {/* Artist Image & Name Section */}
         <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
             <Image source={{ uri: getImageUrl(item.image) }} style={styles.artistRowImage} />
             <View style={styles.artistRowText}>
                 <Text style={styles.rowTitle}>{item.name}</Text>
                 <Text style={styles.rowSub}>1 Album  |  Songs: N/A</Text>
             </View>
         </View>

         {/* Three Dots - Clicking this opens the modal */}
         <TouchableOpacity 
            style={{ padding: 10 }}
            onPress={() => openDetails(item)}
         >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.SecondaryText} />
         </TouchableOpacity>
      </View>
  );

  return (
    <>
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />

        {/* --- ARTIST DETAILS MODAL --- */}
        <ArtistDetailsModal 
            visible={modalVisible}
            artist={selectedArtist}
            onClose={() => setModalVisible(false)}
        />
    </>
  )
}

export default ArtistListSection

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
    justifyContent: 'space-between' // Ensures dots go to right
  },
  artistRowImage: { 
    width: moderateScale(60), 
    height: moderateScale(60), 
    borderRadius: 100, // Circular
    backgroundColor: colors.LightGray 
  },
  artistRowText: { 
    flex: 1, 
    marginLeft: scale(15), 
    justifyContent: 'center' 
  },
  rowTitle: { 
    fontSize: textScale(16), 
    fontWeight: 'bold', 
    color: colors.Black, 
    marginBottom: 4 
  },
  rowSub: { 
    fontSize: textScale(12), 
    color: colors.SecondaryText, 
    fontWeight: '500' 
  },
})