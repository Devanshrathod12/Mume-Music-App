import React from 'react';
import NavigationString from './NavigationString';
import * as Screen from "../Screens"
import BottomTab from "./BottomTab"
export default function MainScreen(Stack) {
    return (
        <>
        <Stack.Screen 
         name="BottomTab"
         component={BottomTab}
         options={{ headerShown: false }}
        />
        <Stack.Screen 
         name={NavigationString.AlbamSongList}
         component={Screen.AlbamSongList}
         options={{ headerShown: false }}
        />
        <Stack.Screen 
         name={NavigationString.MusicPlayer}
         component={Screen.MusicPlayer}
         options={{ headerShown: false }}
        />
        <Stack.Screen 
         name={NavigationString.SearchingScreen}
         component={Screen.SearchingScreen}
         options={{ headerShown: false }}
        />
        <Stack.Screen 
         name={NavigationString.ArtistSongList}
         component={Screen.ArtistSongList}
         options={{ headerShown: false }}
        />
        </>
   
    );
}