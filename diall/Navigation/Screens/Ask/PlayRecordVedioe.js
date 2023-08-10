import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, Button, Image,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Video } from 'expo-av';
import { FontAwesome } from 'react-native-vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { deleteFileInCache } from '../../../utils/utils';

const PlayRecordVedioe = ({ route, navigation }) => {
    const [inputValue, setInputValue] = useState('');
    const { vediorecording } = route.params;
    const handleInputChange = (text) => {
        setInputValue(text);
    };
const goBackNavigation=()=>{
    // deleteFileInCache(vediorecording?.uri)
   navigation.goBack()
}
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <FontAwesome
              name="times"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        });
      }, [navigation]);
    
    

    return (
        <KeyboardAwareScrollView  keyboardShouldPersistTaps="handled">


        <View style={styles.videoContainer}>
             
            <Video
                // ref={videoPlayer}
                source={{ uri: vediorecording?.uri }}
                useNativeControls={false}
                resizeMode="cover"
                isLooping
                shouldPlay={true}
                style={styles.video}
            // onLoad={onLoad}
            >

            </Video>
            <TextInput
                style={styles.input}
                placeholder="Title of your question..."
                value={inputValue}
                onChangeText={handleInputChange}
                placeholderTextColor={'#FFFFFF'}
                maxLength={40}
            >

            </TextInput>
            <FontAwesome
              name="times"
              size={24}
              color="black"
              style={styles.backButton}
              onPress={goBackNavigation}
            />
             <TouchableOpacity style={styles.buttonContainer}>

    <Image source={require('diall/assets/SendButton.png')} style={styles.customIcon}/>
        
  </TouchableOpacity>
        </View>
        </KeyboardAwareScrollView>

    )
}
const styles = StyleSheet.create({
    videoContainer: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    input: {
        position: 'absolute',
        width: 310,
        height: 67,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderColor: "#FFFFFF",
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: "#FFFFFF",
        fontWeight: 'bold',
        top:150,
        fontSize:24
  
    },
    backButton:{
        position:'absolute',
        top:60,
        left:30,
        width: 20,
height:20,
color:'#FFFFFF'
    },
    buttonContainer: {
        position:'absolute',
        bottom:40,
        width:260,
        height:100,
        
      }
});
export default PlayRecordVedioe