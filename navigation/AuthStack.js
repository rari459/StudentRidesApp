import React from 'react';
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import LoginView from '../src/auth/LoginView';
import RegisterView from '../src/auth/RegisterView';
import WelcomeView from '../src/auth/WelcomeView';

export default function AuthStack() {

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
      <Stack.Screen name="Welcome" component={WelcomeView}/>
      <Stack.Screen name="Login" component={LoginView}/>
      <Stack.Screen name="Register" component={RegisterView}/>
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50
  },
})