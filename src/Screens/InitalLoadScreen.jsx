import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import NavigationString from '../Navigation/NavigationString';
import { scale, verticalScale, textScale } from "../Styles/StyleConfig";
import { useTheme } from '../Context/ThemeContext';

const InitalLoadScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
           navigation.navigate(NavigationString.FinalLogoScreen);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);


    return (
        <View style={[styles.container, { backgroundColor: theme.WhiteBackground }]}>
            <View style={styles.logoContainer}>
                {/* Orange Circle */}
                <View style={[styles.iconCircle, { backgroundColor: theme.lightornge }]}>
                    <Ionicons name="musical-notes" size={scale(50)} color="#FFFFFF" />
                </View>
                {/* App Name Text - Now Dynamic */}
                <Text style={[styles.logoText, { color: theme.HeadingColor }]}>Mume</Text>
            </View>
        </View>
    );
};

export default InitalLoadScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginBottom: verticalScale(15),
    },
    logoText: {
        fontSize: textScale(32),
        fontWeight: 'bold',
        letterSpacing: 2,
    }
});