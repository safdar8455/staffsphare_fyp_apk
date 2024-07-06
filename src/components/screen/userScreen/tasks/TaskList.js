import React, { Component } from 'react';
import
{
    Text, View, Image, StatusBar,
    BackHandler, AsyncStorage, Dimensions,
    TouchableOpacity, Platform, Alert, RefreshControl,
    ActivityIndicator, ScrollView,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from "lodash";
import { TaskStyle } from './TaskStyle';
import { GetAssignedToMeTasks } from '../../../../services/api/TaskService';
import { Actions } from 'react-native-router-flux';
 import * as actions from '../../../../common/actions';
import TaskLists from "./TaskListComponent"
import { CommonStyles } from '../../../../common/CommonStyles';


import FontAwesome from 'react-native-vector-icons/FontAwesome'

var screen = Dimensions.get('window');

export default class UserTaskList extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            progressVisible: false,
            refreshing: false,
            userId: "",
            taskList: [],

        }
        this.arrayholder = [];
    }

    _onRefresh = async () =>
    {
        this.setState({ refreshing: true });
        setTimeout(function ()
        {
            this.setState({
                refreshing: false,
            });

        }.bind(this), 2000);

        this.getTaskList(this.state.userId, false);
    };

    async componentDidMount()
    {
        const uId = await AsyncStorage.getItem("userId");
        this.setState({ userId: uId });
        this.getTaskList(uId, true);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    async  componentWillReceiveProps(){       
        this.getTaskList(this.state.userId, true);
    }

    componentWillMount()
    {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () =>
    {
      BackHandler.exitApp()
        return true;
    }
    searchFilterFunction = text =>
    {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item =>
        {
            const itemData = `${item.Title.toUpperCase()} ${item.Title.toUpperCase()} ${item.Title.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            taskList: newData,
        });
    };

    renderHeader = () =>
    {
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
    getTaskList = async (userId, isProgress) =>
    {
        try
        {
            this.setState({ progressVisible: isProgress });
            await GetAssignedToMeTasks(userId)
                .then(res =>
                {
                    this.setState({ taskList: res.result });
                    console.log(this.arrayholder, 'taskresutl...');
                    this.setState({ progressVisible: false });
                })
                .catch(() =>
                {
                    this.setState({ progressVisible: false });
                    console.log("error occured");
                });

        } catch (error)
        {
            this.setState({ progressVisible: false });
            console.log(error);
        }
    }

    goToCreateTask()
    {
        Actions.CreateTask()
    }

    gotoDetails(task)
    {
        actions.push("ViewTask", { TaskModel: task, arrayholder: this.arrayholder, });
    }

    render()
    {

        return (
            <View
                style={TaskStyle.container}>
            
                <View
                    style={CommonStyles.HeaderContent}>
                    <View
                        style={CommonStyles.HeaderFirstView}>
                        
                        <View
                            style={CommonStyles.HeaderTextView}>
                            <Text
                                style={CommonStyles.HeaderTextstyle}>
                                TASK
                            </Text>
                        </View>
                    </View>
                </View>
                {this.state.progressVisible == true ? (<ActivityIndicator size="large" color="#1B7F67" style={TaskStyle.loaderIndicator} />) : null}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    <TaskLists itemList={this.state.taskList} headerRenderer={this.renderHeader()} />
                </ScrollView>
                {/* <TouchableOpacity
                onPress={() => this.goToCreateTask()}
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        height: 70,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 100,
                    }}
                >
                    <FontAwesome name="plus"  size={30} color="#fff" />
                </TouchableOpacity> */}
            </View >
        )
    }
}


