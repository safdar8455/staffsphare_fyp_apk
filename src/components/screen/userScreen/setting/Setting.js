import React from 'react';
import
{
    Platform, StatusBar, BackHandler,
    AsyncStorage, Alert, View,
    Text, Image, ScrollView, ToastAndroid,
    TouchableOpacity, TextInput
} from 'react-native';

import { FontAwesome, AntDesign,Feather } from '@expo/vector-icons';
import { SettingStyle } from './SettingStyle'
import
{
    loadFromStorage,
    storage,
    CurrentUserProfile,
    clearStorageValue
} from "../../../../common/storage";
import { Actions } from 'react-native-router-flux';

import { CommonStyles } from '../../../../common/CommonStyles';



const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
export default class SettingScreenUser extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {

            ImageFileName: "",
            Name: '',
            Phone: '',
            Email: '',
            userId: '',
            HasAccessQrCodeScan:false,
        }
    }

    modalchangepassword()
    {
        Actions.QRcode()
    }
    Notice()
    {
        Actions.UserNotice()
    }
    closemodalchangepassword()
    {
        this.setState({ progressVisible: true })
        if (this.state.oldpassword == "" && this.state.newpassword == "" && this.state.confirmpassword == "")
        {
            alert("Field can not be empty")
        }
        else if (this.state.newpassword != this.state.confirmpassword)
        {
            alert("Password does not match");
        }
        else
        {
            this.changepassword();
        }
    }

    handleBackButton = () =>
    {
        Actions.pop()
        // BackHandler.exitApp()
        return true;
    }

   async componentDidMount()
    {
        this._bootstrapAsync();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const uId = await AsyncStorage.getItem("userId");
        this.setState({ userId: uId });
        var userDetails = await loadFromStorage(storage, CurrentUserProfile);
        this.setState({ HasAccessQrCodeScan: userDetails.item.HasAccessQrCodeScan })
       
    }
    componentWillMount()
    {

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    openModal2()
    {
        Actions.ReportScreen();
    }
    openDesignationModal()
    {
        Actions.LeaveList();
    }
    
    gotoExpense()
    {
        Actions.Expenses();
    }
    gotoIncome()
    {
        Actions.Incomes();
    }
    openmodalforEmpList()
    {
        Actions.EmployeeSetupScreen();
    }
    _bootstrapAsync = async () =>
    {
        var response = await loadFromStorage(storage, CurrentUserProfile);
        await this.setState({ Name: response.item.UserFullName });
        await this.setState({ Phone: response.item.PhoneNumber });
        await this.setState({ Email: response.item.Email });

        console.log(response, '...............');
    }
    openModal3()
    {
        Actions.Notice();
    }
 logOut = () =>
    {
        Alert.alert(
            'Log Out'

            ,
            'Log Out From The App?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                style: 'ok',
                onPress: async () =>
                {
                    await clearStorageValue();
                     Actions.auth({ type: 'reset'})
                   
                }
            },], {
            cancelable: false
        }
        )
        return true;
    };
    render()
    {
        return (
            <View style={SettingStyle.container}>
               
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        <View
                            style={CommonStyles.HeaderTextView}>
                            <Text
                                style={CommonStyles.HeaderTextstyle}>
                                More
                            </Text>
                        </View>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={SettingStyle.middleViewContainer}>   
                    {
                         this.state.HasAccessQrCodeScan?
                         <View
                         style={SettingStyle.viewchangePass}>
                         <TouchableOpacity onPress={() => this.modalchangepassword()}>
                             <View style={SettingStyle.view2}>
                                 <View style={SettingStyle.view3}>
                                                <AntDesign name="qrcode" size={24}
                                                    style={{ transform: [{ scaleX: -1 }] }}
                                                />
                                     <Text style={SettingStyle.text1}>
                                     QRcode Scanner
                                  </Text>
                                 </View>
                                 <View style={SettingStyle.ChevronRightStyle}>
                                     <FontAwesome name="chevron-right"
                                         size={18}
                                         color="#cccccc"
                                         style={{
                                             marginRight: 20
                                         }}
                                     />
                                 </View>
                             </View>
                         </TouchableOpacity>
                     </View>:
                    <View></View>
                    }               
                 
                 <View
                         style={SettingStyle.viewchangePass}>
                         <TouchableOpacity onPress={() => this.Notice()}>
                             <View style={SettingStyle.view2}>
                                 <View style={SettingStyle.view3}>
                                 <Feather name="bell" size={20} color="#283d48"
                                            style={{ transform: [{ scaleX: -1 }] }}
                                        />
                                     <Text style={SettingStyle.text1}>
                                     Notice
                                  </Text>
                                 </View>
                                 <View style={SettingStyle.ChevronRightStyle}>
                                 <FontAwesome name="chevron-right"
                                            size={18}
                                            color="#cccccc"
                                            style={{
                                                marginRight: 20
                                            }}
                                        />
                                 </View>
                             </View>
                         </TouchableOpacity>
                     </View>


                    </View>
                    <View style={SettingStyle.lastViewContainer}>


                        <View style={SettingStyle.viewchangePass}>
                            <TouchableOpacity onPress={() =>this.logOut()}>
                                <View style={SettingStyle.view2}>
                                    <View style={SettingStyle.view3}>
                                        <Image
                                            style={SettingStyle.view1Image}
                                            source={require('../../../../assets/images/s_5.png')}>
                                        </Image>
                                        <Text
                                            style={SettingStyle.text1}>
                                            Logout
                                    </Text>
                                    </View>
                                    <View style={SettingStyle.ChevronRightStyle}>
                                        <FontAwesome name="chevron-right"
                                            size={18}
                                            color="#cccccc"
                                            style={{
                                                marginRight: 20
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View >
        );
    }
}

