import * as fbConfig from '../firebase/firebase'
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
import { initializeApp } from "firebase/app";
import { collection, doc, setDoc, onSnapshot, getDoc, addDoc  } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import app from '../app.json'
import Context from '../Context';
import 'react-native-get-random-values';

const firebaseConfig = {
    apiKey: "AIzaSyA9P_SG1A7qZ296cLuw_Q_cViOeOp6Ht0g",
    authDomain: "firebarrier-88bc1.firebaseapp.com",
    projectId: "firebarrier-88bc1",
    storageBucket: "firebarrier-88bc1.appspot.com",
    messagingSenderId: "34671031006",
    appId: "1:34671031006:web:02a162dd3ced32e352c84f",
    measurementId: "G-N6STHJN7DP"
};

async function LoadPersonData(callerId){
    const url = app.WebApi+"/persons/"+callerId;
    let json = null;
    await fetch(url,{
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': Context.TOKEN
      }
    })
    .then((response) => {
      console.log(Context.TOKEN)
      if(response.status == 200)
        json = response.json()
      
      else
        throw new Error('Smth was wrong: '+response.status);
    })
    .catch((error) => {
      console.error(error);
    });
    return json;
  }

class CallManager{

    static db = null;
    static calls = null;
    static offerCandidates = null;
    static answerCandidates = null;

    static Init(){
        console.log("Initializing firebase...");
        try
        {
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            calls = collection(db, "calls");
            offerCandidates = collection(db, "offerCandidates");
            answerCandidates  = collection(db, "answerCandidates");
            console.log("Finished initializing firebase.");
        } catch(error) {
            console.error('Error:', error)
        }
        
    }

    static async SubcribeToIncomeCalls(id, navigation){

        console.log("Subscribing on incoming calls");
        const docRef = doc(db, "calls", id);
        let docSnap = await getDoc(docRef);

        let incomingCall = {
            userId:id,
            callerId:null,
            offer:null,
            status:"receiving"
        }

        if(!docSnap.exists()){
            console.log("Document of incoming calls doesn't exist, now it's creating...");
            await setDoc(docRef, incomingCall);
            docSnap = await getDoc(docRef);
        }else{
            console.log("Document of incoming calls exists.");
        }

        var events = require('events');
        var eventEmitter = new events.EventEmitter();

        const unsub = onSnapshot(docRef, async (doc) => {
           
            const call = doc.data();
            
            if(call.status == "incoming"){

                console.log("Caller id " + call.callerId);
                let caller = await LoadPersonData(call.callerId);

                console.log("You have incoming call from ");
                navigation.navigate("IncomingCallWindow", {userId:call.userId, callerName:caller.firstname + " "+caller.lastname});
            }else if(call.status == "terminated"){
                call.status = "available";
                call.callerId = null;
                await setDoc(docRef, call);
                navigation.navigate("Contacts");
            }                    
          });
    }

    static async Call(id, callerId, navigation){
        console.log("Starting outcoming call to "+id);
        const docRef = doc(db, "calls", id);
        let docSnap = await getDoc(docRef);
        let call = docSnap.data();
        call.status = "incoming";
        call.callerId = callerId;
        await setDoc(docRef, call);

        let receiver = await LoadPersonData(id);
        navigation.navigate("OutcomingCallWindow", {receiverId:id,receiverName:receiver.firstname + " "+receiver.lastname});
        this.SubcribeToOutcomeCalls(id, navigation);
    }

    static async SubcribeToOutcomeCalls(id, navigation){

        console.log("Subscribing on outcoming calls");
        const docRef = doc(db, "calls", id);
        const unsub = onSnapshot(docRef, async (doc) => {
           
           const call = doc.data();
            
           if(call.status == "terminated"){
                navigation.navigate("Contacts");
            }
            if(call.status == "responded"){
                navigation.navigate("OutcomeLiveCall",  {id: id});
            }                    
          });
    }

    static async SubcribeToImcomingCalls(id, navigation){

        console.log("Subscribing on incoming calls");
        const docRef = doc(db, "calls", id);
        const unsub = onSnapshot(docRef, async (doc) => {
           
           const call = doc.data();
            
           if(call.status == "OfferCreated"){
                navigation.navigate("IncomeLiveCall",  {id: id});
            }                
          });
    }

    static async HangUp(id, navigation){
        console.log("HangUp call to "+id);
        const docRef = doc(db, "calls", id);
        let docSnap = await getDoc(docRef);
        let call = docSnap.data();
        call.status = "terminated";
        await setDoc(docRef, call);
        navigation.navigate("Contacts");
    }

    static async Respond(id, navigation){
        this.SubcribeToImcomingCalls(id, navigation);
        console.log("Respond call to "+id);
        const docRef = doc(db, "calls", id);
        let docSnap = await getDoc(docRef);
        let call = docSnap.data();
        call.status = "responded";
        await setDoc(docRef, call);
    }
}

export default CallManager;