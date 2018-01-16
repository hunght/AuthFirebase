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
  View,
  Button,
  TextInput
} from 'react-native';
import firebase from 'react-native-firebase';
import PhoneInput from 'react-native-phone-input';
export default class App extends Component<{}> {
  logIn = phoneNumber => {
    firebase
      .auth()
      .verifyPhoneNumber(phoneNumber)
      .on(
        'state_changed',
        phoneAuthSnapshot => {
          // How you handle these state events is entirely up to your ui flow and whether
          // you need to support both ios and android. In short: not all of them need to
          // be handled - it's entirely up to you, your ui and supported platforms.

          // E.g you could handle android specific events only here, and let the rest fall back
          // to the optionalErrorCb or optionalCompleteCb functions
          switch (phoneAuthSnapshot.state) {
            // ------------------------
            //  IOS AND ANDROID EVENTS
            // ------------------------
            case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
              console.log('code sent');
              this.setState({
                textLog: 'code sent'
              });

              // on ios this is the final phone auth state event you'd receive
              // so you'd then ask for user input of the code and build a credential from it
              break;
            case firebase.auth.PhoneAuthState.ERROR: // or 'error'
              console.log('verification error');
              this.setState({
                textLog: phoneAuthSnapshot.error
              });
              console.log(phoneAuthSnapshot.error);
              break;

            // ---------------------
            // ANDROID ONLY EVENTS
            // ---------------------
            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
              console.log('auto verify on android timed out');
              // proceed with your manual code input flow, same as you would do in
              // CODE_SENT if you were on IOS
              break;
            case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
              // auto verified means the code has also been automatically confirmed as correct/received
              // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
              console.log('auto verified on android');
              console.log(phoneAuthSnapshot);
              this.logged();
              // Example usage if handling here and not in optionalCompleteCb:
              // const { verificationId, code } = phoneAuthSnapshot;
              // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

              // Do something with your new credential, e.g.:
              // firebase.auth().signInWithCredential(credential);
              // firebase.auth().linkWithCredential(credential);
              // etc ...
              break;
          }
        },
        error => {
          // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
          // the ERROR case in the above observer then there's no need to handle it here
          console.log(error);
          // verificationId is attached to error if required
          console.log(error.verificationId);
        },
        phoneAuthSnapshot => {
          // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
          // depending on the platform. If you've already handled those cases in the observer then
          // there's absolutely no need to handle it here.
          if (!phoneAuthSnapshot.code) {
            this.setState({
              textLog: 'Pls enter code number',
              phoneNumber: '',
              isCodeSent: true,
              phoneAuthSnapshot
            });
          }
          // Platform specific logic:
          // - if this is on IOS then phoneAuthSnapshot.code will always be null
          // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
          //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
          // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
          //   continue with user input logic.
          console.log(phoneAuthSnapshot);
        }
      );
    // optionally also supports .then & .catch instead of optionalErrorCb &
    // optionalCompleteCb (with the same resulting args)
  };

  logged = () => {
    const { navigate } = this.props.navigation;
    navigate('Home');
  };

  sendCode = code => {
    const { verificationId } = this.state.phoneAuthSnapshot;
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        console.log('credential =', credential, result);
        this.logged();
      });
  };
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      textLog: 'Pls enter phone number'
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}> {this.state.textLog} </Text>
        {this.state.isCodeSent ? (
          <TextInput
            keyboardType={'phone-pad'}
            style={styles.textInputStyle}
            value={this.state.phoneNumber}
            onChangeText={text =>
              this.setState({
                phoneNumber: text
              })
            }
          />
        ) : (
          <PhoneInput ref="phone" />
        )}

        <Button
          style={styles.instructions}
          title={this.state.isCodeSent ? 'Login with code number' : 'Login'}
          onPress={() => {
            this.state.isCodeSent
              ? this.sendCode(this.state.phoneNumber)
              : this.refs.phone.isValidNumber()
                ? this.logIn(this.refs.phone.getValue())
                : this.setState({
                    textLog: 'invalid phone number'
                  });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
