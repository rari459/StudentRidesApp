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
    isPending: boolean
    isCancelled: boolean
    isCompleted: boolean
    passengers: number
    pickup: string
    requestor: string
    vehicle: string
    wheelchairs: number

    constructor(requestor?: User, pickup?: Location, destination?: Location, passengers?: number, wheelchairs?: number) {
        this.dateCreated = new Date()
        this.driver = "0KKDvDWpWvZObDYLVCTg8zIO74j1"
        this.isPending = true
        this.isCancelled = false
        this.isCompleted = false
        this.vehicle = null
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

    async assignDriver(driver: User, vehicle: string): Promise<void> {
        this.driver = driver.uid
        this.vehicle = vehicle
        this.isPending = false
        await this.save()
        return Promise.resolve()
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
        this.isCancelled = true
        this.isPending = false
        return this.save()
    }

    async save(): Promise<void> {
        await firestore().collection('users').doc(this.requestor).collection('rides').doc(this.uid).update(this)
        return Promise.resolve()
    }
}