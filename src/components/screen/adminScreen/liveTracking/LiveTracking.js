import React from 'react';
import {
    Platform, StatusBar, Dimensions, ScrollView,
    TouchableOpacity, View, Text, FlatList,
    Image, StyleSheet, AsyncStorage
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from "react-native-maps-directions";
import { Actions } from 'react-native-router-flux';
import { LiveTrackingStyle } from './LiveTrackingStyle';
import {
    GetMovementDetailsAll, GetAll, GetMovementDetailsadmin
} from '../../../../services/api/AttendanceService';
import { CommonStyles } from '../../../../common/CommonStyles';
import config from '../../../../services/configuration/config';
import Modal from 'react-native-modalbox';
import Iconic from 'react-native-vector-icons/Feather'
import { SearchBar } from 'react-native-elements';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import PubNub from "pubnub";
import { ConvertUtcToLocalTime } from '../../../../common/commonFunction'

const { width, height } = Dimensions.get('window');
const pubnub = new PubNub({
    subscribeKey: config.pubnubSubscribeKey,
    publishKey: config.pubnubPublishKey
});
const PUBNUB_CHANEL = 'ems_hr';
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class LiveTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            employeeList: [],
            DepartmentName: "",
            Designation: "",
            EmployeeName: "",
            UserId: "",
            Latitude: 0,
            Longitude: 0,
            LogLocation: '',
            EmpTrackList: [],
            data: [],
            markers: [],
            slectedEmployeeId: 0,
            selctedEmployeeValue: 'All Employee',
        }
        this.arrayholder = [];
        this.mapView = null;
    }


    async componentDidMount() {
        await this.getEmpAllWithCompanyId();
        await this.getEmpTrackInfo();
        // this.startTimer();
    }
    startTimer = () => {
        let interval = setInterval(() => {
            this.getEmpTrackInfo();
        }, 3000);
        this.setState({ interval: interval });
    };
    handleBackButton() {
        Actions.DailyAttendance();
        return true;
    }

    _getLocationAsync = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
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
            const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude));
            const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude));

            this.setState({ Latitude: currentLatitude });
            this.setState({ Longitude: currentLongitude });
        });
        console.log("currentloc", this.state.Latitude, this.state.Longitude);
    };
    getEmpAllWithCompanyId = async () => {
        try {
            this.setState({ progressVisible: true })
            await GetAll()
                .then(res => {
                    this.setState({ employeeList: res.result });
                    this.arrayholder = res.result;
                    this.setState({ progressVisible: false })
                })
                .catch(() => {
                    this.setState({ progressVisible: false })
                    console.log("error occured");
                });
        } catch (error) {
            this.setState({ progressVisible: false })
            console.log(error);
        }
    }
    getEmpTrackInfo = async () => {
        try {
            this.setState({ markers: [] });
            if (this.state.selctedEmployeeValue === "All Employee") {
                await GetMovementDetailsAll()
                    .then(res => {
                        this.setState({
                            EmpTrackList: res.result,
                        });
                        var markerlist = [];
                        console.log('movement details', res.result)
                        if (res.result.length > 0) {
                            res.result.map((userData, index) => {
                                var title = '';
                                var color = '';
                                var Note="";
                                if (userData.IsCheckInPoint) {
                                    title = "Checked In at: " + userData.LogTimeVw;
                                    color = 'green';
                                    Note="";
                                } else if (userData.IsCheckOutPoint) {
                                    title = "Checked Out at: " + userData.LogTimeVw;
                                    color = 'red';
                                    Note="";
                                } else {
                                    title = "Checked point at: " + userData.LogTimeVw;
                                    color = 'yellow';
                                    Note= userData.Note==null?"":" Note: "+userData.Note;
                                }
                                var newMarkerObj = {
                                    "title": userData.UserName + " " + title + " " + (index + 1),
                                    "description": userData.LogLocation+Note,
                                    "color": color,
                                    coordinates: {
                                        "latitude": userData.Latitude,
                                        "longitude": userData.Longitude
                                    },
                                }
                                markerlist.push(newMarkerObj);
                            });
                            console.log('markerlist', markerlist);
                            this.setState({ markers: this.state.markers.concat(markerlist) });
                            this.setState({
                                Longitude: res.result[res.result.length - 1].Longitude,
                                Latitude: res.result[res.result.length - 1].Latitude,
                                LogLocation: res.result[res.result.length - 1].LogLocation,
                            });
                        } else {
                            this._getLocationAsync();
                        }
                    })
                    .catch((ex) => {
                        console.log(ex, "GetMovementDetails error occured");
                    });
            } else {
                await GetMovementDetailsadmin(this.state.slectedEmployeeId)
                    .then(res => {
                        this.setState({
                            EmpTrackList: res.result,
                        });
                        var markerlist = [];
                        console.log('movement details', res.result)
                        res.result.map((userData, index) => {
                            var title = '';
                            var color = '';
                            var Note="dfddddff";
                            if (userData.IsCheckInPoint) {
                                title = "Checked In at: " + userData.LogTimeVw;
                                color = 'green';
                                Note="";
                            } else if (userData.IsCheckOutPoint) {
                                title = "Checked Out at: " + userData.LogTimeVw;
                                color = 'red';
                                Note="";
                            } else {
                                title = "Checked point at: " + userData.LogTimeVw;
                                color = index === res.result.length - 1 ? 'red' : 'yellow';
                                Note= userData.Note==null?"":" Note: "+userData.Note;
                            }
                            var newMarkerObj = {
                                "title": title,
                                "description": userData.LogLocation + Note,
                                "color": color,
                                coordinates: {
                                    "latitude": userData.Latitude,
                                    "longitude": userData.Longitude
                                },
                            }
                            markerlist.push(newMarkerObj);

                        });
                        this.setState({ markers: this.state.markers.concat(markerlist) });
                        this.setState({
                            Longitude: res.result[res.result.length - 1].Longitude,
                            Latitude: res.result[res.result.length - 1].Latitude,
                            LogLocation: res.result[res.result.length - 1].LogLocation,
                        });
                    })
                    .catch((ex) => {
                        console.log(ex, "GetMovementDetails error occured");
                    });
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    _onRefresh = async () => {
        this.setState({ refreshing: true });
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);
        this.getEmpTrackInfo();
    };

    async closeEmployeeModal(item) {
        this.refs.employeeModal.close();
        await this.setState({ selctedEmployeeValue: item.EmployeeName })
        await this.setState({ slectedEmployeeId: item.PortalUserId })
        this.getEmpTrackInfo();
    }
    async closeEmployeeModalForAll() {
        await this.setState({ selctedEmployeeValue: "All Employee" })
        this.getEmpTrackInfo();
        this.refs.employeeModal.close();
    }
    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.UserName.toUpperCase()} ${item.DepartmentName.toUpperCase()} ${item.DesignationName.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            employeeList: newData,
        });
    };
    renderSearchHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                // style={{ position: 'absolute', zIndex: 1, marginBottom: 0 }}
                lightTheme
                containerStyle={{ backgroundColor: '#f6f7f9', }}
                inputContainerStyle={{ backgroundColor: 'white', }}
                round
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
            />

        );
    };

    onReady = (result) => {
        this.mapView.fitToCoordinates(result.coordinates, {
            edgePadding: {
                right: (width / 20),
                bottom: (height / 20),
                left: (width / 20),
                top: (height / 20),
            }
        });
    }
    onStart = (result) => {
        console.log('onstart', result);
    }
    onError = (errorMessage) => {
        console.log(errorMessage);
    }

    renderMapView() {
        console.log('coor', this.state.markers)
        return (
            <View style={{
                flexDirection: 'column', flex: 1,
            }}>
                <View style={{ margin: 10, flex: 1 }}>
                    {this.state.EmpTrackList.length < 1 ? <View><Text>No employee movement to show</Text></View> :
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{
                                height: (height * 95) / 100,
                            }}
                            ref={c => this.mapView = c}
                            loadingEnabled={true}
                            showsUserLocation={false}
                            followUserLocation={true}
                            zoomEnabled={true}
                            region={
                                {
                                    latitude: this.state.Latitude,
                                    longitude: this.state.Longitude,
                                    latitudeDelta: this.state.selctedEmployeeValue === "All Employee" ? 4 : 0.5,//0.001200,
                                    longitudeDelta: this.state.selctedEmployeeValue === "All Employee" ? 4 : 0.5 * (width / height)//0.001200 * .60
                                }
                            }
                        >
                            {this.state.markers.length == 0 ? null : this.state.markers.map((marker, index) => (
                                <MapView.Marker
                                    key={index}
                                    tracksViewChanges={true}
                                    tracksInfoWindowChanges={true}
                                    pinColor={marker.color}
                                    coordinate={marker.coordinates}
                                    title={marker.title}
                                    description={marker.description}
                                />
                            ))}
                        </MapView>
                    }
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={LiveTrackingStyle.container}>
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        <View
                            style={[LiveTrackingStyle.logoImage, {
                                flexDirection: 'row', justifyContent: "center", alignItems: "center"
                            }]}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}
                                onPress={() => this.refs.employeeModal.open()}>
                                <Text
                                    style={LiveTrackingStyle.employeeModalTextStyle}>
                                    {this.state.selctedEmployeeValue}

                                </Text>
                                <Iconic
                                    name="chevrons-down" size={14} color="black"
                                    style={{ marginTop: 4 }}>
                                </Iconic>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <StatusBar hidden={false} backgroundColor="rgba(0, 0, 0, 0.2)" />
                {this.renderMapView()}
                <Modal style={{
                    height: "85%",
                    width: "100%",
                    borderRadius: 10,
                    backgroundColor: '#EBEBEB',
                    marginTop: "10%"
                }}
                    position={"center"} ref={"employeeModal"} isDisabled={this.state.isDisabled}
                    backdropPressToClose={false}
                    swipeToClose={false}
                >
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={{ padding: 10 }}></Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ padding: 10, fontSize: 18 }}>Select Employee</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.employeeModal.close()} style={{
                                marginLeft: 0, marginTop: 0,
                            }}>
                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                    source={require('../../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingVertical: 0, }}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ height: "90%" }}>
                            <View style={{ flex: 1, padding: 10, }}>
                                <TouchableOpacity onPress={() => this.closeEmployeeModalForAll()}>
                                    <View style={LiveTrackingStyle.FlatlistMainView}>
                                        <View>
                                            <Text style={LiveTrackingStyle.EmpText}>
                                                All Employee
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <FlatList
                                    data={this.state.employeeList}
                                    keyExtractor={(x, i) => i.toString()}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => this.closeEmployeeModal(item)}>
                                            <View
                                                style={LiveTrackingStyle.FlatlistMainView}>

                                                <View>
                                                    <Text style={LiveTrackingStyle.EmpText}>
                                                        Name: {item.EmployeeName}
                                                    </Text>
                                                    <Text style={LiveTrackingStyle.EmpText}>
                                                        Designation: {item.Designation}
                                                    </Text>
                                                    <Text style={LiveTrackingStyle.EmpText}>
                                                        Department: {item.Department}
                                                    </Text>
                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                    }
                                    ListHeaderComponent={this.renderSearchHeader()}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </Modal>


            </View>
        );
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
