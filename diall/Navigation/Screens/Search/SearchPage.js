import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Share } from 'react-native';
import { db } from '../../../firebaseconfig';





// const usersData = [
//     { id: 1, name: 'John Doe', role: 'Admin', imgSource: 'https://reactnative.dev/img/tiny_logo.png' },
//     { id: 2, name: 'Jane Smith', role: 'User', imgSource: 'diall/assets/favicon.png' },
//     { id: 3, name: 'Michael Johnson', role: 'User', imgSource: 'diall/assets/favicon.png' },
//     // ... other user data
// ];

const SearchPage = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [usersData,setUsersData]=useState([])
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
        // try {
        //   await Sharing.shareAsync(videoUrl);
        // } catch (error) {
        //   console.error('Error sharing video:', error);
        // }
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
            <TouchableOpacity style={styles.askButton} onPress={() => navigation.navigate('Record', { 'therapistDetails': item })}>
                <Text style={styles.askText}>Ask</Text>
            </TouchableOpacity>
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
