import React, { Component } from "react";

// import the screens we want to navigate
import Start from "./components/Start";
import Chat from "./components/Chat";

// import react native gesture handler
import "react-native-gesture-handler";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//ReactNativeActionSheet uses React context to allow your components to invoke the menu. This means your app needs to be wrapped with the ActionSheetProvider component first.

import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <ActionSheetProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Start">
            <Stack.Screen name="Home" component={Start} />
            <Stack.Screen name="Chat" component={Chat} />
          </Stack.Navigator>
        </NavigationContainer>
      </ActionSheetProvider>
    );
  }
}
