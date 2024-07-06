import { StyleSheet,Platform } from 'react-native';

export const CommonStyles = StyleSheet.create({
    HeaderContent: {
        ...Platform.select({
            ios: {
                justifyContent: 'space-between',
                backgroundColor: '#f6f7f9',
                flexDirection: 'row',
                padding: 10,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderColor: '#fff',

                height: 60,
            },
            android: {
                justifyContent: 'space-between',
                backgroundColor: '#f6f7f9',
                flexDirection: 'row',
                padding: 10,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderColor: '#fff',

                elevation: 1,
                height: 60,
            },
        }),
    },
    HeaderFirstView: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    HeaderMenuicon: {
        alignItems: 'center', padding: 10,
    },
    HeaderMenuLeft: {
        justifyContent: 'flex-end', marginRight: 0,
        marginLeft: 0, flexDirection: 'row',
        alignItems: 'center',
    },
    HeaderMenuLeftStyle: {
        alignItems: 'center',
        height: 40, width: 75,
    },
    HeaderMenuiconstyle: {
        width: 20, height: 20,
    },
    HeaderTextView:
    {
        padding: 0,
        marginLeft: 17, margin: 0,
        flexDirection: 'row', alignItems: 'center',
    },
    HeaderTextstyle: {
        fontFamily: "PRODUCT_SANS_BOLD", fontSize: 16,
        textAlign: "left", color: "black",
    },

    createTaskButtonContainer: {
        justifyContent: 'flex-end', marginRight: 0,
        marginLeft: 0, flexDirection: 'row',
        alignItems: 'center',
    },
    createTaskButtonTouch: {
        flexDirection: 'row', alignItems: 'center', padding: 3,
    },
    plusButton: {
        backgroundColor: "#355FB7",
        alignItems: 'center',
        padding: 6,
        paddingHorizontal: 9,
        borderBottomLeftRadius: 6,
        borderTopLeftRadius: 6,
    },
    ApplyButtonText: {

        fontSize: 12, color: '#ffffff',
        fontFamily: 'Montserrat_Bold',
    },
    ApplyTextButton: {
        backgroundColor: "#4570cb",
        alignItems: 'center',
        padding: 7,
        paddingHorizontal: 9,
        borderBottomRightRadius: 6,
        borderTopRightRadius: 6,
    },
});
