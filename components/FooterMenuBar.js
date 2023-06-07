import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Context from '../Context';

let nv = null;

async function logOut()
{
    Context.TOKEN = null;
    await SecureStore.deleteItemAsync('secure_token');
    nv.navigate('Start');
};

const FooterMenuBar = ({navigation}) => {
    nv = navigation;
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Contacts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={logOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    height: 56,
    elevation: 6,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default FooterMenuBar;
