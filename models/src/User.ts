import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Promise } from 'bluebird'

export class User {

    uid: string
    dateCreated: Date
    email: string
    school: string

    constructor(uid: string) {
        this.uid = uid || null
        this.dateCreated = new Date()
        this.email = ""
        this.school = ""
    }

    async create(password: string): Promise<FirebaseAuthTypes.User> {
        try {
            const result = await auth().createUserWithEmailAndPassword(this.email, password)
            if (!result.user) {
                throw new Error("Create user operation failed. Try again later.")
            }
            this.uid = result.user.uid

            await firestore().collection('users').doc(this.uid).set(this)
            return Promise.resolve(result.user)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    static async getByUID(uid: string): Promise<User | null> {
        try {
            const result = await firestore().collection('users').doc(uid).get()
            const data = result.data()
            if (!data || !result.exists) {
                throw new Error("No user found with that ID.")
            }
            data.id = result.id
            return Promise.resolve(data as User)
        } catch (err) {
            return Promise.resolve(null)
        }
    }

   
}