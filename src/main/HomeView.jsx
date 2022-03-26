import React, { useRef } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import AuthContext from '../../navigation/AuthContext'
import MapView from 'react-native-maps'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Modalize } from 'react-native-modalize'
import moment from 'moment'

export default function HomeView({ navigation }) {

    const { currentUser } = React.useContext(AuthContext)
    const modalizeRef = useRef(null)
    const [serviceIsActive, setServiceIsActive] = React.useState(false)

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
        const currentTime = moment()
        
        if ((currentTime.hour() >= 18 && currentTime.hour() < 24) || (currentTime.hour() >= 0 && currentTime.hour() < 6)) {
            setServiceIsActive(true)
        } else {
            setServiceIsActive(false)
        }
    }, [])

    const TEST_DATA = [
        {
            name: "Marston Science Library",
            dateCreated: new Date()
        },
        {
            name: "Library West",
            dateCreated: new Date()
        },
        {
            name: "Beaty Towers",
            dateCreated: new Date()
        }
    ]

    function renderGreetingText() {
        const currentTime = moment()
        
        if ((currentTime.hour() >= 18 && currentTime.hour() < 24) || (currentTime.hour() >= 0 && currentTime.hour() < 6)) {
            return `Good evening, ${currentUser.name} 🌙`
        } else {
            return `Hello there, ${currentUser.name} ☀️`
        }
    }

    const RecentListHeader = () => (
        <View>
            <Text style={styles.greetingText}>{renderGreetingText()}</Text>
            <Text style={styles.statusText}>The SNAP service is {serviceIsActive ? 'active' : 'inactive'}</Text>
        </View>
    )

    const RecentRideCard = ({name, dateCreated}) => (
        <TouchableOpacity style={styles.recentRideCardContainer}>
            <Ionicons name={'location-sharp'} size={33} color={'#AB00FF'}/>
            <View style={styles.recentRideCardInfoColumn}>
                <Text style={styles.recentRideNameText}>{name}</Text>
                <Text style={styles.recentRideDateText}>{moment(dateCreated).format('MMM DD, h:mm A')}</Text>
            </View>
        </TouchableOpacity>
    )

    function renderRecentRideItem({ item }) {
        return <RecentRideCard {...item}/>
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
            <Modalize 
                ref={modalizeRef}
                modalStyle={styles.modal} 
                alwaysOpen={300} 
                modalTopOffset={75}
                panGestureComponentEnabled={true}
                flatListProps={{
                    ListHeaderComponent: RecentListHeader,
                    data: TEST_DATA,
                    renderItem: renderRecentRideItem,
                    scrollEnabled: false
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
        paddingVertical: 5,
        marginVertical: 10,
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
    }
});