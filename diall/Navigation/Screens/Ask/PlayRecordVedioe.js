import { View,  StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, Button, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Video } from 'expo-av';
import { FontAwesome } from 'react-native-vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../firebaseconfig';
import { addDoc, collection } from 'firebase/firestore';

const PlayRecordVedioe = ({ route, navigation }) => {
    const [inputValue, setInputValue] = useState('');
    const { vediorecording } = route.params;
    const handleInputChange = (text) => {
        setInputValue(text);
    };

    const uploadVedioe = async () => {
        try {
            const response = await fetch(vediorecording.uri);
            const videoBlob = await response.blob();

            const blob = videoBlob
            const storageRef = ref(storage, "Data/" + new Date().getTime())
            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Upload progress here
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    // Handle upload error
                    console.error('Upload error:', error);
                },
                async () => {
                    // Upload completed successfully
                    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                        await saveRecord(url)
                    })
                }
            );
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    const saveRecord = async (url) => {
        try {
            const docRef = await addDoc(collection(db, 'data'), {
                id: new Date().getTime(), url: url, userName: 'MSD', title: inputValue, therapist: route.params?.therapistDetails?route.params?.therapistDetails:'Anonymosly'
            })
        }
        catch (e) {
            console.log(e)
        }
    }
    const goBackNavigation = () => {
        // deleteFileInCache(vediorecording?.uri)
        navigation.goBack()
    }
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <FontAwesome
                    name="times"
                    size={24}
                    color="black"
                    style={{ marginLeft: 15 }}
                    onPress={() => navigation.goBack()}
                />
            ),
        });
    }, [navigation]);



    return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">


            <View style={styles.videoContainer}>

                <Video
                    // ref={videoPlayer}
                    source={{ uri: vediorecording?.uri }}
                    useNativeControls={false}
                    resizeMode="cover"
                    isLooping
                    shouldPlay={true}
                    style={styles.video}
                // onLoad={onLoad}
                >

                </Video>
                <TextInput
                    style={styles.input}
                    placeholder="Title of your question..."
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholderTextColor={'#FFFFFF'}
                    maxLength={40}
                >

                </TextInput>
                <FontAwesome
                    name="times"
                    size={24}
                    color="black"
                    style={styles.backButton}
                    onPress={goBackNavigation}
                />
                {inputValue && <TouchableOpacity style={styles.buttonContainer} onPress={uploadVedioe}>

                    <Image source={require('diall/assets/SendButton.png')} style={styles.customIcon} />

                </TouchableOpacity>}
            </View>
        </KeyboardAwareScrollView>

    )
}
const styles = StyleSheet.create({
    videoContainer: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    input: {
        position: 'absolute',
        width: 310,
        height: 67,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderColor: "#FFFFFF",
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: "#FFFFFF",
        fontWeight: 'bold',
        top: 150,
        fontSize: 24

    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 30,
        width: 20,
        height: 20,
        color: '#FFFFFF'
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 80,
        width: 260,
        height: 100,

    }
});
export default PlayRecordVedioe