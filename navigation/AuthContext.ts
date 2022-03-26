import React from 'react'
import { User } from '../models'

type AuthContextType = {
  currentUser: User | null,
  setCurrentUser: () => any,
  login: () => any,
  register: () => any,
  logout: () => any,
  erase: () => any
}

const AuthContext = React.createContext<AuthContextType>({
    currentUser: null,
    setCurrentUser: () => {},
    login: () => {},
    register: () => {},
    logout: () => {},
    erase: () => {}
})

export default AuthContext