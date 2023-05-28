import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartWindow from './StartWindow';
import SignUpWindow from './SignUpWindow';
import SignInWindow from './SignInWindow';
import ContactWindow from './ContactWindow';
import LiveCallWindow from './LiveCallWindow';
import IncomingCallWindow from './IncomingCallWindow';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LiveCallWindow">
        <Stack.Screen
          name="Start"
          component={StartWindow}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SignUp" component={SignUpWindow} />
        <Stack.Screen name="SignIn" component={SignInWindow} />
        <Stack.Screen name="Contacts" component={ContactWindow} />
        <Stack.Screen name="LiveCallWindow" component={LiveCallWindow} />
        <Stack.Screen name="IncomingCallWindow" component={IncomingCallWindow} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;