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

// IMPORTANT: Sort Modal Import karein
import SortModal from '../Components/Modal/SortModal'; 

const Home = () => {
  const insets = useSafeAreaInsets();
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('Suggested');
  const tabs = ["Suggested", "Songs", "Artists", "Albums"];
  
  // API Data State
  const [data, setData] = useState([]);
  const [suggestedData, setSuggestedData] = useState({ recentlyPlayed: [], artists: [], mostPlayed: [] });
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
            const songRes = await axios.get("https://saavn.sumit.co/api/search/songs", { params: { query: "trending", limit: 6 } });
            const artistRes = await axios.get("https://saavn.sumit.co/api/search/artists", { params: { query: "top", limit: 6 } });
            
            setSuggestedData({
                recentlyPlayed: songRes.data.data.results,
                artists: artistRes.data.data.results,
                mostPlayed: songRes.data.data.results.reverse().slice(0, 4)
            });
            setLoading(false);
            return;
        }

        let endpoint = "https://saavn.sumit.co/api/search/songs"; // Default
        let query = "top";

        switch(activeTab) {
            case 'Songs': endpoint = "https://saavn.sumit.co/api/search/songs"; query="latest"; break;
            case 'Albums': endpoint = "https://saavn.sumit.co/api/search/albums"; query="party"; break;
            case 'Artists': endpoint = "https://saavn.sumit.co/api/search/artists"; query="star"; break;
        }

        console.log(`Fetching ${activeTab}...`);
        const res = await axios.get(endpoint, { params: { query: query, limit: 20 } });
        
        if (res.data?.data?.results) {
          setData(res.data.data.results);
        }

    } catch (error) {
      console.log("API Error", error);
    } finally {
      setLoading(false);
    }
  };

  // --- SORTING FUNCTION (IMPORTANT) ---
  const getSortedData = () => {
    if (!data) return [];
    
    // Naya array copy karein taaki original data change na ho
    let sortedList = [...data];

    // Modal ke selection ke hisab se data sort karein
    if (sortOption === 'Ascending') {
        return sortedList.sort((a, b) => a.name.localeCompare(b.name));
    } 
    else if (sortOption === 'Descending') {
        return sortedList.sort((a, b) => b.name.localeCompare(a.name));
    }
    else if (sortOption === 'Artist') {
         // Agar artist data nested hai, safely sort karein
        return sortedList.sort((a, b) => {
            const artistA = a.artists?.primary?.[0]?.name || a.artist || "Unknown";
            const artistB = b.artists?.primary?.[0]?.name || b.artist || "Unknown";
            return artistA.localeCompare(artistB);
        });
    }
    
    // Default: Return data as is
    return sortedList;
  };

  // Content Renderer
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
        // ** Yaha Sorted Data pass kar rahe hain **
        return <SongListSection data={getSortedData()} />;
      case 'Artists':
        return <ArtistListSection data={data} />;
      case 'Albums':
        return <AlbamListSection data={data} />;
      default:
        return null;
    }
  };

  // --- SORT HANDLER ---
  const handleSortPress = () => {
    if (activeTab === 'Songs') {
      setSortModalVisible(true);
    } else {
      console.log("Sort is mainly available for Songs tab");
    }
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      
      {/* 1. Header */}
      <Header />

      {/* 2. Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 3. Filter Row / Stats Row */}
      {/* Ye Sirf Suggested tab chhod kar sab me dikhega */}
      {activeTab !== 'Suggested' && (
        <View style={styles.statsRow}>
            
            {/* Total Count */}
            <Text style={styles.countText}>{data.length} {activeTab.toLowerCase()}</Text>
            
            {/* Sort Button - (Only clickable on 'Songs') */}
            <TouchableOpacity 
                style={styles.sortBtn} 
                onPress={handleSortPress} // Function call kiya
                activeOpacity={0.6}
            >
                <Text style={styles.sortText}>
                    {/* Songs tab pe Selected Option dikhayega (e.g., Ascending) */}
                    {activeTab === 'Songs' ? sortOption : 'Ascending'}
                </Text>
                
                <Ionicons 
                    name="swap-vertical-outline" 
                    size={16} 
                    color={colors.Primary} 
                    style={{marginLeft: 4}}
                />
            </TouchableOpacity>
        </View>
      )}

      {/* 4. Body Content */}
      <View style={{flex: 1}}>
          {renderContent()}
      </View>

      {/* 5. Sort Modal (Render last so it comes on top) */}
      <SortModal 
         visible={isSortModalVisible}
         selectedOption={sortOption}
         onClose={() => setSortModalVisible(false)} // Close Modal Function
         onSelect={(option) => {
             setSortOption(option);   // Selection update
             setSortModalVisible(false); // Close Modal
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
    padding: 5 // Click area badhane ke liye thoda padding diya
  },
  sortText: { 
    fontSize: textScale(14), 
    color: colors.Primary, 
    fontWeight: '600' 
  },
});