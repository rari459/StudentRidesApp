import { useHeaderHeight } from '@react-navigation/elements'
import React from 'react'
import { Image, Keyboard, ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native'
import { TextInput } from 'react-native-paper'
import AuthContext from '../../navigation/AuthContext'

export default function RegisterView({ navigation }) {

    const { register } = React.useContext(AuthContext)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const headerHeight = useHeaderHeight()

    async function submit() {
        try {
          if (!email || !password) {
            throw new Error("Please fill out all required fields.")
          }
          setLoading(true)
          await register(email, password)
          setLoading(false)
        } catch (err) {
          setLoading(false)
          return Alert.alert("Error", err.message)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={headerHeight}>
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Text style={styles.headerText}>Sign Up</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                label="Email" 
                value={email} 
                onChangeText={setEmail} 
                style={styles.textInput} 
                textContentType={'emailAddress'} 
                keyboardType={'default'} 
                autoCompleteType={'email'} 
                clearButtonMode={'while-editing'} 
                autoCapitalize={'none'}
              />
              <TextInput 
                label="Password" 
                value={password} 
                onChangeText={setPassword} 
                style={styles.textInput} 
                textContentType={'password'} 
                clearButtonMode={'while-editing'} 
                autoCompleteType={'password'} 
                secureTextEntry={true}
                autoCapitalize={'none'}
              />
            </View>
            <TouchableOpacity delayPressIn={0} style={styles.button} onPress={submit}>
              {loading ? <ActivityIndicator color={'white'} style={styles.buttonLoader}/> : null}
              <Text style={styles.buttonText}>{!loading ? "CREATE ACCOUNT" : "PROCESSING"}</Text>
            </TouchableOpacity>
          </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      );
    }
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerText: {
    width: 300,
    color: '#404040',
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
    margin: 30
  },
  content: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 55,
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'stretch'
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 5
  },
  inputContainer: {
    paddingVertical: 5,
    alignSelf: 'stretch'
  },
  textInput: {
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    marginBottom: 7
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    marginVertical: 30,
    borderRadius: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AB00FF'
  },
  buttonLoader: {
    color: 'white',
    marginRight: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.6
  },
  forgotPasswordText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.65)',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20
  },
  linkText: {
    color: '#AB00FF'
  }
});