import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import BottomTab from "./components/BottomTab";
import AuthNavigator from "./navigators/AuthNavigator";
import { auth, db } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

export default function App() {
    const [user, setUser] = useState(null);
    const Stack = createNativeStackNavigator();
    useEffect(() => {
        setUser(auth.currentUser);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        console.log("Root Render");
    }, []);

    // if (user) {
    //   console.log("true");
    // } else {
    //   console.log("false");
    // }
    return (
        <PaperProvider>
            {!user && (
                <NavigationContainer>
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
                </NavigationContainer>
            )}
            {user && (
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Main"
                            component={BottomTab}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </PaperProvider>
    );
}

const styles = StyleSheet.create({});
