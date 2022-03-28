import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from '../src/main/HomeView.jsx';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerMenu from './DrawerMenu';
import RequestRideView from '../src/main/RequestRideView.jsx';
import Feather from 'react-native-vector-icons/Feather';

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

  function RootStack() {
    const Stack = createStackNavigator()

    return (
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name="Home" component={HomeView}/>
        <Stack.Screen name="Request Ride" component={RequestRideView} options={{
          presentation: 'modal',
          headerBackImage: () => <Feather name={'x'} size={28} color={'#000'} style={{padding: 5}}/>
        }}/>
      </Stack.Navigator>
    )
  }

  const Drawer = createDrawerNavigator()

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerMenu {...props}/>}>
      <Drawer.Screen name="Root" component={RootStack} options={{swipeEnabled: false, headerShown: false}}/>
    </Drawer.Navigator>
  )
}