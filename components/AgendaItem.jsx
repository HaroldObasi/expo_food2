import { StyleSheet, Text, View } from "react-native";
import React from "react";

const AgendaItem = ({ mealTitle, mealCalCount }) => {
  return (
    <View style={styles.container}>
      <Text>{mealTitle}</Text>
      <Text>{mealCalCount}</Text>
    </View>
  );
};

export default AgendaItem;

const styles = StyleSheet.create({
  container: {
    borderColor: "#C4C4C4",
    borderWidth: 1,
    padding: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderRadius: 10,
  },
});
