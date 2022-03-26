import React from 'react';
import { StyleSheet, Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from '../src/main/HomeView';

export default function AppStack() {

  const headerOptions = {
    title: "",
    headerBackTitleVisible: false,
    headerTintColor: '#AB00FF',
    headerTitleStyle: {
      color: '#000',
    },
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0
    },
    headerLeftContainerStyle: {
      padding: 10
    },
    headerRightContainerStyle: {
      padding: 10
    }
  }

  const Stack = createStackNavigator()

  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Home" component={HomeView}/>
    </Stack.Navigator>
  )
}