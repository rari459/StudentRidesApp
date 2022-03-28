import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Promise } from 'bluebird'
import { Location } from './Location'
import { User } from './User'

export class Ride {

    uid: string
    dateCreated: Date
    destination: string
    driver: string
    passengers: number
    pending: boolean
    pickup: string
    requestor: string
    wheelchairs: number

    constructor(requestor: User, pickup: Location, destination: Location, passengers: number, wheelchairs: number) {
        this.dateCreated = new Date()
        this.pending = true
        this.pickup = pickup.name
        this.destination = destination.name
        this.requestor = requestor.uid
        this.passengers = passengers
        this.wheelchairs = wheelchairs
    }

    async create(): Promise<void> {
        const newDoc = await firestore().collection('users').doc(this.requestor).collection('rides').add(this)
        this.uid = newDoc.id
        return Promise.resolve()
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