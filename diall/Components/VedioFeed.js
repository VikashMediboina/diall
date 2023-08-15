// Import necessary libraries and components
import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text, Dimensions, Share, Platform, Image, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Video, ResizeMode } from 'expo-av'; // Expo Video component
import * as Sharing from 'expo-sharing';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LinearProgressBar from './LinearProgressBar';

// Component: VedioFeed
const VedioFeed = ({ videoData, isCurrent }) => {
  // State variables
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const videoPlayer = useRef(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Function to toggle play/pause of the video
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to handle video press
  const onVideoPress = () => {
    togglePlayPause();
    if (videoPlayer.current) {
      if (isPlaying) {
        videoPlayer.current?.pauseAsync();
      } else {
        videoPlayer.current?.playAsync();
      }
    }
  };

  // Function to share the video
  const onShare = async () => {
    setIsPlaying(true);
    try {
      const result = await Share.share({
        message: videoData.url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with a specific activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // Function to handle playback status update
  const handlePlaybackStatusUpdate = (data) => {
    if (data.isLoaded) {
      setVideoDuration(data.durationMillis);
      setCurrentPosition(0);
    }
  };

  // Update progress animation based on video position
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(async () => {
        if (videoDuration) {
          const { positionMillis } = await videoPlayer.current.getStatusAsync();
          const progress = Number(positionMillis / videoDuration) * 100 > 0 ? Number(positionMillis / videoDuration) * 100 : 0;
          setCurrentPosition(progress);
          Animated.timing(progressAnimation, {
            toValue: progress,
            duration: 50, // Adjust animation duration as needed
            useNativeDriver: false,
          }).start();
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, videoDuration]);

  // Control video play/pause based on focus state
  useEffect(() => {
    if (isCurrent && isFocused) {
      setIsPlaying(true);
      videoPlayer.current?.playAsync();
    } else {
      setIsPlaying(false);
      videoPlayer.current?.pauseAsync();
    }
    return () => {
      if (isPlaying) {
        videoPlayer.current?.pauseAsync();
        setIsPlaying(false);
      }
    };
  }, [isCurrent, isFocused]);

  // Pause video playback when navigating away from the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (isPlaying) {
        videoPlayer.current.pauseAsync();
        setIsPlaying(false);
      }
    });

    return unsubscribe;
  }, [navigation]);

  // Determine bottom box position based on platform
  const getbottomBox = () => {
    if (Platform.OS === 'ios') {
      return { bottom: 80 };
    }
    return { bottom: 20 };
  };

  // Determine play button color based on playback state
  const getPlayColor = () => isPlaying ? 'black' : 'white';

  // Render component
  return (
    <View style={[styles.videoContainer]}>
      {/* Video Press Handler */}
      <TouchableOpacity onPress={onVideoPress}>
        <Video
          ref={videoPlayer}
          source={{ uri: videoData.url }}
          useNativeControls={false}
          isLooping
          style={[styles.video, { tintColor: getPlayColor() }]}
          onLoad={handlePlaybackStatusUpdate}
          resizeMode="cover"
          shouldPlay={isPlaying}
        />
        {/* Show overlay when video is paused */}
        {!isPlaying ? <View style={styles.overlay} />:null}
      </TouchableOpacity>

      {/* Overlay for play button */}
      <TouchableWithoutFeedback onPress={onVideoPress}>
        <View style={styles.videoContainer}>
          {!isPlaying ? <Image source={require('diall/assets/Play.png')} style={styles.centeredImage} />:null}
        </View>
      </TouchableWithoutFeedback>

      {/* Bottom user and video information */}
      <View style={[{ position: 'absolute', marginBottom: 20, marginLeft: 10 }, getbottomBox()]}>
        <Text style={{ color: '#007AFF', fontWeight: '600', fontSize: 16, textShadowColor: 'rgba(0, 0, 0, 0.10)' }}>
          @{videoData?.userName}
        </Text>
        <Text style={{ color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.10)', fontSize: 16, fontWeight: '400' }}>
          {videoData?.title}
        </Text>
      </View>

      {/* Video progress bar and share button */}
      <View style={styles.videoInfoContainer}>
        {/* Animated progress indicator */}
        <Animated.View style={[styles.progressIndicator, {
          width: progressAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          })
        }]} />

        {/* Share button */}
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Image source={require('diall/assets/Send.png')} color="#ffffff" />
        </TouchableOpacity>

        {/* Linear progress bar when focused */}
        {isFocused ? <View style={[{ position: 'absolute' }, getbottomBox()]}>
          <LinearProgressBar progress={currentPosition} width={Dimensions.get('window').width} height={5} />
        </View>:null}
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    position: 'relative',
    alignContent: 'center',
    justifyContent: 'center'
  },
  video: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  shareButton: {
    position: 'absolute',
    bottom: 90,
    right: 10,
    padding: 5,
    borderRadius: 20,
  },
  centeredImage: {
    width: 60,
    height: 70,
    position: 'absolute',
    alignSelf: 'center',
    bottom: Dimensions.get('window').height / 2
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay color
  },
});

export default VedioFeed;
