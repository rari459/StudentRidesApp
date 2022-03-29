import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import AuthContext from '../navigation/AuthContext'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Modalize } from 'react-native-modalize'
import * as ExpoLocation from 'expo-location'
import { useNavigation } from '@react-navigation/core'
import VanPNG from './../assets/van.png'

export default function ConfirmedRideModal({ ride, onCancel }) {

    const { currentUser } = React.useContext(AuthContext)
    const navigation = useNavigation()
    const [vehicle, setVehicle] = React.useState(null)
    const [currentLocation, setCurrentLocation] = React.useState(null)
    const [minutesAway, setMinutesAway] = React.useState(3)
    const modalizeRef = React.useRef(null)

    async function getCurrentLocation() {
        const res = await ExpoLocation.requestForegroundPermissionsAsync()
        if (res.status === ExpoLocation.PermissionStatus.GRANTED) {
            const location = await ExpoLocation.getLastKnownPositionAsync()
            setCurrentLocation(location.coords)
        }
    }

    React.useEffect(() => {
        getCurrentLocation()
    }, [ride])

    React.useEffect(() => {
        getTimeRemaining()
    }, [currentLocation])

    async function getTimeRemaining() {
        if (!currentLocation) return
        const vehicle = await ride.getVehicle()
        console.log(vehicle)
        setVehicle(vehicle)
        // setMinutesAway(timeRemaining)
    }

    async function cancelRide() {
        await ride.cancel()
        onCancel()
    }

    return (
        <Modalize 
            ref={modalizeRef}
            modalStyle={styles.modal} 
            alwaysOpen={360} 
            modalTopOffset={75}
            panGestureEnabled={false}
            scrollViewProps={{scrollEnabled: false}}
            withHandle={false}
        >
            <View style={styles.container}>
                <View>
                    {vehicle && <View style={{...styles.row, justifyContent: 'space-between'}}>
                        <Image source={VanPNG} style={styles.carImage} resizeMode={'contain'}/>
                        <View style={styles.vehicleInfoContainer}>
                            <Text style={{...styles.headingText, fontWeight: '500', color: 'rgba(0, 0, 0, 0.5)'}}>Your vehicle number is</Text>
                            <Text style={styles.licensePlateText}>{vehicle.number}</Text>
                        </View>
                    </View>}
                    <View style={styles.innerContent}>
                        <View style={styles.row}>
                            <SimpleLineIcons name={'clock'} size={26}/>
                            <View style={{marginHorizontal: 15}}>
                                <Text style={styles.headingText}>Arriving in {minutesAway} minutes</Text>
                                <Text style={styles.subheadingText}>We'll let you know when your ride is here.</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelRide}>
                    <Text style={styles.cancelButtonText}>{"Cancel Ride"}</Text>
                </TouchableOpacity>
            </View>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
        paddingVertical: 25,
        paddingHorizontal: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1
    },
    carImage: {
        height: 120,
        width: 140
    },
    vehicleInfoContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    licensePlateText: {
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
        paddingVertical: 5
    },
    innerContent: {
        paddingVertical: 20,
        marginBottom: 20
    },
    headingText: {
        fontSize: 17,
        fontWeight: '700'
    },
    subheadingText: {
        fontSize: 17,
        fontWeight: '500',
        opacity: 0.5,
        paddingTop: 3,
    },
    cancelButton: {
        flexDirection: 'row',
        backgroundColor: '#AB00FF',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelButtonText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        paddingHorizontal: 10
    }
});