import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import CallManager from './logic/CallManager';

async function HangUp(id,navigation){
  await CallManager.HangUp(id, navigation);
}

const OutcomingCallWindow = ({navigation, route, callerAvatar, onRespond, onTerminate }) => {
  let receiverId = route.params?.receiverId;
  let receiverName = route.params?.receiverName;
  return (
    <View style={styles.container}>
      <Image source={require('./user.png')} style={styles.avatar} />
      {/* ${callerName} */}
      <Text style={styles.callerName}>{'Waiting for response from '+ receiverName}</Text>
      <TouchableOpacity style={styles.terminateButton} onPress={()=>HangUp(receiverId, navigation)}>
        <Text style={styles.buttonText}>Hang up</Text>
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
    textAlign: 'center',
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

export default OutcomingCallWindow;
