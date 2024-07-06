import React, { Component } from 'react';

import { Actions } from 'react-native-router-flux';

import Timeline from 'react-native-timeline-flatlist'
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from '../../../../services/configuration/config';
import { CommonStyles } from '../../../../common/CommonStyles';

import { MyPanelStyle } from './ProxyPanelStyle';

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


import {
    CheckIn, CheckOut, CheckPoint,
    GetMyTodayAttendanceQRcode,
    GetMovementDetailsQRcode,
    GetUserId,
} from '../../../../services/api/AttendanceService';
import { getLocation } from '../../../../services/api/LocationService'
import { ConvertUtcToLocalTime } from '../../../../common/commonFunction'
import {
    DailyAttendanceCombo,
} from '../../../menuDrawer/DrawerContent';


import { urlDev, urlResource } from '../../../../services/configuration/config';


let uIdd = "";



_getLocationAsync = async () => {
    try {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        await fetchlog(location.coords.latitude, location.coords.longitude);
    } catch (error) {
        console.log('l error', error);
    }
};

createCheckPoint = async (Latitude, Longitude, loglocation) => {
    try {
        var TrackingModel = {
            UserId: uIdd,
            Latitude: Latitude,
            Longitude: Longitude,
            LogLocation: loglocation,
            DeviceName: "Ioo",
            DeviceOSVersion: Platform.OS === 'ios' ? Platform.systemVersion : Platform.Version
        };
        console.log("TrackingModel response", TrackingModel)


        const response = await CheckPoint(TrackingModel);
        if (response && response.isSuccess) {
            console.log("createCheckPoint response", response)

        }
    } catch (errors) {
        console.log("createCheckPoint Errors", errors);
    }
}
fetchlog = async (lat, long) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&sensor=true&key=' + config.mapApiKey + '', {
        method: 'GET',

    })
        .then(response => response.json())
        //If response is in json then in success
        .then(responseJson => {
            //Success
            console.log('addlo', responseJson.results[0].formatted_address);
            createCheckPoint(JSON.stringify(lat), JSON.stringify(long), responseJson.results[0].formatted_address);
        })
        //If response is not in json then in error
        .catch(error => {

            console.error(error);
        });
}
let interval = null;
export default class ProxyPanel extends Component {
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
            EmployeeCode:"",
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

            DeviceOSVersion: Platform.OS === 'ios' ? Platform.systemVersion : Platform.Version,
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
        }
    }
    _onRefresh = async () => {
        this.setState({ refreshing: true });
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);
        this.GetMyTodayAttendanceQRcode();
    };


    _sendToServer = async (currentLatitude, currentLongitude) => {
        var s = await getLocation(currentLatitude, currentLongitude);
        if (this.state.pointcheck == "CheckIn") {
            this.createCheckingIn(currentLatitude, currentLongitude, s);
        } else if (this.state.pointcheck == "CheckPoint") {
            this.createCheckPoint(currentLatitude, currentLongitude, s);
        } else {
            this.createCheckOut(currentLatitude, currentLongitude, s);
        }
        this.setState({LogLocation: s});
    }



    async componentDidMount() {
        console.log(this.props.Model,'@@@@@@@@@@@@@@@')
        this.GetUserId(this.props.Model)
        //this.getMyTodayAttendance(uId);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

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
        Actions.pop({ refresh: {} });
    }

    GetUserId = async (empCode) => {
        try {
            this.setState({ progressVisible: true });
            await GetUserId(empCode)
                .then(res => {
                    if(res.result!=null){
                        this.setState({UserId:res.result.UserId});
                        this.GetMyTodayAttendanceQRcode(res.result.UserId);
                    }
                    console.log(res.result.UserId, '.....usrid');
                })
                .catch(() => {
                    this.setState({ progressVisible: false });
                    console.log("error occured");
                });

        } catch (error) {
            this.setState({ progressVisible: false });
            console.log(error);
        }
    }
    GetMyTodayAttendanceQRcode = async () => {
        this.setState({ progressVisible: true });
        await GetMyTodayAttendanceQRcode(this.state.UserId)
            .then(res => {
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
                this.setState({ AutoCheckPointTime: res.result.AutoCheckPointTime==""?0: res.result.AutoCheckPointTime, });
                this.setState({ Status: res.result.Status, });
                this.setState({ EmployeeId: res.result.EmployeeId, });
                this.setState({ ImageFileName: res.result.ImageFileName, });
                console.log("attendanceModel", res.result);
                console.log('IsCheckedIn', this.state.IsCheckedIn);
                this.setState({ progressVisible: false });

            }).catch(() => {
                this.setState({ progressVisible: false });
                console.log("GetMyTodayAttendanceQRcode error occured");
            });
        this.setState({ progressVisible: true });
        await GetMovementDetailsQRcode(this.state.UserId)
            .then(res => {

                this.setState({ EmpTrackList: res.result });
                if (this.state.data.length != 0) {
                    this.setState({ data: [] });
                }
                res.result.map((userData) => {

                    var title = '';
                    var color = '';
                    if (userData.IsCheckInPoint) {
                        title = "Checked In";
                        color = "green"
                    } else if (userData.IsCheckOutPoint) {
                        title = "Checked Out";
                        color = "red"
                    } else {
                        title = "Checked point";
                        color = "gray"
                    }

                    var myObj = {
                        "time": ConvertUtcToLocalTime(userData.LogDateTime),
                        "title": title,
                        "description": userData.LogLocation,
                        "circleColor": color
                    };
                    this.state.data.push(myObj);


                })
                this.setState({ progressVisible: false });
            }).catch((error) => {
                this.setState({ progressVisible: false });
                console.log("GetMovementDetailsQRcode error occured", error);
            });
    }

    getLoction = async () => {

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
            ToastAndroid.show(errorMessage, ToastAndroid.TOP);
        } else {
            await this._getLocationAsync();
        }
    }


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            ToastAndroid.show(errorMessage, ToastAndroid.TOP);
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        await Location.getCurrentPositionAsync({
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 0,
            distanceFilter: 10
        }).then((position) => {
            console.log(position, 'test positions');
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
            this.setState({ Latitude: currentLongitude });
            this.setState({ Longitude: currentLatitude });
            if (this.state.pointcheck == "CheckPoint"){
                this._sendCheckpointToServer(currentLatitude, currentLongitude);
            }
            else{
                this._sendToServer(currentLatitude, currentLongitude);
            }
        });
    };

    _sendCheckpointToServer=async(currentLatitude, currentLongitude)=>{
        var s = await getLocation(currentLatitude, currentLongitude);
        this.createCheckPoint(currentLatitude, currentLongitude, s);
        this.setState({LogLocation: s});
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
                    timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13, marginTop: 5, }}
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
                DeviceOSVersion: this.state.DeviceOSVersion
            };

            this.state.progressVisible = true;
            const response = await CheckIn(TrackingModel);
            if (response && response.isSuccess) {
                console.log("createCheckingIn response", response)
                this.GetMyTodayAttendanceQRcode();
                this.state.progressVisible = false

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
                DeviceOSVersion: this.state.DeviceOSVersion
            };
            console.log("TrackingModel response", TrackingModel)


            const response = await CheckPoint(TrackingModel);
            if (response && response.isSuccess) {
                console.log("createCheckPoint response", response)
                this.GetMyTodayAttendanceQRcode();

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

    async createCheckOut(Latitude, Longitude, loglocation,fileId) {
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

                this.GetMyTodayAttendanceQRcode();
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
                        <TouchableOpacity
                            style={CommonStyles.HeaderMenuicon}
                            onPress={() => { this.goBack() }}>
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../../../assets/images/left_arrow.png')}>
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={MyPanelStyle.HeaderTextView}>
                            <Text
                                style={MyPanelStyle.HeaderTextstyle}>
                                ATTENDANCE PANEL
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
                            {
                                this.state.IsCheckedIn?
                                <TouchableOpacity
                            disabled={this.state.touchabledisablepointcheckout}
                            onPress={() => this.getCheckOut()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../../assets/images/checkout.png')}
                                style={MyPanelStyle.ButtonImage}>
                            </Image>
                        </TouchableOpacity>:
                        <TouchableOpacity
                        disabled={this.state.touchabledisablepointcheckin}
                        onPress={() => this.getCheckIn()}
                        style={MyPanelStyle.ButtonContainer}>
                        <Image
                            resizeMode='contain'
                            source={require('../../../../assets/images/checkin.png')}
                            style={MyPanelStyle.ButtonImage}>
                        </Image>
                    </TouchableOpacity>
                            }
                        

                        {/* <TouchableOpacity
                            disabled={this.state.touchabledisablepoint}
                            onPress={() => this.getCheckPoint()}
                            style={MyPanelStyle.ButtonContainer}>
                            <Image
                                resizeMode='contain'
                                source={require('../../../../assets/images/checkpoint.png')}
                                style={MyPanelStyle.ButtonImage}>
                            </Image>
                        </TouchableOpacity> */}
                        
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