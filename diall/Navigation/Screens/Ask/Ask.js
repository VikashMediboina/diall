import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Button, Text, Dimensions, TextInput } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
// import { Container } from './styles';
import * as Permissions from 'expo-permissions';
import { Video } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Record from './Record';
import PlayRecordVedioe from './PlayRecordVedioe';


const Stack = createStackNavigator();

const Ask = ({ navigation }) => {
 
  return (
    <Stack.Navigator 
    screenOptions={{
      headerShown: false}}>
      <Stack.Screen name="Record" component={Record} />
      <Stack.Screen name="PlayRecord" component={PlayRecordVedioe} />
    </Stack.Navigator>
  );
}


export default Ask;