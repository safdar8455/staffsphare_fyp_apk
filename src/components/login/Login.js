import React, { Component } from 'react';
import LoginForm from '../login/LoginForm';
import { Text, StyleSheet, Platform, Dimensions, View, Image, StatusBar, ScrollView } from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;


var { width, height } = Dimensions.get('window');

export default class Login extends Component
{
    render()
    {
        return (
            <View style={styles.container}>
            
           <View>
                 {/* <Text style={{fontSize:16,fontWeight:'bold'}}>Admin Credential:111222/123456</Text>
                 <Text style={{fontSize:16,fontWeight:'bold'}}>User Credential:002/123456</Text> */}
           </View>
                
                <View style={[styles.logoContainer]}>
                    <Image style={{
                                flex: 1,
                                margin: 10,
                                width: "90%",
                                }}
                                resizeMode="contain" 
                                source={require('../../../src/assets/images/login.png')}>
                   </Image>
                </View>
                <View style={{ flex: 1}}>
                    <LoginForm phoneno={this.props.phoneno} />
                </View>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    logoContainer: {
        marginTop: (height * 5) / 100,
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignItems: "center"
    },
})
