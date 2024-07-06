import React, { Component } from 'react';
import {
    FlatList, Text, View, Image, StatusBar, TouchableOpacity, ScrollView,
    Platform, RefreshControl, AsyncStorage, BackHandler, Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { CommonStyles } from '../../../../common/CommonStyles';
import { DailyAttendanceStyle } from './DailyAttendanceStyle';
import * as actions from '../../../../common/actions';

import { GetAttendanceFeed } from '../../../../services/api/AttendanceService';
import { urlDev, urlResource } from '../../../../services/configuration/config';
import Icon from 'react-native-vector-icons/AntDesign'


export default class AdminTodayAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeList: [],
            statusCount: { TotalEmployee: 0, TotalCheckIn: 0, TotalCheckOut: 0 },
            refreshing: false,
            selectedId: 1,
            displayAbleEmployeeList: [],
            isModelVisible: false,
            ZoomImage:""
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
                this.setState({ displayAbleEmployeeList: this.state.employeeList.filter(x => x.IsCheckedIn || x.IsCheckedOut) });
                break;
            case 3: //not attend
                this.setState({ displayAbleEmployeeList: this.state.employeeList.filter(x => x.NotAttend) });
                break;
        }
    };

    async  componentDidMount() {
        this.getAttendanceFeed();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    goBack() {
        Actions.pop();
    }
    goToDetail(item) {
        global.aItemUserId = item.UserId;
        actions.push("DetailsContainer", { aItem: item });
    };
    getAttendanceFeed = async () => {
        await GetAttendanceFeed()
            .then(res => {
                this.setState({
                    employeeList: res.result.EmployeeList,
                    displayAbleEmployeeList: res.result.EmployeeList,
                    statusCount: res.result.StatusCount
                });
                console.log(res.result.EmployeeList, 'emplist');

            }).catch(() => { 
            
            });
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
                            EMPLOYEE
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setSelectedOption(2)}>
                    <View style={DailyAttendanceStyle.countBoxColumn2}>
                        <Text
                            style={this.state.selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2NumberActive :
                                DailyAttendanceStyle.countBoxColumn2NumberInactive}>
                            {this.state.statusCount.TotalCheckIn}
                        </Text>
                        <Text
                            style={this.state.selectedId == 2 ?
                                DailyAttendanceStyle.countBoxColumn2LabelActive :
                                DailyAttendanceStyle.countBoxColumn2LabelInactive}>
                            PRESENT
                    </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setSelectedOption(3)}>
                    <View style={DailyAttendanceStyle.countBoxColumn3}>
                        <Text
                            style={this.state.selectedId == 3 ?
                                DailyAttendanceStyle.countBoxColumn3NumberActive :
                                DailyAttendanceStyle.countBoxColumn3NumberInactive
                            }
                        >
                            {this.state.statusCount.TotalNotAttend}
                        </Text>
                        <Text
                            style={this.state.selectedId == 3 ?
                                DailyAttendanceStyle.countBoxColumn3LabelActive :
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
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                       
                        <View
                        style={CommonStyles.HeaderTextView}>
                       <Text
                           style={CommonStyles.HeaderTextstyle}>
                         Attendance Feed
                       </Text>
                   </View>
                    </View>
                </View>
                <View
                    style={
                        DailyAttendanceStyle.ListContainer
                    }>
                    {this.renderStatusList()}
                </View>
                <View
                    style={
                        DailyAttendanceStyle.FlatListContainer
                    }>
                    {/* <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        data={this.state.displayAbleEmployeeList}
                        keyExtractor={(x, i) => i.toString()}
                        numColumns={2}
                        renderItem={({ item }) =>
                           
                                <View style={
                                    DailyAttendanceStyle.FlatListTouchableOpacity1
                                }>

                                <TouchableOpacity onPress={() => this.goToDetail(item)}>
                                    <View
                                        style={
                                            DailyAttendanceStyle.FlatListAttendanceLeft
                                        }>
        
                                        <View style={DailyAttendanceStyle.InTimeContainer}>
                                           
                                            <View style={{alignItems:'center'}}>

                                          
                                                <Text style={
                                                    DailyAttendanceStyle.CheckinTimeText
                                                }>
                                                    {item.CheckInTimeVw !== "" ? item.CheckInTimeVw : ("")}
                                                   
                                                    </Text>
                                                    
                                                    </View>
                                        </View>

                                        <View style={DailyAttendanceStyle.ImageContainer}>
                                            {item.ImageFileName !== "" ?
                                                <Image resizeMode='cover' style={
                                                    DailyAttendanceStyle.ImageLocal
                                                } source={{ uri: urlResource + item.ImageFileName }} /> : <Image style={
                                                    DailyAttendanceStyle.ImagestyleFromServer
                                                } resizeMode='cover' source={require('../../../../assets/images/employee.png')} />}


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
                                        <View style={DailyAttendanceStyle.OutTimeContainer}>
                                            <View style={DailyAttendanceStyle.AttendanceImageView2}>

                                                <Text style={
                                                    DailyAttendanceStyle.CheckOutTimeText
                                                }>
                                                    
                                                    {item.IsCheckedOut ? item.CheckOutTimeVw : ("")}
                                                </Text>
                                               
                                            </View>
                                        </View>
                                      

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
                                   

                                </TouchableOpacity>                                                          
                             
                                </View>
                           
                        }>
                        
                    </FlatList>
             */}
                 <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        data={this.state.displayAbleEmployeeList}
                        keyExtractor={(x, i) => i.toString()}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.goToDetail(item)}>
                                <View style={
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
                                                } resizeMode='cover' source={require('../../../../assets/images/employee.png')} />}


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
                                                    (
                                                        <Icon
                                                            name="arrowdown" size={10}
                                                            color="#07c15d"
                                                            style={DailyAttendanceStyle.AntDesignstyle}>
                                                        </Icon>
                                                    ) : ("")}
                                            </Text>
                                            <Text style={
                                                DailyAttendanceStyle.CheckinTimeText
                                            }>
                                                {item.CheckInTimeVw !== "" ? item.CheckInTimeVw : ("")}{item.IsLate?" L":""}</Text>

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
                                                    (
                                                        <Icon
                                                            name="arrowup" size={10}
                                                            color="#a1d3ff"
                                                            style={
                                                                DailyAttendanceStyle.CheckOutTimeIconstyle
                                                            }>
                                                        </Icon>
                                                    ) : ("")}
                                            </Text>
                                            <Text style={
                                                DailyAttendanceStyle.CheckOutTimeText
                                            }>{item.IsCheckedOut ? item.CheckOutTimeVw : ("")}{item.IsEarly?" E":""}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }>
                        
                    </FlatList>
              
                </View>

            </View>
        )
    }
}

