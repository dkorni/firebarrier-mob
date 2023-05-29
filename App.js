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

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ConnectMenu">
        <Stack.Screen
          name="Start"
          component={StartWindow}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SignUp" component={SignUpWindow} />
        <Stack.Screen name="SignIn" component={SignInWindow} />
        <Stack.Screen name="Contacts" component={ContactWindow} />
        <Stack.Screen name="OutcomeLiveCall" component={OutcomeLiveCall} />
        <Stack.Screen name="IncomeLiveCall" component={IncomeLiveCall} />
        <Stack.Screen name="IncomingCallWindow" component={IncomingCallWindow} />
        <Stack.Screen name="ConnectMenu" component={ConnectMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;