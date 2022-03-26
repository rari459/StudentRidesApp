import React from 'react'
import auth from '@react-native-firebase/auth'
import analytics from '@react-native-firebase/analytics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../models'
import AuthContext from './AuthContext'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    return (
      <AuthContext.Provider
        value={{
          currentUser: user,
          setCurrentUser: setUser,
          login: async (email, password) => {
            return new Promise(async function (resolve, reject) {
              try {
                const response = await auth().signInWithEmailAndPassword(email, password)
                analytics().logLogin({method: 'email'})
                const userProfile = await User.getByUID(response.user.uid)
                setUser(userProfile)
                return resolve()
              } catch (err) {
                console.log(err)
                return reject(err)
              }
            })
          },
          register: async (email, password) => {
            return new Promise(async function (resolve, reject) {
              try {
                email = email.trim()
                const user = new User()
                user.email = email
                user.school = "University of Florida"
                const newFirebaseUser = await user.create(password)

                analytics().logSignUp({method: 'email'})
                await newFirebaseUser.sendEmailVerification()
                setUser(user)
                return resolve()
              } catch (err) {
                console.log(err)
                return reject(err)
              }
            })
          },
          logout: async () => {
            return new Promise(async function (resolve, reject) {
              try {
                await auth().signOut()
                await AsyncStorage.clear()
                setUser(null)
                return resolve()
              } catch (err) {
                console.log(err)
                return reject(err)
              }
            })
          },
          erase: async () => {
            return new Promise(async function (resolve, reject) {
              try {
                await auth().currentUser.delete()
                await AsyncStorage.clear()
                setUser(null)
                return resolve()
              } catch (err) {
                console.log(err)
                return reject(err)
              }
            })
          }
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };