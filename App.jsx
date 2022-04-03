import React from 'react'
import { LogBox } from 'react-native'
import AppNavigator from './navigation/AppNavigator.jsx'
import { AuthProvider } from './navigation/AuthProvider'

export default function App() {

  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);

  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
  )
}