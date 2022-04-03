import React, { useRef } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import NumericInput from 'react-native-numeric-input'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Ride } from '../../models'
import AuthContext from '../../navigation/AuthContext'

export default function ConfirmRideView({ route, navigation }) {

    const { currentUser } = React.useContext(AuthContext)
    const pickupLocation = route.params.pickup
    const destinationLocation = route.params.destination
    const [loading, setLoading] = React.useState(false)
    const [passengers, setPassengers] = React.useState(1)
    const [wheelchairs, setWheelchairs] = React.useState(0)

    async function submit() {
        try {
            setLoading(true)
            const newRideRequest = new Ride(currentUser, pickupLocation, destinationLocation, passengers, wheelchairs)
            await newRideRequest.create()
            setLoading(false)
            navigation.getParent().goBack()
        } catch (err) {
            setLoading(false)
            console.log(err)
            Alert.alert("Error", "Could not confirm your ride. Try again later.")
        }
    }

    return (
        <SafeAreaProvider initialSafeAreaInsets={{top: 0}}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.headerText}>Confirm Ride</Text>
                    <View style={styles.innerContent}>
                        <View style={styles.column}>
                            <Text style={styles.headingText}>Pickup</Text>
                            <Text style={styles.locationNameText}>{pickupLocation.name}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.headingText}>Destination</Text>
                            <Text style={styles.locationNameText}>{destinationLocation.name}</Text>
                        </View>
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.rowHeadingText}>Passengers</Text>
                                <NumericInput
                                    value={passengers}
                                    onChange={setPassengers}
                                    totalHeight={40} 
                                    rounded={true}
                                    minValue={1}
                                    maxValue={6}
                                />
                            </View>
                        </View>
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.rowHeadingText}>Wheelchairs</Text>
                                <NumericInput
                                    value={wheelchairs}
                                    onChange={setWheelchairs}
                                    totalHeight={40} 
                                    rounded={true}
                                    minValue={0}
                                    maxValue={4}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.orderButton} onPress={submit} disabled={loading}>
                    {loading && <ActivityIndicator color={'#fff'}/>}
                    <Text style={styles.orderButtonText}>{loading ? "Processing..." : "Order Ride"}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    content: {
        flexGrow: 1,
        alignItems: 'stretch'
    },
    headerText: {
        fontSize: 34,
        fontWeight: '600'
    },
    innerContent: {
        paddingVertical: 20
    },
    column: {
        marginVertical: 15
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    headingText: {
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 0.5)'
    },
    rowHeadingText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.75)'
    },
    locationNameText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.8)',
        paddingVertical: 5
    },
    orderButton: {
        flexDirection: 'row',
        backgroundColor: '#AB00FF',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    orderButtonText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        paddingHorizontal: 10
    }
});