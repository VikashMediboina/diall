// Import necessary libraries and components
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Record from './Record';
import PlayRecordVedioe from './PlayRecordVedioe';
import SearchPage from '../Search/SearchPage';

// Create a stack navigator
const Stack = createStackNavigator();

// Component: Ask
// This component sets up a navigation stack for recording and playing videos.
const Ask = ({ navigation }) => {
  return (
    // Define a stack navigator with options to hide the header
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      {/* Add a screen for recording videos */}
      <Stack.Screen name="Record" component={Record} />
      {/* Add a screen for playing recorded videos */}
      <Stack.Screen name="PlayRecord" component={PlayRecordVedioe} />
      {/*Search Page */}
      <Stack.Screen name="SearchPage" component={SearchPage} />
    </Stack.Navigator>
  );
}

// Export the Ask component
export default Ask;
