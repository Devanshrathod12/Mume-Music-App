import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

// Styles
import colors from '../Styles/colors';
import { scale, textScale } from '../Styles/StyleConfig';

// Components Imports
import Header from '../Components/HomeItemsRender/Header';
import Tabs from '../Components/HomeItemsRender/Tabs';
import SuggestedSection from '../Components/HomeItemsRender/SuggestedSection';
import SongListSection from '../Components/HomeItemsRender/SongListSection';
import AlbamListSection from '../Components/HomeItemsRender/AlbamListSection';
import ArtistListSection from '../Components/HomeItemsRender/ArtistListSection';
import SortModal from '../Components/Modal/SortModal';

const Home = () => {
    const insets = useSafeAreaInsets();

    // Tabs State 
    const [activeTab, setActiveTab] = useState('Suggested');
    const tabs = ["Suggested", "Songs", "Artists", "Albums"];

    // API Data State
    const [data, setData] = useState([]);
    const [suggestedData, setSuggestedData] = useState({
        recentlyPlayed: [],
        artists: [],
        mostPlayed: []
    });
    const [loading, setLoading] = useState(false);

    // Sorting State
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [sortOption, setSortOption] = useState('Ascending');

    // API Call Logic
    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchArtistSongs = async (artistId) => {
  console.log("ARTIST ID →", artistId);

  try {
    const res = await axios.get(
      `https://saavn.sumit.co/api/artists/${artistId}/songs`
    );

    console.log("FULL RESPONSEvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv →", res.data);
    console.log("SONGS →", JSON.stringify(res.data, null, 2));

  } catch (error) {
    console.log("API ERROR →", error.response?.data || error.message);
  }
};

useEffect(() => {
  fetchArtistSongs("468245");   // 👈 Artist ID
}, []);
 
    const fetchData = async () => {
        setLoading(true);
        setData([]); // Clear old data

        try {
            // 1. Suggested Tab Logic (Mixed Data)
            if (activeTab === 'Suggested') {
                const songRes = await axios.get("https://saavn.sumit.co/api/search/songs", {
                    params: { query: "trending", limit: 6 }
                });
                const artistRes = await axios.get("https://saavn.sumit.co/api/search/artists", {
                    params: { query: "top", limit: 6 }
                });
                setSuggestedData({
                    recentlyPlayed: songRes.data.data.results,
                    artists: artistRes.data.data.results,
                    mostPlayed: songRes.data.data.results.reverse().slice(0, 4)
                });
                setLoading(false);
                return; 
            }

            // 2. Tab Specific Logic
            let endpoint = "";
            let query = "";
            let params = { limit: 50 }; // Default limit

            if (activeTab === 'Albums') {
                // Specific Logic for ALBUMS as requested
                endpoint = "https://saavn.sumit.co/api/search/albums";
                query = "top"; 
                params = { 
                    query: "top",
                    limit: 50 // Thoda jada data mangaya taaki scroll accha lage
                };
            } else if (activeTab === 'Songs') {
                endpoint = "https://saavn.sumit.co/api/search/songs";
                params = { query: "latest", limit: 200 };
            } else if (activeTab === 'Artists') {
                endpoint = "https://saavn.sumit.co/api/search/artists";
                params = { query: "top", limit: 200 };
            }

            // Call API
            const res = await axios.get(endpoint, { params: params });
            console.log(res.data,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaag")
            console.log(`${activeTab} Data Fetch:`, res.data?.data?.results?.length);

            if (res.data?.data?.results) {
                setData(res.data.data.results);
            }

        } catch (error) { 
            console.log("API Error", error);
        } finally {
            setLoading(false);
        }
    };

    // --- SORTING FUNCTION ---
    const getSortedData = () => {
        if (!data) return [];
        let sortedList = [...data];

        // 1. Common Name Sorting
        if (sortOption === 'Ascending') {
            return sortedList.sort((a, b) => a.name.localeCompare(b.name));
        } 
        else if (sortOption === 'Descending') {
            return sortedList.sort((a, b) => b.name.localeCompare(a.name));
        } 
        // 2. Artist Sorting (Works for Songs, Artists, Albums)
        else if (sortOption === 'Artist') {
            return sortedList.sort((a, b) => {
                const artistA = a.artists?.primary?.[0]?.name || a.artist || "Unknown";
                const artistB = b.artists?.primary?.[0]?.name || b.artist || "Unknown";
                return artistA.localeCompare(artistB);
            });
        }
        // 3. Year Sorting (Mainly for Albums)
        else if (sortOption === 'Year' && activeTab === 'Albums') {
            return sortedList.sort((a, b) => (b.year || 0) - (a.year || 0)); // Newest first
        }

        return sortedList;
    };

    // --- SORT HANDLER ---
    const handleSortPress = () => {
        // Ab Songs, Artists, AUR Albums teeno ke liye Sort Modal khulega
        if (activeTab === 'Songs' || activeTab === 'Artists' || activeTab === 'Albums') {
            setSortModalVisible(true);
        }
    };

    // --- CONTENT RENDERER ---
    const renderContent = () => {
        if (loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.Primary} />
                </View>
            );
        }

        switch (activeTab) {
            case 'Suggested':
                return <SuggestedSection suggestedData={suggestedData} />;
            case 'Songs':
                return <SongListSection data={getSortedData()} />;
            case 'Artists':
                return <ArtistListSection data={getSortedData()} />;
            case 'Albums':
                return <AlbamListSection data={getSortedData()} />; // ✅ Updated with Sort
            default:
                return null;
        }
    };
 
    // Logic: Sort Icon tab dikhega jab Songs, Artists ya Albums tab active ho
    const isSortActive = ['Songs', 'Artists', 'Albums'].includes(activeTab);

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top }]}>

            {/* 1. Header */}
            <Header />

            {/* 2. Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* 3. Stats / Filter Row */}
            {activeTab !== 'Suggested' && (
                <View style={styles.statsRow}>

                    {/* Total Count */}
                    <Text style={styles.countText}>
                        {data.length} {activeTab.toLowerCase()}
                    </Text>

                    {/* Sort Button (Global Modal Trigger) */}
                    <TouchableOpacity
                        style={styles.sortBtn}
                        onPress={handleSortPress}
                        activeOpacity={isSortActive ? 0.6 : 1}
                    >
                        <Text style={[
                            styles.sortText,
                            { color: isSortActive ? colors.Primary : colors.SecondaryText }
                        ]}>
                            {isSortActive ? sortOption : 'Ascending'}
                        </Text>
                        <Ionicons
                            name="swap-vertical-outline"
                            size={16}
                            color={isSortActive ? colors.Primary : colors.SecondaryText}
                            style={{ marginLeft: 4 }}
                        />
                    </TouchableOpacity>

                </View>
            )}

            {/* 4. Body Content */}
            <View style={{ flex: 1 }}>
                {renderContent()}
            </View>

            {/* 5. Sort Modal (Global) */}
            <SortModal
                visible={isSortModalVisible}
                selectedOption={sortOption}
                onClose={() => setSortModalVisible(false)}
                onSelect={(option) => {
                    setSortOption(option);
                    setSortModalVisible(false);
                }}
            />

        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.WhiteBackground,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        marginTop: 20,
        marginBottom: 15
    },
    countText: {
        fontSize: textScale(18),
        fontWeight: '700',
        color: colors.HeadingColor
    },
    sortBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    sortText: {
        fontSize: textScale(14),
        fontWeight: '600'
    },
});