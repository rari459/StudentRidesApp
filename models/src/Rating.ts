import firestore from '@react-native-firebase/firestore'
import { Promise } from 'bluebird'
import { Ride } from './Ride'
import { User } from './User'

export class Rating {

    uid: string
    author: string
    driver: string
    ride: string
    stars: number
    comments: string

    constructor(author?: User, ride?: Ride, stars?: number, comments?: string) {
        this.author = author ? author.uid : null
        this.driver = ride ? ride.driver : null
        this.ride = ride ? ride.uid : null
        this.stars = stars || 0
        this.comments = comments || ""
    }

    static fromJSON(data): Rating {
        const rating = new Rating()
        Object.assign(rating, data)
        return rating
    }

    async create(): Promise<void> {
        const newDoc = await firestore().collection('users').doc(this.driver).collection('ratings').add(this)
        this.uid = newDoc.id
        return Promise.resolve()
    }
}