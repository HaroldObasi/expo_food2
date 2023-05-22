import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  currentDay,
  monitorAgendaItems2,
  getAgendaItems,
  getAgendasMultiple,
} from "../controllers/actions";
import {
  useFonts,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { db, auth } from "../firebase/config";
import React, { useState, useEffect } from "react";
import { Agenda, Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/core";
import { API_KEY } from "../spoonacularApiConstants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Card, Avatar } from "react-native-paper";
import axios from "axios";

const Planner = () => {
  const userId = auth.currentUser.uid;
  const [selectedDate, setSelectedDate] = useState(currentDay());
  const [agendaData, setAgendaData] = useState(null);
  const [trueData, setTrueData] = useState({});
  const navigation = useNavigation();
  const [dummy, setDummy] = useState({
    "2022-05-17": [
      {
        mealType: "breakfast",
        mealName: "dummy 1",
        calorieCount: "333",
      },
      {
        mealType: "lunch",
        mealName: "dummy 2",
        calorieCount: "333",
      },
      {
        mealType: "dinner",
        mealName: "dummy 3",
        calorieCount: "333",
      },
    ],
  });

  // const currentDate =

  // console.log("my date: ", myDate.toISOString().split("T")[0]);
  let [fontsLoaded, error] = useFonts({
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  const generateAgendaItem = (obj) => {
    var results = {};
    results[obj["date"]] = [];

    Object.keys(obj["meals"]).map((i) => {
      results[obj["date"]].push({
        "mealType": i,
        "calorieCount": obj["meals"][i]["calorieCount"],
        "mealName": obj["meals"][i]["mealName"],
        "recipeId": obj["meals"][i]["recipeId"],
      });
    });

    return results;
  };

  const getIngredients = (arr) => {
    let ingredients = [];
    for (let i of arr) {
      ingredients.push({
        name: i.name,
        imperialMeasure: {
          amount: i.measures.us.amount || "N/A",
          unit: i.measures.us.unitShort || "N/A",
        },
        metricMeasure: {
          amount: i.measures.metric.amount || "N/A",
          unit: i.measures.metric.unitShort || "N/A",
        },
      });
    }

    return ingredients;
  };

  const getSteps = (arr) => {
    let steps = [];
    for (let x of arr) {
      steps.push({
        name: x.step,
        number: x.number,
      });
    }
    return steps;
  };

  const navigateToInfo = async (id) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
      );
      const foodInfo = response.data;
      const rawIngredients = response.data.extendedIngredients;
      const rawSteps = response.data.analyzedInstructions[0].steps;
      navigation.navigate("Feed", {
        screen: "Food",
        params: {
          id: foodInfo.id,
          img: foodInfo.image,
          title: foodInfo.title,
          ingredients: getIngredients(rawIngredients),
          steps: getSteps(rawSteps),
          prepTime: foodInfo.readyInMinutes,
          calories: Math.round(foodInfo.nutrition.nutrients[0].amount),
        },
      });
    } catch (error) {}
  };

  useEffect(() => {
    getAgendasMultiple(
      db,
      userId,
      selectedDate,
      generateAgendaItem,
      setTrueData,
      trueData
    );
  }, [trueData]);

  const renderItems = (item) => {
    return (
      <TouchableOpacity
        onPress={() => navigateToInfo(item.recipeId)}
        disabled={item.mealName ? false : true}
      >
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.mealType}>{item.mealType.toUpperCase()}</Text>
            <Text style={item.mealName ? styles.mealName : { color: "grey" }}>
              {item.mealName || "MEAL NOT SET"}
            </Text>
          </View>
          {/* <FontAwesome name="close" size={25} style={styles.search} /> */}
        </View>
      </TouchableOpacity>
    );
  };

  return trueData ? (
    <SafeAreaView style={{ flex: 1 }}>
      <Agenda items={trueData} renderItem={renderItems} />
    </SafeAreaView>
  ) : (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>loading</Text>
    </SafeAreaView>
  );
};

export default Planner;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  mealType: {
    // alignSelf: "center",
    paddingBottom: 15,
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
  },

  mealName: {
    fontFamily: "Poppins_400Regular",
  },
});
