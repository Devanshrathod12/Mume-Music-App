import { StyleSheet } from 'react-native'
import React from 'react'
import Route from "./src/Navigation/Routes"
import { SafeAreaProvider } from 'react-native-safe-area-context'
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
      <SafeAreaProvider>
        <Route />
      </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({
  
})