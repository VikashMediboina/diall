import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Button, Text, Dimensions, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
// import { Container } from './styles';
// import * as Permissions from 'expo-permissions';
import { Video } from 'expo-av';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Circle, Rect } from 'react-native-svg';
import CustomToolTip from '../../../Components/CustomToolTip';


const Record = ({ route,navigation }) => {
    const routerdetails = route.params;

    const isScreenFocused = useIsFocused()
    const [hasPermission, setHasPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recorded, setrecorded] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingInterval, setRecordingInterval] = useState(null);
    const [vediorecording, setVediorecording] = useState(null);
    const cameraRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    const toggleTooltip = () => {
        setTooltipVisible(!isTooltipVisible);
    };

    const closeTooltip = () => {
        setTooltipVisible(false);
    };
    // Request camera permission on component mount
    useEffect(() => {
        // Request camera permission

        const requestCameraPermission = async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus === 'granted');
        };

        // Request audio permission
        const requestAudioPermission = async () => {
            const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus === 'granted');
        };

        requestCameraPermission();
        requestAudioPermission();
    }, []);
    useEffect(() => {
        if (hasAudioPermission && hasCameraPermission) {
            setHasPermission(true);
        }
    }, [hasCameraPermission, hasAudioPermission])
    const startRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(true);
            setRecordingDuration(0);
            // Start recording

            const videoRecording = await cameraRef.current.recordAsync({ maxDuration: 15 });
            console.log('Video recorded:', videoRecording.uri);
            setVediorecording(videoRecording)



        }
    };

    const stopRecording = async () => {
        setIsRecording(false);
        clearInterval(recordingInterval);
        setRecordingDuration(0);
        setProgress(0)
        if (cameraRef.current) {
            await cameraRef.current.stopRecording();
        }

    };




    useEffect(() => {
        if (vediorecording?.uri) {


            navigation.navigate('PlayRecord', { 'vediorecording': vediorecording, 'therapistDetails':routerdetails?.therapistDetails})
        }
    }, [vediorecording])

    useFocusEffect(
        React.useCallback(() => {
            // Start camera here
            //   Camera.resumePreview()
            if (hasPermission) {
                // cameraRef.current.startPreviewAsync();

            }
            return () => {
                // Stop camera here
                // cameraRef.current.pausePreviewAsync();
                setProgress(0)
                setIsRecording(false)
            };
        }, [])
    );


    useEffect(() => {
        let interval;

        if (isRecording) {
            interval = setInterval(() => {
                setProgress((prevProgress) => (prevProgress + 1) % 100);
            }, 153);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);

    return (
        <View style={styles.container}>
            {hasPermission === null ? (
                <View >
                </View>
            ) : hasPermission === false ? (
                <Text>No access to camera

                </Text>
            ) : (
                <View style={styles.cameraContainer}>

                    {isScreenFocused && <Camera
                        ref={cameraRef}
                        style={styles.camera}
                        type={CameraType.front}
                        ratio='16:9'
                        isActive={isScreenFocused}
                    >
                        <View style={styles.controlsContainer}>
                            {isRecording ? (
                                <TouchableOpacity onPress={stopRecording} >

                                    <Svg width={140} height={140}>

                                        <Circle
                                            cx="70"
                                            cy="70"
                                            r="60"
                                            fill="transparent"
                                            stroke="#FFFFFF"
                                            strokeWidth="5"
                                            strokeDasharray={`${60 * 2 * Math.PI},${60 * 2 * Math.PI}`}
                                            strokeDashoffset={60 * Math.PI * 2 * ((96 - progress) / 100)}
                                            transform="rotate(-90, 70, 70)"
                                        >

                                        </Circle>
                                        <Circle cx="70" cy="70" r="50" fill="white" fillOpacity="0.5" />
                                        <Rect x="54" y="54" width="35" height="35" fill="white" />
                                    </Svg>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={startRecording} >
                                    <Svg width={140} height={140}>

                                        <Circle cx="70" cy="70" r="36.5" stroke="white" strokeWidth="7" fill="none" shapeRendering="crispEdges" />
                                    </Svg>
                                </TouchableOpacity>
                            )}
                        </View>
                    </Camera>}
                    <View style={{position:'absolute',top:50,right:40}}>
                   <CustomToolTip />
                        </View>
                </View>


            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    camera: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'flex-end',

    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    recordButton: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.50)',
        borderRadius: 30,
    },
    recordIndicator: {
        width: 4,
        height: 30,
        backgroundColor: 'white',
        position: 'absolute',
        top: 15,
        left: 28,
        borderRadius: 2,
    },
    puseButton: {
        borderRadius: 5,
        background: '#FFF',
        width: 35,
        height: 35,

    },
    videoContainer: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        // aspectRatio: 9 / 16, // Portrait aspect ratio
    },
    input: {
        position: 'absolute',
        width: 200,
        height: 40,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderColor: "#FFFFFF",
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'

    },
});

export default Record;