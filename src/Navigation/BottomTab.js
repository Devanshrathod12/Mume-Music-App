// import React from 'react';
// import { StyleSheet, View } from 'react-native'; 
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import { useActiveTrack } from 'react-native-track-player'; 
// import { useSelector } from 'react-redux'; 

// // Theme Context Import
// import { useTheme } from '../Context/ThemeContext'; 

// // Screens
// import Home from '../Screens/Home';
// import Setting from "../Screens/Setting";
// import Favorites from "../Screens/Favorites";
// import Playlists from "../Screens/Playlists";

// // Components
// import MiniPlayer from '../Components/MiniPlayer/MiniPlayer';

// const Tab = createBottomTabNavigator();

// const BottomTab = () => {
//   const activeTrack = useActiveTrack(); 
//   const { theme } = useTheme(); // 👈 Theme access kiya

//   const favoritesCount = useSelector((state) => state.music.favorites.length);
//   const playlistsCount = useSelector((state) => state.music.playlists.length);

//   return (
//     <SafeAreaProvider>
//       <View style={{ flex: 1, backgroundColor: theme.WhiteBackground }}>
        
//         <Tab.Navigator
//           screenOptions={{
//             headerShown: false,
//             tabBarStyle: {
//               height: 65,
//               paddingBottom: 8,
//               paddingTop: 8,
//               backgroundColor: theme.TabBarBackground, // 👈 Dynamic BG
//               elevation: 10, 
//               borderTopWidth: 0,
//               // Dark mode mein halka shadow dene ke liye (iOS)
//               shadowColor: theme.Black,
//               shadowOffset: { width: 0, height: -2 },
//               shadowOpacity: 0.1,
//             },
//             tabBarActiveTintColor: theme.Primary, 
//             tabBarInactiveTintColor: theme.InactiveIcon, // 👈 Dynamic Inactive color
//             tabBarLabelStyle: {
//                 fontWeight: '600',
//                 fontSize: 11
//             }
//           }}
//         >
//           {/* 1. HOME */}
//           <Tab.Screen
//             name="Home"
//             component={Home}
//             options={{
//               tabBarLabel: 'Home',
//               tabBarIcon: ({ color, size, focused }) => (
//                 <Ionicons
//                   name={focused ? "home" : "home-outline"}  
//                   size={size}
//                   color={color}
//                 />
//               ),
//             }}
//           />

//           {/* 2. FAVORITES */}
//           <Tab.Screen
//             name="Favorites"
//             component={Favorites}
//             options={{
//               tabBarLabel: 'Favorites',
//               tabBarBadge: favoritesCount > 0 ? favoritesCount : null,
//               tabBarBadgeStyle: {
//                 backgroundColor: theme.BadgeRed, 
//                 color: 'white',
//                 fontSize: 10,
//               },
//               tabBarIcon: ({ color, size, focused }) => (
//                 <Ionicons
//                   name={focused ? "heart" : "heart-outline"}  
//                   size={size}
//                   color={color}
//                 />
//               ),
//             }}
//           />

//           {/* 3. PLAYLISTS */}
//           <Tab.Screen
//             name="Playlists"
//             component={Playlists}
//             options={{
//               tabBarLabel: 'Playlists',
//               tabBarBadge: playlistsCount > 0 ? playlistsCount : null,
//               tabBarBadgeStyle: {
//                 backgroundColor: theme.lightornge, 
//                 color: 'white',
//                 fontSize: 10,
//               },
//               tabBarIcon: ({ color, size, focused }) => (
//                 <Ionicons
//                   name={focused ? "musical-notes" : "musical-notes-outline"}  
//                   size={size}
//                   color={color}
//                 />
//               ),
//             }}
//           />

//           {/* 4. SETTINGS */}
//           <Tab.Screen
//             name="Settings"
//             component={Setting}
//             options={{
//               tabBarLabel: 'Settings',
//               tabBarIcon: ({ color, size, focused }) => (
//                 <Ionicons
//                   name={focused ? "settings" : "settings-outline"}  
//                   size={size}
//                   color={color}
//                 />
//               ),
//             }}
//           />
//         </Tab.Navigator>

//         {activeTrack && <MiniPlayer />}
        
//       </View>
//     </SafeAreaProvider>
//   );
// };

// export default BottomTab;
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useActiveTrack } from 'react-native-track-player'; 
import { useSelector } from 'react-redux'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../Context/ThemeContext'; 
import Home from '../Screens/Home';
import Setting from "../Screens/Setting";
import Favorites from "../Screens/Favorites";
import Playlists from "../Screens/Playlists";
import MiniPlayer from '../Components/MiniPlayer/MiniPlayer';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const activeTrack = useActiveTrack(); 
  const { theme } = useTheme(); 
  const [downloadCount, setDownloadCount] = useState(0);

  const favoritesCount = useSelector((state) => state.music.favorites.length);

  useEffect(() => {
    const updateDownloads = async () => {
      const savedSongs = await AsyncStorage.getItem('offline_songs');
      if (savedSongs) {
        const songsArray = JSON.parse(savedSongs);
        setDownloadCount(songsArray.length);
      }
    };
    updateDownloads();
    const interval = setInterval(updateDownloads, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.WhiteBackground }}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              height: 65,
              paddingBottom: 8,
              paddingTop: 8,
              backgroundColor: theme.TabBarBackground,
              elevation: 10, 
              borderTopWidth: 0,
              shadowColor: theme.Black,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
            },
            tabBarActiveTintColor: theme.Primary, 
            tabBarInactiveTintColor: theme.InactiveIcon,
            tabBarLabelStyle: {
                fontWeight: '600',
                fontSize: 11
            }
          }}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}  
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Favorites"
            component={Favorites}
            options={{
              tabBarLabel: 'Favorites',
              tabBarBadge: favoritesCount > 0 ? favoritesCount : null,
              tabBarBadgeStyle: {
                backgroundColor: theme.BadgeRed, 
                color: 'white',
                fontSize: 10,
              },
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "heart" : "heart-outline"}  
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Playlists"
            component={Playlists}
            options={{
              tabBarLabel: 'Library',
              tabBarBadge: downloadCount > 0 ? downloadCount : null,
              tabBarBadgeStyle: {
                backgroundColor: theme.BadgeRed, 
                color: 'white',
                fontSize: 10,
              },
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "musical-notes" : "musical-notes-outline"}  
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Settings"
            component={Setting}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "settings" : "settings-outline"}  
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>

        {activeTrack && <MiniPlayer />}
      </View>
    </SafeAreaProvider>
  );
};

export default BottomTab;