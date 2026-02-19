import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native'; 
import { useTheme } from '../Context/ThemeContext';
import { scale, moderateScale, textScale, verticalScale } from '../Styles/StyleConfig';

const DownloadsSongs = () => {
    const [downloadedSongs, setDownloadedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const navigation = useNavigation(); 

    useEffect(() => {
        loadDownloads();
        setupPlayer();
    }, []);

    const setupPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({
                capabilities: [
                    Capability.Play, 
                    Capability.Pause, 
                    Capability.SkipToNext, 
                    Capability.SkipToPrevious, 
                    Capability.Stop,
                    Capability.SeekTo
                ],
            });
        } catch (e) {}
    };

    const loadDownloads = async () => {
        try {
            setLoading(true);
            const savedSongs = await AsyncStorage.getItem('offline_songs');
            if (savedSongs) {
                const parsedSongs = JSON.parse(savedSongs);
                setDownloadedSongs(parsedSongs);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const playDownloadedSong = async (song) => {
        try {
            const path = song.localPath || song.url;
            if (!path) {
                Alert.alert("Error", "File path missing.");
                return;
            }

            await TrackPlayer.reset();

            // 2. Local file path format sahi karein
            let trackUrl = String(path);
            if (!trackUrl.startsWith('file://')) {
                trackUrl = `file://${trackUrl}`;
            }

            const trackData = {
                id: song.id.toString(),
                url: trackUrl,
                title: song.name,
                artist: song.artists?.primary?.[0]?.name || 'Offline',
                // MusicPlayer activeTrack?.artwork use karta hai
                artwork: Array.isArray(song.image) 
                    ? song.image[song.image.length - 1].url 
                    : song.image || 'https://via.placeholder.com/300',
            };

            // 4. Track add karein aur play karein
            await TrackPlayer.add(trackData);
            await TrackPlayer.play();

            // 5. MusicPlayer screen par jump karein
            navigation.navigate('MusicPlayer'); 

        } catch (error) {
            console.error("Playback failed", error);
            Alert.alert("Error", "Playback failed.");
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: theme.CardBackground }]} 
            onPress={() => playDownloadedSong(item)}
        >
            <Image 
                source={{ uri: Array.isArray(item.image) ? item.image[0].url : item.image }} 
                style={styles.img} 
            />
            <View style={styles.info}>
                <Text style={[styles.name, { color: theme.HeadingColor }]} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={{ color: theme.SecondaryText, fontSize: textScale(12) }}>Offline</Text>
            </View>
            <Text style={{ color: theme.Primary, fontWeight: 'bold' }}>PLAY</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.WhiteBackground }]}>
            <Text style={[styles.header, { color: theme.HeadingColor }]}>My Downloads</Text>
            {loading ? (
                <ActivityIndicator size="large" color={theme.Primary} />
            ) : (
                <FlatList
                    data={downloadedSongs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.empty}>No songs found.</Text>}
                />
            )}
        </View>
    );
};

export default DownloadsSongs;

const styles = StyleSheet.create({
    container: { flex: 1, padding: scale(20) },
    header: { fontSize: textScale(22), fontWeight: 'bold', marginBottom: verticalScale(20), marginTop: verticalScale(20) },
    card: { flexDirection: 'row', alignItems: 'center', padding: scale(10), borderRadius: 12, marginBottom: verticalScale(10) },
    img: { width: moderateScale(50), height: moderateScale(50), borderRadius: 8, marginRight: scale(15) },
    info: { flex: 1 },
    name: { fontSize: textScale(16), fontWeight: '600' },
    empty: { textAlign: 'center', marginTop: 50, color: 'gray' }
});