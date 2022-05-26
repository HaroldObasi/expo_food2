import { StyleSheet, Text, View } from "react-native";
import React from "react";

const InfoTile = ({ title, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default InfoTile;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    height: 60,
    width: 100,
    padding: 8,
    borderColor: "#E05D5D",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 14,
    color: "#E05D5D",
  },
  value: {
    fontSize: 20,
  },
});
