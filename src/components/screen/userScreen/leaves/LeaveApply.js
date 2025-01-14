import React, { Component } from 'react';

import {
    Text, View, Platform, Image,
    StatusBar, ScrollView, Dimensions,
    BackHandler, TouchableOpacity,
    KeyboardAvoidingView, TextInput,
    AsyncStorage, ToastAndroid, NetInfo,
} from 'react-native';


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { CommonStyles } from '../../../../common/CommonStyles';

import Modal from 'react-native-modalbox';

import { Actions, Scene } from 'react-native-router-flux';

import DateTimePicker from '@react-native-community/datetimepicker'

import { LeaveApplyStyle, } from './LeaveApplyStyle';
import { LeaveListStyle } from './LeaveListStyle';




import moment from 'moment'


import AntDesign from 'react-native-vector-icons/AntDesign'

import { createLeave } from '../../../../services/api/Leave';
import { GetLeaveStatusList } from '../../../../services/api/Leave';


const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;



export default class LeaveApply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            date1: new Date(),
            CompanyId: "",
            UserId: "",
            LeaveApplyFrom: "",
            LeaveApplyTo: "",
            IsHalfDay: false,
            LeaveTypeId: "",
            LeaveReason: "",
            CreatedAt: new Date(),
            IsApproved: false,
            IsRejected: false,
            RejectReason: "",
            ApprovedById: null,
            ApprovedAt: null,
            IsCorrection:null,
            leave: {
                LeaveArrayText: '',
                LeaveArrayValue: '',
            },
            LeaveArray: [],
            Id:0,
            show: false,
            show2: false,
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.onDateChange2 = this.onDateChange2.bind(this);
    }

    onDateChange2(event,date1) {
        date1 = date1 || this.state.date1;
        if(moment(moment(this.state.date).format("YYYY-MM-DD")).isSameOrBefore( moment(date1).format("YYYY-MM-DD"))){
            var dat = moment(date1).format("YYYY-MM-DD");
            var now=  moment(new Date()).format("YYYY-MM-DD");
            var res=  moment(dat).isSameOrAfter(now); 
              if (res) {
                this.setState({
                    date1: date1,
                    show2:false,
                });
              }else{
                  alert("You have select back date")
                  this.setState({
                    show2:false,
                });
              }
        }else{
            alert("To Date can not be Back date than From date")
            this.setState({
                show2:false,
            });
        }
       
    }
    show=()=>{
        this.setState({show:true})
    }
    show2=()=>{
        this.setState({show2:true})
    }
    onDateChange(event, date) {
        date = date || this.state.date;
      var dat = moment(date).format("YYYY-MM-DD");
      var now=  moment(new Date()).format("YYYY-MM-DD");
      var res=  moment(dat).isSameOrAfter(now); 
        if (res) {
            this.setState({
                show: false,
                date:date,
              });
        }else{
            alert("You have select back date")
            this.setState({
                show: false,
              });
        }
    }

    getStatus = async () => {
        try {

            await GetLeaveStatusList()
                .then(res => {
                    this.setState({ LeaveArray: res.result, });
                    console.log(res.result, "statusList");
                })
                .catch(() => {

                    console.log("error occured");
                });

        } catch (error) {

            console.log(error);
        }
    }

    handleBackButton = () => {
        this.goBack();
        return true;
    }

    goBack() {
        Actions.pop({ refresh: {} });
    }

    async componentDidMount() {
        this.getStatus();
        const uId = await AsyncStorage.getItem("userId");
        const cId = await AsyncStorage.getItem("companyId");
        this.setState({ UserId: uId, CompanyId: cId });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    LeaveTypeDropDown(value, text) {

        this.setState(Object.assign(this.state.leave, { LeaveArrayText: value }));

        this.setState(Object.assign(this.state.leave, { LeaveArrayValue: text }));

        this.refs.LeaveTypeModal.close()
    }

    async createLeave() {

        if (this.state.taskTitle !== "") {
            let leaveModel = {
                Id: this.state.Id,
                UserId: this.state.UserId,
                LeaveApplyFrom: moment(new Date(this.state.date)).format('YYYY-MM-DD HH:mm:ss a'),
                LeaveApplyTo: moment(new Date(this.state.date1)).format('YYYY-MM-DD HH:mm:ss a'),
                IsHalfDay: this.state.IsHalfDay,
                LeaveTypeId: this.state.leave.LeaveArrayText,
                LeaveReason: this.state.LeaveReason,
                CreatedAt: this.state.CreatedAt,
                IsApproved: this.state.IsApproved,
                IsRejected: this.state.IsRejected,
                RejectReason: this.state.RejectReason,
                ApprovedById: this.state.ApprovedById,
                ApprovedAt: this.state.ApprovedAt,
                IsCorrection: this.state.IsCorrection,
            };
            console.log("leaveModel", leaveModel);
            if(moment(moment(this.state.date).format("YYYY-MM-DD")).isSameOrBefore( moment(this.state.date1).format("YYYY-MM-DD"))){
            if (leaveModel.LeaveTypeId != "") {
                if (leaveModel.LeaveReason != "") {
                    let response = await createLeave(leaveModel);
                    if(response.result.Success){
                        ToastAndroid.show('Leave applied successfully', ToastAndroid.TOP);
                        this.goBack();
                    }else{
                        ToastAndroid.show('Something went wrong, please try again', ToastAndroid.TOP);
                    }
                   
                }
                else {
                    ToastAndroid.show('Please Enter Reason', ToastAndroid.TOP);
                }
            }
            else {
                ToastAndroid.show('Please select Leave Type', ToastAndroid.TOP);
            }
        }
            else{
                ToastAndroid.show('To Date can not be Back date than From date', ToastAndroid.TOP);
            }
        }

    }

    renderLeaveArrayList() {
        let content = this.state.LeaveArray.map((arraytext, i) => {
            arraytext
            return (
                <TouchableOpacity
                    style={{
                        paddingVertical: 4, borderBottomColor: '#D5D5D5',
                        borderBottomWidth: 2, overflow:'scroll',
                    }}
                    key={i}
                    onPress={() => { this.LeaveTypeDropDown(arraytext.Id, arraytext.Name) }}>
                    <Text style={LeaveApplyStyle.renderLeaveArrayListTextStyle}
                        key={arraytext.Id}>{arraytext.Name}
                    </Text>
                </TouchableOpacity>
            )
        });
        return content;
    }
    render() {
        var { width, height } = Dimensions.get('window');
        const {date, show, show2, date1} = this.state;
        return (
            <View style={LeaveApplyStyle.container}>
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
                                Leave Apply
                            </Text>
                        </View>
                    </View>
                    <View
                        style={LeaveListStyle.ApplyButtonContainer}>
                        <TouchableOpacity
                            onPress={() => this.createLeave()}
                            style={LeaveListStyle.ApplyButtonTouch}>
                            <View style={LeaveListStyle.plusButton}>
                                <MaterialCommunityIcons name="content-save" size={Platform.OS==='ios'? 15.3 : 17.5} color="#ffffff" />
                            </View>
                            <View style={LeaveListStyle.ApplyTextButton}>
                                <Text style={LeaveListStyle.ApplyButtonText}>
                                    REQUEST
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1, }}>
                        <ScrollView showsVerticalScrollIndicator={false}
                            keyboardDismissMode="on-drag"
                            style={{ flex: 1, }}>
                            <View
                                style={LeaveApplyStyle.mainBodyStyle}>
                                <View
                                    style={LeaveApplyStyle.mainBodyTopStyle}>
                                    <Text
                                        style={LeaveApplyStyle.fromTextStyle}>
                                        from:
                                    </Text>
                                    <Text
                                        style={LeaveApplyStyle.toTextStyle}>
                                        To:
                                    </Text>
                                </View>

                                <View
                                    style={LeaveApplyStyle.datePickerRowStyle}>
                                    <View
                                        style={LeaveApplyStyle.datePickerLeftStyle}>
                                        <TouchableOpacity
                                        onPress={this.show}
                                         style={{
                                            borderRadius: 8,
                                            backgroundColor: "#f5f7fb",
                                            height: 30,
                                            width: '90%',
                                            marginRight: 25
                                        }}>
                                            <Text style={{ color: "#848f98",
                                                    fontFamily: "Montserrat_SemiBold",
                                                    fontWeight: "bold",
                                                    fontStyle: "normal",
                                                    padding: 5,}}>{moment(this.state.date).format("YYYY-MM-DD")}</Text>
                                        </TouchableOpacity>
                                        
                                        {
                                        show && <DateTimePicker value={date}
                                            is24Hour={false}
                                            display="default"
                                            mode='date'
                                            onChange={this.onDateChange} />
                                        }
                                    </View>
                                    <View
                                        style={LeaveApplyStyle.datePickerRightStyle}>
                                        <TouchableOpacity 
                                        onPress={() => this.show2()}
                                        style={{
                                            borderRadius: 8,
                                            backgroundColor: "#f5f7fb",
                                            height: 30,
                                            width: '82%',
                                            marginRight: 25,
                                        }}>
                                            <Text style={{
                                                color: "#848f98",
                                                fontFamily: "Montserrat_SemiBold",
                                                fontWeight: "bold",
                                                fontStyle: "normal",
                                                padding: 5,
                                            }}>{moment(this.state.date1).format("YYYY-MM-DD")}</Text>
                                        </TouchableOpacity>
                                        {show2 && <DateTimePicker value={date1}
                                            is24Hour={false}
                                            display="default"
                                            mode='date'
                                            onChange={this.onDateChange2} />}
                                    </View>
                                </View>
                                <View
                                    style={LeaveApplyStyle.leaveTypeRowStyle}>
                                    <Text
                                        style={LeaveApplyStyle.leaveTypeRowTextStyle}>
                                        Leave Type:
                                    </Text>
                                </View>
                                <View
                                    style={LeaveApplyStyle.leaveDropDownRow}>
                                    <TouchableOpacity
                                        style={LeaveApplyStyle.leaveDropDownStyle}
                                        onPress={() => this.refs.LeaveTypeModal.open()}>
                                        <Text
                                            style={LeaveApplyStyle.leaveDropDownText}>
                                            {this.state.leave.LeaveArrayValue == '' ? "Leave type" : this.state.leave.LeaveArrayValue}
                                        </Text>
                                        <AntDesign
                                            name="caretdown"
                                            style={LeaveApplyStyle.leaveDropDownIconStyle}
                                            size={14} color="#848f98">
                                        </AntDesign>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={LeaveApplyStyle.leaveCauseRow}>
                                    <Text
                                        style={LeaveApplyStyle.leaveCauseText}>
                                        Cause:
                                    </Text>
                                </View>
                                <View
                                    style={LeaveApplyStyle.leaveTextInputRow}>
                                    <TextInput
                                        style={LeaveApplyStyle.leaveCauseTextInputStyle}
                                        multiline={true}
                                        placeholderTextColor="#cbcbcb"
                                        placeholder="write cause here"
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        onChangeText={text => this.setState({ LeaveReason: text })}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <Modal
                        style={LeaveApplyStyle.leaveTypeModalMainStyle}
                        position={"center"} ref={"LeaveTypeModal"}
                        isDisabled={this.state.isDisabled}
                        backdropPressToClose={false}
                        onOpened={() => this.setState({ floatButtonHide: true })}
                        onClosed={() => this.setState({ floatButtonHide: false })}
                        swipeToClose={false}>
                        <View>
                            <View
                                style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                <View style={{ alignItems: "flex-start" }}>
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <TouchableOpacity
                                        style={{ padding: 5, }}
                                        onPress={() => this.refs.LeaveTypeModal.close()}>
                                        <AntDesign name="closecircle"
                                            size={30} color="black">
                                        </AntDesign>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View
                            // style={{ paddingVertical: 20, }}
                            >
                                <ScrollView showsVerticalScrollIndicator={true}
                                    style={{ height: (height * 50) / 100,}}>
                                    <View style={{ width: "100%",overflow:'scroll' }} >
                                        {this.state.LeaveArray != null ?
                                            this.renderLeaveArrayList()
                                            : <Text>No Leave Selected</Text>}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View >
        )
    }
}


