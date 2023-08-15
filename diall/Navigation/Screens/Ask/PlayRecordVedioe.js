import { View,  StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Video } from 'expo-av';
import { FontAwesome } from 'react-native-vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../firebaseconfig';
import { addDoc, collection } from 'firebase/firestore';
// import client from '../../../awsconfig';
import { Amplify, Storage } from 'aws-amplify';
import awsmobile from '../../../src/aws-exports';
Amplify.configure(awsmobile);


// {Storage: {
//     Auth: {
//         // Use your Access Key credentials
      
//         region: 'us-east-2', // Amazon Cognito Region
//         Credential:{
//             accessKeyId: 'AKIAWN2ADJAWB5G2XZ6B',
//             secretAccessKey: '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',
//         }
//         // // Specify the rest of the configuration
//         // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
//         // userPoolId: 'XX-XXXX-X_abcd1234',
//         // userPoolWebClientId: 'XX-XXXX-X_abcd1234',
//       },
//     AWSS3: {
//       bucket: 'daill', //REQUIRED -  Amazon S3 bucket name
//       region: 'us-east-2', //OPTIONAL -  Amazon service region
//       isObjectLockEnabled: false //OPTIONAl - Object Lock parameter
//     }}

const PlayRecordVedioe = ({ route, navigation }) => {
    const [inputValue, setInputValue] = useState('');
    const { vediorecording } = route.params;
    const [loading,setLoding]=useState(false)
    const handleInputChange = (text) => {
        setInputValue(text);
    };

    const uploadVedioe = async () => {
        try {
            setLoding(true)
            const response = await fetch(vediorecording.uri);
            const videoBlob = await response.blob();

            const blob = videoBlob



            await Storage.put(new Date().getTime()+'.mp4', blob, {
                // contentType: 'image/jpeg' // contentType is optional
                level:'public',
              }).then(res=>{
                Storage.get(res.key).then(url=>{
                    saveRecord(url)
                    console.log(result)
                }).catch( (err)=> 
                    {console.log('Error uploading file:', err);}
                )
              }).catch ((err) =>
               { console.log('Error uploading file:', err);}
              
              )
            } catch (err) {
              console.log('Error uploading file:', err);
            }

            // const command = new PutObjectCommand({
            //     Bucket: "daill",
            //     Key: new Date().getTime(),
            //     Body: 'blob',
            //   });
            
            //   try {
            //     const response = await client.send(command);
            //     console.log(response);
            //   } catch (err) {
            //     console.error(err);
            //   }



            // const storageRef = ref(storage, "Data/" + new Date().getTime())
            // const uploadTask = uploadBytesResumable(storageRef, blob);

            // uploadTask.on(
            //     'state_changed',
            //     (snapshot) => {
            //         // Upload progress here
            //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //         console.log(`Upload is ${progress}% done`);
            //     },
            //     (error) => {
            //         // Handle upload error
            //         console.error('Upload error:', error);
            //     },
            //     async () => {
            //         // Upload completed successfully
            //         getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            //             await saveRecord(url)
            //         })
            //     }
            // );
        // }
        // catch (error) {
        //     setLoding(false)
        //     console.error('Error:', error);
        // }
    }
    const saveRecord = async (url) => {
        try {
            const docRef = await addDoc(collection(db, 'data'), {
                id: new Date().getTime(), url: url, userName: 'MSD', title: inputValue, therapist: route.params?.therapistDetails?route.params?.therapistDetails:'Anonymosly'
            })
            setLoding(false)
            navigation.goBack()
        }
        catch (e) {
            setLoding(false)
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
                {loading?<View style={styles.indicator}>
                    <ActivityIndicator size="large" />
                </View>:<>
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
                </>}
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
        bottom: 90,
        width: 260,
        height: 100,
    },
    indicator:{
        flex: 1,
        justifyContent: 'center',
        position:'absolute'
    }
});
export default PlayRecordVedioe