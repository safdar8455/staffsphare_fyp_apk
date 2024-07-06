import React, { Component } from 'react';
import {
    FlatList, Text, View, Image, StatusBar,
    TouchableOpacity, Platform,
    RefreshControl, AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import AntDesign from 'react-native-vector-icons/AntDesign'

import { DailyAttendanceStyle } from './DailyAttendanceStyle';

import{GetAttendanceFeed} from '../../../../services/api/AttendanceService'
import { urlDev, urlResource } from '../../../../services/configuration/config';


export default class UserAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeList: [],
            employeeDetail: {},
            statusCount: { TotalEmployee: 0, TotalCheckIn: 0, TotalCheckOut: 0 },
            refreshing: false,
            selectedId: 1,
            displayAbleEmployeeList: [],
            UserId: 0,
        }
    }

    _onRefresh = async () => {
        this.setState({
            refreshing: true,
            selectedId: 1
        })
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);

        this.getAttendanceFeed();
    }

    setSelectedOption = (id) => {
        this.setState({ selectedId: id });
        switch (id) {
            case 1: //All
                this.setState({ displayAbleEmployeeList: this.state.employeeList });
                break;
            case 2: //checked in
                this.setState({ displayAbleEmployeeList: this.state.employeeList.filter(x => x.IsCheckedIn) });
                break;
            case 3: //not attend
                this.setState({ displayAbleEmployeeList: this.state.employeeList.filter(x => x.NotAttend) });
                break;
            case 3: //not attend
                this.setState({ displayAbleEmployeeList: this.state.employeeList.filter(x => x.NotAttend) });
                break;
        }
    };

    async  componentDidMount() {
     
        const UserId =await AsyncStorage.getItem("userId");
        this.setState({ UserId: UserId});
        console.log("UserId", this.state.UserId);

        this.getAttendanceFeed();
    }

    getAttendanceFeed = async () => {
        await GetAttendanceFeed()
            .then(res => {
                var cEmployee=res.result.EmployeeList.filter(x => x.UserId === this.state.UserId);

                if(cEmployee==null){
                    Actions.login();
                }

                this.setState({
                    employeeList: res.result.EmployeeList.filter(x => x.UserId != this.state.UserId),
                    displayAbleEmployeeList: res.result.EmployeeList,
                    statusCount: res.result.StatusCount,
                    employeeDetail: res.result.EmployeeList
                        .filter(x => x.UserId === this.state.UserId)[0]

                });
                console.log(res.result.EmployeeList, "employeeDetail....");
                

            }).catch(() => { console.log("error occured"); });
    }
    renderStatusList() {
        return (
            <View style={DailyAttendanceStyle.countBoxContainer}>
                <TouchableOpacity onPress={() => this.setSelectedOption(1)}>
                    <View style={DailyAttendanceStyle.countBoxColumn1}>
                        <Text
                            style={this.state.selectedId == 1 ?
                                DailyAttendanceStyle.countBoxColumn1NumberActive :
                                DailyAttendanceStyle.countBoxColumn1NumberInactive}>
                            {this.state.statusCount.TotalEmployee}
                        </Text>
                        <Text
                            style={this.state.selectedId == 1 ?
                                DailyAttendanceStyle.countBoxColumn1LabelActive :
                                DailyAttendanceStyle.countBoxColumn1LabelInactive}>
                            TOTAL
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setSelectedOption(2)}>
                    <View style={DailyAttendanceStyle.countBoxColumn2}>
                        <Text style={
                            this.state.selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2NumberActive :
                                DailyAttendanceStyle.countBoxColumn2NumberInactive}>
                            {this.state.statusCount.TotalCheckIn}
                        </Text>
                        <Text style={
                            this.state.selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2LabelActive
                                :
                                DailyAttendanceStyle.countBoxColumn2LabelInactive}>
                            PRESENT
                    </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setSelectedOption(3)}>
                    <View style={DailyAttendanceStyle.countBoxColumn3}>
                        <Text style={
                            this.state.selectedId == 3 ?
                                DailyAttendanceStyle.countBoxColumn3NumberActive :
                                DailyAttendanceStyle.countBoxColumn3NumberInactive
                        }
                        >
                            {this.state.statusCount.TotalNotAttend}
                        </Text>
                        <Text style={
                            this.state.selectedId == 3 ? DailyAttendanceStyle.countBoxColumn3LabelActive
                                :
                                DailyAttendanceStyle.countBoxColumn3LabelInactive}
                        >
                           ABSENT
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        );

    }

    render() {
        return (
            <View style={DailyAttendanceStyle.container}>
              
                <View
                    style={DailyAttendanceStyle.HeaderContent}>
                    <View
                        style={DailyAttendanceStyle.HeaderFirstView}>
                        <TouchableOpacity
                            style={DailyAttendanceStyle.HeaderMenuicon}
                            onPress={() => { Actions.drawerOpen(); }}>
                            <Image resizeMode="contain" style={DailyAttendanceStyle.HeaderMenuiconstyle}

                                  source={require('../../../../assets/images/menu_b.png')}
                                
                                >
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={DailyAttendanceStyle.HeaderTextView}>
                            <Text
                                style={DailyAttendanceStyle.HeaderTextstyle}>
                                TODAY'S FEED
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={[
                        DailyAttendanceStyle.FlatListTouchableOpacity,
                        style = {
                            padding: 10,
                            height: 100,

                            backgroundColor: "#f8f9fb"
                        }
                    ]}>
                    <View
                        style={
                            DailyAttendanceStyle.FlatListLeft
                        }>
                        <View style={{ paddingRight: 10, }}>
                            {this.state.employeeDetail!=null && this.state.employeeDetail.ImageFileName !== "" ? (
                                <Image resizeMode='cover' style={
                                    DailyAttendanceStyle.ImageLocal
                                } source={{ uri: urlResource + this.state.employeeDetail.ImageFileName }} />) :

                                (<Image style={
                                    DailyAttendanceStyle.ImagestyleFromServer
                                } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />)}


                            {this.state.employeeDetail.IsCheckedOut ? (<Image resizeMode="contain"
                                style={DailyAttendanceStyle.styleForonlineOfflineIcon}
                                source={require('../../../../assets/images/icon_gray.png')} />)
                                :
                                (this.state.employeeDetail.IsCheckedIn ?
                                    (<Image style={DailyAttendanceStyle.styleForonlineOfflineIcon
                                    } resizeMode='contain' source={require('../../../../assets/images/icon_green.png')} />)
                                    : (<Image style={
                                        DailyAttendanceStyle.styleForonlineOfflineIcon
                                    } resizeMode='contain' source={require('../../../../assets/images/icon_gray.png')} />))
                            }

                        </View>
                        <View style={DailyAttendanceStyle.RightTextView}>
                            <Text style={
                                DailyAttendanceStyle.NameText
                            }
                            >
                                {this.state.employeeDetail.EmployeeName}
                            </Text>
                            <Text style={
                                DailyAttendanceStyle.DesignationText
                            }
                            >
                                {this.state.employeeDetail.Designation}
                            </Text>
                            <Text style={
                                DailyAttendanceStyle.DepartmentText
                            }
                            >
                                {this.state.employeeDetail.DepartmentName}
                            </Text>
                        </View>
                    </View>
                    <View style={DailyAttendanceStyle.TimeContainer}>
                        <TouchableOpacity onPress={() => Actions.MyPanel()}>
                            <Image resizeMode="contain" style={{
                                width: 67,
                                height: 56
                            }}
                                source={require('../../../../assets/images/panelb.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>

            
                <View
                    style={
                        DailyAttendanceStyle.FlatListContainer
                    }>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        data={this.state.employeeList}
                        keyExtractor={(x, i) => i.toString()}
                        renderItem=
                        {({ item }) =>
                            <View
                                style={
                                    DailyAttendanceStyle.FlatListTouchableOpacity
                                }>
                                <View
                                    style={
                                        DailyAttendanceStyle.FlatListLeft
                                    }>
                                    <View style={{ paddingRight: 10, }}>
                                        {item.ImageFileName !== "" ?
                                            <Image resizeMode='cover' style={
                                                DailyAttendanceStyle.ImageLocal
                                            } source={{ uri: urlResource + item.ImageFileName }} /> : <Image style={
                                                DailyAttendanceStyle.ImagestyleFromServer
                                            } resizeMode='contain' source={require('../../../../assets/images/employee.png')} />}


                                        {item.IsCheckedOut ? (<Image resizeMode="contain"
                                            style={DailyAttendanceStyle.styleForonlineOfflineIcon}
                                            source={require('../../../../assets/images/icon_gray.png')} />)
                                            : (item.IsCheckedIn ?
                                                (<Image style={DailyAttendanceStyle.styleForonlineOfflineIcon
                                                } resizeMode='contain' source={require('../../../../assets/images/icon_green.png')} />)
                                                : (<Image style={
                                                    DailyAttendanceStyle.styleForonlineOfflineIcon
                                                } resizeMode='contain' source={require('../../../../assets/images/icon_gray.png')} />))
                                        }

                                    </View>
                                    <View style={DailyAttendanceStyle.RightTextView}>
                                        <Text style={
                                            DailyAttendanceStyle.NameText
                                        }
                                        >
                                            {item.EmployeeName}
                                        </Text>
                                        <Text style={
                                            DailyAttendanceStyle.DesignationText
                                        }
                                        >
                                            {item.Designation}
                                        </Text>
                                        <Text style={
                                            DailyAttendanceStyle.DepartmentText
                                        }
                                        >
                                            {item.DepartmentName}
                                        </Text>
                                    </View>
                                </View>
                                <View style={DailyAttendanceStyle.TimeContainer}>
                                    <View
                                        style={
                                            DailyAttendanceStyle.TimeContent
                                        }>
                                        <Text
                                            style={
                                                DailyAttendanceStyle.CheckintimeStyle
                                            }>
                                            {item.CheckInTimeVw !== "" ?
                                                (<AntDesign
                                                    name="arrowdown" size={10}
                                                    color="#07c15d"
                                                    style={DailyAttendanceStyle.AntDesignstyle}>
                                                </AntDesign>) : ("")}
                                        </Text>
                                        <Text style={
                                            DailyAttendanceStyle.CheckinTimeText
                                        }>
                                            {item.CheckInTimeVw !== "" ? item.CheckInTimeVw : ("")}</Text>

                                    </View>

                                    <View
                                        style={
                                            DailyAttendanceStyle.CheckOutTimeView
                                        }>
                                        <Text
                                            style={
                                                DailyAttendanceStyle.CheckOutTimetext
                                            }>
                                            {item.IsCheckedOut ?
                                                (<AntDesign
                                                    name="arrowup" size={10}
                                                    color="#a1d3ff"
                                                    style={
                                                        DailyAttendanceStyle.CheckOutTimeIconstyle
                                                    }>
                                                </AntDesign>) : ("")}
                                        </Text>
                                        <Text style={
                                            DailyAttendanceStyle.CheckOutTimeText
                                        }>{item.IsCheckedOut ? item.CheckOutTimeVw : ("")}</Text>
                                    </View>
                                </View>
                            </View>

                        }>
                        
                    </FlatList>
                </View>

            </View >
        )
    }
}
