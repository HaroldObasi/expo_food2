import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, Chip } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/core";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import AppLoading from "expo-app-loading";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import FoodTile from "../components/FoodTile";
import SearchTile from "../components/SearchTile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import BottomTab from "../components/BottomTab";
import {
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import randomRecipes from "../dummy";
import NewTile from "../components/NewTile";
import FoodTileAlt from "../components/FoodTileAlt";
import { getLikes, getOthersLikedFeed } from "../controllers/actions";
import { getUserInfo } from "../controllers/auth";

const SPOONACULAR_API_KEY = "fb5ce892b23346d280b3354db0d10d61";
const Tab = createBottomTabNavigator();

const Feed = () => {
  // const [recipes, setRecipes] = useState(randomRecipes);
  const [recipes, setRecipes] = useState([]);
  const [othersLiked, setOthersLiked] = useState(randomRecipes);
  const [othersLikedData, setOthersLikedData] = useState([]);
  const [userData, setUserData] = useState({});
  const [randomTag, setRandomTag] = useState("main course");
  const [tags, setTags] = useState([
    {
      name: "Main Course",
      selected: true,
    },
    {
      name: "Dessert",
      selected: false,
    },
    {
      name: "Beverage",
      selected: false,
    },
    {
      name: "Breakfast",
      selected: false,
    },
    {
      name: "Italian",
      selected: false,
    },
  ]);
  const userId = auth.currentUser.uid;
  const docRef = doc(db, "users", userId);

  const updateTagStatus = (name) => {
    const updatedTags = tags.map((tag) => {
      if (tag.name === name) {
        tag.selected = !tag.selected;
        setRandomTag(tag.name.toLowerCase());
        console.log(randomTag);
      } else {
        tag.selected = false;
      }
      return tag;
    });

    setTags([...updatedTags]);
  };

  useEffect(() => {
    getUserInfo(auth, db, setUserData);
    getOthersLikedFeed(db, userId, setOthersLikedData);
  }, []);

  const navigation = useNavigation();
  let [fontsLoaded, error] = useFonts({
    Pacifico_400Regular,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });
  var y = 0;
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.heading}>
                <Text styles={styles.titleGreeting}>
                  Hello, {userData.firstName}
                </Text>
                <MaterialCommunityIcons
                  name="magnify"
                  size={35}
                  style={styles.search}
                  onPress={() => {
                    navigation.navigate("Search");
                  }}
                />
              </View>
              {/* <View style={styles.othersTab}>
                <Text style={styles.tabTitle}>Others Liked</Text>
                <FlatList
                  data={othersLiked}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  keyExtractor={(item) => item.title}
                  renderItem={({ item }) => {
                    return (
                      <FoodTile
                        id={String(item.id)}
                        name={item.title}
                        imgSrc={item.image}
                        prepTime={item.readyInMinutes}
                        summary={item.summary}
                        rawIngredients={item.extendedIngredients}
                        rawSteps={item.analyzedInstructions[0].steps}
                      />
                    );
                  }}
                />
              </View> */}

              <View style={styles.othersTab}>
                <Text style={styles.tabTitle}>Others Liked</Text>
                <FlatList
                  data={othersLikedData}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  keyExtractor={(item) => item.recipeId}
                  renderItem={({ item }) => {
                    return (
                      <FoodTile
                        id={String(item.recipeId)}
                        name={item.recipeName}
                        imgSrc={item.recipeImgSrc}
                        prepTime={item.recipePrepTime}
                        summary={""}
                        rawIngredients={null}
                        rawSteps={null}
                        ingredients={item.recipeIngredients}
                        steps={item.recipeSteps}
                      />
                    );
                  }}
                />
              </View>

              <View style={styles.new}>
                <Text style={styles.tabTitle}>Try Something New</Text>
                <FlatList
                  data={tags}
                  horizontal
                  keyExtractor={(item) => item.name}
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 20 }}
                  renderItem={({ item }) => {
                    return (
                      <Chip
                        onPress={() => {
                          updateTagStatus(item.name);
                        }}
                        mode="flat"
                        selected={item.selected}
                        selectedColor="#FFFFFF"
                        style={
                          item.selected
                            ? styles.chipSelected
                            : styles.chipDefault
                        }
                        textStyle={
                          item.selected
                            ? styles.chipTextSelected
                            : styles.chipTextDefault
                        }
                      >
                        {item.name}
                      </Chip>
                    );
                  }}
                />

                <FlatList
                  data={othersLiked}
                  showsHorizontalScrollIndicator={false}
                  onEndReached={() => {
                    console.log("end reached");
                  }}
                  horizontal
                  keyExtractor={(item) => item.title}
                  renderItem={({ item }) => {
                    return (
                      <NewTile
                        id={String(item.id)}
                        name={item.title}
                        imgSrc={item.image}
                        prepTime={item.readyInMinutes}
                        summary={item.summary}
                        rawIngredients={item.extendedIngredients}
                        rawSteps={item.analyzedInstructions[0].steps}
                      />
                    );
                  }}
                />
              </View>

              <View style={styles.fromLikes}>
                <Text style={styles.tabTitle}>Based on your Likes</Text>
                <FlatList
                  data={othersLiked}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  keyExtractor={(item) => item.title}
                  renderItem={({ item }) => {
                    return (
                      <FoodTileAlt
                        id={String(item.id)}
                        name={item.title}
                        imgSrc={item.image}
                        prepTime={item.readyInMinutes}
                        summary={item.summary}
                        rawIngredients={item.extendedIngredients}
                        rawSteps={item.analyzedInstructions[0].steps}
                      />
                    );
                  }}
                />
              </View>
            </View>
            {/* <BottomTab /> */}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
};

export default Feed;

const styles = StyleSheet.create({
  container: { marginBottom: 30 },
  titleGreeting: {
    fontFamily: "Poppins_500Medium_Italic",
    fontSize: 14,
  },
  heading: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  search: {
    color: "#9A9A9A",
  },
  new: {
    marginTop: 20,
  },
  tabTitle: {
    fontSize: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontFamily: "Poppins_600SemiBold",
    color: "#303030",
  },
  head1: {
    fontFamily: "Pacifico_400Regular",
    fontSize: 46,
    color: "#E05D5D",
    marginLeft: 10,
  },
  image: {
    height: 300,
    width: 300,
  },
  chipDefault: {
    marginHorizontal: 15,
    paddingVertical: 3,
    backgroundColor: "transparent",
  },
  chipSelected: {
    backgroundColor: "#F14336",
  },

  chipTextDefault: {
    color: "#F14336",
    fontFamily: "Poppins_400Regular",
  },

  chipTextSelected: {
    color: "white",
    fontFamily: "Poppins_400Regular",
  },

  fromLikes: {
    marginTop: 10,
    marginBottom: 40,
  },
});
