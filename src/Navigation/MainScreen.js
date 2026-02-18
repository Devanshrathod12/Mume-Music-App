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
        </>
   
    );
}