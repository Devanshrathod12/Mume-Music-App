
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import MainScreen from './MainScreen';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const Route = () => {
    return (
        <NavigationContainer>          
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                //     gestureEnabled: true,
                //     gestureDirection: "horizontal",
                //     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                }}
            >
                {MainScreen(Stack)}
            </Stack.Navigator>   
        </NavigationContainer>
    );
};

export default Route;