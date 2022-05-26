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
import { mealType } from "../spoonacularApiConstants";
import { Button, Chip } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/core";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import AppLoading from "expo-app-loading";
import { db } from "../firebase/config";
import FoodTile from "../components/FoodTile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import {
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import randomRecipes from "../dummy";
import NewTile from "../components/NewTile";
import FoodTileAlt from "../components/FoodTileAlt";
import {
  getLikes,
  getOthersLikedFeed,
  setRandomMealsFromTag,
} from "../controllers/actions";
import { getUserInfo } from "../controllers/auth";

const SPOONACULAR_API_KEY = "fb5ce892b23346d280b3354db0d10d61";
const Tab = createBottomTabNavigator();

const Feed = () => {
  // const [recipes, setRecipes] = useState(randomRecipes);
  const [recipes, setRecipes] = useState([]);
  const [randomMeals, setRandomMeals] = useState({
    "main course": [],
    "side dish": [],
    "appetizer": [],
    "dessert": [],
    "salad": [],
    "bread": [],
    "breakfast": [],
    "soup": [],
    "beverage": [],
    "sauce": [],
    "marinade": [],
    "fingerfood": [],
    "snack": [],
    "drink": [],
  });
  const [othersLiked, setOthersLiked] = useState(randomRecipes);
  const [othersLikedData, setOthersLikedData] = useState([]);
  const [userData, setUserData] = useState({});
  const [randomTag, setRandomTag] = useState("main course");
  const [selectedTag, setSelectedTag] = useState(mealType[0]);
  const userId = auth.currentUser.uid;

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
    setRandomMealsFromTag(selectedTag, randomMeals, setRandomMeals);
  }, []);

  useEffect(() => {
    console.log("New tag");
    setRandomMealsFromTag(selectedTag, randomMeals, setRandomMeals);
  }, [selectedTag]);

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
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Search");
                  }}
                >
                  <FontAwesome name="search" size={25} style={styles.search} />
                </TouchableOpacity>
              </View>

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
                  data={mealType}
                  horizontal
                  keyExtractor={(item) => item}
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 20 }}
                  renderItem={({ item }) => {
                    return (
                      <Chip
                        mode="flat"
                        selected={item === selectedTag}
                        selectedColor="#FFFFFF"
                        onPress={() => setSelectedTag(item)}
                        style={
                          item === selectedTag
                            ? styles.chipSelected
                            : styles.chipDefault
                        }
                        textStyle={
                          item === selectedTag
                            ? styles.chipTextSelected
                            : styles.chipTextDefault
                        }
                      >
                        {item}
                      </Chip>
                    );
                  }}
                />

                {randomMeals[selectedTag].length >= 1 ? (
                  <FlatList
                    data={randomMeals[selectedTag]}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={() => {
                      console.log("end");
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
                ) : (
                  <></>
                )}
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
