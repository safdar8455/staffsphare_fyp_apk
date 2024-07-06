import React, { Component } from 'react';
import { AsyncStorage, StyleSheet,
     Text, View, ActivityIndicator,KeyboardAvoidingView,
      Dimensions, TextInput, TouchableOpacity, 
      AppState, BackHandler, Alert, Image, } from 'react-native';
import { Actions } from 'react-native-router-flux';
import  NetInfo from "@react-native-community/netinfo";
import { Feather, Entypo } from '@expo/vector-icons';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { Login, GetUserClaim,updateDeviceIdentifier } from '../../services/api/AccountService';
import { saveToStorage, storage, CurrentUserProfile } from '../../common/storage';
import * as Device from 'expo-device';
var { width, height } = Dimensions.get('window');

export default class LoginForm extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            userName: this.props.phoneno,
            password: "",
            alertMessage: "",
            loading: false,
            DeviceIdentifier:'',
            deviceName:"",
            brand:'',
            modelName:'',
            osName:'',
            osVersion:'',
            osBuildId:''

        };
    }

    handleBackButton = () =>
    {
        BackHandler.exitApp()
        return true;
    }
    changeUsrNameHandler = (text) =>
    {
        this.setState({ userName: text });
    };
    changePassNameHandler = (text) =>
    {
        this.setState({ password: text });
    };

    forgotPassword()
    {
      Actions.ForgotPassword();
    }
    componentDidMount()
    {
        const getDeviceValue=Device.modelName+Device.osBuildId+Device.osInternalBuildId
        console.log(getDeviceValue,'value of expo Device##############');
        this.setState({DeviceIdentifier:getDeviceValue})
        this.setState({deviceName:Device.modelName})
        this.setState({brand:Device.brand})
        this.setState({modelName:Device.modelName})
        this.setState({osName:Device.osName})
        this.setState({osVersion:Device.osVersion})
        this.setState({osBuildId:Device.osBuildId})

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount()
    {
        this.setState({ userName: '' })
    }
    async  onPressSubmitButton()
    {

        let hasNetwork = await NetInfo.fetch();
       
        if (hasNetwork.isConnected)
        {
            if (this.state.userName != "" && this.state.password != "")
            {
                this.setState({ loading: true });
                this.onFetchLoginRecords();
            } else
            {
                this.setState({ alertMessage: "Please input all field" });
                this.isConfirm();
            }
        } else
        {
            Alert.alert(
                "No Internet ",
                "Enable Wifi or Mobile Data",
                [
                    { text: 'OK', },
                ],
                { cancelable: false }
            )
        }
    }
    async onFetchLoginRecords()
    {
        try
        {
            let UserModel = {
                UserName: this.state.userName,
                Password: this.state.password,
            };
            console.log(UserModel);
            let response = await Login(UserModel);
            if (response && response.isSuccess)
            {
                if (response.result.Success)
                {
                    await AsyncStorage.setItem("userToken", response.result.Token);
                    await AsyncStorage.setItem("userId", response.result.UserId);
                    await this.getUserClaim();
                  
                    this.setState({ loading: false });
                } else
                {
                    this.setState({ loading: false });
                    this.setState({ alertMessage: "User name or password is wrong" });
                    this.isConfirm();
                }
            } else
            {
                this.setState({ loading: false });
                this.setState({ alertMessage: "User name or password is wrong " });
                this.isConfirm();
            }
        } catch (errors)
        {

            console.log(errors);
        }
    }
    DeviceConfirmation = (ob) => {
        Alert.alert(
            'Confirmation'
            ,
            'Already you have login using another device.Are your sure for register this device?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                style: 'ok',
                onPress: async () => {
                   this.RegisterNewDevice(ob);

                }
            },], {
            cancelable: false
        }
        )
        return true;
    };
    RegisterNewDevice(ob){
      
        this.updteDeviceInfoApiCall();
        saveToStorage(storage, CurrentUserProfile, ob);
        Actions.auth();
    }
    updteDeviceInfoApiCall(){
        let model={
            UniqueDeviceIdentifier:this.state.DeviceIdentifier,
            deviceName:this.state.deviceName,
            brand:this.state.brand,
            modelName:this.state.modelName,
            osName:this.state.osName,
            osVersion:this.state.osVersion,
            osBuildId:this.state.osBuildId
        }
        let response =  updateDeviceIdentifier(model);
    }
    getUserClaim = async () =>
    {
        try
        {
            await GetUserClaim()
                .then(res =>
                {
                    const ob = res.result;
                    if (ob != null)
                    {
                        if(ob.UserType=='user'){
                            if(ob.UniqueDeviceIdentifier==""){                            
                                this.updteDeviceInfoApiCall()
                                saveToStorage(storage, CurrentUserProfile, ob);
                                Actions.auth();
                            }
                           else if(this.state.DeviceIdentifier==ob.UniqueDeviceIdentifier ){
                                this.updteDeviceInfoApiCall()
                                saveToStorage(storage, CurrentUserProfile, ob);
                                Actions.auth();
                            }else{
                                if(ob.IsMultipleDevieAllow){
                                this.DeviceConfirmation(ob);
                                }else{
                                    alert("Please Contract your Admin");
                                }
                            }
                        }else{
                            saveToStorage(storage, CurrentUserProfile, ob);
                            Actions.auth();
                        }
                    }
                })
                .catch((error) =>
                {
                    console.log(error);
                });
        } catch (error)
        {
            console.log(error);
        }
    }
    
    openConfirm = (show) =>
    {
        this.setState({ showConfirm: show });
    }

    optionYes = () =>
    {
        this.openConfirm(false);
    }

    optionNo = () =>
    {
        this.openConfirm(false);
    }

    isConfirm()
    {
        this.openConfirm(true);
    }

    render()
    {
        return (
            <View style={styles.container}>
                {this.state.loading ? (<ActivityIndicator size="large" color="#1B7F67" style={{ left: 0, right: 0, bottom: 0, top: 0, justifyContent: 'center', alignContent: 'center', }} />) : null}
                <KeyboardAvoidingView  behavior='padding'  enabled >
                <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                    <Entypo name="old-mobile" size={20} color="#4b4b4b"
                        style={styles.InputIcon} />
                    <TextInput style={styles.TextInput}
                       
                        placeholder="Your Login ID"
                        placeholderTextColor="#bcbcbc"
                        underlineColorAndroid="transparent"
                        returnKeyType="next" autoCorrect={false}
                        onChangeText={this.changeUsrNameHandler}
                        value={this.state.userName}
                        onSubmitEditing={() => this.refs.txtPassword.focus()}
                    />
                </View>
                <View style={styles.TextInputView}>
                    <Feather name="lock" size={20} color="#4b4b4b"
                        style={styles.InputIcon} />
                    <TextInput style={styles.TextInput}
                        placeholder="Your Password"
                        placeholderTextColor="#bcbcbc"
                        underlineColorAndroid="transparent"
                        onChangeText={this.changePassNameHandler}
                        returnKeyType="go" secureTextEntry autoCorrect={false}
                        ref={"txtPassword"}
                    />
                </View>

                <TouchableOpacity style={styles.LoginButton}
                    onPress={() => this.onPressSubmitButton(this.state.userName,
                        this.state.password)}>
                    <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>

                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.TextStyle}>
                            LOGIN
                    </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', marginRight: 10, }}>
                        <Entypo name="chevron-right" size={20} color="#ffffff" />
                    </View>
                </TouchableOpacity>

                <View style={[styles.LoginButton,  { backgroundColor: '#ffffff', }]}>

                    {/* <TouchableOpacity
                        onPress={this.forgotPassword}
                        style={{
                            alignItems: 'center',
                            width: (width * 80) / 100,
                            height: "100%",
                            justifyContent: 'center',
                            backgroundColor: '#f1f4f6',
                            borderRadius: 5,
                        }}>

                        <Text style={[styles.TextStyle, style = { color: "#6d6d6d" }]}>
                            FORGOT PASSWORD
                        </Text>
                    </TouchableOpacity> */}
                  

                </View>

                <ConfirmDialog
                    title="Message"
                    message={this.state.alertMessage}
                    onTouchOutside={() => this.openConfirm(false)}
                    visible={this.state.showConfirm}
                    positiveButton={
                        {
                            title: "OK",
                            onPress: this.optionYes,
                            titleStyle: {
                                color: "black",
                                colorDisabled: "aqua",
                            }
                        }
                    }
                />
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    TextInputView: {
        width: (width * 80) / 100,
        height: 45,
        backgroundColor: '#f1f4f6',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    InputIcon: {
        justifyContent: "flex-start",
        marginHorizontal: 10,
    },
    TextInput: {
        flex: 1,
        color: "#3D6AA5",
        paddingRight: 3,
    },
    LoginButton: {
        backgroundColor: '#316fde',
        borderRadius: 5,
        height: 45,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: (width * 80) / 100,
    },
    TextStyle: {
        fontSize: 13,
        fontFamily: "Montserrat_Bold",
        color: "#ffffff"
    },
})
