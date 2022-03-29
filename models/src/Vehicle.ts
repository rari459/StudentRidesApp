import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { Promise } from 'bluebird'
import { distanceBetween } from 'geofire-common'

export class Vehicle {

    uid: string
    lastLocation: FirebaseFirestoreTypes.GeoPoint
    number: number
    school: string

    constructor(number?: number) {
        this.number = number
        this.school = "University of Florida"
    }

    static fromJSON(data): Vehicle {
        const vehicle = new Vehicle()
        Object.assign(vehicle, data)
        return vehicle
    }

    async create(): Promise<void> {
        const newDoc = await firestore().collection('vehicles').add(this)
        this.uid = newDoc.id
        return Promise.resolve()
    }

    static async getByUID(uid: string): Promise<Vehicle | null> {
        try {
            const result = await firestore().collection('vehicles').doc(uid).get()
            const data = result.data()
            if (!data || !result.exists) {
                throw new Error("No user found with that ID.")
            }
            data.id = result.id
            const vehicle = Vehicle.fromJSON(data)
            return Promise.resolve(vehicle)
        } catch (err) {
            return Promise.resolve(null)
        }
    }

    static async getByNumber(number: number): Promise<Vehicle | null> {
        try {
            const result = await firestore().collection('vehicles').where('number', '==', number).get()
            const data = result.docs
            if (!data || result.empty) {
                return Promise.resolve(null)
            }
            const vehicles = data.map((doc) => doc.data())
            const vehicle = Vehicle.fromJSON(vehicles[0])
            return Promise.resolve(vehicle)
        } catch (err) {
            return Promise.resolve(null)
        }
    }

    async getMinutesAway(destinationLocation: FirebaseFirestoreTypes.GeoPoint): Promise<number> {
        const center = [this.lastLocation.latitude, this.lastLocation.longitude]
        const distanceInKm = distanceBetween([destinationLocation.latitude, destinationLocation.longitude], center)
        const distanceInM = distanceInKm * 1000
        return Promise.resolve(Math.round(distanceInM * 2))
    }
}