import React, { Component } from 'react';

import {
    Platform, StatusBar, Dimensions, RefreshControl,TextInput,
    TouchableOpacity, View, Text, FlatList, Image, ScrollView,
    ActivityIndicator, AsyncStorage, BackHandler, Alert,
} from 'react-native';

import Modal from 'react-native-modalbox';

import {
    DailyAttendanceCombo, MyPanelCombo,
    MyTaskCombo, LeaveListCombo,
    BillsCombo, ExpensesCombo, NoticeCombo,
    drawerSelectedOption
} from '../../../menuDrawer/UserDrawerContent';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SearchBar } from 'react-native-elements';

import { Actions } from 'react-native-router-flux';

import * as actions from '../../../../common/actions';

import { GetUserPendingLeaves, LeaveApproved,leaveCorrection } from '../../../../services/api/Leave';

import { LeaveListStyle } from './LeaveListStyle';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;

function StatusBarPlaceHolder() {
    return (
        <View style={{
            width: "100%",
            height: STATUS_BAR_HEIGHT,
            backgroundColor: '#4c52c3',
        }}>
            <StatusBar />
        </View>
    );
}
export default class ApproveLeaveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leaveList: [],
            progressVisible: true,
            refreshing: false,
            userId: "",
            // selectedId: '',
            RejectReason: null,
            RequestNo:null,
            SerialNo:null,
        }
    }
    _onRefresh = async () => {
        this.setState({ refreshing: true });
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);

        this.GetUserPendingLeaves(this.state.userId, false);
    };
    goBack() {
        DailyAttendanceCombo();
    }
    async componentDidMount() {

        // global.DrawerContentId = 4;
        const uId = await AsyncStorage.getItem("userId");
        this.setState({ userId: uId });
        this.GetUserPendingLeaves(uId, true);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    async componentWillReceiveProps() {
        this.GetUserPendingLeaves(this.state.userId, true);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }
    leaveApprove = async (item) => {
        let leaveModel = {
            RequestNo: item.RequestNo,
            ApproverSerialId: item.ApproverSerialId,
            IsApproved: true,
            IsRejected: false,
            RejectReason: null,
        };
        await LeaveApproved(leaveModel)
            .then(res => {
                this.GetUserPendingLeaves(this.state.userId, true);
            })
            .catch(() => {
                this.setState({ progressVisible: false });
                console.log("error occured");
            });
    }
    openReasonModal(item){
        this.setState({RequestNo:item.RequestNo})
        this.setState({ApproverSerialId:item.ApproverSerialId})
        this.refs.modalReason.open() 
    }
    async closemodalReason() {
        this.setState({ progressVisible: true })
        if (this.state.RejectReason == null) {
            alert("Reason can not be empty")
        }
        else {
            // alert("popup go");
            this.refs.modalReason.close();
            await this.leaveReject();
        }
    }
    leaveReject = async () => {
        let leaveModel = {
            RequestNo: this.state.RequestNo,
            ApproverSerialId: this.state.ApproverSerialId,
            IsApproved: false,
            IsRejected: true,
            RejectReason: this.state.RejectReason,
        };
        await LeaveApproved(leaveModel)
            .then(res => {
                this.GetUserPendingLeaves(this.state.userId, true);
            })
            .catch(() => {
                this.setState({ progressVisible: false });
                console.log("error occured");
            });
    }
    leaveCorrection = async (item) => {
        await leaveCorrection(item.Id)
            .then(res => {
                this.GetUserPendingLeaves(this.state.userId, true);
            })
            .catch(() => {
                this.setState({ progressVisible: false });
                console.log("error occured");
            });

        this.GetUserPendingLeaves(this.state.userId, true);
    }
    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                style={{ position: 'absolute', zIndex: 1 }}
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
    GetUserPendingLeaves = async (userId, isProgress) => {
        try {
            this.setState({ progressVisible: isProgress });
            await GetUserPendingLeaves(userId)
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
    goToCorrection(item) {
        actions.push("LeaveCorrection", { Model: item });
    }
    render() {
        var { width, height } = Dimensions.get('window');
        return (
            <View style={LeaveListStyle.container}>
                <StatusBarPlaceHolder />

                <View
                    style={LeaveListStyle.HeaderContent}>
                    <View
                        style={LeaveListStyle.HeaderFirstView}>
                        <TouchableOpacity
                            style={LeaveListStyle.HeaderMenuicon}
                            onPress={() => { Actions.drawerOpen(); }}>
                            <Image resizeMode="contain" style={LeaveListStyle.HeaderMenuiconstyle}
                                source={require('../../../../assets/images/menu_b.png')}>
                            </Image>
                        </TouchableOpacity>
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
                        <TouchableOpacity
                            onPress={() => Actions.LeaveApply()}
                            style={LeaveListStyle.ApplyButtonTouch}>
                            <View style={LeaveListStyle.plusButton}>
                                <FontAwesome
                                    name="plus" size={Platform.OS === 'ios' ? 16.6 : 18} color="#ffffff">
                                </FontAwesome>
                            </View>
                            <View style={LeaveListStyle.ApplyTextButton}>
                                <Text style={LeaveListStyle.ApplyButtonText}>
                                    LEAVE
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 1, marginTop: 5, }}>

                    {this.state.progressVisible == true ? (<ActivityIndicator size="large"
                        color="#1B7F67" style={LeaveListStyle.loaderIndicator} />) : null}


                    <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                    >
                        <View style={{ flex: 1, }}>

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
                                        <View style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: .4, padding: 8, paddingLeft: 0 }}>

                                            <Text style={{ fontFamily: 'Montserrat_SemiBold', fontSize: 14 }}>{item.EmployeeName}</Text>
                                        </View>
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

                                        {(item.StatusId==1 && !item.IsCorrection) ?
                                            <View
                                                style={LeaveListStyle.buttonContainer}
                                            >
                                                <View style={LeaveListStyle.foraligmentitem}>
                                                    <TouchableOpacity
                                                        onPress={() => this.leaveApprove(item)}
                                                        style={LeaveListStyle.buttonTouchable}
                                                    >
                                                        <Text style={LeaveListStyle.approveText}>
                                                            APPROVE
                                      </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() => this.openReasonModal(item)}

                                                        style={LeaveListStyle.rejectButtonTouchable}
                                                    >
                                                        <Text
                                                            style={LeaveListStyle.rejectText}
                                                        >
                                                            REJECT
                                      </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.leaveCorrection(item)}

                                                        style={LeaveListStyle.correctionButtonTouchable}
                                                    >
                                                        <Text
                                                            style={LeaveListStyle.rejectText}
                                                        >
                                                            CORRECTION
                                      </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {/* <Text style={LeaveListStyle.statusDate}>
                                                    {item.LeaveInDays} Days

                                               </Text> */}
                                           
                                                <Text
                                                    style={LeaveListStyle.statusDate1}>
                                                    {item.LeaveInDays} Days

                                                </Text>
                                          
                                            </View>
                                            :
                                            <View
                                                style={LeaveListStyle.statusButton}>
                                                <View
                                                    style={LeaveListStyle.statusButtonInner}>

                                                    {item.StatusId == 2 ? (<Text style={{ color: 'green', }}>Approved</Text>) : (item.StatusId == 3 ? (<Text style={{ color: 'red', }}>Rejected</Text>) : (<Text style={{ color: '#f1b847', }}>Correction</Text>))}

                                                </View>

                                                {/* <Text
                                                    style={LeaveListStyle.statusDate}
                                                >
                                                    {item.LeaveInDays} Days

                                                </Text> */}
                                                <View style={LeaveListStyle.daysBox}>
                                                    <Text
                                                        style={LeaveListStyle.statusDate}>
                                                        {item.LeaveInDays} Days

                                                </Text>
                                                </View>
                                            </View>
                                        }
                                    </View>

                                }
                                ListHeaderComponent={this.renderHeader()}
                            />
                        </View>
                    </ScrollView>



                </View>
                <Modal style={{
                    height: 190,
                    width: "83%",
                    borderRadius: 20,
                }} position={"center"}
                    ref={"modalReason"} isDisabled={this.state.isDisabled}
                    onOpened={() => this.setState({ floatButtonHide: true })}>


                    <View style={{ justifyContent: "space-between", flexDirection: "column" }}>
                        <View style={{ alignItems: "flex-start" }}></View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.modalReason.close()}
                                style={{ marginLeft: 0, marginTop: 0}}>


                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                                </Image>

                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{paddingVertical: 10,justifyContent:'center'}}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16,textAlign:'center' }}>
                        Please state reason
                            </Text>


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
                            placeholder="Write Your Reason"
                            placeholderTextColor="#cbcbcb"
                            returnKeyType="next" autoCorrect={false}
                            onChangeText={(text) => this.setState({ RejectReason: text })}
                        />
                        <TouchableOpacity style={{
                            backgroundColor: '#3D3159',
                            padding: 10,
                            width: 120,
                            alignSelf: 'center',
                            borderRadius: 20,
                            marginTop: "3%",
                            alignItems: 'center',
                        }}
                            onPress={() => this.closemodalReason()} >
                            <Text style={{ color: 'white', fontWeight: 'bold'}}>
                               Save
                                </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
           
           
            </View>
        );
    }
}

