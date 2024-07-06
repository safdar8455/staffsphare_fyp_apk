import React, { Component } from 'react';
import RegisterForm from './RegisterForm';
import { KeyboardAvoidingView, StyleSheet, Platform, Dimensions, View, Image, Text, StatusBar, ScrollView } from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight;
function StatusBarPlaceHolder()
{
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

export default class Register extends Component
{
    static navigationOptions = {
        title: "Screen One", header: null
    }
    render()
    {
        const { navigate } = this.props.navigation;
        return (
            <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StatusBarPlaceHolder />
                    <View style={styles.mainView}>
                        <Text style={styles.AdminText}>
                            ADMIN
                        </Text>
                        <Text style={styles.RegisterText}>
                            REGISTER
                        </Text>
                    </View>
                    <RegisterForm />
                </ScrollView>
            </KeyboardAvoidingView>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f6f8',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    imageContainer: {
        flex: 1

    },
    logo: {

        width: 355,
        height: 250,
        top: -35
    },
    AdminText: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
        textAlign: "left",
        color: "#9f9f9f"
    },
    RegisterText: {
        fontFamily: "Montserrat_Bold",
        fontSize: 31,
        textAlign: "left",
        color: "#030303"
    },
    mainView: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
})
