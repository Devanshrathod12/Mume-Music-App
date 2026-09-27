
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, FlatList,
    TouchableOpacity, Image, ActivityIndicator, Keyboard, StatusBar
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MusicApiSearch } from '../Api/MusicApi';

// Theme & Config
import { useTheme } from '../Context/ThemeContext';
import { scale, verticalScale, moderateScale, textScale } from '../Styles/StyleConfig';
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import { addRecentSearch, removeRecentSearch, clearRecentSearches } from '../redux/musicSlice';

const SearchingScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const activeTrack = useActiveTrack();
    const { playing } = useIsPlaying();

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Songs');
    const [loading, setLoading] = useState(false);
    const [isSearched, setIsSearched] = useState(false);

    const dispatch = useDispatch();
    const recentSearches = useSelector(state => state.music.recentSearches) || [];

    const [results, setResults] = useState([]);

    const tabs = ["Songs", "Artists", "Albums"];

    const handleSearch = async (query, tab = activeTab) => {
        if (!query.trim()) return;

        setLoading(true);
        setSearchQuery(query);
        setIsSearched(true);

        dispatch(addRecentSearch(query));

        try {
            const data = await MusicApiSearch(query);

            let mappedData = [];
            if (tab === "Songs") {
                mappedData = data;
            } else if (tab === "Artists") {
                const artistsMap = new Map();
                data.forEach(song => {
                    if (song.artists && song.artists.primary) {
                        song.artists.primary.forEach(artist => {
                            if (artist.name && !artistsMap.has(artist.name)) {
                                artistsMap.set(artist.name, {
                                    id: artist.id || artist.name,
                                    name: artist.name,
                                    image: song.image,
                                    type: 'artist'
                                });
                            }
                        });
                    }
                });
                mappedData = Array.from(artistsMap.values());
            } else if (tab === "Albums") {
                const albumsMap = new Map();
                data.forEach(song => {
                    if (song.album && song.album.name && !albumsMap.has(song.album.id)) {
                        albumsMap.set(song.album.id, {
                            id: song.album.id,
                            name: song.album.name,
                            image: song.image,
                            artists: song.artists,
                            type: 'album'
                        });
                    }
                });
                mappedData = Array.from(albumsMap.values());
            }

            setResults(mappedData || []);
        } catch (error) {
            console.log("Search Error:", error);
            setResults([]);
        } finally {
            setLoading(false);
            Keyboard.dismiss();
        }
    };

    const handleClear = () => {
        setSearchInput('');
        setIsSearched(false);
        setSearchQuery('');
        setResults([]);
    };

    const getImageUrl = (item) => {
        if (!item?.image) return 'https://via.placeholder.com/150';
        if (typeof item.image === 'string') return item.image;
        if (Array.isArray(item.image) && item.image.length > 0) return item.image[item.image.length - 1]?.url;
        return 'https://via.placeholder.com/150';
    };

    const handlePlayPause = async (item) => {
        const trackUrl = item?.downloadUrl?.[item.downloadUrl.length - 1]?.url;
        if (!trackUrl) return;

        if (activeTrack?.id === item.id) {
            playing ? await TrackPlayer.pause() : await TrackPlayer.play();
        } else {
            try {
                const tracksToAdd = results.map(s => ({
                    id: s.id,
                    url: s?.downloadUrl?.[s.downloadUrl.length - 1]?.url,
                    title: s.name,
                    artist: s?.artists?.primary?.[0]?.name || "Unknown",
                    artwork: getImageUrl(s),
                    duration: Number(s.duration) || 0
                })).filter(t => t.url);

                const clickedIndex = tracksToAdd.findIndex(t => t.id === item.id);

                await TrackPlayer.reset();
                await TrackPlayer.add(tracksToAdd);
                await TrackPlayer.skip(clickedIndex);
                await TrackPlayer.play();
            } catch (e) {
                console.log("Search Player Error:", e);
            }
        }
    };

    const renderRecentSection = () => (
        <View style={styles.sectionContainer}>
            <View style={styles.recentHeader}>
                <Text style={[styles.sectionTitle, { color: theme.HeadingColor }]}>Recent Searches</Text>
                <TouchableOpacity onPress={() => dispatch(clearRecentSearches())}>
                    <Text style={[styles.clearAllText, { color: theme.Primary }]}>Clear All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={recentSearches}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.recentItem}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => { setSearchInput(item); handleSearch(item) }}>
                            <Text style={[styles.recentItemText, { color: theme.SecondaryText }]}>{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={() => dispatch(removeRecentSearch(item))}>
                            <Ionicons name="close-outline" size={20} color={theme.SecondaryText} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );

    const renderResultItem = ({ item }) => {
        const isActive = activeTrack?.id === item.id;

        const handleItemPress = () => {
            if (activeTab === "Artists") {
                navigation.navigate('ArtistSongList', { artistData: item });
            } else if (activeTab === "Albums") {
                navigation.navigate('AlbamSongList', { albumData: item });
            } else {
                handlePlayPause(item);
            }
        };

        return (
            <TouchableOpacity style={styles.songRow} onPress={handleItemPress} activeOpacity={0.7}>
                <Image source={{ uri: getImageUrl(item) }} style={[styles.itemImage, activeTab === "Artists" && { borderRadius: 50 }, { backgroundColor: theme.LightGray }]} />
                <View style={styles.itemInfo}>
                    <Text style={[styles.itemTitle, { color: isActive ? theme.Primary : theme.HeadingColor }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.itemSubtitle, { color: theme.SecondaryText }]}>{activeTab === "Artists" ? "Artist" : item?.artists?.primary?.[0]?.name || "Unknown"}</Text>
                </View>
                {activeTab === "Songs" && (
                    <View>
                        <Ionicons
                            name={isActive && playing ? "pause-circle" : "play-circle"}
                            size={moderateScale(35)}
                            color={theme.Primary}
                        />
                    </View>
                )}
                <TouchableOpacity onPress={() => { }}>
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.SecondaryText} style={{ marginLeft: scale(10) }} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.WhiteBackground, paddingTop: insets.top }]}>
            <StatusBar barStyle={theme.WhiteBackground === '#FFFFFF' ? "dark-content" : "light-content"} backgroundColor={theme.WhiteBackground} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back-outline" size={24} color={theme.Black} />
                </TouchableOpacity>

                <View style={[
                    styles.inputContainer,
                    isSearched
                        ? { backgroundColor: theme.WhiteBackground === '#FFFFFF' ? '#FFF5F0' : theme.CardBackground, borderWidth: 0 }
                        : { backgroundColor: theme.MainBackground, borderWidth: 1, borderColor: theme.Primary }
                ]}>
                    <Ionicons
                        name="search"
                        size={18}
                        color={isSearched ? theme.SecondaryText : theme.Primary}
                        style={{ marginRight: 8 }}
                    />
                    <TextInput
                        placeholder="Search songs, artists..."
                        placeholderTextColor={theme.SecondaryText}
                        style={[styles.textInput, { color: theme.Black }]}
                        value={searchInput}
                        onChangeText={(text) => {
                            setSearchInput(text);
                            if (text === "") setIsSearched(false);
                        }}
                        onSubmitEditing={() => handleSearch(searchInput)}
                        returnKeyType="search"
                    />
                    {searchInput.length > 0 && (
                        <TouchableOpacity onPress={handleClear}>
                            <Ionicons name="close-circle" size={18} color={theme.SecondaryText} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {!searchQuery ? (
                renderRecentSection()
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.tabsWrapper}>
                        {tabs.map(tab => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.tabBtn,
                                    { borderColor: theme.Primary },
                                    activeTab === tab && { backgroundColor: theme.Primary }
                                ]}
                                onPress={() => { setActiveTab(tab); handleSearch(searchQuery, tab); }}
                            >
                                <Text style={[
                                    styles.tabText,
                                    { color: activeTab === tab ? '#FFF' : theme.Primary }
                                ]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={theme.Primary} style={{ marginTop: 50 }} />
                    ) : results.length > 0 ? (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.id}
                            renderItem={renderResultItem}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.notFoundContainer}>
                            <View style={[styles.sadFaceCircle, { backgroundColor: theme.Primary }]}>
                                <View style={styles.eyesRow}><View style={styles.eye} /><View style={styles.eye} /></View>
                                <View style={styles.sadMouth} />
                            </View>
                            <Text style={[styles.notFoundTitle, { color: theme.HeadingColor }]}>Not Found</Text>
                            <Text style={[styles.notFoundSub, { color: theme.SecondaryText }]}>Sorry, the keyword you entered cannot be found, please search with another keyword.</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default SearchingScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(10)
    },
    backBtn: { marginRight: scale(10) },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: scale(12),
        height: verticalScale(45),
    },
    textInput: { flex: 1, fontSize: textScale(14) },
    sectionContainer: { paddingHorizontal: scale(20), marginTop: verticalScale(15) },
    recentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    sectionTitle: { fontSize: textScale(18), fontWeight: 'bold' },
    clearAllText: { fontSize: textScale(14), fontWeight: '600' },
    recentItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
    recentItemText: { fontSize: textScale(15) },
    tabsWrapper: { flexDirection: 'row', paddingHorizontal: scale(15), marginTop: 15 },
    tabBtn: {
        paddingHorizontal: scale(20),
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10
    },
    tabText: { fontWeight: '600' },
    listContainer: { paddingHorizontal: scale(20), paddingTop: 20, paddingBottom: 100 },
    songRow: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(15) },
    itemImage: { width: moderateScale(60), height: moderateScale(60), borderRadius: 15 },
    itemInfo: { flex: 1, marginLeft: scale(12) },
    itemTitle: { fontSize: textScale(16), fontWeight: 'bold' },
    itemSubtitle: { fontSize: textScale(13), marginTop: 4 },
    notFoundContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 40, marginTop: verticalScale(80) },
    sadFaceCircle: {
        width: 150, height: 150, borderRadius: 75,
        justifyContent: 'center', alignItems: 'center', marginBottom: 30
    },
    eyesRow: { flexDirection: 'row', justifyContent: 'space-around', width: '50%', marginBottom: 15 },
    eye: { width: 15, height: 10, borderRadius: 5, backgroundColor: '#1F2937' },
    sadMouth: { width: 40, height: 15, borderRadius: 10, borderTopWidth: 5, borderColor: '#1F2937' },
    notFoundTitle: { fontSize: textScale(22), fontWeight: 'bold', marginBottom: 10 },
    notFoundSub: { fontSize: textScale(14), textAlign: 'center', lineHeight: 22 }
});