// import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import TrackPlayer, { useActiveTrack } from 'react-native-track-player';

// import colors from '../../Styles/colors'
// import { scale, verticalScale, textScale, width } from '../../Styles/StyleConfig'

// const SuggestedSection = ({ suggestedData }) => {
//     const navigation = useNavigation();
//     const activeTrack = useActiveTrack(); // Current playing song detect karne ke liye
//     const [recentSongs, setRecentSongs] = useState([]);

//     useEffect(() => {
//         loadRecentlyPlayed();
//     }, [activeTrack]); // Jab gaana change ho, list refresh ho jaye

//     const loadRecentlyPlayed = async () => {
//         try {
//             const savedQueue = await AsyncStorage.getItem('mini_player_queue');
//             if (savedQueue) {
//                 const parsedData = JSON.parse(savedQueue);
//                 // Sirf top 10 gaane dikhayenge recently played mein
//                 setRecentSongs(parsedData.slice(0, 10));
//             }
//         } catch (error) {
//             console.log("Error loading recent songs", error);
//         }
//     };

//     const getImageUrl = (images) => {
//         if (!images) return 'https://via.placeholder.com/150';
//         if (typeof images === 'string') return images;
//         return images.find(img => img.quality === '500x500')?.url || images[images.length - 1]?.url;
//     };

//     // Gaana play karne ka function
//     const handleRecentPlay = async (item, index) => {
//         try {
//             await TrackPlayer.reset();
//             await TrackPlayer.add(recentSongs);
//             await TrackPlayer.skip(index);
//             await TrackPlayer.play();
//             navigation.navigate('MusicPlayer');
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     return (
//         <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(100) }} showsVerticalScrollIndicator={false}>
            
//             {/* 1. REAL Recently Played (From Storage) */}
//             {recentSongs.length > 0 && (
//                 <>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>Recently Played</Text>
//                         <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
//                     </View>
//                     <FlatList 
//                         horizontal
//                         data={recentSongs}
//                         keyExtractor={(item, index) => index.toString()}
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={{ paddingHorizontal: scale(20) }}
//                         renderItem={({item, index}) => {
//                             const isPlaying = activeTrack?.id === item.id;
//                             return (
//                                 <TouchableOpacity 
//                                     style={styles.horizontalCard} 
//                                     onPress={() => handleRecentPlay(item, index)}
//                                 >
//                                     <View>
//                                         <Image source={{uri: getImageUrl(item.artwork || item.image)}} style={styles.horizontalImage} />
//                                         {isPlaying && (
//                                             <View style={styles.playingOverlay}>
//                                                 <Text style={styles.playingText}>Playing</Text>
//                                             </View>
//                                         )}
//                                     </View>
//                                     <Text style={[styles.cardTitle, isPlaying && {color: colors.Primary}]} numberOfLines={1}>
//                                         {item.title || item.name}
//                                     </Text>
//                                     <Text style={styles.cardSub} numberOfLines={1}>{item.artist || "Artist"}</Text>
//                                 </TouchableOpacity>
//                             )
//                         }}
//                     />
//                 </>
//             )}

//             {/* 2. Top Artists (API Data) */}
//             <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>Top Artists</Text>
//                 <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
//             </View>
//             <FlatList 
//                 horizontal
//                 data={suggestedData.artists}
//                 keyExtractor={item => item.id}
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ paddingHorizontal: scale(20) }}
//                 renderItem={({item}) => (
//                     <TouchableOpacity 
//                         style={styles.artistCircleCard}
//                         onPress={() => navigation.navigate('ArtistSongList', { artistData: item })}
//                     >
//                         <Image source={{uri: getImageUrl(item.image)}} style={styles.artistImageCircle} />
//                         <Text style={styles.artistNameCircle} numberOfLines={1}>{item.name}</Text>
//                     </TouchableOpacity>
//                 )}
//             />

//             {/* 3. Most Played / Trending (API Data) */}
//             <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>Trending Now</Text>
//             </View>
//             {suggestedData.recentlyPlayed.slice(0, 3).map((item) => (
//                 <TouchableOpacity 
//                     key={item.id} 
//                     style={styles.bigCard}
//                     onPress={() => navigation.navigate('MusicPlayer')}
//                 >
//                     <Image source={{uri: getImageUrl(item.image)}} style={styles.bigCardImage} />
//                     <View style={styles.bigCardText}>
//                         <Text style={styles.bigCardTitle}>{item.name}</Text>
//                         <Text style={styles.bigCardSub}>Featured Trending</Text>
//                     </View>
//                 </TouchableOpacity>
//             ))}
//         </ScrollView>
//     )
// }

// export default SuggestedSection

// const styles = StyleSheet.create({
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(20), marginTop: verticalScale(20), marginBottom: verticalScale(12) },
//   sectionTitle: { fontSize: textScale(18), fontWeight: 'bold', color: colors.HeadingColor },
//   seeAll: { fontSize: textScale(14), color: colors.Primary, fontWeight: '600' },
//   horizontalCard: { width: scale(140), marginRight: scale(15) },
//   horizontalImage: { width: scale(140), height: scale(140), borderRadius: 20, marginBottom: 8 },
//   playingOverlay: { 
//       position: 'absolute', 
//       width: scale(140), 
//       height: scale(140), 
//       backgroundColor: 'rgba(255, 107, 0, 0.4)', 
//       borderRadius: 20, 
//       justifyContent: 'center', 
//       alignItems: 'center' 
//   },
//   playingText: { color: 'white', fontWeight: 'bold', fontSize: textScale(12), backgroundColor: colors.Primary, paddingHorizontal: 8, borderRadius: 5 },
//   cardTitle: { fontSize: textScale(14), fontWeight: 'bold', color: colors.Black },
//   cardSub: { fontSize: textScale(12), color: colors.SecondaryText },
//   artistCircleCard: { alignItems: 'center', marginRight: scale(15) },
//   artistImageCircle: { width: scale(80), height: scale(80), borderRadius: 100, marginBottom: 6 },
//   artistNameCircle: { fontSize: textScale(12), fontWeight: '600', color: colors.Black, width: scale(80), textAlign: 'center' },
//   bigCard: { width: width - scale(40), marginHorizontal: scale(20), height: verticalScale(180), borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 5, backgroundColor: 'white' },
//   bigCardImage: { width: '100%', height: '100%' },
//   bigCardText: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 15 },
//   bigCardTitle: { color: 'white', fontWeight: 'bold', fontSize: textScale(18) },
//   bigCardSub: { color: '#ddd', fontSize: textScale(12) }
// })
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';

// Theme & Config
import { useTheme } from '../../Context/ThemeContext';
import { scale, verticalScale, textScale, width } from '../../Styles/StyleConfig'

const SuggestedSection = ({ suggestedData }) => {
    const navigation = useNavigation();
    const { theme } = useTheme(); // 👈 Theme Access
    const activeTrack = useActiveTrack();
    const [recentSongs, setRecentSongs] = useState([]);

    useEffect(() => {
        loadRecentlyPlayed();
    }, [activeTrack]);

    const loadRecentlyPlayed = async () => {
        try {
            const savedQueue = await AsyncStorage.getItem('mini_player_queue');
            if (savedQueue) {
                const parsedData = JSON.parse(savedQueue);
                setRecentSongs(parsedData.slice(0, 10));
            }
        } catch (error) {
            console.log("Error loading recent songs", error);
        }
    };

    const getImageUrl = (images) => {
        if (!images) return 'https://via.placeholder.com/150';
        if (typeof images === 'string') return images;
        return images.find(img => img.quality === '500x500')?.url || images[images.length - 1]?.url;
    };

    const handleRecentPlay = async (item, index) => {
        try {
            await TrackPlayer.reset();
            await TrackPlayer.add(recentSongs);
            await TrackPlayer.skip(index);
            await TrackPlayer.play();
            navigation.navigate('MusicPlayer');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ScrollView 
            contentContainerStyle={{ paddingBottom: verticalScale(100) }} 
            showsVerticalScrollIndicator={false}
            backgroundColor={theme.WhiteBackground} // 👈 Sync background
        >
            
            {/* 1. Recently Played */}
            {recentSongs.length > 0 && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.HeadingColor }]}>Recently Played</Text>
                        <TouchableOpacity><Text style={[styles.seeAll, { color: theme.Primary }]}>See All</Text></TouchableOpacity>
                    </View>
                    <FlatList 
                        horizontal
                        data={recentSongs}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: scale(20) }}
                        renderItem={({item, index}) => {
                            const isPlaying = activeTrack?.id === item.id;
                            return (
                                <TouchableOpacity 
                                    style={styles.horizontalCard} 
                                    onPress={() => handleRecentPlay(item, index)}
                                >
                                    <View>
                                        <Image source={{uri: getImageUrl(item.artwork || item.image)}} style={[styles.horizontalImage, { backgroundColor: theme.LightGray }]} />
                                        {isPlaying && (
                                            <View style={[styles.playingOverlay, { backgroundColor: theme.Overlay }]}>
                                                <Text style={[styles.playingText, { backgroundColor: theme.Primary }]}>Playing</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[styles.cardTitle, { color: isPlaying ? theme.Primary : theme.Black }]} numberOfLines={1}>
                                        {item.title || item.name}
                                    </Text>
                                    <Text style={[styles.cardSub, { color: theme.SecondaryText }]} numberOfLines={1}>{item.artist || "Artist"}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </>
            )}

            {/* 2. Top Artists */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.HeadingColor }]}>Top Artists</Text>
                <TouchableOpacity><Text style={[styles.seeAll, { color: theme.Primary }]}>See All</Text></TouchableOpacity>
            </View>
            <FlatList 
                horizontal
                data={suggestedData?.artists || []}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: scale(20) }}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        style={styles.artistCircleCard}
                        onPress={() => navigation.navigate('ArtistSongList', { artistData: item })}
                    >
                        <Image source={{uri: getImageUrl(item.image)}} style={[styles.artistImageCircle, { backgroundColor: theme.LightGray }]} />
                        <Text style={[styles.artistNameCircle, { color: theme.Black }]} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {recentSongs.length > 0 && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.HeadingColor }]}>Most Played</Text>
                        <TouchableOpacity><Text style={[styles.seeAll, { color: theme.Primary }]}>See All</Text></TouchableOpacity>
                    </View>
                    <FlatList 
                        horizontal
                        data={recentSongs}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: scale(20) }}
                        renderItem={({item, index}) => {
                            const isPlaying = activeTrack?.id === item.id;
                            return (
                                <TouchableOpacity 
                                    style={styles.horizontalCard} 
                                    onPress={() => handleRecentPlay(item, index)}
                                >
                                    <View>
                                        <Image source={{uri: getImageUrl(item.artwork || item.image)}} style={[styles.horizontalImage, { backgroundColor: theme.LightGray }]} />
                                        {isPlaying && (
                                            <View style={[styles.playingOverlay, { backgroundColor: theme.Overlay }]}>
                                                <Text style={[styles.playingText, { backgroundColor: theme.Primary }]}>Playing</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[styles.cardTitle, { color: isPlaying ? theme.Primary : theme.Black }]} numberOfLines={1}>
                                        {item.title || item.name}
                                    </Text>
                                    <Text style={[styles.cardSub, { color: theme.SecondaryText }]} numberOfLines={1}>{item.artist || "Artist"}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </>
            )}

        </ScrollView>
    )
}

export default SuggestedSection

const styles = StyleSheet.create({
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(20), marginTop: verticalScale(20), marginBottom: verticalScale(12) },
    sectionTitle: { fontSize: textScale(18), fontWeight: 'bold' },
    seeAll: { fontSize: textScale(14), fontWeight: '600' },
    horizontalCard: { width: scale(140), marginRight: scale(15) },
    horizontalImage: { width: scale(140), height: scale(140), borderRadius: 20, marginBottom: 8 },
    playingOverlay: { position: 'absolute', width: scale(140), height: scale(140), borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    playingText: { color: 'white', fontWeight: 'bold', fontSize: textScale(12), paddingHorizontal: 8, borderRadius: 5 },
    cardTitle: { fontSize: textScale(14), fontWeight: 'bold' },
    cardSub: { fontSize: textScale(12) },
    artistCircleCard: { alignItems: 'center', marginRight: scale(15) },
    artistImageCircle: { width: scale(80), height: scale(80), borderRadius: 100, marginBottom: 6 },
    artistNameCircle: { fontSize: textScale(12), fontWeight: '600', width: scale(80), textAlign: 'center' },
    bigCard: { width: width - scale(40), marginHorizontal: scale(20), height: verticalScale(180), borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 5 },
    bigCardImage: { width: '100%', height: '100%' },
    bigCardText: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15 },
    bigCardTitle: { color: 'white', fontWeight: 'bold', fontSize: textScale(18) },
    bigCardSub: { color: '#ddd', fontSize: textScale(12) }
})