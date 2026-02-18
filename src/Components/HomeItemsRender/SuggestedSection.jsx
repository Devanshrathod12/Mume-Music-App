import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import colors from '../../Styles/colors'
import { scale, verticalScale, textScale, width } from '../../Styles/StyleConfig'

const SuggestedSection = ({ suggestedData }) => {
    
    const getImageUrl = (images) => {
        if (!images || images.length === 0) return 'https://via.placeholder.com/150';
        return images.find(img => img.quality === '500x500')?.url || images[images.length - 1]?.url;
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(100) }} showsVerticalScrollIndicator={false}>
            {/* Recently Played */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recently Played</Text>
                <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <FlatList 
                horizontal
                data={suggestedData.recentlyPlayed}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: scale(20) }}
                renderItem={({item}) => (
                    <View style={styles.horizontalCard}>
                        <Image source={{uri: getImageUrl(item.image)}} style={styles.horizontalImage} />
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cardSub} numberOfLines={1}>{item.artist || "Artist"}</Text>
                    </View>
                )}
            />

            {/* Artists */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Artists</Text>
                <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <FlatList 
                horizontal
                data={suggestedData.artists}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: scale(20) }}
                renderItem={({item}) => (
                    <View style={styles.artistCircleCard}>
                        <Image source={{uri: getImageUrl(item.image)}} style={styles.artistImageCircle} />
                        <Text style={styles.artistNameCircle} numberOfLines={1}>{item.name}</Text>
                    </View>
                )}
            />

            {/* Most Played */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Most Played</Text>
                <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            {suggestedData.mostPlayed.map((item) => (
                <View key={item.id} style={styles.bigCard}>
                    <Image source={{uri: getImageUrl(item.image)}} style={styles.bigCardImage} />
                    <View style={styles.bigCardText}>
                        <Text style={styles.bigCardTitle}>{item.name}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

export default SuggestedSection

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(20), marginTop: verticalScale(20), marginBottom: verticalScale(12) },
  sectionTitle: { fontSize: textScale(18), fontWeight: 'bold', color: colors.HeadingColor },
  seeAll: { fontSize: textScale(14), color: colors.Primary, fontWeight: '600' },
  horizontalCard: { width: scale(140), marginRight: scale(15) },
  horizontalImage: { width: scale(140), height: scale(140), borderRadius: 20, marginBottom: 8 },
  cardTitle: { fontSize: textScale(14), fontWeight: 'bold', color: colors.Black },
  cardSub: { fontSize: textScale(12), color: colors.SecondaryText },
  artistCircleCard: { alignItems: 'center', marginRight: scale(15) },
  artistImageCircle: { width: scale(80), height: scale(80), borderRadius: 100, marginBottom: 6 },
  artistNameCircle: { fontSize: textScale(12), fontWeight: '600', color: colors.Black, width: scale(80), textAlign: 'center' },
  bigCard: { width: width - scale(40), marginHorizontal: scale(20), height: verticalScale(200), borderRadius: 20, marginBottom: 20, overflow: 'hidden' },
  bigCardImage: { width: '100%', height: '100%' },
  bigCardText: { position: 'absolute', bottom: 15, left: 15, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  bigCardTitle: { color: 'white', fontWeight: 'bold', fontSize: textScale(16) }
})