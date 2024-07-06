import { StyleSheet, Platform, Dimensions, } from 'react-native';
const { width } = Dimensions.get('window');
export const LiveTrackingStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9',
        flexDirection: 'column',

    },
    logoImage: {
        paddingLeft: 10,
        
        // justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'row',
    },
    HeaderContent: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#fff',
        shadowColor: "#fff",
        shadowRadius: 3,
        shadowColor: "black",
        shadowOpacity: 0.7,
        shadowOffset: { width: 10, height: -5 },
        elevation: 10,
        height: 60,
    },
    FlatlistMainView: {
        padding: 12,
        borderWidth: 0, backgroundColor: 'white',
        marginBottom: 5, marginLeft: 5, marginRight: 5,marginTop:5,
        borderRadius: 10, borderColor: 'gray',
        justifyContent: 'space-between',
        flexDirection: 'row',
        elevation: 2,
    },
    listDivider: {
        justifyContent: 'space-between', flexDirection: 'row',
        borderBottomColor: 'white', borderBottomWidth: 2, paddingBottom: 10,
    },
        noticepart: {
        alignItems: 'flex-start',
        color: '#1a1a1a', fontSize: 10, fontFamily: 'OPENSANS_REGULAR'
    },
    EmpText:
    {
        fontSize: 12, color: '#8f8f8f'
    },
    employeeModalTextStyle:{
        color:'black'
    },
    imageradious: {
        ...Platform.select({
            ios: {
                width: 60, height: 60, borderRadius: 30
            },
            android: {
                width: 60, height: 60, borderRadius: 300,
            },
        }),
    },
})



