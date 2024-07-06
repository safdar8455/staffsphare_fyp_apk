import React from "react";
import { ActivityIndicator, AsyncStorage,StatusBar, StyleSheet, View } from "react-native";
import { Actions } from 'react-native-router-flux';
import { loadFromStorage, storage, CurrentUserProfile, clearStorageValue } from "../../common/storage";

export default class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    var response = await loadFromStorage(storage, CurrentUserProfile);

    if (response && response.isSuccess) {

      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        Actions.Dashboard();
      }
      else {
        await clearStorageValue();
        Actions.login();
      }
    } else {
      await clearStorageValue();
      Actions.login();
    }
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator /><StatusBar barStyle="default" />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
