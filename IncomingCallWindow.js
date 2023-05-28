import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const IncomingCallWindow = ({ callerName, callerAvatar, onRespond, onTerminate }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./user.png')} style={styles.avatar} />
      {/* ${callerName} */}
      <Text style={styles.callerName}>{`Denys Korniienko is calling you`}</Text>
      <TouchableOpacity style={styles.respondButton} onPress={onRespond}>
        <Text style={styles.buttonText}>Respond</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.terminateButton} onPress={onTerminate}>
        <Text style={styles.buttonText}>Terminate</Text>
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
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  callerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  respondButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  terminateButton: {
    backgroundColor: '#FF3B30',
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

export default IncomingCallWindow;
