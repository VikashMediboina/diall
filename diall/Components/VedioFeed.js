import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text ,Dimensions} from 'react-native';
// import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
// import { Video } from 'expo-av';
import { Video, ResizeMode } from 'expo-av';
import * as Sharing from 'expo-sharing';
import { useNavigation,useIsFocused } from '@react-navigation/native';

const VedioFeed = ({ videoUrl,isCurrent }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [status, setStatus] = React.useState({ isPlaying: true });
  const videoPlayer = useRef(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
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
    setIsPlaying(true)
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



  useEffect(() => {
    if (isCurrent && isFocused) {
      setIsPlaying(true)
      videoPlayer.current.playAsync();
    } else {
      setIsPlaying(false)
      videoPlayer.current.pauseAsync();
    }
    return () => {
      if (isPlaying) {
        videoPlayer.current.pauseAsync();
        setIsPlaying(false);
      }
    };
  }, [isCurrent,isFocused]);



  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (isPlaying) {
        videoPlayer.current.pauseAsync();
        setIsPlaying(false);
      }
    });

    return unsubscribe;
  }, [navigation]);



  return (
    <View style={styles.videoContainer}>
      <TouchableOpacity onPress={onVideoPress}>

        <Video
          ref={videoPlayer}
          source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          useNativeControls={true}
          isLooping
          style={styles.video}
          onLoad={onLoad}
          resizeMode="cover"
          shouldPlay={isPlaying}
        />
      </TouchableOpacity>
      <View style={styles.videoInfoContainer}>
        <Animated.View style={[styles.progressIndicator, {
          width: progressAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          })
        }]} />
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
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
    alignContent: 'center',
    // alignItems:'center',
    justifyContent: 'center'
  },
  video: {
    height: Dimensions.get('window').height,
    width:Dimensions.get('window').width,
  },
  shareButton: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 20,
  },
});
export default VedioFeed