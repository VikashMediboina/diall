import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Share } from 'react-native';
import { db } from '../../../firebaseconfig';
import { addDoc } from 'firebase/firestore';
import { Amplify, Storage } from 'aws-amplify';




const SearchPage = ({ navigation,route }) => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [usersData,setUsersData]=useState([])
    const [loading, setLoding] = useState(false);
    const { vediorecording } = route.params;
    const { title } = route.params;

    const handleSearch = (userSearchString) => {
        if (userSearchString) {
            const filteredResults = usersData.filter(user =>
                user.name.toLowerCase().includes(userSearchString.toLowerCase())
            );
            setSearchResults(filteredResults);
        }
        else {
            setSearchResults([])
        }

    };
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'therapists'), (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                setUsersData((prevData) => [ change.doc.data(), ...prevData])
            }
          })
        })
        return unsubscribe
      }, [])
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'Hello therapist! I found this app that could help us with our sessions. You can install it from the App Store: https://apps.apple.com/app/apple-store/id6446042096',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };
     // Upload the recorded video
     const uploadVedioe = async (item) => {
        try {
            setLoding(true);
            const response = await fetch(vediorecording.uri);
            const videoBlob = await response.blob();
            const blob = videoBlob;

            // Upload video to AWS S3 using Amplify Storage
            const id=new Date().getTime() 
            await Storage.put(id+ '.mp4', blob, {
                level: 'public',
                expires:null
            }).then((res) => {
                // Get the URL of the uploaded video
                Storage.get(res.key)
                    .then((url) => {
                        const full_url='https://diall3f29946034eb4a6493e0bc724085a09663201-dev.s3.amazonaws.com/public/'+id+ '.mp4'
                        saveRecord(full_url);
                    })
                    .catch((err) => {
                        console.log('Error getting URL:', err);
                    });
            }).catch((err) => {
                console.log('Error uploading file:', err);
            });
        } catch (err) {
            console.log('Error uploading file:', err);
        }
    };

    // Save record data to Firebase Firestore
    const saveRecord = async (url) => {
        try {
            const docRef = await addDoc(collection(db, 'data'), {
                id: new Date().getTime(),
                url: url,
                userName: 'MSD',
                title: title,
                therapist: searchText || 'Anonymously',
            });
            setLoding(false);
            navigation.navigate('Record');
        } catch (e) {
            setLoding(false);
            console.log(e);
        }
    };

    const handleClearSearch = () => {
        setSearchText('');
        setSearchResults([]);
    };
    const onSearchChange = (value) => {
        handleSearch(value)
        setSearchText(value)
    }
    const renderUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <View style={{ flex: 1 }}>
                <Image source={{ uri: item.imgSource }} style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 0 }}>

                </Image>
            </View>
            <View style={{ flex: 4 }}>

                <Text style={styles.userName}>@{item.name}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
            </View>
            { loading?<View style={styles.askButton}><Text style={styles.askText}>...Loading</Text></View>: <TouchableOpacity style={styles.askButton} onPress={() => uploadVedioe(item)}>
           <Text style={styles.askText}>Send</Text>
            </TouchableOpacity>}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Find a therapist..."
                    value={searchText}
                    onChangeText={onSearchChange}
                    placeholderTextColor={'#000'}
                />
                <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
                    <Text style={{ fontSize: 20 }}>X</Text>
                </TouchableOpacity>
            </View>
            {searchResults.length !== 0 ? <FlatList
                data={searchResults}
                renderItem={renderUserItem}
                keyExtractor={(item,index) => index.toString()}
            /> :
                <View style={styles.infoBox}>
                    {!searchText && searchResults.length == 0 ?
                        <Text style={styles.infoText}>
                            Type in the search bar to find a therapist that’s right for you
                        </Text> :
                        < >
                            <Text style={styles.infoText}>
                                Don’t see your therapist?

                            </Text>
                            <TouchableOpacity style={styles.inviteButton} onPress={onShare}>
                                <Text style={styles.inviteText}>
                                    Invite your therapist
                                </Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        borderRadius: 5,
        padding: 5,
        marginRight: 10,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingLeft: 20,
        height: 42,
        color: '#000',
        fontSize: 16,
        fontWeight: '500'
    },
    clearButton: {
        borderRadius: 5,
        fontSize: 45,
        position: 'relative',
        left: -40
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    userRole: {
        fontSize: 16,
        color: '#9D9D9D',
    },
    askButton: {
        backgroundColor: '#85C623',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    askText: {
        color: '#FFF',
        fontWeight: '600',
    },
    infoBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    infoText: {
        color: '#9D9D9D',
        fontWeight: '600',
        fontSize: 18,
        marginBottom: 20
    },
    inviteButton: {
        backgroundColor: '#85C623',
        paddingVertical: 25,
        paddingHorizontal: 50,
        borderRadius: 15,
    },
    inviteText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 20,
    }
});

export default SearchPage;
