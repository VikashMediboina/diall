import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import VedioFeed from '../../Components/VedioFeed';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseconfig';


const Watch = ({ navigation }) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [videoData,setVideoData]=useState(
[
    { id: '1', url: 'https://www.youtube.com/shorts/n1dPik4LzIE',userName:'QuinnTyminskiOTD', title:'How do I get over my ex?'},
    { id: '2', url: 'https://youtube.com/shorts/2ox6SllUD2o?feature=share',userName:'QuinnTyminskiOTD', title:'FOMO' },
    { id: '3', url: 'https://youtube.com/shorts/2ox6SllUD2o?feature=share',userName:'Isbat', title:'KRSK' },
    { id: '4', url: 'https://youtube.com/shorts/2ox6SllUD2o?feature=share',userName:'Nato', title:'SNBP' },
    // Add more video URLs as needed
  ]);
  const onViewableItemsChanged = ({ viewableItems }) => {
    const activeItem = viewableItems[0];
    if (activeItem) {
      // if(activeIndex<activeItem.index){
      //   const newVedioData = videoData.filter(item => item.index >= activeItem.index);
      //   newVedioData.push(videoData[activeIndex]);
      //   setVideoData({...newVedioData});
      // }
      // else if(activeIndex>activeItem.index){
      //   const newVedioData = videoData.filter(item => item.index <= activeItem.index);
      // newVedioData.push(videoData[activeIndex]);
      // setVideoData({...newVedioData});
      // }
      // console.log(activeIndex,activeItem.index,videoData)
      setActiveIndex(activeItem.index);
    }
  };
  useEffect(()=>{
const unsubscribe=onSnapshot(collection(db,'data'),(snapshot)=>{
  snapshot.docChanges().forEach((change)=>{
    if(change.type==="added"){
      console.log(change.doc.data())
      setVideoData((prevData)=>[...prevData,change.doc.data()])
    }
  })
})
return unsubscribe
  },[])
  const viewabilityConfigCallbackPairs = useRef([
  
    {   viewabilityConfig: {
      viewAreaCoveragePercentThreshold: 50,
    },
    onViewableItemsChanged },
  ]);

  const renderVideoItem = ({ item,index }) => <VedioFeed videoData={item} isCurrent={index === activeIndex}/>;

  return (
    <View style={styles.veideoFeedSpace}>
      <FlatList
        data={videoData}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
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