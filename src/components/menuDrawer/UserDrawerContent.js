import React, { Component } from 'react';
import { ScrollView, StatusBar, Platform, Dimensions, Text, View, TouchableOpacity, Image, Alert, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Feather } from '@expo/vector-icons';
import { DrawerContentStyle } from './DrawerContentStyle';
import { clearStorageValue } from "../../common/storage";
import config from '../../services/configuration/config';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { loadFromStorage, storage, CurrentUserProfile } from "../../common/storage";
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';
const logOut = () =>
{
    global.DrawerContentId = 8;
    Alert.alert(
        'Log Out',
        'Log Out From The App?', [{
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
        }, {
            text: 'OK',
            style: 'ok',
            onPress: async () =>
            {
                await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                await clearStorageValue();
                Actions.auth({ type: 'reset'})
            }
        },], {
        cancelable: false
    }
    )
    return true;
};
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;


const drawerSelectedOption = (id) =>
{
    global.DrawerContentId = id
   
};


const MyPanelCombo = () =>
{
    Actions.MyPanel(); drawerSelectedOption(2);
}

const TasksCombo = () =>
{
    Actions.UserTaskList(); drawerSelectedOption(4);
}

const LeavesCombo = () =>
{
    Actions.TabForLeaveApprove(); drawerSelectedOption(5);
}


const NoticeCombo = () =>
{
    Actions.UserNotice(); drawerSelectedOption(6);
}
const QRcodeCombo = () =>
{
    Actions.QRcode(); drawerSelectedOption(7);
}
const logoutCombo = () =>
{
        drawerSelectedOption(9);
        logOut();

}
var { width, height } = Dimensions.get('window');
export
{
    TasksCombo,
    LeavesCombo,
    NoticeCombo, logoutCombo,
    drawerSelectedOption,
    MyPanelCombo,
    QRcodeCombo,
}


export default class UserDrawerContent extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            selectedId: 1,
            UserTypeId:null,
            HasAccessQrCodeScan:false,
        }
    }
    async componentDidMount()
    {
        var userDetails = await loadFromStorage(storage, CurrentUserProfile);
        console.log(userDetails,'^^^^^^^^^^^')
        this.setState({ HasAccessQrCodeScan: userDetails.item.HasAccessQrCodeScan })
        global.DrawerContentId = 1;
        
    }
   
    getMyPanel()
    {
        if (global.userType == "user")
        {
            return (<TouchableOpacity
                onPress={() => MyPanelCombo()}
                style={
                    global.DrawerContentId == 3 ?
                        DrawerContentStyle.itemContainerSelected :
                        DrawerContentStyle.itemContainer}>
                <Feather name="map" size={24} color="#218f6f"
                    style={{ transform: [{ scaleX: -1 }] }}
                />
                <Text style={DrawerContentStyle.itemTextStyle}>
                    My panel
            </Text>
            </TouchableOpacity>)
        }
    }
    render()
    {
        return (
            <View style={DrawerContentStyle.container}>

                <View
                    style={[DrawerContentStyle.logoImage,
                    { marginBottom: 5, marginTop: 10,
                       justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row' }
                    ]}>
                    <Image
                        resizeMode='contain'
                        style={{ height: 38, width: 38,   marginVertical:15, }}
                        source={require('../../assets/images/icon.png')} >
                    </Image>
                    <Text style={{
                        marginLeft: 5,
                        fontSize: 26,
                        fontWeight: "bold",
                        color: "#000000",
                        fontFamily: "Montserrat_Bold",
                    }}>
                    {config.appTitle}
                    </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                   

                    <TouchableOpacity
                    onPress={() => MyPanelCombo()}
                    style={
                        global.DrawerContentId == 2 ?
                            DrawerContentStyle.itemContainerSelected :
                            DrawerContentStyle.itemContainer}>
                        <Feather name="map" size={24}
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <Text style={DrawerContentStyle.itemTextStyle}> My Panel</Text>
                </TouchableOpacity>

                    
                    <TouchableOpacity
                        onPress={() => TasksCombo()}
                        style={
                            global.DrawerContentId == 4 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                                <Feather name="book-open" size={24}
                                style={{ transform: [{ scaleX: -1 }] }}
                            />
                            <Text style={DrawerContentStyle.itemTextStyle}>My Tasks</Text>
                    </TouchableOpacity>
                   
                    <TouchableOpacity
                        onPress={() => LeavesCombo()}
                        style={
                            global.DrawerContentId == 5 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                                <Feather name="calendar" size={24}
                                style={{ transform: [{ scaleX: -1 }] }}
                            />
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Leaves
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => NoticeCombo()}
                        style={
                            global.DrawerContentId == 6 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                                <Feather name="bell" size={24}
                                style={{ transform: [{ scaleX: -1 }] }}
                            />
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Notice Board
                        </Text>
                    </TouchableOpacity>
                    {
                      this.state.HasAccessQrCodeScan?
                      <TouchableOpacity
                      onPress={() => QRcodeCombo()}
                      style={
                          global.DrawerContentId == 7 ?
                              DrawerContentStyle.itemContainerSelected :
                              DrawerContentStyle.itemContainer}>
                              <AntDesign name="qrcode" size={24}
                              style={{ transform: [{ scaleX: -1 }] }}
                          />
                      <Text style={DrawerContentStyle.itemTextStyle}>
                        QRcode Scanner
                      </Text>
                  </TouchableOpacity>:
                   <View></View>
                    } 
                   
                    <TouchableOpacity
                        onPress={() => logoutCombo()}
                        style={
                            global.DrawerContentId == 9 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                            <Feather name="log-out" size={25}  color="#c24a4a"/>
                   
                            <Text style={DrawerContentStyle.itemTextStyle}>
                                Logout
                    </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        )
    }
}
