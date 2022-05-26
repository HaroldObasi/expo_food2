import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import {
  useFonts,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";

const NewTile = ({
  id,
  name,
  imgSrc,
  summary,
  rawIngredients,
  rawSteps,
  prepTime,
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
    });
  };
  let [fontsLoaded, error] = useFonts({
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });
  return (
    <TouchableOpacity onPress={onClickTile}>
      <View style={[styles.container, styles.shadowProp]}>
        <Image
          source={{
            uri: imgSrc,
          }}
          style={styles.tileImage}
        />

        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewTile;

const styles = StyleSheet.create({
  container: {
    height: 220,
    width: 155,
    backgroundColor: "#FFF1F1",
    borderRadius: 10,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  tileImage: {
    height: 130,
    width: 130,
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 5,
  },
  name: {
    fontSize: 14,
    // marginLeft: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    fontFamily: "Poppins_600SemiBold",
  },
  panel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ingredients: {
    fontSize: 6,
    marginLeft: 14,
    width: 130,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
