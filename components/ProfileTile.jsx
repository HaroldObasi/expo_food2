import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/core";
// import { TouchableOpacity } from "react-native-gesture-handler";

const ProfileTile = ({
  id,
  imgSrc,
  title,
  ingredients,
  prepTime,
  rawIngredients,
  rawSteps,
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

  const onPressTile = () => {
    navigation.navigate("Feed", {
      screen: "Food",
      params: {
        id: id,
        img: imgSrc,
        title: title,
        ingredients: getIngredients(rawIngredients),
        steps: getSteps(rawSteps),
        prepTime: prepTime,
      },
    });
  };
  return (
    <TouchableOpacity onPress={onPressTile} style={{ width: 333 }}>
      <View style={[styles.container, styles.shadowProp]}>
        <View>
          <Image
            source={{
              uri: imgSrc,
            }}
            style={styles.image}
          />
          <View style={styles.gradientHolder}>
            <LinearGradient
              style={styles.gradient}
              colors={["transparent", "#404040"]}
            ></LinearGradient>
          </View>
        </View>
        <View style={styles.textHolder}>
          <Text style={styles.foodInfoHead}>{title}</Text>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                borderRightWidth: 1,
                paddingRight: 10,
                borderColor: "#ffffff",
              }}
            >
              <Text style={[styles.foodInfoMin]}>
                {ingredients.length} Ingredients
              </Text>
            </View>

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.foodInfoMin}>{prepTime} min</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileTile;

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: 333,
    // backgroundColor: "#FFF1F1",
    borderRadius: 10,
    marginBottom: 25,
    marginRight: 25,
  },
  image: {
    height: 180,
    width: 333,
    // marginTop: 20,
    // alignSelf: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    marginLeft: 14,
    paddingVertical: 5,
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

  foodInfoHead: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#ffffff",
  },
  foodInfoMin: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#ffffff",
  },
  textHolder: {
    position: "absolute",
    bottom: 15,
    left: 7,
  },
  gradient: {
    borderRadius: 10,
    height: 180,
    width: 333,
  },
  gradientHolder: {
    position: "absolute",
  },
});
