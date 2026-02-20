
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, FlatList,
    TouchableOpacity, Image, ActivityIndicator, Keyboard, StatusBar
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Theme & Config
import { useTheme } from '../Context/ThemeContext'; 
import { scale, verticalScale, moderateScale, textScale } from '../Styles/StyleConfig';
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';

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

    const [recentSearches, setRecentSearches] = useState(['Ariana Grande', 'Drake', 'Memories']);
    const [results, setResults] = useState([]);

    const tabs = ["Songs", "Artists", "Albums"];

    const handleSearch = async (query, tab = activeTab) => {
        if (!query.trim()) return;
        
        setLoading(true);
        setSearchQuery(query);
        setIsSearched(true);
        
        if (!recentSearches.includes(query)) {
            setRecentSearches(prev => [query, ...prev].slice(0, 10));
        }

        try {
            let endpoint = "https://saavn.sumit.co/api/search/songs";
            if (tab === "Artists") endpoint = "https://saavn.sumit.co/api/search/artists";
            if (tab === "Albums") endpoint = "https://saavn.sumit.co/api/search/albums";

            const res = await axios.get(endpoint, { params: { query: query, limit: 20 } });
            setResults(res.data?.data?.results || []);
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
        if (!item?.image || item.image.length === 0) return 'https://via.placeholder.com/150';
        return item.image[item.image.length - 1]?.url;
    };

    const handlePlayPause = async (item) => {
        const trackUrl = item?.downloadUrl?.[item.downloadUrl.length - 1]?.url;
        if (!trackUrl) return;

        if (activeTrack?.id === item.id) {
            playing ? await TrackPlayer.pause() : await TrackPlayer.play();
        } else {
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: item.id,
                url: trackUrl,
                title: item.name,
                artist: item?.artists?.primary?.[0]?.name || "Unknown",
                artwork: getImageUrl(item),
            });
            await TrackPlayer.play();
        }
    };

    const renderRecentSection = () => (
        <View style={styles.sectionContainer}>
            <View style={styles.recentHeader}>
                <Text style={[styles.sectionTitle, { color: theme.HeadingColor }]}>Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text style={[styles.clearAllText, { color: theme.Primary }]}>Clear All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={recentSearches}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.recentItem} onPress={() => {setSearchInput(item); handleSearch(item)}}>
                        <Text style={[styles.recentItemText, { color: theme.SecondaryText }]}>{item}</Text>
                        <Ionicons name="close-outline" size={20} color={theme.SecondaryText} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    const renderResultItem = ({ item }) => {
        const isActive = activeTrack?.id === item.id;
        return (
            <View style={styles.songRow}>
                <Image source={{ uri: getImageUrl(item) }} style={[styles.itemImage, activeTab === "Artists" && { borderRadius: 50 }, { backgroundColor: theme.LightGray }]} />
                <View style={styles.itemInfo}>
                    <Text style={[styles.itemTitle, { color: isActive ? theme.Primary : theme.HeadingColor }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.itemSubtitle, { color: theme.SecondaryText }]}>{activeTab === "Artists" ? "Artist" : item?.artists?.primary?.[0]?.name || "Unknown"}</Text>
                </View>
                {activeTab === "Songs" && (
                    <TouchableOpacity onPress={() => handlePlayPause(item)}>
                        <Ionicons 
                            name={isActive && playing ? "pause-circle" : "play-circle"} 
                            size={moderateScale(35)} 
                            color={theme.Primary} 
                        />
                    </TouchableOpacity>
                )}
                <Ionicons name="ellipsis-vertical" size={20} color={theme.SecondaryText} style={{ marginLeft: scale(10) }} />
            </View>
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
                            if(text === "") setIsSearched(false);
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