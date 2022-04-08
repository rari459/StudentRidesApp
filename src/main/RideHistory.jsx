import React from 'react'
import { View, StyleSheet, Text, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper'
import * as ExpoLocation from 'expo-location'
import { Location } from '../../models'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import RideComponent from './RideComponent'

export default function RideHistory({ navigation }) {
    return ( 
        <ScrollView>
            <View style = {styles.header}>
                <RideComponent 
                dropoff = "Hume Hall" 
                driver = "Driver Name" 
                rating = "3"/>
            </View>
        </ScrollView>
        

    )
}
const styles = StyleSheet.create({
    header :{
        flex : 1,
        alignItems: 'center',
        alignSelf: 'stretch',

    }
})