// Import necessary libraries and components
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Circle, Rect } from 'react-native-svg';
import CustomToolTip from '../../../Components/CustomToolTip';

// Component: Record
const Record = ({ route, navigation }) => {
    // Extract route details from navigation
    const routerdetails = route.params;

    // Check if the screen is focused
    const isScreenFocused = useIsFocused();

    // State variables
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

    // Function to toggle the tooltip visibility
    const toggleTooltip = () => {
        setTooltipVisible(!isTooltipVisible);
    };

    // Function to close the tooltip
    const closeTooltip = () => {
        setTooltipVisible(false);
    };

    // Request camera and audio permissions on component mount
    useEffect(() => {
        const requestCameraPermission = async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus === 'granted');
        };

        const requestAudioPermission = async () => {
            const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus === 'granted');
        };

        requestCameraPermission();
        requestAudioPermission();
    }, []);

    // Check if camera and audio permissions are granted
    useEffect(() => {
        if (hasAudioPermission && hasCameraPermission) {
            setHasPermission(true);
        }
    }, [hasCameraPermission, hasAudioPermission]);

    // Function to start recording
    const startRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(true);
            setRecordingDuration(0);

            // Start recording video
            const videoRecording = await cameraRef.current.recordAsync({ maxDuration: 15 });
            console.log('Video recorded:', videoRecording.uri);
            setVediorecording(videoRecording);
        }
    };

    // Function to stop recording
    const stopRecording = async () => {
        setIsRecording(false);
        clearInterval(recordingInterval);
        setRecordingDuration(0);
        setProgress(0);
        
        if (cameraRef.current) {
            await cameraRef.current.stopRecording();
        }
    };

    // Effect to navigate to PlayRecord component when a video is recorded
    useEffect(() => {
        if (vediorecording?.uri) {
            navigation.navigate('PlayRecord', { 'vediorecording': vediorecording, 'therapistDetails': routerdetails?.therapistDetails });
        }
    }, [vediorecording]);

    // Effect to clear recording state when screen loses focus
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setProgress(0);
                setIsRecording(false);
            };
        }, [])
    );

    // Effect to update recording progress
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

    // Render component
    return (
        <View style={styles.container}>
            {hasPermission === null ? (
                <View >
                </View>
            ) : hasPermission === false ? (
                <Text>No access to camera</Text>
            ) : (
                <View style={styles.cameraContainer}>
                    {isScreenFocused && (
                        <Camera
                            ref={cameraRef}
                            style={styles.camera}
                            type={CameraType.front}
                            ratio='16:9'
                            isActive={isScreenFocused}
                        >
                            <View style={styles.controlsContainer}>
                                {isRecording ? (
                                    // Render recording progress circle
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
                                            />
                                            <Circle cx="70" cy="70" r="50" fill="white" fillOpacity="0.5" />
                                            <Rect x="54" y="54" width="35" height="35" fill="white" />
                                        </Svg>
                                    </TouchableOpacity>
                                ) : (
                                    // Render recording button
                                    <TouchableOpacity onPress={startRecording} >
                                        <Svg width={140} height={140}>
                                            <Circle cx="70" cy="70" r="36.5" stroke="white" strokeWidth="7" fill="none" shapeRendering="crispEdges" />
                                        </Svg>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Camera>
                    )}
                    {/* Render tooltip */}
                    <View style={{ position: 'absolute', top: 50, right: 40 }}>
                        <CustomToolTip />
                    </View>
                </View>
            )}
        </View>
    );
}

// Styles
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
});

// Export the Record component
export default Record;
