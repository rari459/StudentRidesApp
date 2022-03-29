import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import AuthContext from '../navigation/AuthContext'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Modalize } from 'react-native-modalize'
import moment from 'moment'
import { useNavigation } from '@react-navigation/core'

export default function RecentRidesModal() {

    const { currentUser } = React.useContext(AuthContext)
    const navigation = useNavigation()
    const modalizeRef = React.useRef(null)
    const [serviceIsActive, setServiceIsActive] = React.useState(false)
    const [previousDestinations, setPreviousDestinations] = React.useState([])

    React.useEffect(() => {
        getPreviousRides()

        const currentTime = moment()
        
        if ((currentTime.hour() >= 18 && currentTime.hour() < 24) || (currentTime.hour() >= 0 && currentTime.hour() < 6)) {
            setServiceIsActive(true)
        } else {
            setServiceIsActive(false)
        }
    }, [])

    async function getPreviousRides() {
        try {
            const locations = await currentUser.getPreviousDestinations()
            setPreviousDestinations(locations)
        } catch (err) {
            Alert.alert("Error", err.message)
        }
    }

    function renderGreetingText() {
        const currentTime = moment()
        
        if ((currentTime.hour() >= 18 && currentTime.hour() < 24) || (currentTime.hour() >= 0 && currentTime.hour() < 6)) {
            return `Good evening, ${currentUser.name} 🌙`
        } else {
            return `Hi there, ${currentUser.name} ☀️`
        }
    }

    const RecentListHeader = () => (
        <View>
            <Text style={styles.greetingText}>{renderGreetingText()}</Text>
            <Text style={styles.statusText}>The SNAP service is {serviceIsActive ? 'active' : 'inactive'}</Text>
        </View>
    )

    const RecentRideCard = ({ destination }) => (
        <TouchableOpacity style={styles.recentRideCardContainer} onPress={() => navigation.navigate('Request Ride', {destination: JSON.stringify(destination)})}>
            <Ionicons name={'location-sharp'} size={33} color={'#AB00FF'}/>
            <View style={styles.recentRideCardInfoColumn}>
                <Text style={styles.recentRideNameText}>{destination.name}</Text>
                <Text style={styles.recentRideDateText}>{moment(destination.rideDate).format('MMM DD, h:mm A')}</Text>
            </View>
        </TouchableOpacity>
    )

    function renderRecentRideItem({ item }) {
        return <RecentRideCard destination={item}/>
    }

    return (
        <Modalize 
            ref={modalizeRef}
            modalStyle={styles.modal} 
            alwaysOpen={300} 
            modalTopOffset={75}
            panGestureComponentEnabled={true}
            flatListProps={{
                ListHeaderComponent: RecentListHeader,
                data: previousDestinations,
                renderItem: renderRecentRideItem,
                scrollEnabled: false
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    modal: {
        backgroundColor: '#fff',
        paddingVertical: 25,
        paddingHorizontal: 20
    },
    greetingText: {
        fontWeight: '600',
        fontSize: 26
    },
    statusText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.7)',
        marginVertical: 10
    },
    recentRideCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginVertical: 5,
        backgroundColor: '#fff'
    },
    recentRideCardInfoColumn: {
        marginLeft: 10
    },
    recentRideNameText: {
        fontSize: 17,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.8)',
        marginBottom: 3
    },
    recentRideDateText: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.5)'
    },
    currentRideStatusText: {
        fontSize: 20,
        fontWeight: '600'
    }
});