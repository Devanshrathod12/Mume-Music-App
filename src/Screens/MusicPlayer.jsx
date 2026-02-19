import React, { useState, useEffect } from 'react';
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

// Imports
import colors from '../Styles/colors'; // Adjust path
import { scale, verticalScale, textScale } from '../Styles/StyleConfig'; // Adjust path

const { width } = Dimensions.get('window');

const MusicPlayer = () => {
    const navigation = useNavigation();
    
    // Track Player Hooks
    const activeTrack = activeTrackData = useActiveTrack();
    const { playing } = useIsPlaying();
    const { position, duration } = useProgress();

    // Helper: Format Time (00:00)
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // --- CONTROLS LOGIC ---
    
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

    // Progress Bar Calculation
    const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* --- HEADER --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={30} color={colors.Black} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal-circle" size={30}  />
                </TouchableOpacity>
            </View>

            {/* --- MAIN CONTENT --- */}
            <View style={styles.contentContainer}>
                
                {/* 1. ARTWORK */}
                <View style={styles.artworkWrapper}>
                    <Image 
                        source={{ uri: activeTrack?.artwork || 'https://via.placeholder.com/300' }} 
                        style={styles.artwork} 
                    />
                </View>

                {/* 2. TRACK INFO */}
                <View style={styles.trackInfoContainer}>
                    <View>
                        <Text style={styles.trackTitle} numberOfLines={1}>
                            {activeTrack?.title || "No Song Playing"}
                        </Text>
                        <Text style={styles.trackArtist} numberOfLines={1}>
                            {activeTrack?.artist || "Unknown Artist"}
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="heart-outline" size={28} color={colors.Black} />
                    </TouchableOpacity>
                </View>

                {/* 3. PROGRESS BAR */}
                <View style={styles.progressBarContainer}>
                    {/* Visual Slider using View */}
                    <View style={styles.progressBackground}>
                        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                        {/* Knob */}
                        <View style={[styles.progressKnob, { left: `${progressPercent}%` }]} />
                    </View>
                    
                    <View style={styles.timeRow}>
                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                </View>

                {/* 4. MAIN CONTROLS */}
                <View style={styles.controlsContainer}>
                    
                    {/* Previous Song */}
                    <TouchableOpacity onPress={skipToPrevious}>
                         <Ionicons name="play-skip-back" size={30} color={colors.Black} />
                    </TouchableOpacity>

                    {/* -10 Sec */}
                    <TouchableOpacity onPress={seekBackward} style={styles.secondaryControl}>
                         <Ionicons name="play-back-outline" size={30} color={colors.Black} />
                    </TouchableOpacity>

                    {/* PLAY / PAUSE (Big Orange) */}
                    <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
                        <Ionicons 
                            name={playing ? "pause" : "play"} 
                            size={40} 
                            color="#FFFFFF" 
                            style={{ marginLeft: playing ? 0 : 4 }} 
                        />
                    </TouchableOpacity>

                    {/* +10 Sec */}
                    <TouchableOpacity onPress={seekForward} style={styles.secondaryControl}>
                         <Ionicons name="play-forward-outline" size={30} color={colors.Black} />
                    </TouchableOpacity>

                    {/* Next Song */}
                    <TouchableOpacity onPress={skipToNext}>
                         <Ionicons name="play-skip-forward" size={30} color={colors.Black} />
                    </TouchableOpacity>

                </View>

                {/* 5. BOTTOM ACTIONS (Timer, Lyrics, Cast, Menu) */}
                <View style={styles.bottomIcons}>
                    <Ionicons name="time-outline" size={24} color={colors.Black} />
                    <Ionicons name="musical-notes-outline" size={24} color={colors.Black} />
                    <Ionicons name="radio-outline" size={24} color={colors.Black} />
                    <Ionicons name="ellipsis-vertical" size={24} color={colors.Black} />
                </View>

            </View>
        </SafeAreaView>
    );
};

export default MusicPlayer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(10),
    },
    headerTitle: {
        fontSize: textScale(18),
        fontWeight: '600',
        color: colors.Black,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: scale(25),
        justifyContent: 'space-evenly',
        paddingBottom: verticalScale(20)
    },
    
    // Artwork
    artworkWrapper: {
        width: width - scale(50),
        height: width - scale(50),
        borderRadius: 30,
        elevation: 10,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        backgroundColor: '#F5F5F5',
        alignSelf: 'center',
        overflow: 'hidden' // Important for image radius
    },
    artwork: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // Track Info
    trackInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(10)
    },
    trackTitle: {
        fontSize: textScale(24),
        fontWeight: 'bold',
        color: colors.HeadingColor,
        maxWidth: width * 0.7,
        marginBottom: 4
    },
    trackArtist: {
        fontSize: textScale(16),
        color: '#64748B',
        fontWeight: '500',
    },

    // Progress
    progressBarContainer: {
        marginTop: verticalScale(20),
    },
    progressBackground: {
        width: '100%',
        height: 5,
        backgroundColor: '#E2E8F0',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressFill: {
        height: 5,
        backgroundColor: '#FF6B00',
        borderRadius: 5,
    },
    progressKnob: {
        width: 14,
        height: 14,
        borderRadius: 14,
        backgroundColor: '#FF6B00',
        position: 'absolute',
        marginLeft: -7, // center knob
        borderWidth: 2,
        borderColor: '#FFF',
        elevation: 3
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(8),
    },
    timeText: {
        fontSize: textScale(12),
        color: '#64748B',
        fontWeight: '500'
    },

    // Controls
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
    },
    secondaryControl: {
        marginHorizontal: scale(10)
    },
    playButton: {
        width: scale(75),
        height: scale(75),
        borderRadius: 100,
        backgroundColor: '#FF6B00', // Orange Theme
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#FF6B00',
        shadowOpacity: 0.4,
        shadowRadius: 5
    },

    // Bottom
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(20),
        paddingHorizontal: scale(20)
    }
});