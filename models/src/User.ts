import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Promise } from 'bluebird'
import { Location } from './Location'
import { Ride } from './Ride'

export class User {

    uid: string
    dateCreated: Date
    email: string
    school: string

    constructor(uid: string) {
        this.uid = uid || null
        this.dateCreated = new Date()
        this.email = ""
        this.school = "University of Florida"
    }

    static fromJSON(data): User {
        const user = new User(data.uid)
        Object.assign(user, data)
        return user
    }

    async create(password: string): Promise<FirebaseAuthTypes.User> {
        const result = await auth().createUserWithEmailAndPassword(this.email, password)
        if (!result.user) {
            throw new Error("Create user operation failed. Try again later.")
        }
        this.uid = result.user.uid

        await firestore().collection('users').doc(this.uid).set(this)
        return Promise.resolve(result.user)
    }

    static async getByUID(uid: string): Promise<User | null> {
        try {
            const result = await firestore().collection('users').doc(uid).get()
            const data = result.data()
            if (!data || !result.exists) {
                throw new Error("No user found with that ID.")
            }
            data.id = result.id
            const user = User.fromJSON(data)
            return Promise.resolve(user)
        } catch (err) {
            return Promise.resolve(null)
        }
    }

    async getCurrentRide(): Promise<Ride> {
        const result = await firestore().collection('users').doc(this.uid).collection('rides').where('pending', '==', true).orderBy('dateCreated', 'desc').limit(1).get()
        const rideDocs = result.docs
        if (!rideDocs || result.empty) {
            return Promise.resolve(null)
        }
        const rides = rideDocs.map((doc) => doc.data())
        const ride = Ride.fromJSON(rides[0])
        return Promise.resolve(ride)
    }

    async getPreviousDestinations(): Promise<any[]> {
        const result = await firestore().collection('users').doc(this.uid).collection('rides').orderBy('dateCreated', 'desc').limit(6).get()
        const rideDocs = result.docs
        if (!rideDocs || result.empty) {
            return Promise.resolve([])
        }
        const rides = rideDocs.map((doc) => doc.data())
        const destinationNames = rides.map(ride => ride.destination)
        
        const locationsResult = await firestore().collection('locations').where('name', 'in', destinationNames).get()
        const locationsDocs = locationsResult.docs
        if (!locationsDocs || locationsResult.empty) {
            return Promise.resolve([])
        }
        const locations = locationsDocs.map((doc) => doc.data())

        const response = rides.map((ride) => {
            const location = locations.find(el => el.name === ride.destination) as Location
            return {...location, rideDate: ride.dateCreated.toDate()}
        })
        return Promise.resolve(response)
    }
}