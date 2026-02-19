import { StyleSheet } from 'react-native'
import React,{useEffect} from 'react'
import Route from "./src/Navigation/Routes"
import { SafeAreaProvider } from 'react-native-safe-area-context'
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { setupPlayer } from './src/Services/PlayerSetup';


const App = () => {

    useEffect(() => {
    setupPlayer();
  }, []);

  return (
      <SafeAreaProvider>
        <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Route />
        </PersistGate>
        </Provider>
      </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({
  
})