import React from 'react'
import { Alert } from 'react-native'
import AuthStack from './AuthStack'
import AuthContext from './AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import analytics from '@react-native-firebase/analytics'
import { User } from '../models'

export default function AppNavigator() {

    const { currentUser, setCurrentUser } = React.useContext(AuthContext)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return () => {
            subscriber()
        }
    }, [])

    // Listens for auth state changes (sign in/out actions)
    async function onAuthStateChanged(user) {
        try {
            if (user) {
                const profile = await User.getByUID(user.uid)
                analytics().logEvent('session_started')
                setCurrentUser(profile)
                Alert.alert("Login Successful", `Hello ${profile.email}`)
            } else {
                setCurrentUser(null)
            }
        } catch (err) {
            console.log(err)
            setCurrentUser(null)
        }
        
        setLoading(false)
    }

    return (
        <NavigationContainer>
           <AuthStack/>
        </NavigationContainer>
    )
}
