import React, { useRef } from 'react'
import { View, StyleSheet, Text, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper'
import AuthContext from '../../navigation/AuthContext'
import * as ExpoLocation from 'expo-location'
import { Location } from '../../models'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function RequestRideView({ route, navigation }) {

    const [currentLocation, setCurrentLocation] = React.useState(null)
    const [focusedField, setFocusedField] = React.useState('pickup')
    const [pickupText, setPickupText] = React.useState("")
    const [pickupLocation, setPickupLocation] = React.useState(undefined)
    const [destinationText, setDestinationText] = React.useState("")
    const [destinationLocation, setDestinationLocation] = React.useState(undefined)
    const [searchResults, setSearchResults] = React.useState([])

    React.useEffect(() => {
        getCurrentLocation()

        const defaultDestination = route.params ? JSON.parse(route.params.destination) : undefined
        if (defaultDestination) {
            setDestinationLocation(defaultDestination)
            setDestinationText(defaultDestination.name)
        }
    }, [])

    React.useEffect(() => {
        if (pickupLocation) {
            setPickupText(pickupLocation.name)
        }
    }, [pickupLocation])

    React.useEffect(() => {
        if (pickupLocation && pickupLocation.name !== pickupText) {
            setPickupLocation(undefined)
            searchFor(pickupText)
        } else if (!pickupLocation) {
            searchFor(pickupText)
        } else {
            searchFor("")
        }
    }, [pickupText])

    React.useEffect(() => {
        if (destinationLocation) {
            setDestinationText(destinationLocation.name)
        }
    }, [destinationLocation])

    React.useEffect(() => {
        if (destinationLocation && destinationLocation.name !== destinationText) {
            setDestinationLocation(undefined)
            searchFor(destinationText)
        } else if (!destinationLocation) {
            searchFor(destinationText)
        } else {
            searchFor("")
        }
    }, [destinationText])

    async function getCurrentLocation() {
        const res = await ExpoLocation.requestForegroundPermissionsAsync()
        if (res.status === ExpoLocation.PermissionStatus.GRANTED) {
            const location = await ExpoLocation.getCurrentPositionAsync()
            setCurrentLocation(location.coords)
        }
    }

    async function getClosestPickupLocation() {
        const closestLocation = await Location.findNearestLocation(currentLocation)
        setPickupLocation(closestLocation)
    }

    async function searchFor(text) {
        if (text) {
            const results = await Location.searchForLocations(text)
            setSearchResults(results)
        } else {
            setSearchResults([])
        }
    }

    function renderSearchResults({ item }) {
        return <SearchResultCard location={item}/>
    }

    const SearchResultCard = ({ location }) => {

        function onPress() {
            switch (focusedField) {
                case 'pickup': return setPickupLocation(location)
                case 'destination': return setDestinationLocation(location)
                default: break
            }
        }

        return (
            <TouchableOpacity style={styles.searchResultCardContainer} onPress={onPress}>
                <Ionicons name={'location-sharp'} size={30} color={'#AB00FF'}/>
                <View style={styles.searchResultCardInfoColumn}>
                    <Text style={styles.searchResultCardNameText}>{location.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    <View style={styles.row}>
                        <TextInput 
                            label={'Pickup'}
                            value={pickupText}
                            onChangeText={setPickupText} 
                            onFocus={() => setFocusedField('pickup')}
                            onEndEditing={() => setFocusedField(null)}
                            mode={'outlined'}
                            style={styles.textInput} 
                            outlineColor={'#8d97a6'}
                            activeOutlineColor={'#AB00FF'}
                            clearButtonMode={'while-editing'}
                        />
                        <TouchableOpacity style={styles.currentLocationButton} onPress={getClosestPickupLocation}>
                            <MaterialIcons name={'my-location'} size={30} color={'rgba(0, 0, 0, 0.3)'}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TextInput 
                            label={'Destination'}
                            value={destinationText}
                            onChangeText={setDestinationText} 
                            onFocus={() => setFocusedField('destination')}
                            onEndEditing={() => setFocusedField(null)}
                            mode={'outlined'}
                            style={styles.textInput} 
                            outlineColor={'#8d97a6'}
                            activeOutlineColor={'#AB00FF'}
                            clearButtonMode={'while-editing'}
                        />
                    </View>
                    <FlatList
                        data={searchResults}
                        contentContainerStyle={{paddingVertical: 10}}
                        renderItem={renderSearchResults}
                    />
                </View>
              </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 0,
        paddingHorizontal: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textInput: {
        marginVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        height: 50,
        flexGrow: 1
    },
    currentLocationButton: {
        paddingHorizontal: 5,
        height: 52.5,
        margin: 5,
        top: 2.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchResultCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        marginVertical: 5,
        backgroundColor: '#fff'
    },
    searchResultCardInfoColumn: {
        marginLeft: 10
    },
    searchResultCardNameText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 3
    },
});