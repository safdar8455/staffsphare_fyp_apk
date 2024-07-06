import React, { Component } from 'react';
import {View} from 'react-native'
import { loadFromStorage, storage, CurrentUserProfile } from "../../common/storage";
import AdminTodayAttendance  from '../screen/adminScreen/attendance/AdminTodayAttendance';
import MyPanel  from '../screen/userScreen/myPanel/MyPanel';
import { Actions } from 'react-native-router-flux';

export default class Dashboard extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
            userType: 'admin'
        }
    }

    async  componentDidMount() {
        var userDetails = await loadFromStorage(storage, CurrentUserProfile);
        this.setState({ userType: userDetails.item.UserType })
        global.userType=userDetails.item.UserType;
    };

    render() {
        // <View>{Actions.TabAdmin()}</View>  TabUser
    return this.state.userType=='admin' ?<View>{Actions.TabAdmin()}</View>  : <View>{Actions.TabUser()}</View>;
     };
}