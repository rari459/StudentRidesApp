import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { Promise } from 'bluebird'
import { distanceBetween } from 'geofire-common'
import { Location } from './Location'

export class Vehicle {

    uid: string
    angle: number
    lastLocation: FirebaseFirestoreTypes.GeoPoint
    number: string
    school: string

    constructor(number?: string) {
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

    static async getByNumber(number: string): Promise<Vehicle | null> {
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

    static async getBySchool(school: string): Promise<Vehicle[]> {
        try {
            const result = await firestore().collection('vehicles').where('school', '==', school).get()
            const docs = result.docs
            if (!docs || result.empty) {
                return Promise.resolve([])
            }
            const vehicles = docs.map((doc) => {
                const data = doc.data()
                return Vehicle.fromJSON(data)
            })
            return Promise.resolve(vehicles)
        } catch (err) {
            return Promise.resolve([])
        }
    }

    async getETA(location: Location): Promise<number> {
        try {
            const center = [this.lastLocation.latitude, this.lastLocation.longitude]
            const distanceInKm = distanceBetween([location.coordinates.latitude, location.coordinates.longitude], center)
            const distanceInMi = distanceInKm / 1.609
            return Promise.resolve(Math.round(distanceInMi * 15))
        } catch (err) {
            return Promise.resolve(null)
        }
    }
}