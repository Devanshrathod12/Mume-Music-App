import { StyleSheet } from 'react-native'
import React,{useEffect} from 'react'
import Route from "./src/Navigation/Routes"
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { setupPlayer } from './src/Services/PlayerSetup';
import { ThemeProvider } from './src/Context/ThemeContext';
import { PermissionsAndroid, Platform } from 'react-native';
const App = () => {


  useEffect(() => {
    const initializePlayer = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, 
        );
      }
      await setupPlayer();
    };

    initializePlayer();
  }, []);

  return (
      <SafeAreaProvider>
        <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
        <Route />
        </ThemeProvider>
        </PersistGate>
        </Provider>
      </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({
  
})