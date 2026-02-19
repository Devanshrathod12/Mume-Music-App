// import React from 'react';
// import { 
//     StyleSheet, Text, View, Image, TouchableOpacity, 
//     SafeAreaView, StatusBar, Dimensions 
// } from 'react-native';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import { useNavigation } from '@react-navigation/native';
// import TrackPlayer, { 
//     useActiveTrack, 
//     useIsPlaying, 
//     useProgress 
// } from 'react-native-track-player';
// import Slider from '@react-native-community/slider'; // IMP: Install kiya hua package

// // Imports
// import colors from '../Styles/colors'; // Apne path ke hisaab se check karna
// import { scale, verticalScale, textScale } from '../Styles/StyleConfig';

// const { width } = Dimensions.get('window');

// const MusicPlayer = () => {
//     const navigation = useNavigation();
    
//     // Track Player Hooks
//     const activeTrack = useActiveTrack();
//     const { playing } = useIsPlaying();
//     const { position, duration } = useProgress(); // Current Time & Total Time

//     // --- HELPER: Format Time ---
//     const formatTime = (seconds) => {
//         if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
//     };

//     // --- ACTIONS ---
    
//     const togglePlayback = async () => {
//         if (playing) {
//             await TrackPlayer.pause();
//         } else {
//             await TrackPlayer.play();
//         }
//     };

//     const skipToNext = async () => {
//         await TrackPlayer.skipToNext();
//     };

//     const skipToPrevious = async () => {
//         await TrackPlayer.skipToPrevious();
//     };

//     // -10 Seconds
//     const seekBackward = async () => {
//         const newPos = position - 10;
//         await TrackPlayer.seekTo(newPos > 0 ? newPos : 0);
//     };

//     // +10 Seconds
//     const seekForward = async () => {
//         const newPos = position + 10;
//         await TrackPlayer.seekTo(newPos < duration ? newPos : duration);
//     };

//     // ** Slider Change Logic (Jab user slider khinchega) **
//     const onSlidingComplete = async (value) => {
//         await TrackPlayer.seekTo(value);
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//             {/* --- HEADER --- */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="chevron-down-outline" size={32} color={colors.Black} />
//                 </TouchableOpacity>
//                 <TouchableOpacity>
//                     <Ionicons name="ellipsis-horizontal-circle" size={30} color={colors.Black} />
//                 </TouchableOpacity>
//             </View>

//             {/* --- MAIN CONTENT --- */}
//             <View style={styles.contentContainer}>
                
//                 {/* 1. ARTWORK (Shadow & Image) */}
//                 <View style={styles.artworkWrapper}>
//                     <Image 
//                         source={{ uri: activeTrack?.artwork || 'https://via.placeholder.com/300' }} 
//                         style={styles.artwork} 
//                     />
//                 </View>

//                 {/* 2. TRACK INFO */}
//                 <View style={styles.trackInfoContainer}>
//                     <View style={{flex: 1}}>
//                         <Text style={styles.trackTitle} numberOfLines={1}>
//                             {activeTrack?.title || "No Song Playing"}
//                         </Text>
//                         <Text style={styles.trackArtist} numberOfLines={1}>
//                             {activeTrack?.artist || "Unknown Artist"}
//                         </Text>
//                     </View>
//                 </View>

//                 {/* 3. SLIDER / PROGRESS BAR */}
//                 <View style={styles.progressBarContainer}>
//                     {/* Draggable Slider Component */}
//                     <Slider
//                         style={{width: '100%', height: 40}}
//                         value={position}
//                         minimumValue={0}
//                         maximumValue={duration}
//                         minimumTrackTintColor="#FF6B00" // Played (Orange)
//                         maximumTrackTintColor="#E2E8F0" // Remaining (Grey)
//                         thumbTintColor="#FF6B00"        // Circle Handle
//                         onSlidingComplete={onSlidingComplete} 
//                     />
                    
//                     <View style={styles.timeRow}>
//                         <Text style={styles.timeText}>{formatTime(position)}</Text>
//                         <Text style={styles.timeText}>{formatTime(duration)}</Text>
//                     </View>
//                 </View>

//                 {/* 4. MAIN CONTROLS */}
//                 <View style={styles.controlsContainer}>
                    
//                     {/* Prev Song */}
//                     <TouchableOpacity onPress={skipToPrevious}>
//                          <Ionicons name="play-skip-back" size={30} color={colors.Black} />
//                     </TouchableOpacity>

//                     {/* -10 Sec */}
//                     <TouchableOpacity onPress={seekBackward} style={styles.secondaryControl}>
//                          <Ionicons name="play-back-outline" size={30} color={colors.Black} />
//                     </TouchableOpacity>

//                     {/* Play/Pause Button */}
//                     <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
//                         <Ionicons 
//                             name={playing ? "pause" : "play"} 
//                             size={40} 
//                             color="#FFFFFF" 
//                             style={{ marginLeft: playing ? 0 : 4 }} 
//                         />
//                     </TouchableOpacity>

//                     {/* +10 Sec */}
//                     <TouchableOpacity onPress={seekForward} style={styles.secondaryControl}>
//                          <Ionicons name="play-forward-outline" size={30} color={colors.Black} />
//                     </TouchableOpacity>

//                     {/* Next Song */}
//                     <TouchableOpacity onPress={skipToNext}>
//                          <Ionicons name="play-skip-forward" size={30} color={colors.Black} />
//                     </TouchableOpacity>

//                 </View>

//                 {/* 5. BOTTOM ICONS */}
//                 <View style={styles.bottomIcons}>
//                     <Ionicons name="time-outline" size={24} color={colors.Black} />
//                     <Ionicons name="musical-notes-outline" size={24} color={colors.Black} />
//                     <Ionicons name="radio-outline" size={24} color={colors.Black} />
//                     <Ionicons name="list-outline" size={24} color={colors.Black} />
//                 </View>

//             </View>
//         </SafeAreaView>
//     );
// };

// export default MusicPlayer;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: scale(20),
//         paddingVertical: verticalScale(15),
//     },
//     headerTitle: {
//         fontSize: textScale(18),
//         fontWeight: '600',
//         color: colors.Black,
//     },
//     contentContainer: {
//         flex: 1,
//         paddingHorizontal: scale(25),
//         justifyContent: 'space-evenly',
//         paddingBottom: verticalScale(20)
//     },
    
//     // Artwork
//     artworkWrapper: {
//         width: width - scale(60),
//         height: width - scale(60),
//         borderRadius: 30,
//         elevation: 10,
//         shadowColor: '#FF6B00',
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.3,
//         shadowRadius: 10,
//         backgroundColor: '#F5F5F5',
//         alignSelf: 'center',
//         overflow: 'hidden' 
//     },
//     artwork: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//     },

//     // Track Info
//     trackInfoContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: verticalScale(10),
//         paddingHorizontal: scale(5)
//     },
//     trackTitle: {
//         fontSize: textScale(24),
//         fontWeight: 'bold',
//         color: colors.HeadingColor,
//         marginBottom: 4
//     },
//     trackArtist: {
//         fontSize: textScale(16),
//         color: '#64748B',
//         fontWeight: '500',
//     },

//     // Progress
//     progressBarContainer: {
//         marginTop: verticalScale(20),
//     },
//     timeRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: -8, 
//         paddingHorizontal: scale(5)
//     },
//     timeText: {
//         fontSize: textScale(12),
//         color: '#64748B',
//         fontWeight: '500'
//     },

//     // Controls
//     controlsContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: verticalScale(10),
//     },
//     secondaryControl: {
//         marginHorizontal: scale(5)
//     },
//     playButton: {
//         width: scale(75),
//         height: scale(75),
//         borderRadius: 100,
//         backgroundColor: '#FF6B00', // Orange
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 8,
//         shadowColor: '#FF6B00',
//         shadowOpacity: 0.4,
//         shadowRadius: 5
//     },

//     // Bottom
//     bottomIcons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: verticalScale(20),
//         paddingHorizontal: scale(20)
//     }
// });
import React from 'react';
import { 
    StyleSheet, Text, View, Image, TouchableOpacity, 
    SafeAreaView, StatusBar, Dimensions 
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { 
    useActiveTrack, 
    useIsPlaying, 
    useProgress 
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';

// Theme & Config
import { useTheme } from '../Context/ThemeContext'; // 👈 Theme Access
import { scale, verticalScale, textScale } from '../Styles/StyleConfig';

const { width } = Dimensions.get('window');

const MusicPlayer = () => {
    const navigation = useNavigation();
    const { theme } = useTheme(); // 👈 Context se theme liya
    
    const activeTrack = useActiveTrack();
    const { playing } = useIsPlaying();
    const { position, duration } = useProgress();

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayback = async () => {
        if (playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };

    const skipToNext = async () => {
        await TrackPlayer.skipToNext();
    };

    const skipToPrevious = async () => {
        await TrackPlayer.skipToPrevious();
    };

    const seekBackward = async () => {
        const newPos = position - 10;
        await TrackPlayer.seekTo(newPos > 0 ? newPos : 0);
    };

    const seekForward = async () => {
        const newPos = position + 10;
        await TrackPlayer.seekTo(newPos < duration ? newPos : duration);
    };

    const onSlidingComplete = async (value) => {
        await TrackPlayer.seekTo(value);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.WhiteBackground }]}>
            <StatusBar 
                barStyle={theme.WhiteBackground === '#FFFFFF' ? "dark-content" : "light-content"} 
                backgroundColor={theme.WhiteBackground} 
            />

            {/* --- HEADER --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-down-outline" size={32} color={theme.Black} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal-circle" size={30} color={theme.Black} />
                </TouchableOpacity>
            </View>

            {/* --- MAIN CONTENT --- */}
            <View style={styles.contentContainer}>
                
                {/* 1. ARTWORK */}
                <View style={[styles.artworkWrapper, { shadowColor: theme.Primary, backgroundColor: theme.CardBackground }]}>
                    <Image 
                        source={{ uri: activeTrack?.artwork || 'https://via.placeholder.com/300' }} 
                        style={styles.artwork} 
                    />
                </View>

                {/* 2. TRACK INFO */}
                <View style={styles.trackInfoContainer}>
                    <View style={{flex: 1}}>
                        <Text style={[styles.trackTitle, { color: theme.HeadingColor }]} numberOfLines={1}>
                            {activeTrack?.title || "No Song Playing"}
                        </Text>
                        <Text style={[styles.trackArtist, { color: theme.SecondaryText }]} numberOfLines={1}>
                            {activeTrack?.artist || "Unknown Artist"}
                        </Text>
                    </View>
                </View>

                {/* 3. SLIDER / PROGRESS BAR */}
                <View style={styles.progressBarContainer}>
                    <Slider
                        style={{width: '100%', height: 40}}
                        value={position}
                        minimumValue={0}
                        maximumValue={duration}
                        minimumTrackTintColor={theme.Primary} 
                        maximumTrackTintColor={theme.Separator} 
                        thumbTintColor={theme.Primary}
                        onSlidingComplete={onSlidingComplete} 
                    />
                    
                    <View style={styles.timeRow}>
                        <Text style={[styles.timeText, { color: theme.SecondaryText }]}>{formatTime(position)}</Text>
                        <Text style={[styles.timeText, { color: theme.SecondaryText }]}>{formatTime(duration)}</Text>
                    </View>
                </View>

                {/* 4. MAIN CONTROLS */}
                <View style={styles.controlsContainer}>
                    
                    <TouchableOpacity onPress={skipToPrevious}>
                         <Ionicons name="play-skip-back" size={30} color={theme.Black} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={seekBackward} style={styles.secondaryControl}>
                         <Ionicons name="play-back-outline" size={30} color={theme.Black} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={togglePlayback} 
                        style={[styles.playButton, { backgroundColor: theme.Primary, shadowColor: theme.Primary }]}
                    >
                        <Ionicons 
                            name={playing ? "pause" : "play"} 
                            size={40} 
                            color="#FFFFFF" 
                            style={{ marginLeft: playing ? 0 : 4 }} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={seekForward} style={styles.secondaryControl}>
                         <Ionicons name="play-forward-outline" size={30} color={theme.Black} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={skipToNext}>
                         <Ionicons name="play-skip-forward" size={30} color={theme.Black} />
                    </TouchableOpacity>

                </View>

                {/* 5. BOTTOM ICONS */}
                <View style={styles.bottomIcons}>
                    <Ionicons name="time-outline" size={24} color={theme.SecondaryText} />
                    <Ionicons name="musical-notes-outline" size={24} color={theme.SecondaryText} />
                    <Ionicons name="radio-outline" size={24} color={theme.SecondaryText} />
                    <Ionicons name="list-outline" size={24} color={theme.SecondaryText} />
                </View>

            </View>
        </SafeAreaView>
    );
};

export default MusicPlayer;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(15),
    },
    headerTitle: {
        fontSize: textScale(16),
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: scale(25),
        justifyContent: 'space-evenly',
        paddingBottom: verticalScale(20)
    },
    artworkWrapper: {
        width: width - scale(60),
        height: width - scale(60),
        borderRadius: 30,
        elevation: 15,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        alignSelf: 'center',
        overflow: 'hidden' 
    },
    artwork: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    trackInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(10),
        paddingHorizontal: scale(5)
    },
    trackTitle: {
        fontSize: textScale(26),
        fontWeight: 'bold',
        marginBottom: 4
    },
    trackArtist: {
        fontSize: textScale(18),
        fontWeight: '500',
    },
    progressBarContainer: {
        marginTop: verticalScale(10),
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -5, 
        paddingHorizontal: scale(5)
    },
    timeText: {
        fontSize: textScale(12),
        fontWeight: '600'
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    playButton: {
        width: scale(80),
        height: scale(80),
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 8
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
        paddingHorizontal: scale(20)
    }
});