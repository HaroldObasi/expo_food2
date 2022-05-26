import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  useFonts,
  Raleway_400Regular,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import React from "react";

const CustomButton1 = ({ title, method }) => {
  const [fontsLoaded, error] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
  });
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton1;

const styles = StyleSheet.create({
  button: {
    width: 220,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#E05D5D",
    borderRadius: 14,
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
    fontFamily: "Raleway_700Bold",
  },
});
