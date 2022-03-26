import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

export default function WelcomeView({ navigation }) {

    function launchLoginView() {
        navigation.navigate("Login")
    }

    function launchRegisterView() {
        navigation.navigate("Register")
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={launchLoginView}>
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={launchRegisterView}>
                <Text>Register</Text>
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