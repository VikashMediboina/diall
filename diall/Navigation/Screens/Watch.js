import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import VedioFeed from '../../Components/VedioFeed';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseconfig';
import { useFocusEffect } from '@react-navigation/native';



const Watch = ({ navigation }) => {
  

  const [activeIndex, setActiveIndex] = useState(0);
  const [videoData, setVideoData] = useState(
    [

    ]);
    const [actvideoData, setactVideoData] = useState(
      [
  
      ]);
  const onViewableItemsChanged = ({ viewableItems }) => {
    const activeItem = viewableItems[0];
    if (activeItem) {
      setActiveIndex(activeItem.index);
    }
  };
  const handleEndReached = () => {
    setVideoData([...videoData, ...actvideoData])
  }
  useEffect(() => {
    try {
     const unsubscribe = onSnapshot(collection(db, 'data'), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            if(videoData===0){
              setVideoData((prevData) => [change.doc.data()]);
            }
            else{
              setVideoData((prevData) => [change.doc.data(), ...prevData]);
            }
            setactVideoData((prevData) => [change.doc.data(),...prevData]);
          }
        });
      });
    return unsubscribe
    } catch (error) {
      console.error("Firestore onSnapshot error:", error);
    }
  }, [])
  const viewabilityConfigCallbackPairs = useRef([

    {
      viewabilityConfig: {
        viewAreaCoveragePercentThreshold: 50,
      },
      onViewableItemsChanged
    },
  ]);

// Effect to clear vedio data state when screen loses focus
useFocusEffect(
  React.useCallback(() => {
      return () => {
         setVideoData(actvideoData)
      };
  }, [])
);
  const renderVideoItem = ({ item, index }) => <VedioFeed videoData={item} isCurrent={index === activeIndex} />;

  return (
    <View style={styles.veideoFeedSpace}>
      <FlatList
        data={videoData}
        renderItem={renderVideoItem}
        keyExtractor={(item, index) => index}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        viewabilityConfigCallbackPairs={
          viewabilityConfigCallbackPairs.current
        }

      />
    </View>

  );
}

const styles = StyleSheet.create({
  veideoFeedSpace: {
    height: Dimensions.get('window').height
  }
})


export default Watch;