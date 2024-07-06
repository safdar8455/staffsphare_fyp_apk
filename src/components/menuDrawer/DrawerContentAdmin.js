import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import config from '../../services/configuration/config';
import { DrawerContentStyle } from './DrawerContentStyle';
import { Feather } from '@expo/vector-icons';
import { clearStorageValue } from "../../common/storage";

const logOut = () => {
    global.DrawerContentId = 1;
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

const drawerContent = 1;
const drawerSelectedOption = (id) => {
    global.DrawerContentId = id

};
const DailyAttendanceCombo = () => {
    Actions.AdminTodayAttendance(); drawerSelectedOption(1);
}
const LiveTrackingCombo = () => {
    Actions.LiveTracking(); drawerSelectedOption(2);
}

const TasksCombo = () => {
    Actions.TabnavigationInTasks(); drawerSelectedOption(3);
}

const LeavesCombo = () => {
    Actions.LeaveList(); drawerSelectedOption(4);
}

const ReportsCombo = () => {
    Actions.ReportScreen(); drawerSelectedOption(5);
}

const NoticeCombo = () => {
    Actions.Notice(); drawerSelectedOption(6);
}


const LogoutCombo = () => {
    drawerSelectedOption(7);
    logOut();

}

export {
    DailyAttendanceCombo,
    LiveTrackingCombo,
    TasksCombo,
    LeavesCombo,
    ReportsCombo, NoticeCombo,
    drawerSelectedOption,
    LogoutCombo
}

export default class DrawerContentAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedId: 1,
        }
    }
    async componentDidMount() {
        global.DrawerContentId = 1;
    }

    render() {
        return (
            <View style={DrawerContentStyle.container}>

                <View
                    style={[DrawerContentStyle.logoImage,
                    {
                        marginBottom: 5,
                        justifyContent: "flex-start", alignItems: 'center', flexDirection: 'row'
                    }
                    ]}>
                    <Image
                        resizeMode='contain'
                        style={{ height: 38, width: 38, marginVertical: 40, }}
                        source={require('../../assets/images/icon.png')} >
                    </Image>
                    <Text style={{
                        marginLeft: 5,
                        fontSize: 26,
                        fontWeight: "bold",
                        color: "#fff",
                        fontFamily: "Montserrat_Bold",
                    }}>
                        {config.appTitle}
                    </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <TouchableOpacity
                        onPress={() => DailyAttendanceCombo()}
                        style={
                            global.DrawerContentId == 1 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Feather name="calendar" size={24}
                            style={{ transform: [{ scaleX: -1 }] }}
                        />

                        <Text style={ global.DrawerContentId == 1 ?
                                DrawerContentStyle.itemTextSelectedStyle :
                                DrawerContentStyle.itemTextStyle }>
                            Today Attendance
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => LiveTrackingCombo()}
                        style={
                            global.DrawerContentId == 2 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Feather name="map-pin" size={24}
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Employee Location
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => TasksCombo()}
                        style={
                            global.DrawerContentId == 3 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                        <Feather name="book-open" size={24}
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            All Tasks
                </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => LeavesCombo()}
                        style={
                            global.DrawerContentId == 4 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Feather name="calendar" size={24}
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Leaves
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => ReportsCombo()}
                        style={
                            global.DrawerContentId == 5 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                        <Feather name="file-text" size={24}
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Attendance Report
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => NoticeCombo()}
                        style={
                            global.DrawerContentId == 6 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>

                        <Feather name="bell" size={24}
                            style={{ transform: [{ scaleX: -1 }] }}
                        />
                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Notice Board
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => LogoutCombo()}
                        style={
                            global.DrawerContentId == 7 ?
                                DrawerContentStyle.itemContainerSelected :
                                DrawerContentStyle.itemContainer}>
                        <Feather name="log-out" size={25} color="#c24a4a" />

                        <Text style={DrawerContentStyle.itemTextStyle}>
                            Logout
                    </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        )
    }
}
