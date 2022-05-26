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
import { db, auth } from "../firebase/config";
import React, { useState, useEffect } from "react";
import { Agenda, Calendar } from "react-native-calendars";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Card, Avatar } from "react-native-paper";

const Planner = () => {
  const userId = auth.currentUser.uid;
  const [selectedDate, setSelectedDate] = useState(currentDay());
  // const [items, setItems] = useState({});
  const [agendaData, setAgendaData] = useState(null);
  const [trueData, setTrueData] = useState({});
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

  const generateAgendaItem = (obj) => {
    var results = {};
    results[obj["date"]] = [];

    Object.keys(obj["meals"]).map((i) => {
      results[obj["date"]].push({
        "mealType": i,
        "calorieCount": obj["meals"][i]["calorieCount"],
        "mealName": obj["meals"][i]["mealName"],
      });
    });

    return results;
  };

  useEffect(() => {
    // async () => {
    //   try {
    //     var foo = await getAgendasMultiple(db, userId, selectedDate, generateAgendaItem, setTrueData, trueData);
    //     for (let x of foo) {
    //       var holder = Object.assign(trueData, generateAgendaItem(x));
    //       setTrueData(holder);
    //     }
    //     console.log("effect: ", trueData);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
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
      <View style={styles.itemContainer}>
        <View>
          <Text>{item.mealType}</Text>
          <Text>{item.mealName}</Text>
        </View>
        <FontAwesome name="close" size={25} style={styles.search} />
      </View>
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
});
