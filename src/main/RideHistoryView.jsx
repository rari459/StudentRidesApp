import moment from 'moment'
import React from 'react'
import { View, StyleSheet, Text, Alert, SectionList } from 'react-native'
import AuthContext from '../../navigation/AuthContext'

export default function RideHistoryView({ route, navigation }) {

    const { currentUser } = React.useContext(AuthContext)
    const [loading, setLoading] = React.useState(false)
    const [sections, setSections] = React.useState([])

    React.useEffect(() => {
        refresh()
    }, [])

    async function refresh() {
        try {
            setLoading(true)
            const rides = await currentUser.getPastRides()

            const data = []
            const yesterday = moment().subtract(1, 'day').endOf('day')
            data.push({
                title: 'Today',
                data: rides.filter((el) => moment(el.dateCreated.toDate()).isAfter(yesterday))
            })

            const lastWeek = moment().subtract(1, 'week').startOf('day')
            data.push({
                title: 'This week',
                data: rides.filter((el) => moment(el.dateCreated.toDate()).isBefore(yesterday) && moment(el.dateCreated.toDate()).isAfter(lastWeek))
            })

            const lastMonth = moment().subtract(1, 'month').startOf('day')
            data.push({
                title: 'This month',
                data: rides.filter((el) => moment(el.dateCreated.toDate()).isBefore(lastWeek) && moment(el.dateCreated.toDate()).isAfter(lastMonth))
            })
            
            data.push({
                title: 'Earlier',
                data: rides.filter((el) => moment(el.dateCreated.toDate()).isBefore(lastMonth))
            })
            setSections(data)

            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log(err)
            Alert.alert("Error", "Could not confirm your ride. Try again later.")
        }
    }

    return (
        <View style={styles.container}>
            <SectionList
                style={styles.content}
                sections={sections}
                renderSectionHeader={({ section: { title, data } }) => data.length > 0 && <Text style={styles.headingText}>{title}</Text>}
                stickySectionHeadersEnabled={false}
                renderItem={({ item }) => <Text>{item.destination}</Text>}
                refreshing={loading}
                onRefresh={refresh}
            />
        </View>
    )
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    content: {
        alignSelf: 'stretch',
        paddingHorizontal: 10
    },
    headerText: {
        fontSize: 34,
        fontWeight: '600'
    },
    headingText: {
        fontSize: 24,
        fontWeight: '600',
        paddingVertical: 10,
        marginTop: 5
    }
});