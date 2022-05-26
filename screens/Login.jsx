import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { TextInput as MaterialTI, Button } from "react-native-paper";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { handleLogin } from "../controllers/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { AppLoading } from "expo";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import CustomButton1 from "../components/CustomButton1";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  let [fontsLoaded, error] = useFonts({
    Pacifico_400Regular,
    Poppins_400Regular,
    Poppins_800ExtraBold,
  });

  return (
    <SafeAreaView>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.title}>Log In</Text>

        <MaterialTI
          label="Email"
          value={email}
          mode="outlined"
          onChangeText={(text) => setEmail(text)}
          selectionColor="#E05D5D"
          underlineColor="#E05D5D"
          activeOutlineColor="#E88787"
          style={styles.input}
        />
        <MaterialTI
          label="Password"
          value={password}
          mode="outlined"
          onChangeText={(text) => setPassword(text)}
          selectionColor="#E05D5D"
          underlineColor="#E05D5D"
          activeOutlineColor="#E88787"
          style={styles.input}
        />

        <View style={styles.buttonholder}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLogin(auth, email, password)}
          >
            <Text style={styles.text}>Log In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.alt}>or</Text>

        <View style={styles.buttonholder2}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLogin(auth, email, password)}
          >
            <Text style={styles.text}>Log In Alt</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
          }}
        >
          <Text style={styles.alt}>
            Don't have an account?{" "}
            {
              <Text
                style={{
                  fontFamily: "Poppins_800ExtraBold",
                }}
              >
                Create an account
              </Text>
            }
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "Pacifico_400Regular",
    fontSize: 32,
    color: "#E05D5D",
  },
  input: {
    marginTop: 12,
  },
  buttonholder: {
    marginTop: 20,
  },
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
    fontFamily: "Poppins_400Regular",
  },
  button1: {
    marginTop: 20,
  },
  button2: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#C76B70",
    borderRadius: 8,
    width: 100,
    padding: 8,
    alignItems: "center",
  },
  alt: {
    fontFamily: "Poppins_300Light",
    paddingVertical: 15,
    alignSelf: "center",
  },
});
