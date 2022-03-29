import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import AuthContext from '../../navigation/AuthContext'
import MapView from 'react-native-maps'
import Feather from 'react-native-vector-icons/Feather'
import RecentRidesModal from '../../components/RecentRidesModal'
import ConfirmedRideModal from '../../components/ConfirmedRideModal'
import { useIsFocused } from '@react-navigation/native'
import PendingRideModal from '../../components/PendingRideModal'
import firestore from '@react-native-firebase/firestore';
import { Ride } from '../../models'

export default function HomeView({ navigation }) {

    const { currentUser } = React.useContext(AuthContext)
    const [currentRide, setCurrentRide] = React.useState(null)
    const isFocused = useIsFocused()

    const DrawerButton = () => (
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.openDrawer()}>
            <Feather name={'menu'} size={22} color={'#666666'}/>
        </TouchableOpacity>
    )

    const HeaderBar = () => (
        <TouchableOpacity style={styles.headerBar} activeOpacity={0.7} onPress={() => navigation.navigate('Request Ride')}>
            <Feather name={'search'} size={18} color={'#666666'}/>
            <Text style={styles.headerBarText}>Where are you going?</Text>
        </TouchableOpacity>
    )

    React.useLayoutEffect(() => {
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
            },
            headerRightContainerStyle: {
                flexGrow: 0
            }
        })
    }, [])

    React.useEffect(() => {
        getCurrentRide()
    }, [isFocused])

    React.useEffect(() => {
        if (!currentRide) return
        
        const subscriber = firestore().collection('users').doc(currentUser.uid).collection('rides').doc(currentRide.uid).onSnapshot((snapshot) => {
            if (snapshot.exists) {
                const data = snapshot.data()
                const updatedRide = Ride.fromJSON(data)
                setCurrentRide(updatedRide)
            } else {
                setCurrentRide(null)
            }
        })

        return () => subscriber()
    }, [currentRide])

    async function getCurrentRide() {
        try {
            const ride = await currentUser.getCurrentRide()
            setCurrentRide(ride)
        } catch (err) {
            console.log(err)
            Alert.alert("Error", err.message)
        }
    }

    function onCancelRide() {
        setCurrentRide(null)
    }

    function renderModal() {
        if (currentRide) {
            if (currentRide.driver && currentRide.vehicle) {
                return <ConfirmedRideModal ride={currentRide} onCancel={onCancelRide}/>
            } else {
                return <PendingRideModal ride={currentRide} onCancel={onCancelRide}/>
            }
        } else {
            return <RecentRidesModal/>
        }
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 29.6465,
                    longitude: -82.343567,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            />
            {renderModal()}
        </View>
    )
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    map: {
        flexGrow: 1
    },
    button: {
        backgroundColor: '#fff',
        width: 42.5,
        height: 42.5,
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
    },
    modal: {
        minHeight: 300,
        backgroundColor: '#fff',
        paddingVertical: 25,
        paddingHorizontal: 20
    }
});