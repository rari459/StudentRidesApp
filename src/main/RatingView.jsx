import React from 'react'
import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Text, Keyboard, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { TextInput } from 'react-native-paper';
import { Rating as StarRatingSlider } from 'react-native-ratings';
import { Rating } from '../../models';
import AuthContext from '../../navigation/AuthContext';

export default function RatingView({ route, navigation }) {

    const ride = route.params.ride
    const { currentUser } = React.useContext(AuthContext)
    const [rating, setRating] = React.useState(0)
    const [commentsText, setCommentsText] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const SubmitButton = () => (
        <TouchableOpacity style={{...styles.submitButton, backgroundColor: rating === 0 ? 'rgba(0, 0, 0, 0.1)' : '#AB00FF'}} onPress={submit} disabled={rating === 0}>
            {loading ? <ActivityIndicator color={'#fff'}/> : <Text style={styles.submitButtonText}>Submit</Text>}
        </TouchableOpacity>
    )

    React.useEffect(() => {
        navigation.setOptions({
            headerRight: SubmitButton
        })
    }, [rating, loading])

    async function submit() {
        try {
            setLoading(true)
            const newRating = new Rating(currentUser, ride, rating, commentsText)
            await newRating.create()
            setLoading(false)
            navigation.pop()
        } catch (err) {
            setLoading(false)
            Alert.alert("Error", err.message)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    <Text style={styles.headerText}>How was your ride?</Text>
                    <StarRatingSlider
                        count={5}
                        startingValue={0}
                        showRating={false}
                        onFinishRating={setRating}
                        imageSize={50}
                        style={{marginVertical: 20, alignSelf: 'flex-start'}}
                    />
                    <TextInput 
                        label={'Optional Comments'}
                        value={commentsText}
                        onChangeText={setCommentsText} 
                        mode={'outlined'}
                        style={styles.textInput} 
                        outlineColor={'#8d97a6'}
                        activeOutlineColor={'#AB00FF'}
                        clearButtonMode={'while-editing'}
                        multiline={true}
                    />
                </View>
              </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    headerText: {
        fontSize: 34,
        fontWeight: '600'
    },
    textInput: {
        marginVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#fff'
    },
    submitButton: {
        backgroundColor: '#AB00FF',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 13,
        paddingVertical: 7
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16
    }
});