import React from 'react'
import AppNavigator from './navigation/AppNavigator.jsx'
import { AuthProvider } from './navigation/AuthProvider'

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
  )
}