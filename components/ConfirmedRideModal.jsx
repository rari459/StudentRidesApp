import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Modalize } from 'react-native-modalize'
import VanPNG from './../assets/van.png'

export default function ConfirmedRideModal({ ride, onCancel }) {

    const [vehicle, setVehicle] = React.useState(null)
    const [minutesAway, setMinutesAway] = React.useState(0)
    const modalizeRef = React.useRef(null)

    React.useEffect(() => {
        refresh()
    }, [])

    async function refresh() {
        const vehicle = await ride.getVehicle()
        setVehicle(vehicle)
        const pickupLocation = await ride.getPickup()
        if (pickupLocation) {
            const timeRemaining = await vehicle.getETA(pickupLocation)
            setMinutesAway(timeRemaining)
        }
    }

    async function cancelRide() {
        await ride.cancel()
        onCancel()
    }

    return (
        <Modalize 
            ref={modalizeRef}
            modalStyle={styles.modal} 
            alwaysOpen={350} 
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
                            <Text style={styles.subheadingText}>Your vehicle number is</Text>
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
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        paddingHorizontal: 10
    }
});