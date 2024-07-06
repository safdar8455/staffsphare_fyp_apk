import React from 'react';
import {
    Platform, StatusBar, Dimensions,
    TouchableOpacity, View, Text,
    Image, ScrollView,
    BackHandler,
    RefreshControl,
    FlatList, StyleSheet,
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
import { Actions } from 'react-native-router-flux';
import * as actions from '../../../../common/actions';
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import {
    GetMyTodayAttendanceadmin,
    GetMovementDetailsadmin
} from '../../../../services/api/AttendanceService';

import { CommonStyles } from '../../../../common/CommonStyles';
import { ConvertUtcToLocalTime } from '../../../../common/commonFunction';

import call from 'react-native-phone-call'



export default class DailyAttendanceDetails extends React.Component {
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
        }
    }
    call = () => {
        //handler to make a call
        const args = {
            number: global.phoneNumber,
            prompt: false,
        };
        call(args).catch(console.error);
    }

    async componentDidMount() {
        await this.getEmpTrackInfo();
        await this.getEmpInfo();
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
                    res.result.map((userData, index) => {
                        var title = '';
                        var color = '';
                        var Note="";
                        if (userData.IsCheckInPoint) {
                            title = "Checked In";
                            color = "green";
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
                            "description":  userData.LogLocation+Note,
                            "circleColor": color
                        };
                        this.state.data.push(myObj);
                    });
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
                    console.log(res, "getEmpInfo");
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
        );
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
                <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#f5f7f9',
                    }}>
                    <View style={{ backgroundColor: '#ffffff' }}>
                        <View style={{ flexDirection: 'column' }}>
                            {this.renderTrackList()}
                           
                        </View>
                    </View>
                </View>
            </ScrollView>
         
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
