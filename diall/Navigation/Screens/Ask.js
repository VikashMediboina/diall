import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Button, Text, Dimensions, TextInput } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
// import { Container } from './styles';
import * as Permissions from 'expo-permissions';
import { Video } from 'expo-av';

const Ask = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setrecorded] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [vediorecording, setVediorecording] = useState(null);
  const cameraRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text) => {
    setInputValue(text);
  };
  // Request camera permission on component mount
  useEffect(() => {
    // Request camera permission
    const requestCameraPermission = async () => {
      const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
      setHasCameraPermission(cameraStatus === 'granted');
    };

    // Request audio permission
    const requestAudioPermission = async () => {
      const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
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
      const videoRecording = await cameraRef.current.recordAsync();
      console.log('Video recorded:', videoRecording.uri);
      setVediorecording(videoRecording)
      // Stop recording after 15 seconds
      setTimeout(async () => {
        setIsRecording(false);
        if (cameraRef.current) {
          await cameraRef.current.stopRecording();
        }
      }, 15000);
      setIsRecording(true);
      // Update recording duration every second
      const interval = setInterval(() => {
        setRecordingDuration((prevDuration) => prevDuration + 1);
      }, 1000);
      setRecordingInterval(interval);
    }
  };

  const stopRecording = async () => {
    // setIsRecording(false);
    setrecorded(true)
    clearInterval(recordingInterval);
    setRecordingDuration(0);

    if (cameraRef.current) {
      await cameraRef.current.stopRecording();
    }
  };

  const renderRecordingIndicator = () => {
    const progress = (recordingDuration / 15) * 360;
    const indicatorStyles = [styles.recordIndicator, { transform: [{ rotate: `${progress}deg` }] }];

    return <Animated.View style={indicatorStyles} />;
  };

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <View />
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <View style={styles.cameraContainer}>

          {/* <Camera style={styles.camera} ref={cameraRef} type={CameraType.front}>
<View style={styles.controlsContainer}>
              {isRecording ? (
                <TouchableOpacity onPress={stopRecording} style={styles.recordButton}>
                  {renderRecordingIndicator()}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
                  <Ionicons name="md-videocam" size={40} color="white" />
                </TouchableOpacity>
              )}
            </View> 
      </Camera> */}
          {!recorded ? <Camera
            ref={cameraRef}
            style={styles.camera}
            type={CameraType.front}
          >
            <View style={styles.controlsContainer}>
              {isRecording ? (
                <TouchableOpacity onPress={stopRecording} style={styles.recordButton}>
                  {renderRecordingIndicator()}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
                  <Ionicons name="md-videocam" size={40} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </Camera> : <View style={styles.videoContainer}>
            <Video
              // ref={videoPlayer}
              source={{ uri: vediorecording?.uri }}
              useNativeControls={true}
              resizeMode="cover"
              isLooping
              shouldPlay={true}
              style={styles.video}
            // onLoad={onLoad}
            >
             
</Video>        
<TextInput

style={styles.input}
placeholder="Enter text..."
value={inputValue}
onChangeText={handleInputChange}

>
                
                </TextInput>
                  </View>}
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
    width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.94,
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
    backgroundColor: 'red',
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
  videoContainer: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    height: Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    // aspectRatio: 9 / 16, // Portrait aspect ratio
  },
  input: {
    position:'absolute',
    width: 200,
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor:"#FFFFFF",
    borderRadius:20,
    backgroundColor:'rgba(0, 0, 0, 0.5)'
    
  },
});

export default Ask;