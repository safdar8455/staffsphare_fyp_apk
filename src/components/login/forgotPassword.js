import React, { Component } from 'react';
import {
    KeyboardAvoidingView, StyleSheet, Platform,ToastAndroid,
    Dimensions, View, Image, TextInput, TouchableOpacity,
    Text, StatusBar, ScrollView, BackHandler
} from 'react-native';
import { Feather, MaterialIcons, Entypo } from '@expo/vector-icons';
import { Loading } from '../../common/loading';
import { ProgressDialog, ConfirmDialog } from 'react-native-simple-dialogs';
import { Actions } from 'react-native-router-flux';
import { ResetPassword } from '../../services/api/AccountService';
import { CommonStyles } from '../../common/CommonStyles'



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
var { width, height } = Dimensions.get('window');



export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            PhoneNumber: '',
            Email: '',
            alertHeading:'',
        };
    }
    static navigationOptions = {
        title: "Screen One", header: null
    }
    signIn() {
        Actions.login();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
        Actions.login();
        return true;
    }
    onPressResetButton = async () => {
        
        
            if (this.state.PhoneNumber != "" && this.state.Email != "") {
                this.onFetchResetRecords();
            } else {
                Alert.alert(
                    "",
                    "Please fill up all field ",
                    [
                        { text: 'OK', },
                    ],
                    { cancelable: false }
                )
            }

        
    }

    goBack() {
        Actions.pop();
    }

    async onFetchResetRecords() {
        alert("pi");
        try {
            let data = {
                LoginId: this.state.PhoneNumber,
                Email: this.state.Email,
            };
            console.log(data, '......')
           // this.setState({ loading: true });
            let response = await ResetPassword(data);
            console.log('rege', response);
            if (response && response.result.Success) {
                // Actions.login();
                ToastAndroid.show("Please check your email for a new temporary password.", ToastAndroid.TOP);
            } else {
                ToastAndroid.show("Invalid Phone Number or Email", ToastAndroid.TOP);
            }
            this.setState({ loading: false });

        } catch (errors) {
          
            ToastAndroid.show(errors, ToastAndroid.TOP);
        }
    }


    render() {
        const { navigate } = this.props.navigation;
        return (
            <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mainView}>
                            <View style={{alignItems:'flex-start'}}>
                                <TouchableOpacity
                                    style={{paddingTop:5, }}
                                    onPress={() => { this.goBack() }}>
                                    <Image resizeMode="contain" style={{ width: 25, height: 25, }}
                                        source={require('../../assets/images/back.png')}>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems:'center'}}>
                                <Text style={styles.AdminText}>
                                    Reset Password
                        </Text>
                            </View>
                            <View style={{alignItems:'flex-end'}}>
                               
                            </View>

                        </View>
                    
                    <View style={styles.container}>
                      
                    
                        <View style={{ marginTop: "20%" }}>
                            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                                <Entypo name="old-mobile" size={20} color="#4b4b4b"
                                    style={styles.InputIcon} />
                                <TextInput style={styles.TextInput}
                                    placeholder="Login Id"
                                    placeholderTextColor="#cbcbcb" keyboardType="number-pad"
                                    returnKeyType="next" autoCorrect={false}

                                    onChangeText={mnumber => this.setState({ PhoneNumber: mnumber })}
                                    autoCorrect={false}
                                    onSubmitEditing={() => this.refs.txtEmmail.focus()}
                                    ref={"txtPhoneNumber"}
                                />
                            </View>
                            <View style={[styles.TextInputView, { marginBottom: 10 }]}>
                                <Feather name="at-sign" size={20} color="#4b4b4b"
                                    style={styles.InputIcon} />
                                <TextInput style={styles.TextInput}
                                    placeholder="Email"
                                    placeholderTextColor="#cbcbcb" keyboardType="default"
                                    returnKeyType="next" autoCorrect={false}

                                    onChangeText={Email => this.setState({ Email: Email })}

                                    autoCorrect={false}

                                    ref={"txtEmmail"}

                                />
                            </View>

                            <TouchableOpacity style={styles.LoginButtonReset}
                                onPress={() => this.onPressResetButton()}>
                                <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>

                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.TextStyle}>
                                        Reset Password
                            </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end', marginRight: 10, }}>
                                    <Entypo name="chevron-right" size={20} color="#ffffff" />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.signInTxt}>
                                <Text style={{ color: '#c6c7c7' }}>Need to </Text>
                                <TouchableOpacity onPress={this.signIn}>
                                    <Text> Sign In</Text>
                                </TouchableOpacity>
                                <Text style={{ color: '#c6c7c7' }}>?</Text>
                            </View>
                            <Loading showProgress={this.state.loading} />
                            
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
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
        backgroundColor: "#73b53b",
        borderRadius: 5,
        height: 45,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: (width * 80) / 100,
    },
    LoginButtonReset: {
        backgroundColor: "#518CFA",
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
    inputBox: {
        width: 300,
        height: 60,
        backgroundColor: '#ebebeb',
        color: '#2c2930',
        paddingHorizontal: 10,
        borderRadius: 10,
        textAlign: 'center',
        marginVertical: 10
    },
    horizontalLineContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    horizontalLine: {
        borderBottomColor: '#c3c4c6',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: 250,
        marginTop: 10
    },
    logoBottomText: {
        color: '#bababa',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        width: 250
    },
    buttonContainer: {
        backgroundColor: '#3e325a',
        borderRadius: 20,
        paddingVertical: 13,
        marginVertical: 20,
        width: 200,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
    buttonRegisterContainer: {
        backgroundColor: '#fff',
        paddingVertical: 11,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#3e325a',
        borderRadius: 30,
        width: 160
    },
    registerButtonText: {
        color: '#3e325a',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
    signInTxt: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 15,
        flexDirection: 'row'
    },
    RadioBtnText: {
        textAlign: "center", color: '#6C7272',
        fontFamily: "PRODUCT_SANS_BOLD", fontSize: 13,
        marginTop: 2,
        marginLeft: 3,
        marginRight: 4,
    },
    RadioBtnView: {
        flexDirection: "row", marginVertical: 10,
        alignItems: 'center',
    },
    ActivityIndicatorStyle: {
        position: 'absolute', left: 0, right: 0,
        bottom: 0, top: 0, justifyContent: 'center',
        alignContent: 'center',
    },
    AdminText: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        textAlign: "left",
        color: "#9f9f9f"
    },
    mainView: {
        marginTop:"1%",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})
