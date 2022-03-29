import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { Promise } from 'bluebird'
import { geohashForLocation, geohashQueryBounds, distanceBetween } from 'geofire-common'

export class Location {

    uid: string
    coordinates: FirebaseFirestoreTypes.GeoPoint
    geohash: string
    name: string
    school: string

    constructor(name?: string, coordinates?: FirebaseFirestoreTypes.GeoPoint) {
        this.name = name
        this.coordinates = coordinates ? new firestore.GeoPoint(coordinates.latitude, coordinates.longitude) : null
        this.geohash = coordinates ? geohashForLocation([coordinates.latitude, coordinates.longitude]) : null
        this.school = "University of Florida"
    }

    static fromJSON(data): Location {
        const location = new Location()
        Object.assign(location, data)
        return location
    }

    async create(): Promise<void> {
        const newDoc = await firestore().collection('locations').add(this)
        this.uid = newDoc.id
        return Promise.resolve()
    }

    static async getByUID(uid: string): Promise<Location | null> {
        try {
            const result = await firestore().collection('locations').doc(uid).get()
            const data = result.data()
            if (!data || !result.exists) {
                throw new Error("No destination found with that ID.")
            }
            data.id = result.id
            return Promise.resolve(Location.fromJSON(data))
        } catch (err) {
            return Promise.resolve(null)
        }
    }

    static async getByName(name: string): Promise<Location | null> {
        try {
            const result = await firestore().collection('locations').where('name', '==', name).get()
            const data = result.docs
            if (!data || result.empty) {
                return Promise.resolve(null)
            }
            const locations = data.map((doc) => doc.data())
            const location = Location.fromJSON(locations[0])
            return Promise.resolve(location)
        } catch (err) {
            return Promise.resolve(null)
        }
    }

    static async searchForLocations(queryText: string): Promise<Location[]> {
        try {
            const result = await firestore().collection('locations').where('name', '>=', queryText).where('name', '<=', queryText+ '\uf8ff').get()
            const data = result.docs
            if (!data || result.empty) {
                return Promise.resolve([])
            }
            const locations = data.map((doc) => doc.data())
            return Promise.resolve(locations as Location[])
        } catch (err) {
            return Promise.resolve(null)
        }
    }

    // https://firebase.google.com/docs/firestore/solutions/geoqueries#query_geohashes
    static async findNearestLocation(currentLocation: FirebaseFirestoreTypes.GeoPoint): Promise<Location> {
        return new Promise((resolve, reject) => {
            const center = [currentLocation.latitude, currentLocation.longitude];
            const radiusInM = 50 * 100;
    
            // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
            // a separate query for each pair. There can be up to 9 pairs of bounds
            // depending on overlap, but in most cases there are 4.
            const bounds = geohashQueryBounds(center, radiusInM)
            const promises = [];
            for (const b of bounds) {
                const q = firestore().collection('locations')
                    .orderBy('geohash')
                    .startAt(b[0])
                    .endAt(b[1]);
    
                promises.push(q.get());
            }
    
            // Collect all the query results together into a single list
            Promise.all(promises)
            .then((snapshots) => {
                const matchingDocs = [];
    
                for (const snap of snapshots) {
                    for (const doc of snap.docs) {
                        const coords = doc.get('coordinates');
        
                        // We have to filter out a few false positives due to GeoHash
                        // accuracy, but most will match
                        const distanceInKm = distanceBetween([coords.latitude, coords.longitude], center);
                        const distanceInM = distanceInKm * 1000;
                        if (distanceInM <= radiusInM) {
                            matchingDocs.push(doc);
                        }
                    }
                }
    
                return matchingDocs;
            })
            .then((matchingDocs) => {
                const locations = matchingDocs.map(doc => doc.data())
                const sortedLocations = locations.sort((a, b) => {
                    return distanceBetween([a.coordinates.latitude, a.coordinates.longitude], center) - distanceBetween([b.coordinates.latitude, b.coordinates.longitude], center)
                })
                resolve(sortedLocations[0])
            });
        })
    }
}