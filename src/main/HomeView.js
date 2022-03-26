import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import AuthContext from '../../navigation/AuthContext'
import MapView from 'react-native-maps'
import Feather from 'react-native-vector-icons/Feather'

export default function HomeView({ navigation }) {

    const { currentUser } = React.useContext(AuthContext)

    const DrawerButton = () => (
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.openDrawer()}>
            <Feather name={'menu'} size={22} color={'#666666'}/>
        </TouchableOpacity>
    )

    const HeaderBar = () => (
        <TouchableOpacity style={styles.headerBar} activeOpacity={0.7}>
            <Feather name={'search'} size={18} color={'#666666'}/>
            <Text style={styles.headerBarText}>Where are you going?</Text>
        </TouchableOpacity>
    )

    React.useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerLeft: DrawerButton,
            headerTitle: HeaderBar,
            headerTitleContainerStyle: {
                flexGrow: 1
            },
            headerLeftContainerStyle: {
                padding: 15,
                marginRight: 20,
                flexGrow: 0
            }
        })
    }, [])

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
  },
  headerBar: {
    backgroundColor: '#fff',
    height: 40,
    flexGrow: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,  
    elevation: 1
  },
  headerBarText: {
      fontWeight: '500',
      fontSize: 15,
      fontStyle: 'italic',
      color: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 5
  }
});