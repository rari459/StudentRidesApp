import React from 'react'
import { View, StyleSheet, Text, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper'
import * as ExpoLocation from 'expo-location'
import { Location } from '../../models'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

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

        const parentState = navigation.getParent().getState()
        const currentRoute = parentState.routes[parentState.index]
        const defaultDestination = currentRoute.params ? JSON.parse(currentRoute.params.destination) : undefined
        if (defaultDestination) {
            setDestinationLocation(defaultDestination)
            setDestinationText(defaultDestination.name)
            setFocusedField('destination')
        }
    }, [])

    // React.useEffect(() => {
    //     getClosestPickupLocation()
    // }, [currentLocation])

    React.useEffect(() => {
        if (pickupLocation) {
            setPickupText(pickupLocation.name)
            if (destinationLocation) {
                navigation.navigate('Confirm Ride', {pickup: pickupLocation, destination: destinationLocation})
            }
        }
    }, [pickupLocation])

    React.useEffect(() => {
        if (pickupLocation && pickupLocation.name !== pickupText) {
            setPickupLocation(undefined)
            searchFor(pickupText)
        } else if (!pickupLocation) {
            searchFor(pickupText)
        }
    }, [pickupText])

    React.useEffect(() => {
        if (destinationLocation) {
            setDestinationText(destinationLocation.name)
            if (pickupLocation) {
                navigation.navigate('Confirm Ride', {pickup: pickupLocation, destination: destinationLocation})
            }
        }
    }, [destinationLocation])

    React.useEffect(() => {
        if (destinationLocation && destinationLocation.name !== destinationText) {
            setDestinationLocation(undefined)
            searchFor(destinationText)
        } else if (!destinationLocation) {
            searchFor(destinationText)
        }
    }, [destinationText])

    async function getCurrentLocation() {
        const res = await ExpoLocation.requestForegroundPermissionsAsync()
        if (res.status === ExpoLocation.PermissionStatus.GRANTED) {
            const location = await ExpoLocation.getLastKnownPositionAsync()
            setCurrentLocation(location.coords)
        }
    }

    async function getClosestPickupLocation() {
        if (!currentLocation) return
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
                case 'pickup': {
                    setPickupLocation(location)
                    break
                }
                case 'destination': {
                    setDestinationLocation(location)
                    break
                }
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
            <TouchableWithoutFeedback>
                <View style={styles.content}>
                    <View style={styles.row}>
                        <TextInput 
                            label={'Pickup'}
                            value={pickupText}
                            onChangeText={setPickupText} 
                            onFocus={() => {
                                setFocusedField('pickup')
                                searchFor("")
                            }}
                            mode={'outlined'}
                            style={styles.textInput} 
                            outlineColor={'#8d97a6'}
                            activeOutlineColor={'#AB00FF'}
                            clearButtonMode={'while-editing'}
                            autoFocus={true}
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
                            onFocus={() => {
                                setFocusedField('destination')
                                searchFor("")
                            }}
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
                        keyboardShouldPersistTaps={'always'}
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