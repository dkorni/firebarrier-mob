import React from 'react';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';
import {useState} from 'react';




let localMediaStream;
let remoteMediaStream;
let isVoiceOnly = false;


let mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user'
  }
};



const LiveCallWindow = ({ receiverCameraView, ownerCameraView, subtitles, onTerminate }) => {

  const [localUrl, setLocalUrl] = useState("");
  const [remoteUrl, setRemoteUrl] = useState("");

  async function asyncCall() {
    try {
      const mediaStream = await mediaDevices.getUserMedia( mediaConstraints );
    
      if ( isVoiceOnly ) {
        let videoTrack = await mediaStream.getVideoTracks()[ 0 ];
        videoTrack.enabled = false;
      };
    
      localMediaStream = mediaStream;
      strUrl = localMediaStream.toURL();
      setLocalUrl(strUrl)
      console.log(localUrl + " local url")


      
      let peerConstraints = {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302'
          }
        ]
      };
      
      let peerConnection = new RTCPeerConnection( peerConstraints );
      
      peerConnection.addEventListener( 'connectionstatechange', event => {
        switch( peerConnection.connectionState ) {
          case 'closed':
            // You can handle the call being disconnected here.
      
            break;
        };
      } );
      
      peerConnection.addEventListener( 'icecandidate', event => {
        // When you find a null candidate then there are no more candidates.
        // Gathering of candidates has finished.
        if ( !event.candidate ) { return; };
      
        // Send the event.candidate onto the person you're calling.
        // Keeping to Trickle ICE Standards, you should send the candidates immediately.
      } );
      
      peerConnection.addEventListener( 'icecandidateerror', event => {
        // You can ignore some candidate errors.
        // Connections can still be made even when errors occur.
      } );
      
      peerConnection.addEventListener( 'iceconnectionstatechange', event => {
        switch( peerConnection.iceConnectionState ) {
          case 'connected':
          case 'completed':
            // You can handle the call being connected here.
            // Like setting the video streams to visible.
      
            break;
        };
      } );
      
      peerConnection.addEventListener( 'negotiationneeded', event => {
        // You can start the offer stages here.
        // Be careful as this event can be called multiple times.
      } );
      
      peerConnection.addEventListener( 'signalingstatechange', event => {
        switch( peerConnection.signalingState ) {
          case 'closed':
            // You can handle the call being disconnected here.
      
            break;
        };
      } );
      
      peerConnection.addEventListener( 'track', event => {
        // Grab the remote track from the connected participant.
        remoteMediaStream = remoteMediaStream || new MediaStream();
        remoteMediaStream.addTrack( event.track, remoteMediaStream );
        let remoteUrlStr = localMediaStream.toURL();
        setRemoteUrl(remoteUrlStr);
      } );
      
      // Add our stream to the peer connection.
      localMediaStream.getTracks().forEach( 
        track => peerConnection.addTrack( track, localMediaStream )
      );

    } catch( err ) {
      // Handle Error
      console.error(err)
    };
  }


  if(localUrl == ""){
    asyncCall()
  }
  


  return (
    <View style={styles.container}>
      {/* <View style={styles.receiverCameraContainer}>
      <ImageBackground
        source={require('./Max.jpg')}
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%' }}></ImageBackground>
      
      </View> */}
      <RTCView
        style={styles.receiverCameraContainer}
        mirror={true}
        objectFit={'cover'}
        streamURL={remoteUrl}
        zOrder={0}
      />
      {/* <View style={styles.ownerCameraContainer}>{ownerCameraView}
      <ImageBackground
        source={require('./Denys.jpg')}
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%' }}></ImageBackground>
      </View> */}
      <RTCView
        style={styles.ownerCameraContainer}
        mirror={true}
        objectFit={'cover'}
        streamURL={localUrl}
        zOrder={0}
      />
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
