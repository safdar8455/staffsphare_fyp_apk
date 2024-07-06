import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font'
import AppNavigator from './src/navigation/AppNavigator';
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import config from "./src/services/configuration/config"
const pubnub = new PubNub({
  subscribeKey: config.pubnubSubscribeKey,
  publishKey: config.pubnubPublishKey
});
export default class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      loading: true,
      fontsLoaded: false
    };

  }

  async componentDidMount() {
    await Font.loadAsync({
      'PRODUCT_SANS_REGULAR': require('./src/assets/fonts/PRODUCT_SANS_REGULAR.ttf'),
      'Montserrat_Bold': require('./src/assets/fonts/Montserrat_Bold.ttf'),
      'Montserrat_Medium': require('./src/assets/fonts/Montserrat_Medium.ttf'),
      'Montserrat_SemiBold': require('./src/assets/fonts/Montserrat_SemiBold.ttf'),
      'OPENSANS_BOLD': require('./src/assets/fonts/OPENSANS_BOLD.ttf'),
      'OPENSANS_REGULAR': require('./src/assets/fonts/OPENSANS_REGULAR.ttf'),
      'PRODUCT_SANS_BOLD': require('./src/assets/fonts/PRODUCT_SANS_BOLD.ttf')
    });

    this.setState({ fontsLoaded: true, loading: false });
  }

  render() {
    if (this.state.loading === true) {
      return (<ActivityIndicator size="large" color="#1B7F67" style={styles.container} />)
    }
    else {
      return (<AppNavigator>
        <PubNubProvider client={pubnub}></PubNubProvider>
      </AppNavigator>);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

