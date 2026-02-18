import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { scale, verticalScale, textScale } from '../../Styles/StyleConfig';
import colors from '../../Styles/colors';

const sortOptions = [
    "Ascending",
    "Descending",
    "Artist",
    "Album",
    "Year",
    "Date Added",
    "Date Modified",
    "Composer"
];

const SortModal = ({ visible, onClose, selectedOption, onSelect }) => {
    
    const renderOption = ({ item }) => {
        const isSelected = selectedOption === item;
        return (
            <TouchableOpacity 
                style={styles.optionRow} 
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
            >
                <Text style={styles.optionText}>{item}</Text>
                <Ionicons 
                    // Screenshot jaisa design: Selected ho to Filled Radio, nahi to Outline
                    name={isSelected ? "radio-button-on" : "radio-button-off"} 
                    size={scale(20)} 
                    color={isSelected ? colors.Primary : colors.SecondaryText} 
                />
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true} // Transparent background ke liye jaruri hai
            animationType="fade" // Fade effect
            onRequestClose={onClose}
        >
            {/* TouchableWithoutFeedback: Screen ke background pr touch handle krta hai */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    
                    {/* Inner TouchableWithoutFeedback: Ye Modal Box ko band hone se rokta hai */}
                    <TouchableWithoutFeedback onPress={() => {}}> 
                        <View style={styles.modalContainer}>
                            <FlatList
                                data={sortOptions}
                                renderItem={renderOption}
                                keyExtractor={(item) => item}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                scrollEnabled={false} // Chota list hai, scroll ki jarurat nahi
                            />
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SortModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: scale(30),
        marginTop:verticalScale(150),
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(20),
        width: '55%', // Width thoda increase kiya
        paddingVertical: verticalScale(20),
        paddingHorizontal: scale(20),
        elevation: 8, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
       
        marginRight:-scale(150)
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(14), // Thoda spacing diya options ke beech
    },
    optionText: {
        fontSize: textScale(14),
        fontWeight: '500',
        color: '#1E293B', // Dark Color
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F5F9', // Very Light Line
    }
});