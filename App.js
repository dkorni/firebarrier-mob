import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartWindow from './StartWindow';
import SignUpWindow from './SignUpWindow';
import SignInWindow from './SignInWindow';
import ContactWindow from './ContactWindow';
import OutcomeLiveCall from './OutcomeLiveCall';
import IncomingCallWindow from './IncomingCallWindow';
import IncomeLiveCall from './IncomeLiveCall';
import ConnectMenu from './ConnectMenu';
import LoadingScreen from './LoadingScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="LoadingScreen">
        <Stack.Screen 
          name="Start"
          component={StartWindow}
          options={{ headerShown: false }}
        />
        <Stack.Screen  options={{headerShown: false}} name="SignUp" component={SignUpWindow} />
        <Stack.Screen  options={{headerShown: false}} name="SignIn" component={SignInWindow} />
        <Stack.Screen  options={{headerShown: false}} name="Contacts" component={ContactWindow} />
        <Stack.Screen  options={{headerShown: false}} name="OutcomeLiveCall" component={OutcomeLiveCall} />
        <Stack.Screen  options={{headerShown: false}} name="IncomeLiveCall" component={IncomeLiveCall} />
        <Stack.Screen  options={{headerShown: false}} name="IncomingCallWindow" component={IncomingCallWindow} />
        <Stack.Screen  options={{headerShown: false}} name="ConnectMenu" component={ConnectMenu} />
        <Stack.Screen  options={{headerShown: false}} name="LoadingScreen" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;