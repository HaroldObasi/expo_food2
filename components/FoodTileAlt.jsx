import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Food from "./Food";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import {
  useFonts,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";

const FoodTileAlt = ({
  id,
  name,
  imgSrc,
  summary,
  rawIngredients,
  rawSteps,
  prepTime,
  calCount,
}) => {
  const navigation = useNavigation();

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

  const onClickTile = () => {
    navigation.navigate("Food", {
      id: id,
      title: name,
      img: imgSrc,
      summary: summary,
      ingredients: getIngredients(rawIngredients),
      steps: getSteps(rawSteps),
      prepTime: prepTime,
      calories: calCount,
    });
  };

  let [fontsLoaded, error] = useFonts({
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  return (
    <TouchableOpacity onPress={onClickTile}>
      <View style={styles.container}>
        <Image
          source={{
            uri: imgSrc,
          }}
          style={[styles.img, styles.shadowProp]}
        />
        <Text style={styles.text} ellipsizeMode="tail" numberOfLines={2}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FoodTileAlt;

const styles = StyleSheet.create({
  img: {
    // width: 135,
    // height: 129,
    width: 124,
    height: 111,
    borderRadius: 10,
    marginBottom: 8,
  },
  text: {
    textAlign: "left",
    width: 124,
    fontFamily: "Poppins_600SemiBold",
  },
  container: {
    marginHorizontal: 15,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
});
