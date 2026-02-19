import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, Text, View, TouchableOpacity, FlatList, Alert 
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; // 👈 Ye add kiya

// Theme & Config
import { useTheme } from '../Context/ThemeContext'; 
import { scale, verticalScale, textScale, moderateScale } from '../Styles/StyleConfig';
import NavigationString from '../Navigation/NavigationString';

const Playlists = ({ navigation }) => { // 👈 Navigation prop add kiya
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isFocused = useIsFocused(); // 👈 Screen focus check karne ke liye
    const [downloadCount, setDownloadCount] = useState(0);

    // Jab bhi screen focus mein aayegi (modal band hone ke baad ya tab switch karne par)
    useEffect(() => {
        if (isFocused) {
            getDownloads();
        }
    }, [isFocused]);

    const getDownloads = async () => {
        try {
            const savedSongs = await AsyncStorage.getItem('offline_songs');
            console.log("Checking AsyncStorage data..."); // Debugging ke liye
            if (savedSongs) {
                const songsArray = JSON.parse(savedSongs);
                console.log("Found songs:", songsArray.length);
                setDownloadCount(songsArray.length);
            } else {
                setDownloadCount(0);
            }
        } catch (error) {
            console.log("Error fetching downloads:", error);
        }
    };

    const myPlaylists = [
        { id: '1', name: 'Liked Songs', count: '128 songs', icon: 'heart' },
        { id: '2', name: 'Morning Vibes', count: '24 songs', icon: 'sunny' },
        { id: '3', name: 'Workout Mix', count: '15 songs', icon: 'fitness' },
        { id: '4', name: 'Late Night Lo-fi', count: '45 songs', icon: 'moon' },
    ];

    const renderPlaylistItem = ({ item }) => (
        <TouchableOpacity style={styles.playlistCard} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: theme.CardBackground }]}>
                <Ionicons 
                    name={item.icon} 
                    size={30} 
                    color={item.id === '1' ? theme.HeartRed : theme.Primary} 
                />
            </View>
            <View style={styles.playlistInfo}>
                <Text style={[styles.playlistName, { color: theme.HeadingColor }]}>{item.name}</Text>
                <Text style={[styles.playlistCount, { color: theme.SecondaryText }]}>{item.count}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.SecondaryText} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.WhiteBackground, paddingTop: insets.top }]}>
            
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.HeadingColor }]}>My Library</Text>
                <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.Primary }]}>
                    <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={myPlaylists}
                keyExtractor={(item) => item.id}
                renderItem={renderPlaylistItem}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <View>
                        <TouchableOpacity style={[styles.createRow, { borderColor: theme.Separator }]}>
                            <View style={[styles.plusCircle, { backgroundColor: theme.MainBackground }]}>
                                <Ionicons name="add-circle-outline" size={28} color={theme.Primary} />
                            </View>
                            <Text style={[styles.createText, { color: theme.HeadingColor }]}>Create New Playlist</Text>
                        </TouchableOpacity>

                        {/* DOWNLOADS SECTION */}
                        <TouchableOpacity 
                            style={[styles.playlistCard, { marginBottom: verticalScale(10) }]}
                           onPress={() => navigation.navigate(NavigationString.DownloadsSongs)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: theme.Primary + '15' }]}>
                                <Ionicons name="download" size={30} color={theme.Primary} />
                            </View>
                            <View style={styles.playlistInfo}>
                                <Text style={[styles.playlistName, { color: theme.HeadingColor }]}>Downloads</Text>
                                <Text style={[styles.playlistCount, { color: theme.Primary }]}>
                                    {downloadCount} {downloadCount === 1 ? 'song' : 'songs'} available offline
                                </Text>
                            </View>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>Local</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={[styles.divider, { backgroundColor: theme.Separator }]} />
                    </View>
                )}
            />
        </View>
    );
};

export default Playlists;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(15),
    },
    headerTitle: { fontSize: textScale(24), fontWeight: 'bold' },
    addBtn: {
        width: scale(40),
        height: scale(40),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    listContent: { paddingHorizontal: scale(20), paddingBottom: 100 },
    createRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(15),
        borderBottomWidth: 1,
        marginBottom: verticalScale(15),
    },
    plusCircle: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(15),
    },
    createText: { fontSize: textScale(16), fontWeight: '600' },
    playlistCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: verticalScale(12) },
    iconContainer: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(15),
    },
    playlistInfo: { flex: 1 },
    playlistName: { fontSize: textScale(16), fontWeight: 'bold', marginBottom: 4 },
    playlistCount: { fontSize: textScale(13) },
    divider: { height: 1, width: '100%', marginVertical: verticalScale(10) },
    badge: {
        backgroundColor: '#10B981',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(2),
        borderRadius: 6,
    },
    badgeText: { color: '#FFF', fontSize: textScale(10), fontWeight: 'bold' }
});