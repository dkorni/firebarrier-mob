import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Context from './Context';
import CallManager from './logic/CallManager';

import app from './app.json'

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}


async function SkipAuthIfNeeded(navigation){
 
    var token = await SecureStore.getItemAsync('secure_token');

    if(token != null){
  
      const url = app.WebApi+"/auth/ping";
  
      await fetch(url,{
        method:'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        }
      })
      .then(async (response) => {
        console.log(response.status);
        if(response.status == 200){
          Context.TOKEN = 'Bearer '+token;

          // subscribe on incoming calls
          let tokenData = JSON.parse(atob(token.split('.')[1]));
          CallManager.Init();
          await CallManager.SubcribeToIncomeCalls(tokenData.UserId,navigation);

          navigation.navigate('Contacts');
          return;
        }
        else
        {
          navigation.navigate('Start');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  
    }
    else{
      navigation.navigate('Start');
    }


}

const LoadingScreen = ({navigation}) => {
  SkipAuthIfNeeded(navigation);
  console.log("Loading screen");
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoadingScreen;