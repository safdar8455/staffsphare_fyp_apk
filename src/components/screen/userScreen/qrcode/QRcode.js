
// import React from './node_modules/react';
import React, { useState, useEffect } from 'react';
import {
    Platform, StatusBar, Dimensions, RefreshControl, TouchableOpacity,
    View, Text, FlatList, Image, ScrollView, ActivityIndicator,
    AsyncStorage, Alert, BackHandler, StyleSheet, Button,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as actions from '../../../../common/actions';
import { QRcodeStyle } from './QRcodeStyle';
import { getNotice } from '../../../../services/api/Notice';
import { CommonStyles } from '../../../../common/CommonStyles';

import * as Permissions from 'expo-permissions'

import { urlDev, urlResource } from '../../../../services/configuration/config';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class QRcode extends React.Component {

    constructor() {
        super();
        this.state = {
            refreshing: false,
            hasCameraPermission: null,
            scanned: false,
        }
    }
    goBack() {
        Actions.pop();
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        setTimeout(function () {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);
    }


    async componentDidMount() {
        this.getPermissionsAsync();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    getPermissionsAsync = async () => {
        const {
            status
        } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted'
        });
    };
    componentWillMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        BackHandler.exitApp()
        return true;
    }

    handleBarCodeScanned = ({
        type,
        data
    }) => {
        this.setState({
            scanned: true
        });
        actions.push("ProxyPanel", { Model: data});
    };

    render() {
        const {
            hasCameraPermission,
            scanned
        } = this.state;

        if (hasCameraPermission === null) {
            return (<View>
                <Text > Requesting for camera permission </Text>
            </View>)
        }
        if (hasCameraPermission === false) {
            return (<View>
                <Text >No access to camera </Text>
            </View>)
        }
        return (
            <View style={QRcodeStyle.container}>

                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        <TouchableOpacity
                            style={CommonStyles.HeaderMenuicon}
                            onPress={() => { Actions.pop(); }}>
                            <Image resizeMode="contain" style={CommonStyles.HeaderMenuiconstyle}
                                source={require('../../../../assets/images/left_arrow.png')}>
                            </Image>
                        </TouchableOpacity>

                        <View
                            style={CommonStyles.HeaderTextView}>
                            <Text
                                style={CommonStyles.HeaderTextstyle}>
                                QRcode Scanner
                        </Text>
                        </View>
                    </View>
                    <View
                        style={QRcodeStyle.createNoticeButtonContainer}>

                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        marginTop: 10,
                        marginBottom: 10,
                    }}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                    {
                        scanned && (<
                            Button title={
                                'Tap to Scan Again'
                            }
                            onPress={
                                () => this.setState({
                                    scanned: false
                                })
                            }
                        />
                        )
                    }
                </View>
            </View>
        );
    }
}
