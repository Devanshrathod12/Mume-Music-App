
import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// Theme & Config
import { useTheme } from '../../Context/ThemeContext'; 
import { scale, verticalScale, textScale } from '../../Styles/StyleConfig';

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
    const { theme } = useTheme();

    const renderOption = ({ item }) => {
        const isSelected = selectedOption === item;
        return (
            <TouchableOpacity 
                style={styles.optionRow} 
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
            >
                <Text style={[styles.optionText, { color: theme.HeadingColor }]}>{item}</Text>
                <Ionicons 
                    name={isSelected ? "radio-button-on" : "radio-button-off"} 
                    size={scale(20)} 
                    color={isSelected ? theme.Primary : theme.SecondaryText} 
                />
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    
                    <TouchableWithoutFeedback onPress={() => {}}> 
                        <View style={[
                            styles.modalContainer, 
                            { 
                                backgroundColor: theme.ModalBackground, 
                                shadowColor: theme.Black // Dark mode mein shadow black hi rahegi
                            }
                        ]}>
                            <FlatList
                                data={sortOptions}
                                renderItem={renderOption}
                                keyExtractor={(item) => item}
                                ItemExtractor={(item) => item}
                                ItemSeparatorComponent={() => (
                                    <View style={[styles.separator, { backgroundColor: theme.Divider }]} />
                                )}
                                scrollEnabled={false}
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
        marginTop: verticalScale(150),
    },
    modalContainer: {
        borderRadius: scale(20),
        width: '55%', 
        paddingVertical: verticalScale(10), // Padding thoda kam kiya for better look
        paddingHorizontal: scale(20),
        elevation: 10, 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginRight: -scale(150) // Aapki original alignment bar-karar rakhi hai
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(14), 
    },
    optionText: {
        fontSize: textScale(14),
        fontWeight: '600',
    },
    separator: {
        height: 1,
        width: '100%',
    }
});