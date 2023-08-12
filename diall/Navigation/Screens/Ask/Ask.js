import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Record from './Record';
import PlayRecordVedioe from './PlayRecordVedioe';


const Stack = createStackNavigator();

const Ask = ({ navigation }) => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Record" component={Record} />
      <Stack.Screen name="PlayRecord" component={PlayRecordVedioe} />
    </Stack.Navigator>
  );
}


export default Ask;