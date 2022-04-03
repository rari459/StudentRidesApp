import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native'
import AuthContext from '../../navigation/AuthContext'
import MapView, { Marker } from 'react-native-maps'
import Feather from 'react-native-vector-icons/Feather'
import RecentRidesModal from '../../components/RecentRidesModal'
import ConfirmedRideModal from '../../components/ConfirmedRideModal'
import { useIsFocused } from '@react-navigation/native'
import PendingRideModal from '../../components/PendingRideModal'
import firestore from '@react-native-firebase/firestore';
import { Ride, Vehicle } from '../../models'
import VanTopPNG from '../../assets/van_top.png'

export default function HomeView({ navigation }) {

    const { currentUser } = React.useContext(AuthContext)
    const [currentRide, setCurrentRide] = React.useState(null)
    const [hasCurrentRide, setHasCurrentRide] = React.useState(false)
    const [vehicles, setVehicles] = React.useState([])
    const isFocused = useIsFocused()

    const DrawerButton = () => (
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.openDrawer()}>
            <Feather name={'menu'} size={22} color={'#666666'}/>
        </TouchableOpacity>
    )

    const HeaderBar = () => (
        <TouchableOpacity style={styles.headerBar} activeOpacity={0.7} onPress={() => navigation.navigate('Request Ride')} disabled={currentRide}>
            {!currentRide && <Feather name={'search'} size={18} color={'#666666'}/>}
            {currentRide ?
                <Text style={styles.headerBarText} numberOfLines={1}>{currentRide.pickup} → {currentRide.destination}</Text>
            :
                <Text style={styles.headerBarText}>Where are you going?</Text>
            }
        </TouchableOpacity>
    )

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerLeft: DrawerButton,
            headerTitle: HeaderBar,
            headerTitleAlign: 'right',
            headerTitleContainerStyle: {
                flexGrow: 1,
                marginHorizontal: 10,
                marginRight: 15
            },
            headerLeftContainerStyle: {
                padding: 15,
                marginRight: -10,
                flexGrow: 0
            },
            headerRightContainerStyle: {
                flexGrow: 0
            }
        })
    }, [currentRide])

    React.useEffect(() => {
        if (isFocused) {
            getCurrentRide()
        }
    }, [isFocused])

    React.useEffect(() => {
        const subscriber = firestore().collection('vehicles').where('school', '==', currentUser.school).onSnapshot((snapshot) => {
            const docs = snapshot.docs
            if (!docs || snapshot.empty) {
                return Promise.resolve([])
            }
            const vehicles = docs.map((doc) => {
                const data = doc.data()
                return Vehicle.fromJSON(data)
            })
            setVehicles(vehicles)
        })

        return () => subscriber()
    }, [])

    React.useEffect(() => {
        if (!hasCurrentRide) return
        
        const subscriber = firestore().collection('users').doc(currentUser.uid).collection('rides').doc(currentRide.uid).onSnapshot((snapshot) => {
            if (snapshot.exists) {
                const data = snapshot.data()
                const updatedRide = Ride.fromJSON(data)
                setCurrentRide(updatedRide)
                if (updatedRide.isCompleted) {
                    setCurrentRide(null)
                    setHasCurrentRide(false)
                    navigation.navigate('Rate Ride', {ride: updatedRide})
                }
                else if (updatedRide.isCancelled) {
                    setCurrentRide(null)
                    setHasCurrentRide(false)
                }
            } else {
                setCurrentRide(null)
            }
        })

        return () => subscriber()
    }, [hasCurrentRide])

    async function getCurrentRide() {
        try {
            const ride = await currentUser.getCurrentRide()
            if (ride) {
                setCurrentRide(ride)
                setHasCurrentRide(true)
            }
        } catch (err) {
            console.log(err)
            Alert.alert("Error", err.message)
        }
    }

    function onCancelRide() {
        setCurrentRide(null)
    }

    function renderVehicleMarkers() {
        return vehicles.map((vehicle) => (
            <Marker coordinate={{latitude: vehicle.lastLocation.latitude, longitude: vehicle.lastLocation.longitude}}>
                <Image source={VanTopPNG} style={{...styles.markerImage, transform: [{rotate: `-${vehicle.angle}deg`}]}} resizeMode={'contain'}/>
            </Marker>
        ))
    }

    function renderModal() {
        if (currentRide) {
            if (currentRide.isPending) {
                return <PendingRideModal ride={currentRide} onCancel={onCancelRide}/>
            } else {
                return <ConfirmedRideModal ride={currentRide} onCancel={onCancelRide}/>
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
                showsCompass={true}
                compassOffset={{x: 20, y: -100}}
                showsUserLocation={false}
                toolbarEnabled={false}
                followsUserLocation={currentRide && !currentRide.isPending}
            >
                {renderVehicleMarkers()}
            </MapView>
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
        height: 42.5,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 5,  
        elevation: 1,
        paddingHorizontal: 5
    },
    headerBarText: {
        fontWeight: '500',
        fontSize: 15,
        fontStyle: 'italic',
        color: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        maxWidth: '95%'
    },
    modal: {
        minHeight: 300,
        backgroundColor: '#fff',
        paddingVertical: 25,
        paddingHorizontal: 20
    },
    markerImage: {
        maxHeight: 60,
        maxWidth: 60,
        aspectRatio: 2
    }
});