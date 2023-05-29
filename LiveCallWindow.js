import React from 'react';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import {
	//ScreenCapturePickerView,
	//RTCPeerConnection,
	//RTCIceCandidate,
	//RTCSessionDescription,
	//RTCView,
	//MediaStream,
	//MediaStreamTrack,
	//mediaDevices,
	//registerGlobals
} from 'react-native-webrtc';

const LiveCallWindow = ({ receiverCameraView, ownerCameraView, subtitles, onTerminate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.receiverCameraContainer}>
      <ImageBackground
        source={require('./Max.jpg')}
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%' }}></ImageBackground>
      </View>
      <View style={styles.ownerCameraContainer}>{ownerCameraView}
      <ImageBackground
        source={require('./Denys.jpg')}
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%' }}></ImageBackground>
      </View>
      <View style={styles.footer}>
        <View style={styles.subtitlesContainer}>
          <Text style={styles.subtitles}>Here you must see translation of signs</Text>
        </View>
        <TouchableOpacity style={styles.terminateButton} onPress={onTerminate}>
          <Text style={styles.buttonText}>Terminate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  receiverCameraContainer: {
    flex: 1,
  },
  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1 
},
  ownerCameraContainer: {
    position: 'absolute',
    bottom: 100,
    right: 17,
    width: 100,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'yellow'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  subtitlesContainer: {
    flex: 1,
  },
  subtitles: {
    color: '#fff',
    fontSize: 16,
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

export default LiveCallWindow;
