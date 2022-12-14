import React from 'react'
import { Text, TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import AuthContext from './AuthContext'
import RideHistory from '../src/main/RideHistory.jsx'
 

export default function DrawerMenu(props) {

    const navigation = useNavigation()
    const { currentUser, logout } = React.useContext(AuthContext)
    const RideHistoryView = () => {
        navigation.navigate("RideHistory");
      };

    return (
        <View style={styles.container}>
            <DrawerContentScrollView contentContainerStyle={styles.content} scrollEnabled={false} {...props}>
                <View>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Ride History')}>
                        <Text style={styles.buttonText}>Ride History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer} onPress={logout}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer} onPress={RideHistoryView}>
                        <Text style={styles.buttonText}>Ride History</Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 5
    },
    content: {
        flex: 1,
        alignItems: 'flex-start'
    },
    column: {
        paddingVertical: 5,
        alignSelf: 'stretch'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: 25,
        paddingVertical: 5,
        marginVertical: 5
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500'
    }
})