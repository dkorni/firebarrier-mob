import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import app from './app.json'
import * as SecureStore from 'expo-secure-store';
import Context from './Context';

const SignUpWindow = ({navigation}) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDeafmute, setDeafmute] = useState(false);

  const handleSignUp = async () => {


    const url = app.WebApi+"/auth/signup";

    const body = {
      firstname:firstname,
      lastname:lastname,
      nickname:nickname,
      email:email,
      password:password,
      isDeafmute:isDeafmute
    }

    console.log(url);
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
        throw new Error('Wrong password');
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
    
    // Implement sign-up logic here

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="First name"
        value={firstname}
        onChangeText={(text) => setFirstname(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={lastname}
        onChangeText={(text) => setLastname(text)}
      />
       <TextInput
        style={styles.input}
        placeholder="Nickname"
        value={nickname}
        onChangeText={(text) => setNickname(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.checkboxContainer}>
      <CheckBox value={isDeafmute} onValueChange={setDeafmute}>
      </CheckBox>
      <Text style={styles.label}>Are you deafmuted?</Text>
      </View>
     
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  }
};

export default SignUpWindow;
