import React from 'react';
import { ImageBackground, View, Text, TouchableOpacity, TextInput } from 'react-native';
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


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, doc, setDoc, onSnapshot  } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9P_SG1A7qZ296cLuw_Q_cViOeOp6Ht0g",
  authDomain: "firebarrier-88bc1.firebaseapp.com",
  projectId: "firebarrier-88bc1",
  storageBucket: "firebarrier-88bc1.appspot.com",
  messagingSenderId: "34671031006",
  appId: "1:34671031006:web:02a162dd3ced32e352c84f",
  measurementId: "G-N6STHJN7DP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const calls = collection(db, "calls");
const offerCandidates = collection(db, "offerCandidates");
const answerCandidates  = collection(db, "answerCandidates");


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
  const [offerId, setOfferId] = useState("No offer id");

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

      let remoteCandidates = [];

      function handleRemoteCandidate( iceCandidate ) {
        iceCandidate = new RTCIceCandidate( iceCandidate );

        if ( peerConnection.remoteDescription == null ) {
          return remoteCandidates.push( iceCandidate );
        };

        return peerConnection.addIceCandidate( iceCandidate );
      };

      function processCandidates() {
        if ( remoteCandidates.length < 1 ) { return; };

        remoteCandidates.map( candidate => peerConnection.addIceCandidate( candidate ) );
        remoteCandidates = [];
      };
      
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
      
      peerConnection.addEventListener( 'negotiationneeded', async event => {
        // You can start the offer stages here.
        // Be careful as this event can be called multiple times.
        console.log("Creating offer");

        let callId = uuidv4();
        let callDoc = doc(calls, "call-"+callId);
        
        let sessionConstraints = {
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
            VoiceActivityDetection: true
          }
        };

        try {
          const offerDescription = await peerConnection.createOffer( sessionConstraints );
          await peerConnection.setLocalDescription( offerDescription );
          processCandidates();
          await setDoc(callDoc, offerDescription);

          // subscribing on document changes
          const unsub = onSnapshot(callDoc, async (doc) => {
            console.log("Updated data: "+doc.data());
            const answer = doc.data();
            if(answer.type == "answer"){
              const answerDescription = new RTCSessionDescription( answer );
              console.log("Setting remote description: "+doc.data());
              await peerConnection.setRemoteDescription( answerDescription );
            }
           
            

          });

          console.log("Offer created on firebase");
          setOfferId(callDoc.id);
        
          // Send the offerDescription to the other participant.
        } catch( err ) {
          console.error(err);
        };

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
          <TextInput style={styles.subtitles}>{offerId}</TextInput>
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
