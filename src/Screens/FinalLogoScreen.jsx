import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { scale, verticalScale, textScale } from "../Styles/StyleConfig";
import { useTheme } from '../Context/ThemeContext'; 

const FinalLogoScreen = ({ navigation }) => {
    const { theme } = useTheme(); 
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();

        const timer = setTimeout(() => {
             navigation.navigate("BottomTab");
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.WhiteBackground }]}>
            <Animated.View 
                style={[
                    styles.logoContainer, 
                    { 
                        transform: [{ scale: scaleAnim }],
                        opacity: fadeAnim 
                    }
                ]}
            >
                {/* Orange Circle */}
                <View style={[styles.iconCircle, { backgroundColor: theme.lightornge }]}>
                    <Ionicons name="musical-notes" size={scale(70)} color="#FFFFFF" />
                </View>

                {/* Text Logo - Now Dynamic */}
                <Text style={[styles.logoText, { color: theme.HeadingColor }]}>Mume</Text>

            </Animated.View>
        </View>
    );
};

export default FinalLogoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: scale(140),
        height: scale(140),
        borderRadius: scale(70),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        marginBottom: verticalScale(20),
    },
    logoText: {
        fontSize: textScale(40),
        fontWeight: '900',
        letterSpacing: 2,
        fontFamily: 'sans-serif-medium'
    }
});