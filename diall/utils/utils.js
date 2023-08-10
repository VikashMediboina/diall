import RNCache from 'react-native-clear-cache';


export  const  deleteFileInCache=async (cacheFilePath)=>{
    try {
        await RNCache.clearCache();
        console.log('cache cleared')
        // Alert.alert('Cache Cleared', 'App cache has been cleared successfully.');
      } catch (error) {
        console.log(error)
        // Alert.alert('Error', 'An error occurred while clearing cache.');
      }
}