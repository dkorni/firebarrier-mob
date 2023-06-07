import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import app from './app.json'
import * as SecureStore from 'expo-secure-store';
import Context from './Context';

const SignInWindow = ({navigation}) => {
  const [nickname, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {

    const url = app.WebApi+"/auth/signin";

    const body = {
      username:nickname,
      password:password
    }

    await fetch(url,{
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(body)
    })
    .then((response) => {
      if(response.status == 200)
        return response.json()
      
      else
        throw new Error('Wrong password: ' + response.status);
    })
    .then(async (responseJson) =>  {
       console.log(responseJson);
       await SecureStore.setItemAsync('secure_token', responseJson.token);
       Context.TOKEN = 'Bearer '+responseJson.token;
       navigation.navigate('Contacts');
    })
    .catch((error) => {
      console.error(error);
    });

    // Implement sign-in logic here
    console.log('Sign in');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Nickname"
        value={nickname}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default SignInWindow;
