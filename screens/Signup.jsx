import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { TextInput as MaterialTI, Button } from "react-native-paper";
import { auth, db } from "../firebase/config";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { handleSignup } from "../controllers/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { AppLoading } from "expo";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();
  // console.log("user, signup page: ", auth);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigation.navigate("App");
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    console.log("Signup");
  }, [email]);

  let [fontsLoaded, error] = useFonts({
    Pacifico_400Regular,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_800ExtraBold,
  });

  return (
    <SafeAreaView>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.title}>Create Account</Text>

        <MaterialTI
          label="First Name"
          value={firstName}
          mode="outlined"
          onChangeText={(text) => setFirstName(text)}
          selectionColor="#E05D5D"
          underlineColor="#E05D5D"
          activeOutlineColor="#E88787"
          style={styles.input}
        />
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
        <MaterialTI
          label="Confirm Password"
          value={confirmPassword}
          mode="outlined"
          onChangeText={(text) => setConfirmPassword(text)}
          selectionColor="#E05D5D"
          underlineColor="#E05D5D"
          activeOutlineColor="#E88787"
          style={styles.input}
        />
        <View style={styles.buttonholder}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              handleSignup(auth, db, email, password, firstName, navigation)
            }
          >
            <Text style={styles.text}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.alt}>or</Text>

        <View style={styles.buttonholder2}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                width: 250,
              },
            ]}
          >
            <Text style={styles.text}>Create Account with Google</Text>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
            console.log("go to login");
          }}
        >
          <Text style={styles.alt}>
            Already have an Account?{" "}
            {
              <Text
                style={{
                  fontFamily: "Poppins_800ExtraBold",
                }}
              >
                Login
              </Text>
            }
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

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
    fontFamily: "Raleway_700Bold",
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

// const handleSignup = async () => {
//   try {
//     const response = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     console.log("response: ", response);
//     console.log("user: ", response.user);
//   } catch (error) {
//     alert(error.message);
//   }
// };

// const handleLogin = async () => {
//   try {
//     const response = await signInWithEmailAndPassword(auth, email, password);
//     console.log(response);
//     console.log("user: ", response.user);
//     navigation.navigate("Home");
//   } catch (error) {
//     alert(error.message);
//   }
// };

// const handleLogout = async () => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     alert(error);
//   }
// };
