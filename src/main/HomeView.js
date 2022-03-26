import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import AuthContext from '../../navigation/AuthContext'
import MapView from 'react-native-maps'
import Feather from 'react-native-vector-icons/Feather'

export default function HomeView({ navigation }) {

    const { currentUser } = React.useContext(AuthContext)

    const DrawerButton = () => (
        <TouchableOpacity style={styles.button} onPress={openDrawer}>
            <Feather name={'menu'} size={22} color={'#454545'}/>
        </TouchableOpacity>
    )

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerLeft: DrawerButton,
            headerLeftContainerStyle: {
                padding: 15
            }
        })
    }, [])

    function openDrawer() {
        navigation.openDrawer()
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 29.648621,
                    longitude: -82.343567,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            />
        </View>
    )
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  map: {
    flex: 1
  },
  button: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,  
    elevation: 3
  }
});