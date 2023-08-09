import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated,Text } from 'react-native';
// import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
// import { Video } from 'expo-av';
import { Video, ResizeMode } from 'expo-av';
import * as Sharing from 'expo-sharing';

const VedioFeed = ({videoUrl}) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [status, setStatus] = React.useState({});
    const videoPlayer = useRef(null);
    const progressAnimation = useRef(new Animated.Value(0)).current;
  
    const togglePlayPause = () => {
      setIsPlaying(!isPlaying);
    };
  
    const onVideoPress = () => {
      togglePlayPause();
      if (videoPlayer.current) {
        if (isPlaying) {
          videoPlayer.current.pauseAsync();
        } else {
          videoPlayer.current.playAsync();
        }
      }
    };
  
    const onShare = async () => {
      try {
        await Sharing.shareAsync(videoUrl);
      } catch (error) {
        console.error('Error sharing video:', error);
      }
    };
  
    const onLoad = (data) => {
      setVideoDuration(data.duration);
      setCurrentPosition(0);
    };
  
    useEffect(() => {
      if (isPlaying) {
        const interval = setInterval(async () => {
          const { positionMillis } = await videoPlayer.current.getStatusAsync();
          setCurrentPosition(positionMillis / 1000);
          const progress = (positionMillis / videoDuration) * 100;
          Animated.timing(progressAnimation, {
            toValue: progress,
            duration: 1000, // Adjust animation duration as needed
            useNativeDriver: false,
          }).start();
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [isPlaying, videoDuration]);
  
    return (
      <View style={styles.videoContainer}>
        <TouchableOpacity  onPress={onVideoPress}>

        {/* <Video
        ref={videoPlayer}
        style={styles.video}
        defaultControlsVisible={true}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        timeVisible={false}
        
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      /> */}
           <Video
          ref={videoPlayer}
          source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          useNativeControls={true}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          isLooping
          style={styles.video}
          onLoad={onLoad}
        />
        </TouchableOpacity>
        <View style={styles.videoInfoContainer}>
          <Animated.View style={[styles.progressIndicator, { width: progressAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }) }]} />
          <TouchableOpacity style={styles.shareButton}  onPress={onShare}>
            <Icon name="share" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  const styles = StyleSheet.create({
    videoContainer: {
      flex: 1,
      position: 'relative',
      marginBottom: 20,
    },
    video: {
      width: '100%',
      aspectRatio: 9 / 16, // Portrait aspect ratio
    },
    shareButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 5,
      borderRadius: 20,
    },
  });
export default VedioFeed