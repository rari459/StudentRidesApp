import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from '../src/main/HomeView.jsx';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerMenu from './DrawerMenu';
import RequestRideView from '../src/main/RequestRideView.jsx';
import Feather from 'react-native-vector-icons/Feather';
import ConfirmRideView from '../src/main/ConfirmRideView.jsx';
import RatingView from '../src/main/RatingView.jsx';
import RideHistoryView from '../src/main/RideHistoryView.jsx';

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

  function RequestRideStack() {
    const Stack = createStackNavigator()

    return (
      <Stack.Navigator screenOptions={{...headerOptions,
        headerBackImage: () => <Feather name={'x'} size={28} color={'#000'} style={{padding: 5}}/>
      }}>
        <Stack.Screen name="Root" component={RequestRideView}/>
        <Stack.Screen name="Confirm Ride" component={ConfirmRideView}/>
      </Stack.Navigator>
    )
  }

  function RootStack() {
    const Stack = createStackNavigator()

    return (
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name="Home" component={HomeView}/>
        <Stack.Screen name="Request Ride" component={RequestRideStack} options={{presentation: 'modal', headerShown: false}}/>
        <Stack.Screen name="Rate Ride" component={RatingView} options={{presentation: 'modal', headerBackImage: () => <Feather name={'x'} size={28} color={'#000'} style={{padding: 5}}/>}}/>
        <Stack.Screen name="Ride History" component={RideHistoryView} options={{title: "Ride History"}}/>
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