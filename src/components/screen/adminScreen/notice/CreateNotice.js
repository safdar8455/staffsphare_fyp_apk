import React, { Component } from 'react';
import {
    ScrollView, Text, View, Image, StatusBar, ActivityIndicator, ToastAndroid, 
    BackHandler, AsyncStorage, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, CheckBox, FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import {
    MaterialCommunityIcons
} from '@expo/vector-icons'
import _ from "lodash";
import ImageViewer from 'react-native-image-zoom-viewer';
import { urlDev, urlResource } from '../../../../services/configuration/config';
import { CommonStyles } from '../../../../common/CommonStyles';
import { NoticeStyle } from './NoticeStyle';
import { SaveNotice } from '../../../../services/api/Notice';
import { Modal as Modal1 } from 'react-native';

import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'


var tempCheckValues = [];
var cListforcheckbox = [];
const numColumns = 2;
export default class CreateNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: "",
            progressVisible: false,
            departmentList: [],
            checkBoxChecked: [],
            test: {
                CheckBoxList: []
            },
            ImageFileName: "",
            image: null,
            Imageparam: "attendance",
            NoticeId: null,
            isModelVisible: false,

        }
    }

    goBack() {
        Actions.pop();
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    async saveNotice() {
        if(this.state.details!=""){
        try {
            let noticeModel = {
                Details: this.state.details,
                ImageFileName: this.state.ImageFileName,
            };
            this.setState({ progressVisible: true });
            await SaveNotice(noticeModel)
                .then(res => {
                    this.setState({ progressVisible: false });
                    ToastAndroid.show('Notice saved successfully', ToastAndroid.TOP);
                    Actions.pop({ refresh: {} });
                })
                .catch(() => {
                    this.setState({ progressVisible: false });
                    console.log("error occured");
                });

        } catch (error) {
            this.setState({ progressVisible: false });
            console.log(error);
        }
    }else{
        ToastAndroid.show('Detail can not be empty', ToastAndroid.TOP);
    }
    }
    checkBoxChanged(Value, value, isChecked) {
        this.setState({
            checkBoxChecked: tempCheckValues
        })

        var tempCheckBoxChecked = this.state.checkBoxChecked;
        tempCheckBoxChecked[Value] = !value;

        this.setState({
            checkBoxChecked: tempCheckBoxChecked
        })
        if (isChecked) {
            cListforcheckbox.push(Value);
        } else {

            for (let index = 0; index < cListforcheckbox.length; index++) {
                const element = cListforcheckbox[index];

                if (element == Value) {
                    cListforcheckbox.splice(index, 1);
                }

            }
        }
        { this.setState(Object.assign(this.state.test, { CheckBoxList: cListforcheckbox })) }

    }
    handleBackButton = () => {
        Actions.Notice();
        return true;
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
   
    openmodalForImage() {
        this.refs.modalForImage.open();
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
        console.log(urlDev+"NoticeApi/Upload")
        fetch(urlDev + "NoticeApi/Upload",{
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
                this.setState({ image: urlResource + response.ReturnCode });
                            this.setState({ ImageFileName: response.ReturnCode });
                            this.setState({ progressVisible: false });
                            ToastAndroid.show('Uploaded successfully', ToastAndroid.TOP);
                            this.setState({ photo: null });
                this.setState({ photo: null });
            })
            .catch(error => {
                this.setState({ progressVisible: false });
                console.log("upload error", error);
                ToastAndroid.show('Upload Fail', ToastAndroid.TOP);

            });
    };
    ImageViewer() {
        this.setState({ isModelVisible: true })
    }
    gotoBordDetail(item) {
        this.setState({ images: [{ url: item }] });
        this.ImageViewer();
    }
    ShowModalFunction(visible) {
        this.setState({ isModelVisible: false });
    }

    rendercheckbox() {

        return (
            this.state.departmentList.map((val) => {
                { tempCheckValues[val.Value] = false }

                return (
                    <View
                        key={val.Value}
                        style={{

                            flexDirection: 'row',
                            padding: 5,
                            alignSelf: 'center',
                        }}>
                        <CheckBox
                            value={this.state.checkBoxChecked[val.Value]}
                            onValueChange={(value) =>
                                this.checkBoxChanged(val.Value,
                                    this.state.checkBoxChecked[val.Value], value)}
                        />
                        <Text style={{ marginTop: 6, color: '#636363', }}>{val.Text}</Text>
                    </View>
                )
            }
            )
        );
    }

    render() {
        return (
            <View
                style={{
                    flex: 1, backgroundColor: '#ffffff', flexDirection: 'column',
                }}>
               
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
                                CREATE NOTICE
                         </Text>
                        </View>
                    </View>

                    <View
                        style={NoticeStyle.createNoticeButtonContainer}>
                        <View
                            style={NoticeStyle.ApplyButtonContainer}>
                            <TouchableOpacity
                                onPress={() => this.saveNotice()}
                                style={NoticeStyle.ApplyButtonTouch}>
                                <View style={NoticeStyle.plusButton}>
                                    <MaterialCommunityIcons name="content-save" size={Platform.OS==='ios'? 15.3 : 17.5} color="#ffffff" />
                                </View>
                                <View style={NoticeStyle.ApplyTextButton}>
                                    <Text style={NoticeStyle.ApplyButtonText}>
                                        PUBLISH
                                </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>


                {this.state.progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={NoticeStyle.loaderIndicator} />) : null}

                <KeyboardAvoidingView behavior="height" enabled style={NoticeStyle.createnoticecontainer}>
                   
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={NoticeStyle.selectContainer}>
                            <TouchableOpacity onPress={() => this.openmodalForImage()}
                                style={NoticeStyle.opencemarTouchableopacity}>
                                <View>
                                    <Image resizeMode='contain'
                                        style={NoticeStyle.opencemarastle}
                                        source={require('../../../../assets/images/camera_white.png')}>
                                    </Image>

                                </View>
                                <View style={NoticeStyle.selectContainerview}>
                                    <Text style={NoticeStyle.selectText}>
                                        SELECT TO
                                    </Text>
                                    <Text style={NoticeStyle.addPhotoText1}>
                                        ADD PHOTO
                                    </Text>
                                </View>
                              
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={NoticeStyle.openDeptTouhableOpacity}>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={NoticeStyle.inputTextContainer}>


                            <TextInput
                                style={NoticeStyle.inputText}
                                multiline={true}
                                placeholderTextColor="#cbcbcb"
                                placeholder="Write your notice here..."
                                returnKeyType="next"
                                autoCorrect={false}
                                onChangeText={text => this.setState({ details: text })}
                            />
                            <TouchableOpacity
                                style={NoticeStyle.ImageTouchableOpacity} onPress={() => { this.gotoBordDetail( urlResource + this.state.ImageFileName ) }}>
                                <Image resizeMode='contain'
                                    style={NoticeStyle.uploadImageStyle}
                                    source={{ uri: urlResource + this.state.ImageFileName }}></Image>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                  
                </KeyboardAvoidingView>
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
                                <Text style={NoticeStyle.takePhotoText}>From Gallary</Text>
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
                                source={require('../../../../assets/images/close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <ImageViewer
                        saveToLocalByLongPress={true}

                        imageUrls={this.state.images} >
                    </ImageViewer>
                </Modal1>

            </View>
        )
    }
}
