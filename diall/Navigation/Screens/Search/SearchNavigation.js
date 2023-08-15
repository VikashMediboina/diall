// Import necessary libraries and components
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Record from '../Ask/Record';
import PlayRecordVedioe from '../Ask/PlayRecordVedioe';
import SearchPage from './SearchPage';

// Create a stack navigator
const Stack = createStackNavigator();

// Component: SearchNavigation
// This component sets up a navigation stack for search flow.
const SearchNavigation = () => {
  return (
    // Define a stack navigator with options to hide the header
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      
      {/* Add a screen for the search page */}
      <Stack.Screen name="SearchPage" component={SearchPage} />
      {/* Add screens for recording and playing recorded videos */}
      <Stack.Screen name="Record" component={Record} />
      <Stack.Screen name="PlayRecord" component={PlayRecordVedioe} />
    </Stack.Navigator>
  )
}

// Export the SearchNavigation component
export default SearchNavigation;
