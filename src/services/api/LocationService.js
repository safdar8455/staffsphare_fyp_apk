import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export const getLocation = async (currentLatitude, currentLongitude) => {
    var pos = {
        latitude: parseFloat(currentLatitude),
        longitude: parseFloat(currentLongitude),
    };
    let location=null;
try {
    await Location.reverseGeocodeAsync(pos).then(res => {
        let addressformate = res[0].subregion + ", " + res[0].region + ", " + res[0].country
        location= addressformate;
    })
} catch (error) {
    console.error(error);
}
     return location;  
}