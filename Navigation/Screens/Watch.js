import React from 'react';
import { View,FlatList } from 'react-native';
import VedioFeed from '../../Components/VedioFeed';

// import { Container } from './styles';

const Watch = ({navigation}) => {
    const videoData = [
        { id: '1', url: 'https://www.youtube.com/shorts/n1dPik4LzIE' },
        { id: '2', url: 'https://youtube.com/shorts/2ox6SllUD2o?feature=share' },
        // Add more video URLs as needed
      ];
    
      const renderVideoItem = ({ item }) => <VedioFeed videoUrl={item.url} />;
    
      return (
        <FlatList
          data={videoData}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      );
}



  
export default Watch;