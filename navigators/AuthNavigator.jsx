import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "../firebase/config";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import React, { useEffect } from "react";
import App from "../App";

const AuthNavigator = () => {
  const navigation = useNavigation();
  const Stack = createNativeStackNavigator();
  var user = auth.currentUser;
  console.log("user");

  console.log("AUTH SCREEN");
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

const styles = StyleSheet.create({});
