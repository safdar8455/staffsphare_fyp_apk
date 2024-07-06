import React, { Component } from 'react';
import {
    ScrollView, Text, View, Image, StatusBar, TextInput, ToastAndroid, Alert, Dimensions, ActivityIndicator,
    BackHandler, TouchableOpacity, Platform, KeyboardAvoidingView, AsyncStorage, FlatList, RefreshControl, NetInfo
} from 'react-native';
import { Modal as Modal1 } from 'react-native'
import { Actions } from 'react-native-router-flux';
import { TaskStyle } from './TaskStyle';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TaskStatus, SaveTask, deleteTask, PriorityList, GetTaskAttachments, EmployeeListCb,GetAllAssignTo} from '../../../../services/api/TaskService';
import { Menu, MenuItem, MenuDivider, Position } from "react-native-enhanced-popup-menu";
import { NoticeStyle } from '../notice/NoticeStyle'
import Modal from 'react-native-modalbox';
import moment from 'moment';
import { CommonStyles } from '../../../../common/CommonStyles';
import AntDesign from 'react-native-vector-icons/AntDesign'

import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as Permissions from 'expo-permissions';
import _ from "lodash";
import { urlDev, urlResource } from '../../../../services/configuration/config';
import SelectMultiple from 'react-native-select-multiple'

const { width, height } = Dimensions.get('window');

const options = {
    title: 'Select',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const refreshOnBack = () => {
    console.log(global.userType, 'type%%%%')
    if (global.userType == "admin") {
        // Actions.TabnavigationInTasks();
        Actions.pop({ refresh: {} });
    } else {
        Actions.userTask();
        Actions.CreateByMe();
    }
}
const numColumns = 2;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
// function StatusBarPlaceHolder() {
//     return (
//         <View style={{
//             width: "100%",
//             height: STATUS_BAR_HEIGHT,
//             backgroundColor: '#4c52c3',
//         }}>
//             <StatusBar />
//         </View>
//     );
// }
const renderLabel = (label, style) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{width: 42, height: 42}} source={{uri: 'https://dummyimage.com/100x100/52c25a/fff&text=S'}} />
        <View style={{marginLeft: 10}}>
          <Text style={style}>{label}</Text>
        </View>
      </View>
    )
  }
export default class ViewTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskModel: {},
            isDateTimePickerVisible: false,
            DueDate: '',
            EmployeeList: [],
            // EmpName: '',
            // EmpValue: '',
            TastStatusList: [],
            StatusId: '',
            StatusName: '',
            Title: '',
            Description: '',
            AssignToName: '',
            AssignedToId: "",
            progressVisible: false,
            taskId: '',
            priorityList: [],
            fileList: [],
            PriorityId: null,
            PriorityName: null,
            statuscolor: '',
            Imageparam: "resourcetracker",
            image: null,
            ImageFileName: "",
            TaskId: 0,
            images: null,
            isModelVisible: false,
            CreatedDate: "",
            CreatedBy: "",
            AssignedTold: '',
            cbList:[],
            selectedList:[],
            assigednEmp:'',
            DeletedId:0,
            AssignedTold: '',
            OutDoorAddr:"",
            ContractNumber:"",
        }
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ DueDate: date })
        this._hideDateTimePicker();
    }
    setSelectedOption = (id) => {
        switch (id) {
            case 1:
                this.setState({ statuscolor: "#C4C4C4" });
                break;
            case 4:
                this.setState({ statuscolor: "#3D8EC5" });
                break;
            case 2:
                this.setState({ statuscolor: "#CB9A3A" });
                break;
            case 3:
                this.setState({ statuscolor: "#0A7A46" });
                break;
            case 5:
                this.setState({ statuscolor: "#A53131" });
                break;
        }
    }
    async componentDidMount() {
        this.setState({ taskModel: this.props.TaskModel });
        this.setState({ Title: this.props.TaskModel.Title });
        this.setState({ Description: this.props.TaskModel.Description });
        this.setState({ AssignedToId: this.props.TaskModel.AssignedToId });
        this.setState({ AssignToName: this.props.TaskModel.AssignToName });
        this.setState({ StatusId: this.props.TaskModel.StatusId });
        this.setState({ taskId: this.props.TaskModel.Id });
        this.setState({ DueDate: this.props.TaskModel.DueDate });
        this.setState({ DueDateVw: this.props.TaskModel.DueDateVw });
        this.setState({ TaskId: this.props.TaskModel.TaskNo });
        this.setState({ PriorityName: this.props.TaskModel.PriorityName });
        this.setState({ OutDoorAddr: this.props.TaskModel.OutDoorAddr });
        this.setState({ ContractNumber: this.props.TaskModel.ContractNumber });
        this.setState({ TaskTypeId: this.props.TaskModel.TaskTypeId });
        this.setState({ PriorityId: this.props.TaskModel.PriorityId });
        this.setState({ AssignedTold: this.props.TaskModel.AssignedTold });
        this.setState({ CreatedDate: moment(this.props.TaskModel.CreatedAt).format("DD MMMM YYYY") });
        this.setState({ CreatedBy: this.props.TaskModel.CreatedByName });
        console.log(this.props.TaskModel, '...............taskmodal')


        this.getTaskStatuslist();
        this.getPriorityList();
        this.getEmployeeList();
        this.GetTaskAttachments(this.props.TaskModel.Id)
        this.setSelectedOption(this.props.TaskModel.StatusId)
        this.GetAllAssignTo(this.props.TaskModel.Id)
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    GetAllAssignTo = async (TaskId) => {
        try {
            await GetAllAssignTo(TaskId)
                .then(res => {
                    this.setState({ progressVisible: false });
                    this.setState({DeletedId:res.result[0].Id});
                   var all=[];
                   var selectedarr=[];
                   var emp=[];
                    res.result.map(function(x) {
                      emp.push({"id":x.id})
                      all.push(x.label);
                      selectedarr.push({label:x.label,value:x.id});
                      }
                    )
                    this.setState({cblist:emp});
                   this.setState({assigednEmp:all.toString()});
                   this.setState({selectedList:selectedarr});

                   
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
    renderEmpList() {
        return (
            <View>
              <SelectMultiple
                items={this.state.EmployeeList}
                renderLabel={renderLabel}
                selectedItems={this.state.selectedList}
                onSelectionsChange={this.onSelectionsChange} />
            </View>
          )
    }
    onSelectionsChange = (selectedList) => {
        this.setState({ selectedList })
        this.SendValue(selectedList);
      }
    SendValue(selectedList){
        console.log(selectedList,'sel')
       var all=[];
       var assignemp=[];
        const id=this.state.DeletedId;
        selectedList.map(function(x) {
          all.push({"id":x.value});
          assignemp.push( x.label)
          }
        )
        this.setState({cbList:all});
        this.setState({ assigednEmp:assignemp.toString()})
    }
    gotoBordDetail(item) {
        this.setState({ images: [{ url: urlResource + item.BlobName }] });
        this.ImageViewer();
    }
    openmodalForImage() {
        this.refs.modalForImage.open();
    }

    handleBackButton = () => {
        Actions.pop();
        return true;
    }
    goBack() {
        Actions.pop();
    }

    ImageViewer() {
        this.setState({ isModelVisible: true })
    }
    ShowModalFunction(visible) {
        this.setState({ isModelVisible: false });
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    // renderEmpList() {
    //     let content = this.state.EmployeeList.map((emp, i) => {
    //         return (
    //             <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
    //                 onPress={() => { this.closeModal1(emp.Value, emp.Text) }}>
    //                 <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={emp.Value}>{emp.Text}</Text>
    //             </TouchableOpacity>
    //         )
    //     });
    //     return content;
    // }
    DeleteTask = async () => {
        try {
            await deleteTask(this.state.taskId)
                .then(res => {
                    ToastAndroid.show('Task Deleted successfully', ToastAndroid.TOP);
                    refreshOnBack();
                })
                .catch(() => {
                    Alert.alert(
                        "Not Deleted",
                        "Please try again...",
                        [
                            { text: 'OK', },
                        ],
                        { cancelable: false }
                    )
                    console.log("error occured");
                });
        } catch (error) {
            console.log(error);
        }
    }
    getPriorityList = async () => {
        try {
            await PriorityList()
                .then(res => {
                    this.setState({ priorityList: res.result, progressVisible: false });
                    console.log(res.result, "PriotyLIst.....")
                })
                .catch(() => {
                    this.setState({ progressVisible: false });
                });

        } catch (error) {
            this.setState({ progressVisible: false });
        }
    }
    alertmethod() {
        Alert.alert(
            "",
            'Are You Sure?',
            [
                { text: 'NO', onPress: () => console.log('Cancel Pressed!') },
                { text: 'YES', onPress: () => this.DeleteTask() },
            ],
            { cancelable: false }
        )
    }
    renderstatusList() {
        let content = this.state.TastStatusList.map((item, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { this.closeModalforStatus(item.Id, item.Name) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={item.Id}>{item.Name}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }
    async closeModal1(index, value) {
        this.setState({ AssignToName: value })
        this.setState({ AssignedToId: index })
        this.refs.modal1.close()
    }

    async closeModalforStatus(index, value) {
        this.setState({ StatusId: index })
        this.setState({ StatusName: value })
        this.setSelectedOption(index);
        this.refs.modalforstatus.close()
    }

    _takePhoto = async () => {
        this.refs.modalForImage.close()
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            height: 250,
            width: 250,
        });
        console.log(pickerResult, '.......................')
        if (pickerResult.cancelled == false) {
            this.handleUploadPhoto(pickerResult)
        }
    };
    _pickImage = async () => {
        this.refs.modalForImage.close()
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            height: 250,
            width: 250,
        });
        if (pickerResult.cancelled == false) {
            this.handleUploadPhoto(pickerResult)
        }
    };


    handleUploadPhoto = async (pickerResult) => {

        const userToken = await AsyncStorage.getItem("userToken");
        console.log(pickerResult.uri, '...............send')
        var data = new FormData();
        data.append('BlobName', {
            uri: pickerResult.uri,
            name: 'my_photo.jpg',
            type: 'image/jpg'
        })
        this.setState({ progressVisible: true });
        fetch(urlDev + "TaskApi/UploadDocuments", {
            headers: {
                'Authorization': `bearer ${userToken}`,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then(response => {
                let attachmentModel = {
                    TaskId: this.state.taskId,
                    FileName: response.ReturnCode,
                    BlobName: response.ReturnCode,
                }
                console.log("upload succes", response);
                this.setState({ fileList: this.state.fileList.concat(attachmentModel) })

                this.setState({ ImageFileName: response.ReturnCode });
                this.setState({ progressVisible: false });
                ToastAndroid.show('Uploaded successfully', ToastAndroid.TOP);

                console.log(response.ReturnCode, 'return..............');
                this.setState({ photo: null });
            })
            .catch(error => {
                this.setState({ progressVisible: false });
                console.log("upload error", error);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);
            });
    };

    getTaskStatuslist = async () => {
        try {
            await TaskStatus()
                .then(res => {
                    this.setState({ TastStatusList: res.result, progressVisible: false });
                    console.log(this.state.TastStatusList, 'TastStatusList...View');
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
    callsave() {
        this.saveTask();
    }
    async saveTask() {
        if (this.state.Title === "") return ToastAndroid.show('Please enter title ', ToastAndroid.TOP);
        try {
            console.log("due date" + this.state.DueDate)
            let taskModel = {
                CreatedById: this.props.TaskModel.CreatedById,
                Title: this.state.Title,
                Description: this.state.Description,
                Id: this.props.TaskModel.Id,
                StatusId: this.state.StatusId,
                PriorityId: this.state.PriorityId,
                AssignedTold: this.state.AssignedTold,
                OutDoorAddr: this.state.OutDoorAddr,
                ContractNumber: this.state.ContractNumber,
                TaskTypeId: this.state.TaskTypeId,
                AssignedToldList:this.state.cbList,
                DueDate: this.state.DueDate == null ? null : moment(this.state.DueDate).format("YYYYY-MM-DD")
            };
            this.setState({ progressVisible: true });
            const userToken = await AsyncStorage.getItem("userToken");
            var data = new FormData();
            data.append('taskmodel', JSON.stringify(taskModel))
            data.append('taskAttachmentsModel', JSON.stringify(this.state.fileList))


            fetch(urlDev + "TaskApi/SaveTask/", {
                headers: {
                    'Authorization': `bearer ${userToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: "POST",
                body: data
            }).then(response => {
                this.setState({ progressVisible: false });
                ToastAndroid.show('Task Updated successfully', ToastAndroid.TOP);
                refreshOnBack();
            })
                .catch(error => {
                    this.setState({ progressVisible: false });
                    console.log("error occured");
                    this.setState({ touchabledisableForsaveExpense: true })
                });

        } catch (error) {
            this.setState({ progressVisible: false });
            console.log(error);
        }
    }


    async setPriority(id, name) {
        this.setState({ PriorityId: id })
        this.setState({ PriorityName: name })
        this.refs.modalPriority.close()
    }
    renderPriorityList() {
        let content = this.state.priorityList.map((x, i) => {
            return (
                <TouchableOpacity style={{ paddingVertical: 7, borderBottomColor: '#D5D5D5', borderBottomWidth: 2 }} key={i}
                    onPress={() => { this.setPriority(x.Id, x.Name) }}>
                    <Text style={[{ textAlign: 'center' }, TaskStyle.dbblModalText]} key={x.Id}>{x.Name}</Text>
                </TouchableOpacity>
            )
        });
        return content;
    }
    getEmployeeList = async () => {
        try {
            await EmployeeListCb()
                .then(res => {
                    this.setState({ EmployeeList: res.result, progressVisible: false });
                    console.log(this.state.EmployeeList, 'Employeelist...View');
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
    GetTaskAttachments = async (TaskId) => {
        try {
            await GetTaskAttachments(TaskId)
                .then(res => {
                    this.setState({ fileList: res.result, progressVisible: false });
                    console.log("Filelist...", this.state.fileList, 'fileList...View');
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


    renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "45%",
                    margin: 5,
                    alignItems: 'center',
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: 'gray',
                    marginLeft: 10,
                    height: 200,
                }}
                onPress={() => { this.gotoBordDetail(item) }}
            >
                <View>

                    <Image style={{ height: 150, width: 150, }} resizeMode='cover'
                        source={{ uri: urlResource + item.BlobName }} >
                    </Image>

                </View>
            </TouchableOpacity>
        );
    };


    render() {
        let textRef = React.createRef();
        let menuRef = null;
        const setMenuRef = ref => menuRef = ref;
        const hideMenu = () => menuRef.hide();
        const showMenu = () => menuRef.show(textRef.current, stickTo = Position.TOP_RIGHT);
        const onPress = () => showMenu();
        const DeleteEmp = () => {
            hideMenu();
            this.alertmethod();
        }
        return (
            <View
                style={TaskStyle.viewTaskContainer}>
                {/* <StatusBarPlaceHolder /> */}
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        <TouchableOpacity
                            style={CommonStyles.HeaderMenuicon}
                            onPress={this.goBack}>
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../../../assets/images/left_arrow.png')}>
                            </Image>
                        </TouchableOpacity>
                        <View
                            style={CommonStyles.HeaderTextView}>
                            <Text
                                style={CommonStyles.HeaderTextstyle}>
                                VIEW TASK
                            </Text>
                        </View>
                    </View>


                    <View style={CommonStyles.HeaderMenuLeft}>

                        <TouchableOpacity
                            onPress={() => this.callsave()}
                            style={CommonStyles.createTaskButtonTouch}>
                            <View style={CommonStyles.plusButton}>
                                <MaterialCommunityIcons name="content-save" size={Platform.OS === 'ios' ? 15.3 : 18} color="#ffffff" />
                            </View>
                            <View style={CommonStyles.ApplyTextButton}>
                                <Text style={CommonStyles.ApplyButtonText}>
                                    SAVE
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>


                </View>
                <View style={{ flex: 1, }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, }}>
                        <View style={{ flex: 1, }}>
                            <View
                                style={TaskStyle.titleInputRow}>
                                <Text
                                    style={TaskStyle.createTaskTitleLabel1}>
                                    Title:
                                </Text>
                                <TextInput
                                    style={TaskStyle.createTaskTitleTextBox1}
                                    value={this.state.Title}
                                    placeholderTextColor="#dee1e5"
                                    autoCapitalize="none"
                                    onChangeText={text => this.setState({ Title: text })}
                                >
                                </TextInput>
                            </View>

                            <View
                                style={TaskStyle.descriptionInputRow}>
                                <Text
                                    style={TaskStyle.createTaskTitleLabel11}>
                                    Description:
                            </Text>
                                <TextInput
                                    style={TaskStyle.createTaskDescriptionTextBox1}
                                    value={this.state.Description}
                                    placeholderTextColor="#dee1e5"
                                    multiline={true}
                                    autoCapitalize="none"
                                    multiline={true}
                                    onChangeText={text => this.setState({ Description: text })}
                                >
                                </TextInput>
                            </View>


                            <View
                                style={TaskStyle.viewTaskBodyContainer}>
                                <View
                                    style={TaskStyle.viewTaskStatusContainer}>
                                    <Text
                                        style={TaskStyle.viewTaskStatusLabel}>
                                        Created By:
                                </Text>
                                    <TouchableOpacity
                                        style={[TaskStyle.viewTaskStatusCheckboxContainer, { backgroundColor: "#f6f7f9" }, { borderRadius: 5 }]}
                                    >

                                        {this.state.CreatedAt === "" ?
                                            <Text
                                                style={TaskStyle.viewTaskStatusText}>
                                                {this.state.CreatedBy}
                                            </Text> :
                                            <Text
                                                style={TaskStyle.viewTaskStatusTextCreatedBy}>
                                                {this.state.CreatedBy}
                                            </Text>
                                        }

                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={TaskStyle.viewTaskDueDateContainer}>
                                    <Text
                                        style={TaskStyle.viewTaskDueDateLabel}>
                                        Created Date:
                                    </Text>
                                    <TouchableOpacity>
                                        <View
                                            style={TaskStyle.viewTaskDueDateValueContainer}>
                                            <MaterialCommunityIcons
                                                name="clock"
                                                size={20}
                                                color="black"
                                            >
                                            </MaterialCommunityIcons>
                                            <Text
                                                style={TaskStyle.viewTaskDueDateValue}>
                                                {this.state.CreatedDate}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <DateTimePicker
                                        isVisible={this.state.isDateTimePickerVisible}
                                        onConfirm={this._handleDatePicked}
                                        onCancel={this._hideDateTimePicker}
                                        mode={'date'}
                                    />
                                </View>

                            </View>




                            <View
                                style={TaskStyle.viewTaskBodyContainer1}>
                                <View
                                    style={TaskStyle.viewTaskStatusContainer}>
                                    <Text
                                        style={TaskStyle.viewTaskStatusLabel}>
                                        Status:
                                </Text>
                                    <TouchableOpacity onPress={() => this.refs.modalforstatus.open()}
                                        style={[TaskStyle.viewTaskStatusCheckboxContainer, { backgroundColor: this.state.statuscolor }, { borderRadius: 5 }]}
                                    >

                                        {this.state.StatusName === "" ?
                                            <Text
                                                style={TaskStyle.viewTaskStatusText}>
                                                {this.state.taskModel.StatusName}
                                            </Text> :
                                            <Text
                                                style={TaskStyle.viewTaskStatusText}>
                                                {this.state.StatusName}
                                            </Text>
                                        }

                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={TaskStyle.viewTaskDueDateContainer}>
                                    <Text
                                        style={TaskStyle.viewTaskDueDateLabel}>
                                        Due Date:
                                    </Text>
                                    <TouchableOpacity onPress={this._showDateTimePicker}>
                                        <View
                                            style={TaskStyle.viewTaskDueDateValueContainer}>
                                            <MaterialCommunityIcons
                                                name="clock"
                                                size={20}
                                                color="black"
                                            >
                                            </MaterialCommunityIcons>
                                            <Text
                                                style={TaskStyle.viewTaskDueDateValue}>
                                                {this.state.DueDate === null ? " " : moment(this.state.DueDate).format("DD MMMM YYYY")}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <DateTimePicker
                                        isVisible={this.state.isDateTimePickerVisible}
                                        onConfirm={this._handleDatePicked}
                                        onCancel={this._hideDateTimePicker}
                                        mode={'date'}
                                    />
                                </View>

                            </View>
                            <View
                                style={[TaskStyle.viewTaskBodyContainer,
                                { marginVertical: -4, }
                                ]}>
                                <View
                                    style={TaskStyle.viewTaskStatusContainer}>
                                    <TouchableOpacity onPress={() => this.refs.modalPriority.open()}>
                                        <View
                                            style={{
                                                width: (width * 45) / 100, height: 35,
                                                borderRadius: 5, flexDirection: 'row',
                                                alignItems: 'center', justifyContent: 'center',
                                                padding: 5, backgroundColor: "#f6f7f9",
                                            }}>
                                            <Ionicons name="ios-stats-chart" size={18} style={{ marginHorizontal: 5, }}
                                                color="#4a535b" />
                                            <TextInput
                                                style={[TaskStyle.assigneePeopleTextBox]}
                                                placeholder="Select Priority"
                                                placeholderTextColor="#4a535b"
                                                editable={false}
                                                autoCapitalize="none"
                                                value={this.state.PriorityName}
                                            >
                                            </TextInput>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={TaskStyle.viewTaskDueDateContainer}>
                                 
                                    {/* <View
                                        style={{
                                            width: (width * 45) / 100, height: 35,
                                            borderRadius: 5, flexDirection: 'row',
                                            alignItems: 'center', justifyContent: 'center',
                                            padding: 5, backgroundColor: "#f6f7f9",
                                        }}>
                                        <Ionicons name="md-people" size={20} style={{ marginHorizontal: 5, }} color="#4a535b" />
                                        {this.state.AssignToName === "" ?
                                            <Text
                                                style={[TaskStyle.assigneePeopleTextBox]}>
                                                {this.state.taskModel.AssignToName}
                                            </Text> :
                                            <Text
                                                style={[TaskStyle.assigneePeopleTextBox]}>
                                                {this.state.AssignToName}
                                            </Text>
                                        }
                                    </View> */}
                                      <TouchableOpacity
                                        onPress={() => this.refs.modal1.open()}>
                                        <View
                                            style={{
                                                width: (width * 45) / 100, height: 35,
                                                borderRadius: 5, flexDirection: 'row',
                                                alignItems: 'center', justifyContent: 'center',
                                                padding: 5, backgroundColor: "#f6f7f9",
                                            }}>
                                            <Ionicons name="md-people" size={20} style={{ marginHorizontal: 5, }} color="#4a535b" />    
                                                <Text
                                                    style={[TaskStyle.assigneePeopleTextBox]}>
                                                   Select Assign To
                                                </Text>
                                            
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{  marginHorizontal: 10,paddingTop:5, }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Assign To Name: </Text>
                                <Text style={{ marginRight: 10, }}>{this.state.assigednEmp}</Text>
                            </View>
                            <View
                                style={TaskStyle.viewTaskAttachmentContainer}>
                                <View
                                    style={TaskStyle.viewTaskAttachmentInnerContainer}>
                                    <Entypo name="attachment" size={14} color="black"
                                        style={{ marginRight: 10, }} />

                                    <Text
                                        style={TaskStyle.viewTaskAttachmentLeftIcon}>
                                        Attachments
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.openmodalForImage()}
                                    style={TaskStyle.viewTaskAttachmentPlusIcon}>
                                    <Image
                                        style={{ width: 20, height: 20 }} resizeMode='contain'
                                        source={require('../../../../assets/images/leftPlusBig.png')}>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                            {this.state.progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={TaskStyle.loaderIndicator} />) : null}
                            <View style={TaskStyle.scrollContainerView}>
                                <FlatList
                                    data={this.state.fileList}
                                    keyExtractor={(i, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    style={TaskStyle.taskBoardContainer}
                                    renderItem={this.renderItem}
                                    numColumns={numColumns}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>


                <View style={{
                    justifyContent: 'flex-end',
                }}>
                </View>
                <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"} ref={"modal1"} isDisabled={this.state.isDisabled}
                    backdropPressToClose={false}
                    swipeToClose={false}
                >
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <View style={{ alignItems: "flex-start" }}>
                        </View>
                        <View style={{ alignItems: "center", marginLeft: 0, }}>
                            <AntDesign name="caretup" size={32} color="#535353"
                                style={{ marginLeft: 35, marginTop: 5 }} />
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.modal1.close()} style={{
                                marginLeft: 0, marginTop: 0,
                            }}>
                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={TaskStyle.dblModelContent}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                            <View style={{}} >
                                {this.renderEmpList()}
                            </View>
                        </ScrollView>
                        <View style={{ alignItems: "center", marginLeft: 0, marginBottom: 0, }}>
                            <AntDesign name="caretdown" size={32} color="#535353"
                                style={{ marginLeft: 0, marginTop: 0 }} />
                        </View>
                    </View>


                </Modal>
                <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"} ref={"modalforstatus"} isDisabled={this.state.isDisabled}
                    backdropPressToClose={false}
                    swipeToClose={false}
                >
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <View style={{ alignItems: "flex-start" }}>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.modalforstatus.close()} style={{
                                marginLeft: 0, marginTop: 0,
                            }}>
                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={TaskStyle.dblModelContent}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                            <View style={{}} >
                                {this.renderstatusList()}
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                <Modal style={[TaskStyle.modalforCreateCompany1]} position={"center"} ref={"modalPriority"}
                    backdropPressToClose={false}
                    swipeToClose={false}
                >
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <View style={{ alignItems: "flex-start" }}>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.refs.modalPriority.close()} style={{
                                marginLeft: 0, marginTop: 0,
                            }}>
                                <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }} source={require('../../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={TaskStyle.dblModelContent}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ height: "80%" }}>
                            <View style={{}} >
                                {this.renderPriorityList()}
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                <Modal
                    style={NoticeStyle.ImagemodalContainer}
                    position={"center"}
                    ref={"modalForImage"}
                    isDisabled={this.state.isDisabled}
                    backdropPressToClose={true}
                    swipeToClose={false}
                >
                    <View
                        style={{
                            justifyContent: "space-between",
                            flexDirection: "row"
                        }}>
                        <View
                            style={{ alignItems: "flex-start" }}>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity
                                onPress={() => this.refs.modalForImage.close()}
                                style={NoticeStyle.modalClose}>
                                <Image
                                    resizeMode="contain"
                                    style={NoticeStyle.closeImage}
                                    source={require('../../../../assets/images/close.png')}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={NoticeStyle.addPhotoText}>Add Photos</Text>
                        </View>
                        <View style={NoticeStyle.cemaraImageContainer}>
                            <TouchableOpacity onPress={() => this._takePhoto()} style={{ alignItems: "center", paddingLeft: 35 }}>
                                <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../../assets/images/photo_camera_black.png')}></Image>
                                <Text style={NoticeStyle.takePhotoText}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this._pickImage()} style={{ alignItems: 'center', paddingRight: 35 }}>
                                <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../../../assets/images/Gallary.png')}></Image>
                                <Text style={NoticeStyle.takePhotoText}>From Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal1
                    visible={this.state.isModelVisible}
                    transparent={false}
                    onRequestClose={() => this.ShowModalFunction()}>
                    <View
                        style={{
                            width: "100%",
                            padding: 5,
                            backgroundColor: 'black',
                            justifyContent: 'space-between',

                        }}>
                        <View style={{ alignItems: "flex-start", }}>

                        </View>
                        <TouchableOpacity
                            style={{ alignItems: "flex-end", padding: 10 }}
                            onPress={() => this.ShowModalFunction()}>
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 17, marginTop: 15 }}
                                // onPress={() => this.ShowModalFunction()}
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <ImageViewer imageUrls={this.state.images} >
                    </ImageViewer>
                </Modal1>
            </View >

        )
    }
}
