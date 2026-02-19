// import React, { useState, useEffect, useRef } from 'react';
// import { 
//     StyleSheet, View, ActivityIndicator, TouchableOpacity, Text 
// } from 'react-native';
// import axios from 'axios';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import PagerView from 'react-native-pager-view';

// import colors from '../Styles/colors';
// import { scale, textScale } from '../Styles/StyleConfig';

// import Header from '../Components/HomeItemsRender/Header';
// import Tabs from '../Components/HomeItemsRender/Tabs';
// import SuggestedSection from '../Components/HomeItemsRender/SuggestedSection';
// import SongListSection from '../Components/HomeItemsRender/SongListSection';
// import AlbamListSection from '../Components/HomeItemsRender/AlbamListSection';
// import ArtistListSection from '../Components/HomeItemsRender/ArtistListSection';
// import SortModal from '../Components/Modal/SortModal';

// const Home = () => {
//     const insets = useSafeAreaInsets(); 
//     const pagerRef = useRef(null);

//     const tabs = ["Suggested", "Songs", "Artists", "Albums"];
//     const [activeIndex, setActiveIndex] = useState(0); 

//     const [allData, setAllData] = useState({
//         Suggested: { recentlyPlayed: [], artists: [], mostPlayed: [] },
//         Songs: [],
//         Artists: [],
//         Albums: []
//     });

//     const [loading, setLoading] = useState(false);
//     const [isSortModalVisible, setSortModalVisible] = useState(false);
//     const [sortOption, setSortOption] = useState('Ascending');

//     useEffect(() => {
//         fetchData(tabs[activeIndex]);
//     }, [activeIndex]);


//     const fetchData = async (tabName) => {
//         if (allData[tabName] && (Array.isArray(allData[tabName]) ? allData[tabName].length > 0 : allData[tabName].recentlyPlayed?.length > 0)) {
//             return;
//         }

//         setLoading(true);
//         try {
//             if (tabName === 'Suggested') {
//                 const [songRes, artistRes] = await Promise.all([
//                     axios.get("https://saavn.sumit.co/api/search/songs", { params: { query: "trending", limit: 8 } }),
//                     axios.get("https://saavn.sumit.co/api/search/artists", { params: { query: "top", limit: 8 } })
//                 ]);

//                 const songs = songRes.data?.data?.results || [];
//                 const artists = artistRes.data?.data?.results || [];

//                 setAllData(prev => ({
//                     ...prev,
//                     Suggested: {
//                         recentlyPlayed: songs,
//                         artists: artists,
//                         mostPlayed: [...songs].reverse().slice(0, 4)
//                     }
//                 }));
//             } else {
//                 let endpoint = "https://saavn.sumit.co/api/search/songs";
//                 let query = "latest";
//                 let limit = 50;

//                 if (tabName === 'Albums') {
//                     endpoint = "https://saavn.sumit.co/api/search/albums";
//                     query = "trending";
//                 } else if (tabName === 'Artists') {
//                     endpoint = "https://saavn.sumit.co/api/search/artists";
//                     query = "latest";
//                 } 

//                 const res = await axios.get(endpoint, { params: { query, limit } });
//                 console.log(res,"yhjbbdbdobnjkvnskjvdbjdoibjeuibeuibbuiehbuirh") 
//                 const results = res.data?.data?.results || [];
//                 setAllData(prev => ({
//                     ...prev,
//                     [tabName]: results  
//                 }));
//             }
//         } catch (error) {
//             console.log("Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleTabPress = (tabName) => {
//         const index = tabs.indexOf(tabName);
//         setActiveIndex(index);
//         pagerRef.current?.setPage(index);
//     };

//     const onPageSelected = (e) => {
//         setActiveIndex(e.nativeEvent.position);
//     };

//     const getSortedData = (dataList) => {
//         if (!dataList || !Array.isArray(dataList)) return [];
//         let list = [...dataList];
        
//         if (sortOption === 'Ascending') {
//             return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//         }
//         if (sortOption === 'Descending') {
//             return list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
//         }
//         return list;
//     };

//     const currentTabName = tabs[activeIndex];
//     const currentData = allData[currentTabName];
//     const isSortActive = currentTabName !== 'Suggested';
//     const displayCount = Array.isArray(currentData) ? currentData.length : 0;

//     return (
//         <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
//             <Header />

//             <Tabs 
//                 tabs={tabs} 
//                 activeTab={currentTabName} 
//                 setActiveTab={handleTabPress} 
//             />

//             {currentTabName !== 'Suggested' && (
//                 <View style={styles.statsRow}>
//                     <Text style={styles.countText}>
//                         {displayCount} {currentTabName.toLowerCase()}
//                     </Text>

//                     <TouchableOpacity
//                         style={styles.sortBtn}
//                         onPress={() => setSortModalVisible(true)}
//                     >
//                         <Text style={[styles.sortText, { color: colors.Primary }]}>
//                             {sortOption}
//                         </Text>
//                         <Ionicons name="swap-vertical-outline" size={16} color={colors.Primary} style={{ marginLeft: 4 }} />
//                     </TouchableOpacity>
//                 </View>
//             )}

//             <View style={{ flex: 1 }}>
//                 {loading && (!currentData || (Array.isArray(currentData) && currentData.length === 0)) ? (
//                     <View style={styles.loaderContainer}>
//                         <ActivityIndicator size="large" color={colors.Primary} />
//                     </View>
//                 ) : (
//                     <PagerView
//                         ref={pagerRef}
//                         style={styles.pagerView}
//                         initialPage={0}
//                         onPageSelected={onPageSelected}
//                     >
//                         <View key="0" style={styles.page}>
//                              <SuggestedSection suggestedData={allData.Suggested} />
//                         </View>

//                         <View key="1" style={styles.page}>
//                              <SongListSection data={getSortedData(allData.Songs)} />
//                         </View>

//                         <View key="2" style={styles.page}>
//                              <ArtistListSection data={getSortedData(allData.Artists)} />
//                         </View>

//                         <View key="3" style={styles.page}>
//                              <AlbamListSection data={getSortedData(allData.Albums)} />
//                         </View>
//                     </PagerView>
//                 )}
//             </View>

//             <SortModal
//                 visible={isSortModalVisible}
//                 selectedOption={sortOption}
//                 onClose={() => setSortModalVisible(false)}
//                 onSelect={(option) => {
//                     setSortOption(option);
//                     setSortModalVisible(false);
//                 }}
//             />
//         </View>
//     );
// };

// export default Home;

// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//         backgroundColor: colors.WhiteBackground,
//     },
//     pagerView: {
//         flex: 1,
//     },
//     page: {
//         flex: 1,
//     },
//     loaderContainer: {
//         flex: 1, 
//         justifyContent: 'center', 
//         alignItems: 'center'
//     },
//     statsRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: scale(20),
//         marginTop: 20,
//         marginBottom: 10
//     },
//     countText: {
//         fontSize: textScale(18),
//         fontWeight: '700',
//         color: colors.HeadingColor
//     },
//     sortBtn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 5
//     },
//     sortText: {
//         fontSize: textScale(14),
//         fontWeight: '600'
//     },
// });
import React, { useState, useEffect, useRef } from 'react';
import { 
    StyleSheet, View, ActivityIndicator, TouchableOpacity, Text, StatusBar 
} from 'react-native';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import PagerView from 'react-native-pager-view';

// Theme & Config
import { useTheme } from '../Context/ThemeContext'; // 👈 Theme Access
import { scale, textScale } from '../Styles/StyleConfig';

import Header from '../Components/HomeItemsRender/Header';
import Tabs from '../Components/HomeItemsRender/Tabs';
import SuggestedSection from '../Components/HomeItemsRender/SuggestedSection';
import SongListSection from '../Components/HomeItemsRender/SongListSection';
import AlbamListSection from '../Components/HomeItemsRender/AlbamListSection';
import ArtistListSection from '../Components/HomeItemsRender/ArtistListSection';
import SortModal from '../Components/Modal/SortModal';

const Home = () => {
    const insets = useSafeAreaInsets(); 
    const pagerRef = useRef(null);
    const { theme } = useTheme(); // 👈 Context se theme liya

    const tabs = ["Suggested", "Songs", "Artists", "Albums"];
    const [activeIndex, setActiveIndex] = useState(0); 

    const [allData, setAllData] = useState({
        Suggested: { recentlyPlayed: [], artists: [], mostPlayed: [] },
        Songs: [],
        Artists: [],
        Albums: []
    });

    const [loading, setLoading] = useState(false);
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [sortOption, setSortOption] = useState('Ascending');

    useEffect(() => {
        fetchData(tabs[activeIndex]);
    }, [activeIndex]);


    const fetchData = async (tabName) => {
        if (allData[tabName] && (Array.isArray(allData[tabName]) ? allData[tabName].length > 0 : allData[tabName].recentlyPlayed?.length > 0)) {
            return;
        }

        setLoading(true);
        try {
            if (tabName === 'Suggested') {
                const [songRes, artistRes] = await Promise.all([
                    axios.get("https://saavn.sumit.co/api/search/songs", { params: { query: "trending", limit: 8 } }),
                    axios.get("https://saavn.sumit.co/api/search/artists", { params: { query: "top", limit: 8 } })
                ]);

                const songs = songRes.data?.data?.results || [];
                const artists = artistRes.data?.data?.results || [];

                setAllData(prev => ({
                    ...prev,
                    Suggested: {
                        recentlyPlayed: songs,
                        artists: artists,
                        mostPlayed: [...songs].reverse().slice(0, 4)
                    }
                }));
            } else {
                let endpoint = "https://saavn.sumit.co/api/search/songs";
                let query = "latest";
                let limit = 50;

                if (tabName === 'Albums') {
                    endpoint = "https://saavn.sumit.co/api/search/albums";
                    query = "trending";
                } else if (tabName === 'Artists') {
                    endpoint = "https://saavn.sumit.co/api/search/artists";
                    query = "latest";
                } 

                const res = await axios.get(endpoint, { params: { query, limit } });
                const results = res.data?.data?.results || [];
                setAllData(prev => ({
                    ...prev,
                    [tabName]: results  
                }));
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabPress = (tabName) => {
        const index = tabs.indexOf(tabName);
        setActiveIndex(index);
        pagerRef.current?.setPage(index);
    };

    const onPageSelected = (e) => {
        setActiveIndex(e.nativeEvent.position);
    };

    const getSortedData = (dataList) => {
        if (!dataList || !Array.isArray(dataList)) return [];
        let list = [...dataList];
        
        if (sortOption === 'Ascending') {
            return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        }
        if (sortOption === 'Descending') {
            return list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        }
        return list;
    };

    const currentTabName = tabs[activeIndex];
    const currentData = allData[currentTabName];
    const displayCount = Array.isArray(currentData) ? currentData.length : 0;

    return (
        <View style={[styles.mainContainer, { backgroundColor: theme.WhiteBackground, paddingTop: insets.top }]}>
            <StatusBar 
                barStyle={theme.WhiteBackground === '#FFFFFF' ? "dark-content" : "light-content"} 
                backgroundColor={theme.WhiteBackground} 
            />
            
            <Header />

            <Tabs 
                tabs={tabs} 
                activeTab={currentTabName} 
                setActiveTab={handleTabPress} 
            />

            {currentTabName !== 'Suggested' && (
                <View style={styles.statsRow}>
                    <Text style={[styles.countText, { color: theme.HeadingColor }]}>
                        {displayCount} {currentTabName.toLowerCase()}
                    </Text>

                    <TouchableOpacity
                        style={styles.sortBtn}
                        onPress={() => setSortModalVisible(true)}
                    >
                        <Text style={[styles.sortText, { color: theme.Primary }]}>
                            {sortOption}
                        </Text>
                        <Ionicons name="swap-vertical-outline" size={16} color={theme.Primary} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ flex: 1 }}>
                {loading && (!currentData || (Array.isArray(currentData) && currentData.length === 0)) ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={theme.Primary} />
                    </View>
                ) : (
                    <PagerView
                        ref={pagerRef}
                        style={styles.pagerView}
                        initialPage={0}
                        onPageSelected={onPageSelected}
                    >
                        <View key="0" style={styles.page}>
                             <SuggestedSection suggestedData={allData.Suggested} />
                        </View>

                        <View key="1" style={styles.page}>
                             <SongListSection data={getSortedData(allData.Songs)} />
                        </View>

                        <View key="2" style={styles.page}>
                             <ArtistListSection data={getSortedData(allData.Artists)} />
                        </View>

                        <View key="3" style={styles.page}>
                             <AlbamListSection data={getSortedData(allData.Albums)} />
                        </View>
                    </PagerView>
                )}
            </View>

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
    },
    pagerView: {
        flex: 1,
    },
    page: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        marginTop: 20,
        marginBottom: 10
    },
    countText: {
        fontSize: textScale(18),
        fontWeight: '700',
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