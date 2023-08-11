import React, { useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import VedioFeed from '../../Components/VedioFeed';


const Watch = ({ navigation }) => {

  const [activeIndex, setActiveIndex] = useState(0);

  const videoData = [
    { id: '1', url: 'https://www.youtube.com/shorts/n1dPik4LzIE',userName:'QuinnTyminskiOTD', title:'How do I get over my ex?'},
    { id: '2', url: 'https://youtube.com/shorts/2ox6SllUD2o?feature=share',userName:'QuinnTyminskiOTD', title:'FOMO' },
    // Add more video URLs as needed
  ];
  const onViewableItemsChanged = ({ viewableItems }) => {
    const activeItem = viewableItems[0];
    if (activeItem) {
      setActiveIndex(activeItem.index);
    }
  };
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