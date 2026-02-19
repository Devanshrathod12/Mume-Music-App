import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../Styles/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme(); 
    const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setIsDarkMode(colorScheme === 'dark');
        });

        const checkTimeAndSetTheme = () => {
            const currentHour = new Date().getHours();
            if (currentHour >= 18 || currentHour < 7) {
                setIsDarkMode(true);
            } else {
                setIsDarkMode(Appearance.getColorScheme() === 'dark');
            }
        };

        checkTimeAndSetTheme();

        return () => subscription.remove();
    }, []);

    const theme = isDarkMode ? darkTheme : lightTheme;

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);