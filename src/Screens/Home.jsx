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

    const fetchData = async () => {
        setLoading(true);
        setData([]);
        try {
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

            let endpoint = "https://saavn.sumit.co/api/search/songs";
            let query = "top";

            switch (activeTab) {
                case 'Songs':   endpoint = "https://saavn.sumit.co/api/search/songs";   query = "latest"; break;
                case 'Albums':  endpoint = "https://saavn.sumit.co/api/search/albums";  query = "party";  break;
                case 'Artists': endpoint = "https://saavn.sumit.co/api/search/artists"; query = "star";   break;
            }

            const res = await axios.get(endpoint, { params: { query, limit: 200 } });

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

        if (sortOption === 'Ascending') {
            return sortedList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'Descending') {
            return sortedList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === 'Artist') {
            return sortedList.sort((a, b) => {
                const artistA = a.artists?.primary?.[0]?.name || a.artist || a.name || "Unknown";
                const artistB = b.artists?.primary?.[0]?.name || b.artist || b.name || "Unknown";
                return artistA.localeCompare(artistB);
            });
        }
        return sortedList;
    };

    // --- SORT HANDLER (Songs + Artists dono ke liye) ---
    const handleSortPress = () => {
        if (activeTab === 'Songs' || activeTab === 'Artists') {
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
                return <ArtistListSection data={getSortedData()} />; // ✅ Sorted data
            case 'Albums':
                return <AlbamListSection data={data} />;
            default:
                return null;
        }
    };

    // Sort button active hai ya nahi
    const isSortActive = activeTab === 'Songs' || activeTab === 'Artists';

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top }]}>

            {/* 1. Header */}
            <Header />

            {/* 2. Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* 3. Stats / Filter Row - Suggested chhod kar sab me dikhega */}
            {activeTab !== 'Suggested' && (
                <View style={styles.statsRow}>

                    {/* Total Count */}
                    <Text style={styles.countText}>
                        {data.length} {activeTab.toLowerCase()}
                    </Text>

                    {/* Sort Button */}
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

            {/* 5. Sort Modal */}
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