import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import VedioFeed from '../../Components/VedioFeed';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseconfig';


const Watch = ({ navigation }) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [videoData, setVideoData] = useState(
    [
      { id: '1', url: 'https://firebasestorage.googleapis.com/v0/b/diall-22180.appspot.com/o/Data%2FScreen%20Recording%202023-08-12%20at%203.42.55%20AM.mov?alt=media&token=8b4a5f3c-2157-44f0-8ca5-4aa07ac897fa', userName: 'QuinnTyminskiOTD', title: 'How do I get over my ex?' },
      { id: '2', url: 'https://firebasestorage.googleapis.com/v0/b/diall-22180.appspot.com/o/Data%2FScreen%20Recording%202023-08-12%20at%203.35.13%20AM.mov?alt=media&token=35d7765f-4791-4828-9706-d310054ea872', userName: 'QuinnTyminskiOTD', title: 'FOMO' },
      { id: '3', url: 'https://firebasestorage.googleapis.com/v0/b/diall-22180.appspot.com/o/Data%2FScreen%20Recording%202023-08-12%20at%203.46.46%20AM.mov?alt=media&token=8b84bdac-56ba-4869-85ea-e97a4909c130', userName: 'Isbat', title: 'How to overcome anxity?' },
      // Add more video URLs as needed
    ]);
  const onViewableItemsChanged = ({ viewableItems }) => {
    const activeItem = viewableItems[0];
    if (activeItem) {
      setActiveIndex(activeItem.index);
    }
  };
  const handleEndReached = () => {
    setVideoData([...videoData, ...videoData])
  }
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'data'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setVideoData((prevData) => [ change.doc.data(), ...prevData])
        }
      })
    })
    return unsubscribe
  }, [])
  const viewabilityConfigCallbackPairs = useRef([

    {
      viewabilityConfig: {
        viewAreaCoveragePercentThreshold: 50,
      },
      onViewableItemsChanged
    },
  ]);

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