import React from 'react';
import { 
    StyleSheet, Text, View, Switch, ScrollView 
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Theme & Config
import { useTheme } from '../Context/ThemeContext'; 
import { scale, verticalScale, textScale } from '../Styles/StyleConfig';

const Setting = () => {
    const insets = useSafeAreaInsets();
    const { isDarkMode, toggleTheme, theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.WhiteBackground, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.HeadingColor }]}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Appearance Section */}
                <Text style={[styles.sectionLabel, { color: theme.SecondaryText }]}>Appearance</Text>
                
                <View style={[styles.itemRow, { borderBottomColor: theme.Separator }]}>
                    <View style={styles.leftContent}>
                        <View style={[styles.iconBox, { backgroundColor: theme.MainBackground }]}>
                            <Ionicons 
                                name={isDarkMode ? "moon" : "sunny"} 
                                size={22} 
                                color={theme.Primary} 
                            />
                        </View>
                        <Text style={[styles.itemTitle, { color: theme.HeadingColor }]}>Dark Mode</Text>
                    </View>

                    <Switch 
                        value={isDarkMode} 
                        onValueChange={toggleTheme} 
                        trackColor={{ false: "#D1D5DB", true: theme.Primary }}
                        thumbColor={"#FFFFFF"}
                    />
                </View>

                {/* Other Section */}
                <Text style={[styles.sectionLabel, { color: theme.SecondaryText, marginTop: 30 }]}>Other</Text>
                
                <View style={[styles.itemRow, { borderBottomWidth: 0 }]}>
                    <View style={styles.leftContent}>
                        <View style={[styles.iconBox, { backgroundColor: theme.MainBackground }]}>
                            <Ionicons name="ellipsis-horizontal-circle-outline" size={22} color={theme.SecondaryText} />
                        </View>
                        <Text style={[styles.itemTitle, { color: theme.SecondaryText }]}>More Features</Text>
                    </View>
                    <Text style={[styles.comingSoonText, { color: theme.Primary, backgroundColor: theme.MainBackground }]}>
                        Coming Soon
                    </Text>
                </View>

                {/* App Version Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.versionText, { color: theme.SecondaryText }]}>Version 1.0.0</Text>
                </View>

            </ScrollView>
        </View>
    );
};

export default Setting;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(15),
    },
    headerTitle: {
        fontSize: textScale(24),
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(10),
    },
    sectionLabel: {
        fontSize: textScale(12),
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: verticalScale(10),
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(12),
        borderBottomWidth: 0.5,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: scale(40),
        height: scale(40),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(15),
    },
    itemTitle: {
        fontSize: textScale(16),
        fontWeight: '600',
    },
    comingSoonText: {
        fontSize: textScale(10),
        fontWeight: 'bold',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: 8,
        overflow: 'hidden',
        textTransform: 'uppercase'
    },
    footer: {
        marginTop: verticalScale(50),
        alignItems: 'center'
    },
    versionText: {
        fontSize: textScale(12),
        fontWeight: '500',
        opacity: 0.6
    }
});