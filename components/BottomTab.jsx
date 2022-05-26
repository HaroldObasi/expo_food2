import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedNavigator from "../navigators/FeedNavigator";
import Planner from "../screens/Planner";
import Profile from "../screens/Profile";
import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const navigator = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { position: "absolute" },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={{
          headerShown: false,
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={30} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      /> */}
      <Tab.Screen
        name="Planner"
        component={Planner}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({});
