// import React from 'react';
// import { StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Ionicons from '@react-native-vector-icons/ionicons';

// import Home from '../Screens/Home';

// const Tab = createBottomTabNavigator();

// const BottomTab = () => {
//   return (
//     <SafeAreaProvider>
//       <Tab.Navigator
//         screenOptions={{
//           headerShown: false,
//           tabBarStyle: {
//             height: 65,
//             paddingBottom: 8,
//           },
//         }}
//       >
//         <Tab.Screen
//           name="Home"
//           component={Home}
//           options={{
//             tabBarIcon: ({ color, size, focused }) => (
//               <Ionicons
//                 name={focused ? "home" : "home-outline"}  
//                 size={size}
//                 color={color}
//               />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </SafeAreaProvider>
//   );
// };

// export default BottomTab;

// const styles = StyleSheet.create({});
import React from 'react';
import { StyleSheet, View } from 'react-native'; // View import kiya
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useActiveTrack } from 'react-native-track-player'; // Track check karne ke liye

// Screens & Components
import Home from '../Screens/Home';
import MiniPlayer from '../Components/MiniPlayer/MiniPlayer'; // Import Mini Player
// Import other screens if needed

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  // Check karein gaana chal raha hai ya nahi
  const activeTrack = useActiveTrack(); 

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        
        {/* Main Tab Navigator */}
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            // Tab bar ko translucent nahi banayenge taaki mini player uske upar thik se baithe
            tabBarStyle: {
              height: 65,
              paddingBottom: 8,
              paddingTop: 8,
              backgroundColor: '#FFFFFF',
              elevation: 0, // Flat look if mini player has shadow
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: '#FF6B00', // Tera Orange Theme
            tabBarInactiveTintColor: 'grey',
          }}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}  
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          {/* Add other Tab Screens here (Search, Library etc) */}
        </Tab.Navigator>

        {/* 
            MAGIC HERE: Mini Player ko Navigator ke neeche rakha hai (code structure me)
            lekin absolute positioning se ye Tabs ke UPAR aayega. 
        */}
        {activeTrack && <MiniPlayer />}
        
      </View>
    </SafeAreaProvider>
  );
};

export default BottomTab;

const styles = StyleSheet.create({});