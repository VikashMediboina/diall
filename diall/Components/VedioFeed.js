import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text ,Dimensions,Share,Platform, Image,TouchableWithoutFeedback} from 'react-native';
// import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
// import { Video } from 'expo-av';
import { Video, ResizeMode } from 'expo-av';
import * as Sharing from 'expo-sharing';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import LinearProgressBar from './LinearProgressBar';

const VedioFeed = ({ videoData,isCurrent }) => {
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
        videoPlayer.current?.pauseAsync();
      } else {
        videoPlayer.current?.playAsync();
      }
    }
  };

  const onShare = async () => {
    setIsPlaying(true)
    // try {
    //   await Sharing.shareAsync(videoUrl);
    // } catch (error) {
    //   console.error('Error sharing video:', error);
    // }
    try {
      const result = await Share.share({
        message:
        videoData.url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handlePlaybackStatusUpdate = (data) => {
    if(data.isLoaded){
      setVideoDuration(data.durationMillis);
      setCurrentPosition(0);
    }
    
  };

  
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(async () => {
        if(videoDuration){
          const { positionMillis } = await videoPlayer.current.getStatusAsync();
          const progress = Number(positionMillis / videoDuration) * 100>0?Number(positionMillis / videoDuration) * 100:0;
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



  useEffect(() => {
    if (isCurrent && isFocused) {
      setIsPlaying(true)
      videoPlayer.current?.playAsync();
    } else {
      setIsPlaying(false)
      videoPlayer.current?.pauseAsync();
    }
    return () => {
      if (isPlaying) {
        videoPlayer.current?.pauseAsync();
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

  const getbottomBox = () => {
    if (Platform.OS === 'ios') {
      return {bottom:80};
    }
    return {bottom:20};
  };
const getPlayColor=()=> isPlaying?'black':'white'
  return (
    <View style={[styles.videoContainer]}>
      <TouchableOpacity onPress={onVideoPress}>
        <Video
          ref={videoPlayer}
          source={{ uri: videoData.url }}
          useNativeControls={false}
          isLooping
          style={[styles.video,{tintColor:getPlayColor()}]}
          onLoad={handlePlaybackStatusUpdate}
          resizeMode="cover"
          shouldPlay={isPlaying}
          
        />
    {!isPlaying && <View style={styles.overlay} />}
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={onVideoPress}>
      <View style={styles.videoContainer}>
        {/* Conditional rendering of image */}
        {!isPlaying && <Image source={require('diall/assets/Play.png')} style={styles.centeredImage} />}
      </View>
      </TouchableWithoutFeedback>
           <View style={[{position:'absolute',marginBottom:20,marginLeft:10},getbottomBox()]}>
            <Text style={{color:'#007AFF',fontWeight:'600',fontSize:16,textShadowColor:'rgba(0, 0, 0, 0.10)'}}>
              @{videoData?.userName}
            </Text>
            <Text style={{color:'#FFFFFF',textShadowColor:'rgba(0, 0, 0, 0.10)',fontSize:16,fontWeight:'400'}}>
              {videoData?.title}
            </Text>
           </View>

      <View style={styles.videoInfoContainer} >
        <Animated.View style={[styles.progressIndicator, {
          width: progressAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          })
        }]} />
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          {/* <Icon name="share" size={20} color="#ffffff" /> */}
          <Image source={require('diall/assets/Send.png')} color="#ffffff"/>
        </TouchableOpacity>
        {isFocused&&<View style={[{position:'absolute'},getbottomBox()]}>
        <LinearProgressBar progress={currentPosition} width={Dimensions.get('window').width} height={5}/>
        </View>}
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
    justifyContent: 'center'  },
  video: {
    height: Dimensions.get('window').height,
    width:Dimensions.get('window').width,
  },
  shareButton: {
    position: 'absolute',
    bottom: 90,
    right: 10,
    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 20,
  },
  centeredImage: {
    width: 60,
    height: 70,
    position: 'absolute',
    alignSelf: 'center',
    bottom:Dimensions.get('window').height/2
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay color
  },
});
export default VedioFeed