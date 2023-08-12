import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Record from '../Ask/Record';
import PlayRecordVedioe from '../Ask/PlayRecordVedioe';
import SearchPage from './SearchPage';



const Stack = createStackNavigator();


const SearchNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen name="SearchPage" component={SearchPage} />
      <Stack.Screen name="Record" component={Record} />
      <Stack.Screen name="PlayRecord" component={PlayRecordVedioe} />
    </Stack.Navigator>
  )
}

export default SearchNavigation