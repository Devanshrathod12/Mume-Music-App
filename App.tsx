import { StyleSheet } from 'react-native'
import React,{useEffect} from 'react'
import Route from "./src/Navigation/Routes"
import { SafeAreaProvider } from 'react-native-safe-area-context'
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { setupPlayer } from './src/Services/PlayerSetup';
import { ThemeProvider } from './src/Context/ThemeContext';
import { PermissionsAndroid, Platform } from 'react-native';
const App = () => {

  //   useEffect(() => {
  //   setupPlayer();
  // }, []);

  useEffect(() => {
    const initializePlayer = async () => {
      // Android 12 ke liye ye permission maang lo, safe rehta hai
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, // Kabhi-kabhi caching ke liye chahiye hota hai
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