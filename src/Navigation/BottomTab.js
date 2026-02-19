// import React from 'react';
// import { StyleSheet, View } from 'react-native'; 
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import { useActiveTrack } from 'react-native-track-player'; 

// // Screens
// import Home from '../Screens/Home';
// import Setting from "../Screens/Setting";
// import Favorites from "../Screens/Favorites";
// import Playlists from "../Screens/Playlists";

// // Components
// import MiniPlayer from '../Components/MiniPlayer/MiniPlayer';

// const Tab = createBottomTabNavigator();

// const BottomTab = () => {
//   // Check karein gaana chal raha hai ya nahi
//   const activeTrack = useActiveTrack(); 

//   return (
//     <SafeAreaProvider>
//       <View style={{ flex: 1 }}>
        
//         {/* Main Tab Navigator */}
//         <Tab.Navigator
//           screenOptions={{
//             headerShown: false,
//             tabBarStyle: {
//               height: 65,
//               paddingBottom: 8,
//               paddingTop: 8,
//               backgroundColor: '#FFFFFF',
//               elevation: 0, 
//               borderTopWidth: 0,
//             },
//             tabBarActiveTintColor: '#FF6B00', 
//             tabBarInactiveTintColor: 'grey',
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

//         {/* Mini Player: Iski position aapke MiniPlayer component ki CSS 
//             (absolute bottom: 65) se handle ho rahi hai.
//         */}
//         {activeTrack && <MiniPlayer />}
        
//       </View>
//     </SafeAreaProvider>
//   );
// };

// export default BottomTab;

// const styles = StyleSheet.create({});
import React from 'react';
import { StyleSheet, View } from 'react-native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useActiveTrack } from 'react-native-track-player'; 
import { useSelector } from 'react-redux'; // Redux se data lene ke liye

// Screens
import Home from '../Screens/Home';
import Setting from "../Screens/Setting";
import Favorites from "../Screens/Favorites";
import Playlists from "../Screens/Playlists";

// Components
import MiniPlayer from '../Components/MiniPlayer/MiniPlayer';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const activeTrack = useActiveTrack(); 

  // Redux se counts nikal rahe hain
  const favoritesCount = useSelector((state) => state.music.favorites.length);
  const playlistsCount = useSelector((state) => state.music.playlists.length);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              height: 65,
              paddingBottom: 8,
              paddingTop: 8,
              backgroundColor: '#FFFFFF',
              elevation: 0, 
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: '#FF6B00', 
            tabBarInactiveTintColor: 'grey',
          }}
        >
          {/* 1. HOME */}
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

          {/* 2. FAVORITES with Badge */}
          <Tab.Screen
            name="Favorites"
            component={Favorites}
            options={{
              tabBarLabel: 'Favorites',
              // Agar favorites 0 se zyada hain tabhi badge dikhega
              tabBarBadge: favoritesCount > 0 ? favoritesCount : null,
              tabBarBadgeStyle: {
                backgroundColor: '#FF0000', // Red color badge
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

          {/* 3. PLAYLISTS with Badge */}
          <Tab.Screen
            name="Playlists"
            component={Playlists}
            options={{
              tabBarLabel: 'Playlists',
              // Playlists ki ginti ke liye badge
              tabBarBadge: playlistsCount > 0 ? playlistsCount : null,
              tabBarBadgeStyle: {
                backgroundColor: '#FF6B00', // Aap chahen toh theme color de sakte hain
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

          {/* 4. SETTINGS */}
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

const styles = StyleSheet.create({});