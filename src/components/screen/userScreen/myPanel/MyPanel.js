import React, { Component } from 'react';

import { Actions } from 'react-native-router-flux';

import Timeline from 'react-native-timeline-flatlist'
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from '../../../../services/configuration/config';
import { MyPanelStyle } from './MyPanelStyle';
import Modal from 'react-native-modalbox';

import {
    loadFromStorage,
    storage,
    CurrentUserProfile
} from "../../../../common/storage";

const options = {
    title: 'Select',
    storageOptions: {
        skipBackup: true,
        path: 'images',
       
    },
};
import {
    Platform, PermissionsAndroid,
    ScrollView, Text, View, Image,
    NetInfo, StatusBar, ActivityIndicator,
    ToastAndroid, RefreshControl, Alert, TextInput,
    TouchableOpacity, BackHandler, AsyncStorage, StyleSheet, AppState
}
    from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'


import {
    CheckIn, CheckOut, CheckPoint,
    GetMyTodayAttendance,
    GetMovementDetails,
} from '../../../../services/api/AttendanceService';
import { getLocation } from '../../../../services/api/LocationService'
import { ConvertUtcToLocalTime } from '../../../../common/commonFunction'
import {
    DailyAttendanceCombo,
} from '../../../menuDrawer/DrawerContent';

import * as TaskManager from 'expo-task-manager';

import { urlDev, urlResource } from '../../../../services/configuration/config';
import PubNub from "pubnub";
import * as Device from 'expo-device';
const BACKGROUND_FETCH_TASK = 'background-fetch';

const pubnub = new PubNub({
    subscribeKey: config.pubnubSubscribeKey,
    publishKey: config.pubnubPublishKey
});
const PUBNUB_CHANEL = 'ems_hr';

let uIdd = "";

export default class MyPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressVisible: false,
            refreshing: false,
            gps: false,
            svgLinHeight: 60 * 0 - 60,
            touchabledisable: false,
            errorMessage: "",
            location: "",
            touchabledisablepointcheckin: false,
            touchabledisablepoint: false,
            touchabledisablepointcheckout: false,
            attendanceModel: null,
            EmpTrackList: [],
            AttendanceDateVw: "",
            CheckInTimeVw: "",
            CheckOutTimeVw: "",
            DepartmentName: "",
            Designation: "",
            EmployeeCode: "",
            EmployeeName: "",
            IsCheckedIn: false,
            IsCheckedOut: false,
            OfficeStayHour: "",
            Status: "",
            image: null,
            UserId: "",
            Latitude: null,
            Longitude: null,
            LogLocation: null,

            DeviceOSVersion: Device.osVersion,
            DeviceName:Device.deviceName,
            brand:Device.brand,
            modelName:Device.modelName,
            osName:Device.osName,
            Reason: "",
            ImageFileName: "",
            mobile: '',
            name: '',
            gmail: '',
            Imageparam: "resourcetracker",
            ImageFileId: "",
            EmployeeId: 0,
            data: [],
            location: null,
            currentLongitude: 'unknown',//Initial Longitude
            currentLatitude: 'unknown',//Initial Latitude
            myApiKey: "AIzaSyAuojF8qZ_EOF1uLSddHckbEAKtbbwA2uY",
            pointcheck: "",
            fetchDate: null,
            status: null,
            isRegistered: false,
            IsAutoCheckPoint: false,
            AutoCheckPointTime: "1:00:00",
            appState: AppState.currentState,
            Note:null,

        }
    }
    _onRefresh = async () => {
        this.setState({ refreshing: true });
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);
        this.getMyTodayAttendance(this.state.UserId);
    };


    _sendToServer = async (currentLatitude, currentLongitude) => {
        try{
            var s = await getLocation(currentLatitude, currentLongitude);
        if (this.state.pointcheck == "CheckIn") {
            this.createCheckingIn(currentLatitude, currentLongitude, s);
        } else if (this.state.pointcheck == "CheckPoint") {
            this.createCheckPoint(currentLatitude, currentLongitude, s);
        } else {
            this.createCheckOut(currentLatitude, currentLongitude, s);
        }
        this.setState({ LogLocation: s });
        }catch(error){
            console.log(error,' _send to Server')
        }
        
    }



    async componentDidMount() {
        const uId = await AsyncStorage.getItem("userId");
        this.setState({ UserId: uId });
        uIdd = uId;
        var response = await loadFromStorage(storage, CurrentUserProfile);
        await this.setState({ name: response.item.UserFullName });
        await this.setState({ mobile: response.item.PhoneNumber });
        await this.setState({ gmail: response.item.Email });
        this.getMyTodayAttendance(uId);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    }
    handleAppStateChange = (nextAppState) => {
        console.log('app state', nextAppState);
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('app hase come to the foreground');
        }
    }
    async setUpApp() {
        pubnub.subscribe({ channels: [PUBNUB_CHANEL] });
    }
    async getLatestLocation() {
        const { status } = await Location.requestPermissionsAsync();
        if (status != 'granted') {
            console.log("Permission to access location was denied");
            return;
        }
  
    }
    closemodalNote() {
        this.setState({ progressVisible: true })
        if (this.state.Note == null) {
            ToastAndroid.show("Note can not be empty", ToastAndroid.TOP);

        }
        else {
            this.refs.modalNote.close();
             this.getCheckPoint();
        }
    }
    openNoteModal(){
        this.refs.modalNote.open();
    }
    setInterval() {
        var t = this.getMinute(this.state.AutoCheckPointTime);
        interval = setInterval(() =>
            this.getAutoLocation()
            , 1000 * (t * 60));
    }
    getAutoLocation = async () => {
        this.setState({ pointcheck: "CheckPoint" })
        if (this.state.IsCheckedIn === true && this.state.IsCheckedOut == false) this.getLoction();
        console.log('I do not leak!', new Date());
    }

    handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    goBack() {
        DailyAttendanceCombo();
    }
    getMyTodayAttendance = async () => {

        this.setState({ progressVisible: true });
        await GetMyTodayAttendance()
            .then(res => {
                console.log(res.result, '&&&&&&&')
                this.setState({ attendanceModel: res.result, });
                this.setState({ EmployeeCode: res.result.EmployeeCode, });
                this.setState({ EmployeeName: res.result.EmployeeName, });
                this.setState({ DepartmentName: res.result.DepartmentName, });
                this.setState({ Designation: res.result.Designation, });
                this.setState({ CheckInTimeVw: ConvertUtcToLocalTime(res.result.CheckInTime), });
                this.setState({ CheckOutTimeVw: ConvertUtcToLocalTime(res.result.CheckOutTime) });
                this.setState({ OfficeStayHour: res.result.OfficeStayHour, });
                this.setState({ IsCheckedIn: res.result.IsCheckedIn, });
                this.setState({ IsCheckedOut: res.result.IsCheckedOut, });
                this.setState({ IsAutoCheckPoint: res.result.IsAutoCheckPoint, });
                this.setState({ AutoCheckPointTime: res.result.AutoCheckPointTime == "" ? 0 : res.result.AutoCheckPointTime, });
                this.setState({ Status: res.result.Status, });
                this.setState({ EmployeeId: res.result.EmployeeId, });
                this.setState({ ImageFileName: res.result.ImageFileName, });
                console.log("attendanceModel", res.result);
                console.log('IsCheckedIn', this.state.IsCheckedIn);
                this.setState({ progressVisible: false });
                if (this.state.IsCheckedIn && !this.state.IsCheckedOut) {
                    this.getLatestLocation();
                }
            }).catch(() => {
                this.setState({ progressVisible: false });
                console.log("GetMyTodayAttendance error occured");
            });
        this.setState({ progressVisible: true });
        await GetMovementDetails()
            .then(res => {

                this.setState({ EmpTrackList: res.result });
                if (this.state.data.length != 0) {
                    this.setState({ data: [] });
                }
                res.result.map((userData) => {

                    var title = '';
                    var color = '';
                    var Note="";
                    if (userData.IsCheckInPoint) {
                        title = "Checked In";
                        color = "green",
                        Note="";
                    } else if (userData.IsCheckOutPoint) {
                        title = "Checked Out";
                        color = "red";
                        Note="";
                    } else {
                        title = "Checked point";
                        color = "gray";
                        Note= userData.Note==null?"":". Note: "+userData.Note;
                    }

                    var myObj = {
                        "time": ConvertUtcToLocalTime(userData.LogDateTime),
                        "title": title,
                        "description": userData.LogLocation+Note,
                        "circleColor": color
                    };
                    this.state.data.push(myObj);


                })
                this.setState({ progressVisible: false });
            }).catch((error) => {
                this.setState({ progressVisible: false });
                console.log("GetMovementDetails error occured", error);
            });
    }

    getLoction = async () => {

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
            ToastAndroid.show("Oops, this will not work on Sketch in an Android emulator. Try it on your device!", ToastAndroid.TOP);
        } else {
            await this._getLocationAsync();
        }
    }


    _getLocationAsync = async () => {
        try{
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
               
                ToastAndroid.show("Permission to access location was denied", ToastAndroid.TOP);

            }
           
            let location
        try {
         location = await Location.getCurrentPositionAsync({})
        } catch (error){
          location = await Location.getLastKnownPositionAsync({})
        }
        const currentLongitude = JSON.stringify(location.coords.longitude);
        const currentLatitude = JSON.stringify(location.coords.latitude);
        this.setState({ Latitude: currentLongitude });
        this.setState({ Longitude: currentLatitude });
        if (this.state.pointcheck == "CheckPoint") {
            this._sendCheckpointToServer(currentLatitude, currentLongitude);
        }
        else {
            this._sendToServer(currentLatitude, currentLongitude);
        }
        }catch(error){
            console.log(error," Location")
        }
      
    };

    _sendCheckpointToServer = async (currentLatitude, currentLongitude) => {
        try{ 
            var s = await getLocation(currentLatitude, currentLongitude);
            this.createCheckPoint(currentLatitude, currentLongitude, s);
            this.setState({ LogLocation: s });
        }catch(error){
            console.log(error,' _sendcheckpoint')
        }
       
    }
    _getLocationAsyncforgps = async () => {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );

    }
    getMinute(value) {
        var timeList = value.split(":");
        var hours = parseInt(timeList[0]),
            minutes = parseInt(timeList[1]),
            seconds = parseInt(timeList[2]);
        var tm = (hours * 60) + minutes + (seconds / 60);
        console.log('auto time in m', tm);
        return tm;

    }

    renderTrackList() {
        return (
            <View style={styles.container}>
                <Timeline
                    style={styles.list}
                    data={this.state.data}
                    circleSize={20}
                    circleColor={"circleColor"}
                    lineColor='rgb(45,156,219)'
                    timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                    timeStyle={{ textAlign: 'center', backgroundColor: '#eee', color: 'black', padding: 5, marginTop: 5, borderBottomLeftRadius:15 , borderTopRightRadius:15 }}
                    descriptionStyle={{ color: 'gray' }}
                    options={{
                        style: { paddingTop: 5 }
                    }}
                    innerCircle={'dot'}
                />
            </View>
        )
    }

    async createCheckingIn(Latitude, Longitude, loglocation) {
        try {
            const TrackingModel = {
                UserId: this.state.UserId,
                Latitude: Latitude,
                Longitude: Longitude,
                LogLocation: loglocation,
                DeviceName: this.state.DeviceName,
                DeviceOSVersion: this.state.DeviceOSVersion,
                brand:this.state.brand,
                modelName:this.state.modelName,
                osName:this.state.osName,
            };

            this.state.progressVisible = true;
            const response = await CheckIn(TrackingModel);
            if (response && response.isSuccess) {
                console.log("createCheckingIn response", response)
                this.getMyTodayAttendance();
                this.state.progressVisible = false
                // this.getLatestLocation();


            } else {
                ToastAndroid.show('Something went wrong', ToastAndroid.TOP);
                this.state.progressVisible = false;
            }
        } catch (errors) {
            console.log("createCheckingIn Errors", errors);
            this.state.progressVisible = false;
        }
    }

    createCheckPoint = async (Latitude, Longitude, loglocation) => {
        try {
            this.setState({ progressVisible: true });
            const TrackingModel = {
                UserId: this.state.UserId,
                Latitude: Latitude,
                Longitude: Longitude,
                LogLocation: loglocation,
                DeviceName: this.state.DeviceName,
                DeviceOSVersion: this.state.DeviceOSVersion,
                Note:this.state.Note
            };
            console.log("TrackingModel response", TrackingModel)


            const response = await CheckPoint(TrackingModel);
            if (response && response.isSuccess) {
                console.log("createCheckPoint response", response)
                this.getMyTodayAttendance(this.state.UserId);

                this.state.progressVisible = false;
            } else {
                ToastAndroid.show('Something went wrong', ToastAndroid.TOP);
                this.state.progressVisible = false;
            }
        } catch (errors) {
            console.log("createCheckPoint Errors", errors);
            this.state.progressVisible = false;
        }
    }

    async createCheckOut(Latitude, Longitude, loglocation, fileId) {
        try {
            const TrackingModel = {
                UserId: this.state.UserId,
                Latitude: Latitude,
                Longitude: Longitude,
                LogLocation: loglocation,
                DeviceName: this.state.DeviceName,
                DeviceOSVersion: this.state.DeviceOSVersion,
                CheckOutTimeFile: fileId
            };

            const response = await CheckOut(TrackingModel)
            this.state.progressVisible = true;
            console.log("CheckOut TrackingModel", TrackingModel);

            if (response && response.isSuccess) {

                console.log("createCheckOut response", response)

                this.getMyTodayAttendance(this.state.UserId);
                this.state.progressVisible = false;

            } else {
                ToastAndroid.show('Something went wrong', ToastAndroid.TOP);
                this.state.progressVisible = false;
            }
        } catch (errors) {
            console.log("createCheckOut Errors", errors);
            this.state.progressVisible = false;
        }
    }

    getCheckIn = async () => {

        this.setState({ pointcheck: "CheckIn" });
        this.setState({ touchabledisablepointcheckin: true, });

        this.setState({
            touchabledisable: true,
            progressVisible: true
        });
        console.log('check for getCheckIn', this.state.IsCheckedIn);

        if (this.state.IsCheckedOut === false) {
            if (this.state.IsCheckedIn === false) {
                this.setState({ progressVisible: true, });

                await this.getLoction();

                this.setState({ touchabledisablepointcheckin: false, });
            } else {
                this.setState({ progressVisible: false });
                this.setState({ touchabledisablepointcheckin: false, });
                ToastAndroid.show('You have already checked in today', ToastAndroid.TOP);
            }
        } else {
            this.setState({ progressVisible: false });
            this.setState({ touchabledisablepointcheckin: false, });
            ToastAndroid.show('You have already checked out today', ToastAndroid.TOP);
        }


    }

    getCheckOut = async () => {

        this.setState({ pointcheck: "CheckOut" });
        this.setState({ touchabledisablepointcheckout: true, });

        this.setState({
            touchabledisable: true,
            progressVisible: true
        });
        console.log('check for getCheckOut', this.state.IsCheckedOut);

        if (this.state.IsCheckedOut == false) {
            if (this.state.IsCheckedIn === true && this.state.IsCheckedOut == false) {
                this.setState({
                    progressVisible: false,
                });
                await this.getLoction();

            } else {
                this.setState({ progressVisible: false });
                this.setState({ touchabledisablepointcheckout: false, });
                ToastAndroid.show('You have not checked in today', ToastAndroid.TOP);
            }
        } else {
            this.setState({ progressVisible: false });
            this.setState({ touchabledisablepointcheckout: false, });
            ToastAndroid.show('You have already checked out today', ToastAndroid.TOP);
        }

    }

    getCheckPoint = async () => {
        this.setState({ pointcheck: "CheckPoint" });

        this.setState({ touchabledisablepoint: true, });
        this.setState({
            progressVisible: true
        });
        this.setState({
            touchabledisable: true,
        });
        console.log('check for getCheckPoint', this.state.IsCheckedIn);
        if (this.state.IsCheckedOut) {
            this.setState({ progressVisible: false });
            this.setState({
                progressVisible: false
            });
            this.setState({ touchabledisablepoint: false, });
            return ToastAndroid.show('You have already checked out today', ToastAndroid.TOP);
        }
        if (this.state.IsCheckedIn === true && this.state.IsCheckedOut == false) {

            this.getLoction();

            this.setState({
                progressVisible: false
            });
            this.setState({ touchabledisablepoint: false, });

        } else {
            this.setState({ progressVisible: false });
            ToastAndroid.show('You have not checked in today', ToastAndroid.TOP);
            this.setState({
                progressVisible: false
            });
            this.setState({ touchabledisablepoint: false, });
        }



    }


    renderTimeStatusList() {
        return (
            <View
                style={MyPanelStyle.TimeInfoBar}>
                <View
                    style={MyPanelStyle.First2TimePanelView}>

                    <View
                        style={MyPanelStyle.AllTimePanelRow}>
                        <Text>
                            {this.state.CheckInTimeVw ?
                                (<AntDesign name="arrowdown"
                                    size={18} color="#07c15d"
                                    style={{ marginTop: 3, }}
                                />) : (<Text
                                    style={MyPanelStyle.TimeStatusText}>
                                    NOT YET
                                </Text>)
                            }
                        </Text>
                        <Text
                            style={MyPanelStyle.CheckedInText}>
                            {this.state.CheckInTimeVw}
                        </Text>
                    </View>
                    <View style={MyPanelStyle.AllTimePanelRow}>
                        <Text
                            style={MyPanelStyle.TimeStatusText}>
                            CHECKED IN
                        </Text>
                    </View>
                </View>
                <View
                    style={MyPanelStyle.First2TimePanelView}>
                    <View style={MyPanelStyle.AllTimePanelRow}>
                        <Text>
                            {this.state.OfficeStayHour ?
                                (<Entypo name="stopwatch"
                                    size={17} color="#a1b1ff"
                                    style={{
                                        marginTop: 2,
                                        marginRight: 2,
                                    }}
                                />

                                ) : (<Text
                                    style={MyPanelStyle.TimeStatusText}>
                                    NOT YET
                                </Text>)
                            }
                        </Text>
                        <Text style={MyPanelStyle.WorkingTimeText}>
                            {this.state.OfficeStayHour}
                        </Text>
                    </View>
                    <View style={MyPanelStyle.AllTimePanelRow}>
                        <Text
                            style={MyPanelStyle.TimeStatusText}>
                            WORKING TIME
                        </Text>
                    </View>
                </View>
                <View
                    style={MyPanelStyle.Last1TimePanelView}>
                    <View
                        style={MyPanelStyle.AllTimePanelRow}>
                        <Text>
                            {this.state.OfficeStayHour ?
                                (<AntDesign name="arrowup"
                                    size={18}
                                    style={{ marginTop: 3, }}
                                    color="#a1d3ff"
                                />) : (<Text
                                    style={MyPanelStyle.TimeStatusText}>
                                    NOT YET
                                </Text>)
                            }
                        </Text>
                        <Text style={MyPanelStyle.CheckedOutText}>
                            {this.state.CheckOutTimeVw}
                        </Text>
                    </View>
                    <View style={MyPanelStyle.AllTimePanelRow}>
                        <Text
                            style={MyPanelStyle.TimeStatusText}>
                            CHECKED OUT
                            </Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={MyPanelStyle.container}>

                <View
                    style={MyPanelStyle.HeaderContent}>
                    <View
                        style={MyPanelStyle.HeaderFirstView}>
                        <View
                            style={MyPanelStyle.HeaderTextView}>
                            <Text
                                style={MyPanelStyle.HeaderTextstyle}>
                                My Feed
                            </Text>
                        </View>
                    </View>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }>
                    <View
                        style={MyPanelStyle.MainInfoBar}>
                        <View
                            style={MyPanelStyle.MainInfoBarTopRow}>
                            <View style={MyPanelStyle.MainInfoBarTopRowLeft}>
                                {this.state.ImageFileName !== "" ? (
                                    <Image resizeMode='cover' style={
                                        {
                                            ...Platform.select({
                                                ios: {
                                                    width: 80,
                                                    height: 80,
                                                    marginRight: 10,
                                                    borderRadius: 40,
                                                },
                                                android: {
                                                    width: 80,
                                                    height: 80,

                                                    borderRadius: 40,
                                                },
                                            }),
                                        }
                                    } source={{ uri: urlResource + this.state.ImageFileName }} />) :

                                    (<Image style={
                                        {
                                            ...Platform.select({
                                                ios: {
                                                    width: 80,
                                                    height: 80,
                                                    marginRight: 10,
                                                    borderRadius: 40,
                                                },
                                                android: {
                                                    width: 80,
                                                    height: 80,

                                                    borderRadius: 600,
                                                },
                                            }),
                                        }
                                    } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />)}
                                <View
                                    style={MyPanelStyle.TextInfoBar}>
                                    <Text style={MyPanelStyle.UserNameTextStyle}>
                                        {this.state.EmployeeName}
                                    </Text>
                                    <Text style={MyPanelStyle.DesignationTextStyle}>
                                        {this.state.Designation}
                                    </Text>
                                    <Text style={MyPanelStyle.DepartmentTextStyle}>
                                        {this.state.DepartmentName}
                                    </Text>
                                </View>
                            </View>



                        </View>
                    </View>
                    <View>

                        {this.renderTimeStatusList()}
                    </View>
                    <View
                        style={MyPanelStyle.ButtonBar}>
                        <TouchableOpacity
                            disabled={this.state.touchabledisablepointcheckin}
                            onPress={() => this.getCheckIn()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Entypo name="fingerprint"
                                    size={45} color="#07c15d"
                                    style={{ marginTop: 3, }}
                                />
                            <Text style={{ color:"#07c15d"}}>
                                PUNCH IN
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={this.state.touchabledisablepoint}
                           // onPress={() => this.getCheckPoint()}
                           onPress={() => this.openNoteModal()}
                            style={MyPanelStyle.ButtonContainer}>
                             <Feather name="map-pin"
                                    size={45} color="#40BFFF"
                                    style={{ marginTop: 3, }}
                                />
                            <Text style={{ color:"#40BFFF"}}>
                                CHECK POINT
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={this.state.touchabledisablepointcheckout}
                            onPress={() => this.getCheckOut()}
                            style={MyPanelStyle.ButtonContainer}>
                             <Entypo name="fingerprint"
                                    size={45} color="#FF0000"
                                    style={{ marginTop: 3, }}
                                />
                            <Text style={{ color:"#FF0000"}}>
                                PUNCH OUT
                            </Text>
                        </TouchableOpacity>
                    </View >

                    <View
                        style={MyPanelStyle.TimeLineMainView}>
                        <View
                            style={MyPanelStyle.TimeLineHeaderBar}>
                            <Image
                                resizeMode="contain"
                                style={{
                                    width: 19.8,
                                    height: 19.8,
                                }}
                                source={require('../../../../assets/images/goal.png')}>
                            </Image>
                            <Text
                                style={MyPanelStyle.TimeLineHeaderText}>
                                Timeline
                            </Text>
                        </View>
                        {this.state.progressVisible == true ?
                            (<ActivityIndicator size="large" color="#1B7F67"
                                style={MyPanelStyle.loaderIndicator} />) : null}
                        <View style={{}}>

                            {this.renderTrackList()}
                        </View>
                    </View>
                </ScrollView>
                <Modal style={[MyPanelStyle.modalReason]} position={"center"}
                    ref={"modalNote"} isDisabled={this.state.isDisabled}
                    onOpened={() => this.setState({ floatButtonHide: true })}>


                    <View style={{ justifyContent: "space-between", flexDirection: "column" }}>
                        <View style={{ alignItems: "flex-start" }}></View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.modalNote.close()}
                                style={MyPanelStyle.changepassmodalToucah}>


                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                                </Image>

                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={MyPanelStyle.modelContent}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16,textAlign:'center' }}>
                       Note
                            </Text>
                         
                        <View
                            style={MyPanelStyle.horizontalLine}
                        />

                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <TextInput style={{
                            width: 230,
                            height: 40,
                            backgroundColor: '#ebebeb',
                            color: '#2c2930',
                            alignSelf: 'center',
                            borderRadius: 10,
                            textAlign: 'center',
                            paddingHorizontal: 10,
                            marginVertical: 8,
                        }}
                            placeholder="Write Your Note"
                            placeholderTextColor="#cbcbcb"
                            returnKeyType="next" autoCorrect={false}
                            onChangeText={(text) => this.setState({ Note: text })}
                        />
                        <TouchableOpacity style={MyPanelStyle.addPeopleBtnchangpass}
                            onPress={() => this.closemodalNote()} >
                            <Text style={MyPanelStyle.changePassModalSave}>
                               Check Point
                                </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>         

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20, paddingTop: 0,

        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
});