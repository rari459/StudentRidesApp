import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import AuthContext from '../../navigation/AuthContext';

export default function HomeView({ navigation }) {

   const { currentUser, logout } = React.useContext(AuthContext)

    return (
        <View style={styles.container}>
            <Text>Hi {currentUser.email}</Text>
            <TouchableOpacity onPress={logout}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});