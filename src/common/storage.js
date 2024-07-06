import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

export const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24 *  7,
    enableCache: true,
});

export const CurrentUserProfile = 'CurrentUserProfile';

export const saveToStorage = (storage, key, data) => {
    storage.save({ key, data });
}

export const loadFromStorage = async (storage, key) => {
    return await storage.load({key, autoSync: true, syncInBackground: true })
        .then(ret => { return ({ isSuccess: true,item: ret }) })
        .catch(err => { return ({ isSuccess: false,  message: err }) });
}

export const removeFromStorage = (storage, key) => {
    storage.remove({ key });
}

export const clearStorageValue=()=>{
    debugger;
    AsyncStorage.clear();
    AsyncStorage.removeItem("userToken");
    removeFromStorage(storage,CurrentUserProfile);
}
