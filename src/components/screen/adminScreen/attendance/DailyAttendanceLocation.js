import React from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import {
    GetMyTodayAttendanceadmin,
    GetMovementDetailsadmin
} from '../../../../services/api/AttendanceService';

import { CommonStyles } from '../../../../common/CommonStyles';



export default class DailyAttendanceLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DepartmentName: "",
            Designation: "",
            EmployeeName: "",
            UserId: "",
            Latitude: 0,
            Longitude: 0,
            LogLocation: '',
            EmpTrackList: [],
            data: [],
            markers: []
        }
    }


    async componentDidMount() {
        this.getEmpTrackInfo();
        this.getEmpInfo();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        Actions.AdminTodayAttendance();
        return true;
    }

    getEmpTrackInfo = async () => {
        try {
            await GetMovementDetailsadmin(global.aItemUserId)
                .then(res => {
                    this.setState({
                        EmpTrackList: res.result,
                    });
                    console.log('movement details', res.result)
                    res.result.map((userData, index) => {
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
                            "time": userData.LogTimeVw,
                            "title": title,
                            "description": userData.LogLocation,
                            "circleColor": color
                        };
                        var newMarkerObj = {
                            "title": title + " " + (index + 1),
                            "description": userData.LogLocation,
                            coordinates: {
                                "latitude": userData.Latitude,
                                "longitude": userData.Longitude
                            },
                        }
                        this.state.markers.push(newMarkerObj);
                    });
                    this.setState({
                        Longitude: res.result[res.result.length - 1].Longitude,
                        Latitude: res.result[res.result.length - 1].Latitude,
                        LogLocation: res.result[res.result.length - 1].LogLocation,
                    });

                    const tcount = 60 * res.result.length - 60;
                    this.setState({ svgLinHeight: tcount === 0 ? 60 : tcount });
                })
                .catch((ex) => {
                    console.log(ex, "GetMovementDetails error occured");
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    goBack() {
         Actions.AdminTodayAttendance();
    };

    getEmpInfo = async () => {
        try {

            await GetMyTodayAttendanceadmin(global.aItemUserId)
                .then(res => {
                    console.log(res.result, "getEmpInfo");
                    this.setState({ EmployeeName: res.result.EmployeeName, });
                    this.setState({ DepartmentName: res.result.DepartmentName, });
                    this.setState({ Designation: res.result.Designation, });
                    global.aItemEmployeeName = res.result.EmployeeName;

                })
                .catch(() => {
                    console.log("error occured");
                });

        } catch (error) {
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
    renderItem = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 0, height: 45 }}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ color: '#313131' }}>
                        {item.LogTimeVw}
                    </Text>
                </View>
                <Text style={{
                    marginLeft: 5, color: '#7d7d7d',
                    fontFamily: 'PRODUCT_SANS_REGULAR', width: 240,
                    textAlign: 'justify'
                }}>
                    Checked In at {item.LogLocation}
                </Text>
            </View>
        );
    }
    renderMapView() {
        var { width, height } = Dimensions.get('window');
        return (
            <View style={{
                flexDirection: 'column'
            }}>
                <View style={{ margin: 10 }}>
                    <MapView

                        provider={PROVIDER_GOOGLE}
                        style={{
                            height: (height * 80) / 100,
                        }}
                        showsUserLocation={true}
                        followUserLocation={true}
                        zoomEnabled={true}
                        region={{
                            latitude: this.state.Latitude,
                            longitude: this.state.Longitude,
                            latitudeDelta: 0.001200,
                            longitudeDelta: 0.001200 * .60
                        }}

                    >
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                                coordinate={marker.coordinates}
                                title={marker.title}
                                description={marker.description}
                            />
                        ))}
                                         </MapView>
                </View>
            </View>
        )
    }
    render() {
        var { width, height } = Dimensions.get('window');
        return (
            <View style={DailyAttendanceStyle.container}>
              
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        <TouchableOpacity
                            style={CommonStyles.HeaderMenuicon}
                            onPress={() => { this.goBack() }}>
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../../../assets/images/left_arrow.png')}>
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={CommonStyles.HeaderTextView}>
                            <Text
                                style={CommonStyles.HeaderTextstyle}>
                                {this.state.EmployeeName}

                            </Text>
                        </View>
                    </View>
                   
                </View>
                <StatusBar hidden={false} backgroundColor="rgba(0, 0, 0, 0.2)" />
                {this.renderMapView()}
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
