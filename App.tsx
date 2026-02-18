import { StyleSheet } from 'react-native'
import React,{useEffect} from 'react'
import Route from "./src/Navigation/Routes"
import { SafeAreaProvider } from 'react-native-safe-area-context'
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { setupPlayer } from './src/Services/PlayerSetup';


const App = () => {

    useEffect(() => {
    setupPlayer();
  }, []);

  return (
      <SafeAreaProvider>
        <Route />
      </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({
  
})