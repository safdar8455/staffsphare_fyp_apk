import React, { Component } from 'react';
import { Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import { Router, Stack, Scene, Drawer, ActionConst, Tabs } from 'react-native-router-flux';

// Common
import Login from '../components/login/Login';
import AuthLoading from '../components/login/AuthLoading';
import DrawerContent from '../components/menuDrawer/DrawerContent';
import ForgotPassword from '../components/login/forgotPassword';

// Dashboard
import Dashboard from '../components/dashboard/Dashboard';


//Admin

import AdminTodayAttendance from '../components/screen/adminScreen/attendance/AdminTodayAttendance';
import LiveTracking from '../components/screen/adminScreen/liveTracking/LiveTracking';
import ReportScreen from '../components/screen/adminScreen/reports/ReportScreen';
import DetailScreen from '../components/screen/adminScreen/reports/DetailScreen';
import DailyAttendanceDetails from '../components/screen/adminScreen/attendance/DailyAttendanceDetails';
import Notice from '../components/screen/adminScreen/notice/Notice';
import CreateNotice from '../components/screen/adminScreen/notice/CreateNotice';
import NoticeDetail from '../components/screen/adminScreen/notice/NoticeDetail';
import TaskListScreen from '../components/screen/adminScreen/tasks/TaskList';
import CompleteTaskFilter from '../components/screen/adminScreen/tasks/CompleteTaskFilter'
import ViewTask from '../components/screen/adminScreen/tasks/ViewTask';
import LeaveList from '../components/screen/adminScreen/leaves/LeaveList'
import LeaveDetails from '../components/screen/adminScreen/leaves/LeaveDetails'
import DailyAttendanceLocation from '../components/screen/adminScreen/attendance/DailyAttendanceLocation';
//User

import UserAttendance from '../components/screen/userScreen/attendance/UserAttendance';
import MyPanel from '../components/screen/userScreen/myPanel/MyPanel';
import UserNotice from '../components/screen/userScreen/notice/Notice';
import UserNoticeDetail from '../components/screen/userScreen/notice/NoticeDetail';
import UserTaskList from '../components/screen/userScreen/tasks/TaskList'
import UserViewTask from '../components/screen/userScreen/tasks/ViewTask'
import UserLeaveList from '../components/screen/userScreen/leaves/LeaveList'
import LeaveApply from '../components/screen/userScreen/leaves/LeaveApply'
import LeaveCorrection from '../components/screen/userScreen/leaves/LeaveCorrection'
import ApproveLeaveList from '../components/screen/userScreen/leaves/ApproveLeaveList' 
import QRcode from '../components/screen/userScreen/qrcode/QRcode' 
import ProxyPanel from '../components/screen/userScreen/proxyPanel/ProxyPanel' 
import SettingScreen from '../components/screen/adminScreen/setting/Setting'
import SettingScreenUser from '../components/screen/userScreen/setting/Setting' 
import CreateTask from '../components/screen/adminScreen/tasks/CreateTask';




export default class AppNavigator extends Component {

  render() {
    return (

      <Router>
        <Stack key="root" hideNavBar={true}>
          <Scene key="auth" component={AuthLoading} hideNavBar={true} />
          <Scene key="login" component={Login} title="Login" back={false} hideNavBar={true} />
          <Scene key="ForgotPassword" component={ForgotPassword} title="ForgotPassword" hideNavBar={true} />
          <Scene key="DrawerContent" component={DrawerContent} hideNavBar={true} />

          <Drawer key="drawer" drawerImage={{ uri: null }} contentComponent={DrawerContent} type={ActionConst.RESET} hideDrawerButton={false} hideNavBar={true}>
            <Scene key="auth" component={AuthLoading} hideNavBar={true} />
            <Scene key="Dashboard" component={Dashboard} hideNavBar={true} />
            <Scene key="AdminTodayAttendance" component={AdminTodayAttendance} hideNavBar={true} />
            <Scene key="LiveTracking" component={LiveTracking} hideNavBar={true} />
            {/* <Scene key="DailyAttendanceDetails" component={DailyAttendanceDetails} hideNavBar={true} /> */}
           
            {/* <Scene key="UserNotice" component={UserNotice} hideNavBar={true} /> */}
            <Scene key="UserAttendance" component={UserAttendance} hideNavBar={true} />

            <Scene key="MyPanel" component={MyPanel} hideNavBar={true} />
            <Scene key="UserLeaveList" component={UserLeaveList} hideNavBar={true} />
            <Scene key="ApproveLeaveList" component={ApproveLeaveList} hideNavBar={true} />
            <Scene key="SettingScreen" component={SettingScreen} hideNavBar={true} />

           
         
         
            <Tabs
              key="TabForLeaveApprove"
              tabs={true}
              tabBarStyle={{ backgroundColor: '#FFFFFF', }}
              tabStyle={{ flexDirection: 'row', }}
              labelStyle={{ fontSize: 14, marginTop: 12, marginRight: 60, }}
              activeBackgroundColor="white"
              activeTintColor="#26065c"
              inactiveBackgroundColor=" #FFFFFF"
              inactiveTintColor="#9e9e9e"
            >
              <Scene key="UserLeaveList" title="Leave List" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                    <Image source={require('../assets/images/list_s.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image>
                    :
                    <Image source={require('../assets/images/list_a.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image>
                )}>
                <Scene
                  key="UserLeaveList"
                  component={UserLeaveList}
                  title="Leave List"
                  initial
                  titleStyle={{ color: "red" }}
                />
              </Scene>
              <Scene key="ApproveLeaveList" title="Approve part" hideNavBar={true}

                icon={({ focused }) => (
                  focused ?
                    <Image source={require('../assets/images/com.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15, marginLeft: 5, }}></Image>
                    :
                    <Image source={require('../assets/images/com_a.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15, marginLeft: 5, }}></Image>
                )}>
                <Scene
                  key="ApproveLeaveList"
                  component={ApproveLeaveList}
                  title="Approve part"
                />
              </Scene>
            </Tabs>


            <Scene key="TaskListScreen" component={TaskListScreen} hideNavBar={true} />
            <Scene key="UserTaskList" component={UserTaskList} hideNavBar={true} />       
          </Drawer>
          
          <Tabs
              key="TabAdmin"
              tabBarStyle={{ backgroundColor: '#FFFFFF', }}
              labelStyle={{ fontSize: 14, padding: 1 }}
              activeBackgroundColor="white"
              activeTintColor="#26065c"
              inactiveBackgroundColor=" #FFFFFF"
              inactiveTintColor="#9e9e9e"
            >
               <Scene key="AdminTodayAttendance" title="Home" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                  <Entypo name="home" size={23} color="#2c82a1"
                  style={{ marginTop: 5 }} />
                :
                <Entypo name="home" size={23} color="#26065c"
                  style={{ marginTop: 5 }} />
                )}>
                <Scene
                  key="AdminTodayAttendance"
                  component={AdminTodayAttendance}
                  title="Attendance"
                  initial
                  titleStyle={{ color: "red" }}
                />
              </Scene>
              <Scene key="LiveTracking" title="Location" hideNavBar={true}

                icon={({ focused }) => (
                  focused ?
                  <Entypo name="location-pin" size={23} color="#2c82a1"
                  style={{ marginTop: 5 }} />
                :
                <Entypo name="location-pin" size={23} color="#26065c"
                  style={{ marginTop: 5 }} />
                )}>
                <Scene
                  key="Location"
                  component={LiveTracking}
                  title="Map View"
                />
              </Scene>
              <Scene key="TaskListScreen" title="Tasks" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                  <MaterialCommunityIcons name="playlist-edit" size={23} color="#2c82a1"
                  style={{ marginTop: 5 }} />
                :
                <MaterialCommunityIcons name="playlist-edit" size={23} color="#26065c"
                  style={{ marginTop: 5 }} />
                )}>
                <Scene
                  key="TaskListScreen"
                  component={TaskListScreen}
                  title="Tasks"
                  initial
                />
              </Scene>        
              <Scene key="More" title="More" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                  <Entypo name="dots-three-horizontal" size={23} color="#2c82a1"
                  style={{ marginTop: 5 }} />
                :
                <Entypo name="dots-three-horizontal" size={23} color="#26065c"
                  style={{ marginTop: 5 }} />
                )}>
                <Scene
                  key="More"
                  component={SettingScreen}

                  title="More"
                  initial
                />
              </Scene>

            </Tabs>

            <Tabs
              key="TabUser"
              tabBarStyle={{ backgroundColor: '#FFFFFF', }}
              labelStyle={{ fontSize: 14, padding: 1 }}
              activeBackgroundColor="white"
              activeTintColor="#26065c"
              inactiveBackgroundColor=" #FFFFFF"
              inactiveTintColor="#9e9e9e"
            >
               <Scene key="MyPanel" title="My Feed" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                  <Entypo name="check" size={23} color="#2c82a1"
                  style={{ marginTop: 5 }} />
                :
                <Entypo name="check" size={23} color="#26065c"
                  style={{ marginTop: 5 }} />
                )}>
                <Scene
                  key="MyPanel"
                  component={MyPanel}
                  title="My Feed"
                  initial
                />
              </Scene>
              <Scene key="UserLeaveList" title="Leave" hideNavBar={true}

                icon={({ focused }) => (
                  focused ?
                  <Entypo name="calendar" size={19} color="#2c82a1"
                  style={{ marginTop: 5 }} />
                :
                <Entypo name="calendar" size={19} color="#26065c"
                  style={{ marginTop: 5 }} />
                )}>
                <Scene
                  key="Leave"
                  component={UserLeaveList}
                  title="Leave"
                />
              </Scene>
              <Scene key="UserTaskList" title="Tasks" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                  <MaterialCommunityIcons name="playlist-edit" size={23} color="#2c82a1"
                  style={{ marginTop: 5 }} />
                :
                <MaterialCommunityIcons name="playlist-edit" size={23} color="#26065c"
                  style={{ marginTop: 5 }} />
                )}>
                <Scene
                  key="UserTaskList"
                  component={UserTaskList}
                  title="Tasks"
                  initial
                />
              </Scene>        
              <Scene key="More" title="More" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                  <Entypo name="dots-three-horizontal" size={23} color="#2c82a1"
                  style={{ marginTop: 5 }} />
                :
                <Entypo name="dots-three-horizontal" size={23} color="#26065c"
                  style={{ marginTop: 5 }} />
                )}>
                <Scene
                  key="More"
                  component={SettingScreenUser}

                  title="More"
                  initial
                />
              </Scene>

            </Tabs>


            <Tabs
              key="TabnavigationInTasks"
              tabs={true}
              tabBarStyle={{ backgroundColor: '#FFFFFF', }}
              tabStyle={{ flexDirection: 'row', }}
              labelStyle={{ fontSize: 14, marginTop: 12, marginRight: 60, }}
              activeBackgroundColor="white"
              activeTintColor="#26065c"
              inactiveBackgroundColor=" #FFFFFF"
              inactiveTintColor="#9e9e9e"
            >
              <Scene key="TaskListScreen" title="Pending" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                    <Image source={require('../assets/images/list_s.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image>
                    :
                    <Image source={require('../assets/images/list_a.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image>
                )}>
                <Scene
                  key="TaskListScreen"
                  component={TaskListScreen}
                  title="Pending"
                  initial
                  titleStyle={{ color: "red" }}
                />
              </Scene>
              <Scene key="CompleteTaskFilter" title="Done" hideNavBar={true}

                icon={({ focused }) => (
                  focused ?
                    <Image source={require('../assets/images/com.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15, marginLeft: 5, }}></Image>
                    :
                    <Image source={require('../assets/images/com_a.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15, marginLeft: 5, }}></Image>
                )}>
                <Scene
                  key="CompleteTaskFilter"
                  component={CompleteTaskFilter}
                  title="Completed"
                />
              </Scene>
            </Tabs>
            <Tabs
              key="DetailsContainer"
              tabBarStyle={{ backgroundColor: '#FFFFFF', }}
              labelStyle={{ fontSize: 14, padding: 5 }}
              activeBackgroundColor="white"
              activeTintColor="#26065c"
              inactiveBackgroundColor=" #FFFFFF"
              inactiveTintColor="#9e9e9e"
            >
              <Scene key="DailyAttendanceDetails" title="Time Line" hideNavBar={true}

                icon={({ focused }) => (
                  focused ?
                    <Image source={require('../assets/images/goal.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }}></Image>
                    :
                    <Image source={require('../assets/images/goal.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }}></Image>
                )}>
                <Scene
                  key="DailyAttendanceDetails"
                  component={DailyAttendanceDetails}
                  title="Time Line"
                  initial
                />
              </Scene>

               <Scene key="DailyAttendanceLocations" title="Map View" hideNavBar={true}

                icon={({ focused }) => (
                  focused ?
                    <Image source={require('../assets/images/pin_s.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }}></Image>
                    :
                    <Image source={require('../assets/images/pin.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15 }}></Image>
                )}>
                <Scene
                  key="DailyAttendanceLocation"
                  component={DailyAttendanceLocation}
                  title="Map View"
                />
              </Scene>
              {/*
              <Scene key="UserSpecificTasks" title="Tasks" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                    <Image source={require('./assets/images/list_s.png')} resizeMode='contain' style={{ height: 20, width: 20, marginBottom: 5, marginTop: 15, }}></Image>
                    :
                    <Image source={require('./assets/images/list_a.png')} resizeMode='contain' style={{ height: 20, width: 20, marginBottom: 5, marginTop: 15, }}></Image>
                )}>
                <Scene
                  key="UserSpecificTasks"
                  component={UserSpecificTasks}
                  title="Tasks"
                  initial
                />
              </Scene>
              <Scene key="UserSpecificLeave" title="Leave" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                    <Image source={require('./assets/images/briefcase_s.png')} resizeMode='contain' style={{ height: 20, width: 20, marginBottom: 5, marginTop: 15, }}></Image>
                    :
                    <Image source={require('./assets/images/briefcase.png')} resizeMode='contain' style={{ height: 20, width: 20, marginBottom: 5, marginTop: 15, }}></Image>
                )}>
                <Scene
                  key="UserSpecificLeave"
                  component={UserSpecificLeave}

                  title="Leave"
                  initial
                />
              </Scene> */}


            </Tabs>
          
         
         
{/* 
          <Tabs
              key="TabAdmin"
              tabs={true}
              tabBarStyle={{ backgroundColor: '#FFFFFF', }}
              tabStyle={{ flexDirection: 'row', }}
              labelStyle={{ fontSize: 14, marginTop: 12, marginRight: 60, }}
              activeBackgroundColor="white"
              activeTintColor="#26065c"
              inactiveBackgroundColor=" #FFFFFF"
              inactiveTintColor="#9e9e9e"
            >
              <Scene key="AdminTodayAttendance" title="Attendance" hideNavBar={true}
                icon={({ focused }) => (
                  focused ?
                    <Image source={require('../assets/images/list_s.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image>
                    :
                    <Image source={require('../assets/images/list_a.png')} style={{ height: 20, width: 20, marginTop: 15, marginLeft: 25, }} resizeMode="contain"></Image>
                )}>
                <Scene
                  key="AdminTodayAttendance"
                  component={AdminTodayAttendance}
                  title="Attendance"
                  initial
                  titleStyle={{ color: "red" }}
                />
              </Scene>
              <Scene key="CompleteTaskFilter" title="Done" hideNavBar={true}

                icon={({ focused }) => (
                  focused ?
                    <Image source={require('../assets/images/com.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15, marginLeft: 5, }}></Image>
                    :
                    <Image source={require('../assets/images/com_a.png')} resizeMode='contain' style={{ height: 20, width: 20, marginTop: 15, marginLeft: 5, }}></Image>
                )}>
                <Scene
                  key="CompleteTaskFilter"
                  component={CompleteTaskFilter}
                  title="Completed"
                />
              </Scene>
            </Tabs>
          */}



          <Scene key="Notice" component={Notice} hideNavBar={true} />
          <Scene key="ReportScreen" component={ReportScreen} hideNavBar={true} />
          <Scene key="LeaveList" component={LeaveList} hideNavBar={true} />
          <Scene key="QRcode" component={QRcode} hideNavBar={true} />
          <Scene key="CreateNotice" onBack={() => Actions.pop({ refresh: {} })} component={CreateNotice} hideNavBar={true} />
          <Scene key="NoticeDetail" component={NoticeDetail} hideNavBar={true} />
          <Scene key="UserNoticeDetail" component={UserNoticeDetail} hideNavBar={true} />
          <Scene key="ViewTask" component={ViewTask} hideNavBar={true} />
          <Scene key="UserViewTask" component={UserViewTask} hideNavBar={true} />
          <Scene key="LeaveApply" component={LeaveApply} hideNavBar={true} />
          <Scene key="LeaveCorrection" component={LeaveCorrection} hideNavBar={true} />
          <Scene key="ProxyPanel" component={ProxyPanel} hideNavBar={true} />
          <Scene key="LeaveDetails" component={LeaveDetails} hideNavBar={true} />  
          <Scene key="CreateTask" component={CreateTask} hideNavBar={true} />
          <Scene key="DailyAttendanceDetails" component={DailyAttendanceDetails} hideNavBar={true} />
          <Scene key="DetailScreen" component={DetailScreen} hideNavBar={true} /> 
          <Scene key="UserNotice" component={UserNotice} hideNavBar={true} />
        </Stack>
      </Router>
    )
  }
}

