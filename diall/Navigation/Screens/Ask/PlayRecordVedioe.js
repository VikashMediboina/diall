// Import necessary components and libraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome } from 'react-native-vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../firebaseconfig';
import { addDoc, collection } from 'firebase/firestore';
import { Amplify, Storage } from 'aws-amplify';
import awsmobile from '../../../src/aws-exports';

// Configure Amplify with AWS Mobile settings
Amplify.configure(awsmobile);

// Component: PlayRecordVedioe
const PlayRecordVedioe = ({ route, navigation }) => {
    // State variables
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoding] = useState(false);
    const { vediorecording } = route.params;

    // Update inputValue state when text input changes
    const handleInputChange = (text) => {
        setInputValue(text);
    };

    // Upload the recorded video
    const uploadVedioe = async () => {
        try {
            setLoding(true);
            const response = await fetch(vediorecording.uri);
            const videoBlob = await response.blob();
            const blob = videoBlob;

            // Upload video to AWS S3 using Amplify Storage
            const id=new Date().getTime() 
            await Storage.put(id+ '.mp4', blob, {
                level: 'public',
                expires:null
            }).then((res) => {
                // Get the URL of the uploaded video
                Storage.get(res.key)
                    .then((url) => {
                        const full_url='https://diall3f29946034eb4a6493e0bc724085a09663201-dev.s3.amazonaws.com/public/'+id+ '.mp4'
                        saveRecord(full_url);
                    })
                    .catch((err) => {
                        console.log('Error getting URL:', err);
                    });
            }).catch((err) => {
                console.log('Error uploading file:', err);
            });
        } catch (err) {
            console.log('Error uploading file:', err);
        }
    };

    // Save record data to Firebase Firestore
    const saveRecord = async (url) => {
        try {
            const docRef = await addDoc(collection(db, 'data'), {
                id: new Date().getTime(),
                url: url,
                userName: 'MSD',
                title: inputValue,
                therapist: route.params?.therapistDetails || 'Anonymously',
            });
            setLoding(false);
            navigation.goBack();
        } catch (e) {
            setLoding(false);
            console.log(e);
        }
    };

    // Navigate back
    const goBackNavigation = () => {
        navigation.goBack();
    };

    // Set custom header options
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

    // Render component
    return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.videoContainer}>
                {/* Display recorded video */}
                <Video
                    source={{ uri: vediorecording?.uri }}
                    useNativeControls={false}
                    resizeMode="cover"
                    isLooping
                    shouldPlay={true}
                    style={styles.video}
                />
                {/* Display loading indicator if loading */}
                {loading ? (
                    <View style={styles.indicator}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <>
                        {/* Text input for title */}
                        <TextInput
                            style={styles.input}
                            placeholder="Title of your question..."
                            value={inputValue}
                            onChangeText={handleInputChange}
                            placeholderTextColor={'#FFFFFF'}
                            maxLength={40}
                        />
                        {/* Back button */}
                        <FontAwesome
                            name="times"
                            size={24}
                            color="black"
                            style={styles.backButton}
                            onPress={goBackNavigation}
                        />
                        {/* Button to upload video */}
                        {inputValue ? (
                            <TouchableOpacity style={styles.buttonContainer} onPress={uploadVedioe}>
                                <Image source={require('diall/assets/SendButton.png')} style={styles.customIcon} />
                            </TouchableOpacity>):null
                        }
                    </>
                )}
            </View>
        </KeyboardAwareScrollView>
    );
};

// Styles
const styles = StyleSheet.create({
    videoContainer: {
        flex: 1,
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
        borderColor: '#FFFFFF',
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#FFFFFF',
        fontWeight: 'bold',
        top: 150,
        fontSize: 24,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 30,
        width: 20,
        height: 20,
        color: '#FFFFFF',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 90,
        width: 260,
        height: 100,
    },
    indicator: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
    },
    customIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default PlayRecordVedioe;
