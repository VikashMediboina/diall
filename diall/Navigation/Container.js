import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ask from './Screens/Ask/Ask';
import SearchNavigation from './Screens/Search/SearchNavigation';
import Watch from './Screens/Watch';

const Tab = createBottomTabNavigator();
const Container = () => {
  return (
    <NavigationContainer>

      <Tab.Navigator

        screenOptions={{
          tabBarStyle: { backgroundColor: '#121212', paddingTop: 10 },
          tabBarActiveTintColor: "#FFFFFF",
          lazy: false, // Load all screens upfront
          headerShown: false
        }}
      >
        <Tab.Screen name="Watch" component={Watch}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image source={require('../assets/WatchActive.png')} style={{ width: 2 * size / 3, height: 2 * size / 3, tintColor: color }} />
            ),
          }}

        />
        <Tab.Screen name="Ask" component={Ask}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image source={require('../assets/Ask.png')} style={{ width: 2 * size / 3, height: 2 * size / 3, tintColor: color }} />
            ),
          }} />
        {/* <Tab.Screen name="Search" component={SearchNavigation}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image source={require('../assets/search.png')} style={{ width: 2 * size / 3, height: 2 * size / 3, tintColor: color }} />
            ),
          }} /> */}
      </Tab.Navigator></NavigationContainer>
  );
}

export default Container;