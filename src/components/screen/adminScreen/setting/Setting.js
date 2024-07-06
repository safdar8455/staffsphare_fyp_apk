import React from 'react';
import {
Platform, StatusBar, BackHandler,
AsyncStorage, Alert, View, ImageBackground,
Text, Image, ScrollView, ToastAndroid,
TouchableOpacity, TextInput,Dimensions,
} from 'react-native';
import {CommonStyles} from '../../../../common/CommonStyles'
import { FontAwesome,MaterialIcons, AntDesign, Feather,FontAwesome5 } from '@expo/vector-icons';
import { SettingStyle } from './SettingStyle'
import {
loadFromStorage,
storage,
CurrentUserProfile,
clearStorageValue
} from "../../../../common/storage";
import { Actions } from 'react-native-router-flux';


const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : 0;
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
export default class SettingScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            ImageFileName: "",
            Name: '',
            Phone: '',
            Email: '',
            userId: '',
            CompanyName:'',
            Address:'',
        }
    }

    modalchangepassword() {
        Actions.LeaveList()
    }
    closemodalchangepassword() {
        this.setState({ progressVisible: true })
        if (this.state.oldpassword == "" && this.state.newpassword == "" && this.state.confirmpassword == "") {
            alert("Field can not be empty")
        }
        else if (this.state.newpassword != this.state.confirmpassword) {
            alert("Password does not match");
        }
        else {
            this.changepassword();
        }
    }

    handleBackButton = () => {
        Actions.pop()
        return true;
    }

    async componentDidMount() {
        this._bootstrapAsync();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const uId = await AsyncStorage.getItem("userId");
        this.setState({ userId: uId });
    }
    componentWillMount() {

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    openModal2() {
        Actions.ReportScreen();
    }
    openDesignationModal() {
        Actions.LeaveList();
    }

    gotoExpense() {
        Actions.Expenses();
    }
    gotoIncome() {
        Actions.Incomes();
    }
    openmodalforEmpList() {
        Actions.EmployeeSetupScreen();
    }
    _bootstrapAsync = async () => {
        var response = await loadFromStorage(storage, CurrentUserProfile);
        await this.setState({ Name: response.item.UserFullName });
        await this.setState({ Phone: response.item.PhoneNumber });
        await this.setState({ Email: response.item.Email });
        await this.setState({ CompanyName: response.item.CompanyName });
        await this.setState({ Address: response.item.Address });



        console.log(response, '...............');
    }
    openModal3() {
        Actions.Notice();
    }
    logOut = () => {
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
                onPress: async () => {
                    await clearStorageValue();
                    Actions.auth({ type: 'reset' })

                }
            },], {
            cancelable: false
        }
        )
        return true;
    };
    render() {
        const win = Dimensions.get('window');
        return (
            <View style={SettingStyle.container}>
                <StatusBarPlaceHolder />
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        {/* <TouchableOpacity
                            style={CommonStyles.HeaderMenuicon}
                            onPress={() => { Actions.drawerOpen(); }}>
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../../../assets/images/menu_b.png')}>
                            </Image>
                        </TouchableOpacity> */}
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
                    <View style={SettingStyle.profileContainer}>
                        <View style={SettingStyle.settingImageCotainer}>
                            <Image
                                style={SettingStyle.porfileImage}
                                source={require('../../../../assets/images/employee.png')}
                                resizeMode='cover'
                            />
                            <View style={{}}>
                                <Text
                                    style={SettingStyle.profileName}>
                                    {this.state.Name}
                                </Text>
                                <Text
                                    style={SettingStyle.profilePhone}>
                                    {this.state.Phone}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={SettingStyle.middleViewContainer}>
                        <View style={SettingStyle.view1}>
                            
                        </View>
                        <View style={SettingStyle.view1}>
                            <TouchableOpacity onPress={() => this.openModal3()}>
                                <View style={SettingStyle.view2}>
                                    <View
                                        style={SettingStyle.view3}>
                                        {/* <Image
                                            style={SettingStyle.view1Image}
                                            source={require('../../../assets/images/s_2.png')}>
                                        </Image> */}
                                        <Feather name="bell" size={20} color="#283d48"
                                            style={{ transform: [{ scaleX: -1 }] }}
                                        />
                                        <Text
                                            style={SettingStyle.text1}>
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

                        <View style={SettingStyle.view1}>
                            <TouchableOpacity onPress={() => this.modalchangepassword()}>
                                <View style={SettingStyle.view2}>
                                    <View
                                        style={SettingStyle.view3}>
                                        {/* <Image
                                            style={SettingStyle.view1Image}
                                            source={require('../../../assets/images/s_2.png')}>
                                        </Image> */}
                                         <Feather name="calendar" size={20} color="#283d48"
                                            style={{ transform: [{ scaleX: -1 }] }}
                                        />
                                        <Text
                                            style={SettingStyle.text1}>
                                            Leave List
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
                                        {/* <Image
                                            style={SettingStyle.view1Image}
                                            source={require('../../../assets/images/s_5.png')}>
                                        </Image> */}
                                         <AntDesign name="logout" size={20} color="red"
                                             style={{ transform: [{ scaleX: -1 }] }}
                                         />
                                        <Text
                                            style={[SettingStyle.text1]}>
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

