import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { handleLogout } from "../controllers/auth";
import { Button, Avatar } from "react-native-paper";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import AgendaItem from "../components/AgendaItem";
import SearchTile from "../components/SearchTile";
import ProfileTile from "../components/ProfileTile";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { getUserInfo } from "../controllers/auth";
import { setLikedRecipesInfo } from "../controllers/actions";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const Profile = () => {
  const userId = auth.currentUser.uid;
  const navigation = useNavigation();
  const sheetRef = useRef(null);
  const fall = new Animated.Value(1);
  const [userData, setUserData] = useState({});
  const [likedRecipes, setLikedRecipes] = useState([]);

  // useEffect();

  useFocusEffect(
    useCallback(() => {
      getUserInfo(auth, db, setUserData);
    }, [])
  );

  useEffect(() => {
    getUserInfo(auth, db, setUserData);

    // getUserLikedRecipeIds(userId, db, setLikedRecipes);
  }, []);

  useEffect(() => {
    console.log("user data changed ");
    setLikedRecipesInfo(userData.likes, setLikedRecipes);
  }, [userData]);

  let [fontsLoaded, error] = useFonts({
    Pacifico_400Regular,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  const renderContent = () => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Add Meal to Agenda</Text>
      {renderAgendaItems(["1", "2", "3"])}
      {renderAgendaItems(["1", "2", "3"])}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const renderAgendaItems = (list) => {
    return list.map((item) => (
      <View>
        <AgendaItem mealTitle="Rice" mealCalCount="200" />
      </View>
    ));
  };

  const genereteIngredients = (meal) => {
    var sol = [];
    for (let i of meal.extendedIngredients) {
      var str = i.name;
      var arr = str.split(" ");
      for (var x = 0; x < arr.length; x++) {
        arr[x] = arr[x].charAt(0).toUpperCase() + arr[x].slice(1);
      }
      const str2 = arr.join(" ");
      // sol = sol + str2 + ", ";
      sol.push(str2);
    }
    return sol;
  };

  // console.log("first: ", likedRecipes[0].extendedIngredients);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.pHolder}>
          <Avatar.Text
            size={112}
            label={userData.firstName ? userData.firstName.substring(0, 2) : ""}
            style={{ backgroundColor: "#E05D5D" }}
          />
          <Text style={styles.nameField}>{userData.firstName}</Text>
        </View>
        <Button
          style={styles.button}
          icon="power"
          color="#E05D5D"
          mode="contained"
          onPress={() => {
            signOut(auth);
          }}
        >
          Log Out
        </Button>
        <View style={{ backgroundColor: "black", height: 1, marginTop: 40 }} />

        <Text style={styles.subTitle}>Liked Recipes</Text>
        <View style={styles.content}>
          {likedRecipes.map((item) => {
            return (
              <ProfileTile
                id={String(item.id)}
                title={item.title}
                imgSrc={item.image}
                ingredients={genereteIngredients(item)}
                rawIngredients={item.extendedIngredients}
                rawSteps={item.analyzedInstructions[0].steps}
                prepTime={item.readyInMinutes}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  content: {
    marginBottom: 50,
    alignItems: "center",
  },
  button: {
    width: 250,
    marginTop: 20,
    alignSelf: "center",
  },
  nameField: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    marginTop: 10,
  },
  title: {
    fontFamily: "Pacifico_400Regular",
    marginLeft: 15,
    fontSize: 32,
    color: "#E05D5D",
  },
  subTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    marginVertical: 20,
    alignSelf: "center",
  },
  pHolder: {
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 5,
  },
  panelTitle: {
    fontSize: 25,
    marginBottom: 10,
    fontFamily: "Poppins_600SemiBold",
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
});
