import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { Modalize } from 'react-native-modalize'

export default function PendingRideModal({ ride, onCancel }) {

    const modalizeRef = React.useRef(null)

    async function cancelRide() {
        await ride.cancel()
        onCancel()
    }

    return (
        <Modalize 
            ref={modalizeRef}
            modalStyle={styles.modal} 
            alwaysOpen={200} 
            modalTopOffset={75}
            panGestureEnabled={false}
            scrollViewProps={{scrollEnabled: false}}
            withHandle={false}
        >
            <View style={styles.container}>
                <View style={styles.innerContent}>
                    <View style={styles.row}>
                        <Feather name={'search'} size={26}/>
                        <View style={{marginHorizontal: 15}}>
                            <Text style={styles.headingText}>Searching for a driver...</Text>
                            <Text style={styles.subheadingText}>You'll be notified when a driver near you accepts your request.</Text>
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
    innerContent: {
        paddingTop: 0,
        paddingVertical: 30
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
        paddingRight: 10
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