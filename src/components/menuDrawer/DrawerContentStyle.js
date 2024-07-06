import { StyleSheet, Platform, StatusBar } from 'react-native';


export const DrawerContentStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center', height: 40, marginVertical: 8,
        paddingLeft: 15,
    },
    itemContainerSelected: {
        flexDirection: 'row',
        alignItems: 'center', height: 40, marginVertical: 8,
        paddingLeft: 15, marginRight: 5,
        backgroundColor: "#a8caf0",
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,

    },
    itemTextSelectedStyle: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "PRODUCT_SANS_REGULAR",
    },
    itemTextStyle: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: "bold",
        color: "#555555",
        fontFamily: "PRODUCT_SANS_REGULAR",
    },
    logoImage: {
        paddingLeft: 10,
        backgroundColor: "#448ce3",
        flexDirection: 'row',
    },
    ImagestyleFromServer: {
        ...Platform.select({
            ios: {
                width: 60, height: 60, borderRadius: 30
            },
            android: {
                width: 60, height: 60, borderRadius: 200
            },
        }),
    },
    RightTextView: {
        flexDirection: 'column', marginTop: 3,
    },
    NameText: {
        fontFamily: "OPENSANS_BOLD",
        fontSize: 30,
        textAlign: "left",
        color: "#19260c",
    },
    DesignationText: {
        fontSize: 12,
        fontFamily: "OPENSANS_REGULAR",
        textAlign: "left",
        color: "#8f8f8f"
    },
    DepartmentText: {
        fontSize: 12,
        fontFamily: "OPENSANS_REGULAR",
        textAlign: "left",
        color: "#b5b5b5"
    },
    emptyLineStyle: {
        width: "100%", borderBottomWidth: 0.5,
        paddingVertical: 10,
        borderBottomColor: "black",

    },
    
})



