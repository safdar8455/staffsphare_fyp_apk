import React, { Component } from 'react';

import {
Platform, StatusBar, Dimensions, RefreshControl,
TouchableOpacity, View, Text, FlatList, Image, ScrollView,
ActivityIndicator, AsyncStorage, BackHandler, Alert,
} from 'react-native';


import {
DailyAttendanceCombo, MyPanelCombo,
MyTaskCombo, LeaveListCombo,
BillsCombo, ExpensesCombo, NoticeCombo,
drawerSelectedOption
} from '../../../menuDrawer/UserDrawerContent';

import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { Actions } from 'react-native-router-flux';

import * as actions from '../../../../common/actions';

import { GetUserLeaves } from '../../../../services/api/Leave';

import { LeaveListStyle } from './LeaveListStyle';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;

export default class UserLeaveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leaveList: [],
            progressVisible: true,
            refreshing: false,
            userId: "",
            // selectedId: '',
        }
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);

        this.GetUserLeaves(this.state.userId, false);
    };
    goBack() {
        DailyAttendanceCombo();
    }
    async componentDidMount() {

        // global.DrawerContentId = 4;
        const uId = await AsyncStorage.getItem("userId");
        this.setState({ userId: uId });
        this.GetUserLeaves(uId, true);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    async componentWillReceiveProps() {
        this.GetUserLeaves(this.state.userId, true);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    GetUserLeaves = async (userId, isProgress) => {
        try {
            this.setState({ progressVisible: isProgress });
            await GetUserLeaves(userId)
                .then(res => {
                    console.log(res, '$$$$$$$$$$$$$')
                    this.setState({ leaveList: res.result, progressVisible: false });
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
    goToCorrection(item){
        actions.push("LeaveCorrection", { Model: item});
    }
    render() {
        var { width, height } = Dimensions.get('window');
        return (
            <View style={LeaveListStyle.container}>
              

                <View
                    style={LeaveListStyle.HeaderContent}>
                    <View
                        style={LeaveListStyle.HeaderFirstView}>                     
                        <View
                            style={LeaveListStyle.HeaderTextView}>
                            <Text
                                style={LeaveListStyle.HeaderTextstyle}>
                                LEAVE LIST
                            </Text>
                        </View>
                    </View>
                    <View
                        style={LeaveListStyle.ApplyButtonContainer}>
                    </View>
                </View>

                <View style={{ flex: 1, marginTop: 5, }}>

                    {this.state.progressVisible == true ? (<ActivityIndicator size="large"
                        color="#1B7F67" style={LeaveListStyle.loaderIndicator} />) : null}

                    <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }>
                        <View style={{
                            flex: 1,
                            // padding: 10, 
                        }}>

                            <FlatList
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />
                                }
                                data={this.state.leaveList}
                                keyExtractor={(x, i) => i.toString()}
                                renderItem={({ item }) =>
                                    <View
                                        style={LeaveListStyle.listContainer}
                                    >
                                        <View style={LeaveListStyle.listInnerContainer}>
                                            <Text style={LeaveListStyle.leaveType}>

                                                Cause:
                                            </Text>
                                            <Text style={LeaveListStyle.leaveFrom}>
                                                From:

                                            </Text>
                                        </View>

                                        <View style={LeaveListStyle.leaveReasonContainer}>
                                            <Text
                                                style={[LeaveListStyle.leaveReasonText,
                                                { fontFamily: 'Montserrat_SemiBold' }]}>

                                                {item.LeaveReason}
                                            </Text>
                                            <Text
                                                style={LeaveListStyle.reasonFromDate}>
                                                {item.FromDateVw}


                                            </Text>
                                        </View>
                                        <View
                                            style={LeaveListStyle.causeContainer}>
                                            <Text
                                                style={LeaveListStyle.causeText}>

                                                Leave Type:
                                            </Text>
                                            <Text
                                                style={LeaveListStyle.leaveToText}>
                                                To:
                                            </Text>
                                        </View>

                                        <View
                                            style={LeaveListStyle.detailsContainer}>
                                            <Text
                                                style={LeaveListStyle.reasonFromDate}>
                                                {item.LeaveType}

                                            </Text>
                                            <Text
                                                style={LeaveListStyle.detailsTextInner}>
                                                {item.ToDateVw}
                                            </Text>
                                        </View>




                                        {(item.ApprovedBy != null && item.ApprovedBy != '') ?
                                            <View
                                                style={LeaveListStyle.approvedByContainer}>
                                                <Text
                                                    style={LeaveListStyle.approvedByText}>
                                                    Approved By: {item.ApprovedBy}
                                                </Text>
                                                <Text
                                                    style={LeaveListStyle.approvedAtText}>
                                                    Approved At: {item.ApprovedAtVw}
                                                </Text>
                                            </View>
                                            : null}
                                        <View
                                            style={LeaveListStyle.statusButton}>
                                            <View
                                                style={LeaveListStyle.statusButtonInner}>

                                                {item.IsApproved ?
                                                    (<Text style={{ color: 'green', }}>
                                                        Approved
                                                    </Text>) :
                                                    (item.IsRejected
                                                        ? (<Text style={{ color: 'red', }}>
                                                            Rejected
                                                        </Text>) :
                                                      (<Text style={{ color: '#f1b847', }}>
                                                            Pending
                                                        </Text>))}

                                            </View>
                                            <View style={LeaveListStyle.daysBox}>
                                                <Text
                                                    style={LeaveListStyle.statusDate}>
                                                    {item.LeaveInDays} Days

                                                </Text>
                                            </View>
                                        </View>
                               
                               
                                    </View>

                                }
                            />
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                            onPress={() => Actions.LeaveApply()}
                            style={{
                                borderWidth:1,
                                borderColor:'rgba(0,0,0,0.2)',
                                alignItems:'center',
                                justifyContent:'center',
                                width:70,
                                position: 'absolute',                                          
                                bottom: 10,                                                    
                                right: 10,
                                height:70,
                                backgroundColor:'#2B65EC',
                                borderRadius:100,
                              }}>
                            <View style={LeaveListStyle.roundPlusButton}>
                                <FontAwesome
                                    name="plus" size={Platform.OS === 'ios' ? 16.6 : 18} color="#fff">
                                </FontAwesome>
                            </View>
           
                        </TouchableOpacity>
                </View>
            </View>
        );
    }
}

