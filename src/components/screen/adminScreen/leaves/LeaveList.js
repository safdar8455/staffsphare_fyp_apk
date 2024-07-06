import React from 'react';
import {
    Platform, StatusBar, Dimensions, RefreshControl,
    TouchableOpacity, View, Text, FlatList, Image, ScrollView,
    ActivityIndicator, AsyncStorage
} from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { Actions } from 'react-native-router-flux';
import * as actions from '../../../../common/actions';
import { GetLeaevList, LeaveApproved, LeaveRejected, leaveCorrection } from '../../../../services/api/Leave';
import { LeaveListStyle } from './LeaveListStyle';
import { SearchBar } from 'react-native-elements';
import { CommonStyles } from '../../../../common/CommonStyles';

export default class LeaveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leaveList: [],
            progressVisible: true,
            refreshing: false
        }
        this.arrayholder = [];
    }
    _onRefresh = async () => {
        this.setState({ refreshing: true });
        setTimeout(function () {
            this.setState({
                refreshing: false,
                userId: ""
            });

        }.bind(this), 2000);
        this.getLeaveList(false);
    };
    goBack() {
        Actions.pop();
    }
    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                lightTheme
                containerStyle={{ backgroundColor: '#f6f7f9', }}
                inputContainerStyle={{ backgroundColor: 'white', }}
                round
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
            />
        );
    };
    searchFilterFunction = text => {
        this.setState({
            value: text,
        });
        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.EmployeeName.toUpperCase()} ${item.EmployeeName.toUpperCase()} ${item.EmployeeName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            leaveList: newData,
        });
    };
    async componentDidMount() {
        this.getLeaveList(true);
    }
    getLeaveList = async (isProgress) => {
        try {
            this.setState({ progressVisible: isProgress });
            await GetLeaevList()
                .then(res => {
                    console.log(res.result);
                    this.setState({ leaveList: res.result, progressVisible: false });
                    this.arrayholder = res.result;
                })
                .catch(() => {
                    this.setState({ progressVisible: false });
                    console.log("error occured");
                });
        } catch (error) {
            this.setState({ progressVisible: false });
            console.log(error);
        }
    }
    goToDetails(item){
        actions.push("LeaveDetails", { Model: item});
    }
    leaveApprove = async (item) => {
        const uId = await AsyncStorage.getItem("userId");
        await LeaveApproved(item.Id)
            .then(res => {
                this.getLeaveList(true);
            })
            .catch(() => {
                this.setState({ progressVisible: false });
                console.log("error occured");
            });
    }

    leaveReject = async (item) => {
        await LeaveRejected(item.Id)
            .then(res => {
                this.getLeaveList(true);
            })
            .catch(() => {
                this.setState({ progressVisible: false });
                console.log("error occured");
            });

        this.getLeaveList(true);
    }
    leaveCorrection = async (item) => {
        await leaveCorrection(item.Id)
            .then(res => {
                this.getLeaveList(true);
            })
            .catch(() => {
                this.setState({ progressVisible: false });
                console.log("error occured");
            });
        this.getLeaveList(true);
    }

    render() {
        var { width, height } = Dimensions.get('window');
        return (
            <View style={LeaveListStyle.container}>
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
                                LEAVE REQUESTS
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, }}>
                    {this.state.progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={LeaveListStyle.loaderIndicator} />) : null}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, }}>
                            <FlatList
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh.bind(this)}/>
                                }
                                data={this.state.leaveList}
                                keyExtractor={(x, i) => i.toString()}
                                renderItem={({ item }) =>
                               
                                    <View
                                        style={LeaveListStyle.listContainer}>
                                        <View style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: .4, padding: 8, paddingLeft: 0 }}>
                                            <Text style={{ fontFamily: 'Montserrat_SemiBold', fontSize: 14 }}>{item.EmployeeName}</Text>
                                        </View>
                                        <View style={LeaveListStyle.listInnerContainer}>
                                            <Text style={LeaveListStyle.leaveType}>
                                                Cause:
                                           </Text>
                                            <Text style={LeaveListStyle.leaveFrom}>
                                                From:
                                            </Text>
                                        </View>

                                        <View style={LeaveListStyle.leaveReasonContainer}>
                                            <Text
                                                style={[LeaveListStyle.leaveReasonText,
                                                { fontFamily: 'Montserrat_SemiBold' }]}>
                                                {item.LeaveReason}
                                            </Text>
                                            <Text
                                                style={LeaveListStyle.reasonFromDate}>
                                                {item.FromDateVw}
                                            </Text>
                                        </View>
                                        <View
                                            style={LeaveListStyle.causeContainer}>
                                            <Text
                                                style={LeaveListStyle.causeText}>
                                                Leave Type:
                                            </Text>
                                            <Text
                                                style={LeaveListStyle.leaveToText}>
                                                To:
                                           </Text>
                                        </View>
                                        <View
                                            style={LeaveListStyle.detailsContainer}>
                                            <Text
                                                style={LeaveListStyle.reasonFromDate}>
                                                {item.LeaveType}
                                            </Text>
                                            <Text
                                                style={LeaveListStyle.detailsTextInner}>
                                                {item.ToDateVw}
                                            </Text>
                                        </View>
                                        {(item.ApprovedBy != null && item.ApprovedBy != '') ?
                            <View
                                style={LeaveListStyle.approvedByContainer}>
                                <Text
                                    style={LeaveListStyle.approvedByText}>
                                    Approved By: {item.ApprovedBy}
                                </Text>
                                <Text
                                    style={LeaveListStyle.approvedAtText}>
                                    Approved At: {item.ApprovedAtVw}
                                </Text>
                            </View>
                            : null}

                            { (!item.IsApproved && !item.IsRejected)?   
                                  <View
                                  style={LeaveListStyle.buttonContainer}
                              >
                                  <View style={LeaveListStyle.foraligmentitem}>
                                  <TouchableOpacity
                                  onPress={() => this.leaveApprove(item)}                                           
                                      style={LeaveListStyle.buttonTouchable}
                                  >
                                      <Text style={LeaveListStyle.approveText}>
                                          APPROVE
                                      </Text>
                                  </TouchableOpacity>
                                 
                                  <TouchableOpacity
                                  onPress={() => this.leaveReject(item)}    
                                  
                                      style={LeaveListStyle.rejectButtonTouchable}
                                  >
                                      <Text
                                          style={LeaveListStyle.rejectText}
                                      >
                                          REJECT
                                      </Text>
                                  </TouchableOpacity>
                                  </View>
                                  <Text style={LeaveListStyle.statusDate1}>
                                  {item.LeaveInDays} Days
  
                                  </Text>

                              </View>
                            :
                            <View
                            style={LeaveListStyle.statusButton}>
                            <View
                                style={LeaveListStyle.statusButtonInner}>

                                {item.IsApproved == true ? (<Text style={{ color: 'green', }}>Approved</Text>) : (item.IsRejected == true ? (<Text style={{ color: 'red', }}>Rejected</Text>) : (<Text style={{ color: '#f1b847', }}>Pending</Text>))}
              
                            </View>
                           
                            <Text
                                style={LeaveListStyle.statusDate}
                            >
                                {item.LeaveInDays} Days

                            </Text>
                           
                        </View>
                        }
                    </View>
                    
                    }
                                ListHeaderComponent={this.renderHeader()}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}