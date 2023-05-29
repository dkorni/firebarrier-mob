import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const ConnectMenu = ({navigation}) => {
  const [sessionName, setSessionname] = useState('');

  const handleConnect = () => {
    // Implement sign-in logic here
    console.log('Connecting...');
  };

  const create = () => {
    // Implement sign-in logic here
    console.log('Creating...');
    navigation.navigate('LiveCallWindow');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Session code"
        value={sessionName}
        onChangeText={(text) => setSessionname(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleConnect}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={create}>
        <Text style={styles.buttonText}>Create a session</Text>
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
    marginBottom:20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default ConnectMenu;
