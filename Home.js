/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button
} from 'react-native';
import firebase from 'react-native-firebase';

export default class HomeScreen extends React.Component {
  getCurrentPosition() {
    this.watchTimer = navigator.geolocation.watchPosition(
      this._onLocationChanged,
      this._onLocationError,
      this.geoOptions
    );
  }

  _onLocationChanged = async location => {
    console.log('location changed====', location);
    this.setState(location.coords);
  };

  _onLocationError = err => {
    console.log('err===', err);
    if (err.message === 'No location provider available.') {
      Alert.alert('', 'Please turn on location service to get better results');
    } else if (err.message === 'Location request timed out') {
      navigator.geolocation.getCurrentPosition(
        this._onLocationChanged,
        this._onLocationError,
        this.geoOptions
      );
    }
  };
  componentDidMount() {
    this.getCurrentPosition();
  }
  constructor(props) {
    super(props);
    this.state = { latitude: '', longitude: '' };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
          latitude : {this.state.latitude} longitude:{this.state.longitude}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },

  textInputStyle: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: 'lightgray'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: 'transparent'
  }
});
