import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { Promise } from 'bluebird'
import { Location } from './Location'
import { User } from './User'
import { Vehicle } from './Vehicle'

export class Ride {

    uid: string
    dateCreated: Date
    destination: string
    driver: string
    passengers: number
    pending: boolean
    pickup: string
    requestor: string
    vehicle: number
    wheelchairs: number

    constructor(requestor?: User, pickup?: Location, destination?: Location, passengers?: number, wheelchairs?: number) {
        this.dateCreated = new Date()
        this.driver = null
        this.pending = true
        this.vehicle = 1123
        this.pickup = pickup ? pickup.name : null
        this.destination = destination ? destination.name : null
        this.requestor = requestor ? requestor.uid : null
        this.passengers = passengers || 1
        this.wheelchairs = wheelchairs || 0
    }

    static fromJSON(data): Ride {
        const ride = new Ride()
        Object.assign(ride, data)
        return ride
    }

    async create(): Promise<void> {
        const newDoc = await firestore().collection('users').doc(this.requestor).collection('rides').add(this)
        this.uid = newDoc.id
        await newDoc.update(this)
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

    async getDriver(): Promise<User> {
        const driver = await User.getByUID(this.driver)
        return Promise.resolve(driver)
    }

    async getVehicle(): Promise<Vehicle> {
        const vehicle = await Vehicle.getByNumber(this.vehicle)
        return Promise.resolve(vehicle)
    }

    async getPickup(): Promise<Location> {
        const location = await Location.getByName(this.pickup)
        return Promise.resolve(location)
    }

    async getDestination(): Promise<Location> {
        const location = await Location.getByName(this.destination)
        return Promise.resolve(location)
    }

    async cancel(): Promise<void> {
        await firestore().collection('users').doc(this.requestor).collection('rides').doc(this.uid).delete()
        return Promise.resolve()
    }
}