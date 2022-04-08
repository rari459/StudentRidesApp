import React from 'react'
import { View, StyleSheet, Text, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper'
import * as ExpoLocation from 'expo-location'
import { Location, User } from '../../models'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import firestore from '@react-native-firebase/firestore';
import AuthContext from '../../navigation/AuthContext'

export default function RideComponent(props) {
    const { currentUser } = React.useContext(AuthContext)

    return ( 
        <View style = {styles.container}>
            <View>
            <View style = {{flexDirection : 'row', justifyContent: 'center'}}>
                <Ionicons style = {{paddingTop: 3}} name={'location-sharp'} size={30} color={'#AB00FF'}/>
                <Text style = {styles.title}> {props.dropoff} </Text>
            </View>
            <Text style = {styles.driverInfo}>{props.driver}</Text> 
            </View>
            <View style = {styles.ratingbox}>
                <Text style = {styles.rating}>Rating:</Text>
            
            {    
            [...Array(parseInt(props.rating, 10))].map((elementInArray, index) => ( 
                <Ionicons name={'star'} size={20} color={'#AB00FF'}/>
                ) 
            )
            }
                
            {console.log(currentUser.getPreviousDestinations())}
            </View>
            
        
        </View>
    )
}

const styles = StyleSheet.create({
    container :{
        flex : 1,
        flexDirection : 'row',
        paddingTop : 25,
        paddingLeft : 10,
        alignSelf: 'stretch',
        paddingBottom: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        borderTopColor: 'black',
        borderTopWidth: 1,
        
    },
    title : {
        fontWeight: '600',
        fontSize : 27,
    },
    driverInfo : {
        fontWeight: '400',
        fontSize : 15,
        paddingTop : 10,
        paddingLeft : 35
    },

    rating : {
        alignSelf: 'center',
        flexDirection : 'row',
        fontWeight: '500',
        fontSize : 18,
        paddingRight: 15
    },

    ratingbox : {
        position: 'absolute', 
        right: 30,
        flexDirection: 'row',
        justifyContent : 'center',
        paddingTop : 68,
        alignSelf : 'stretch'
    }

    
})