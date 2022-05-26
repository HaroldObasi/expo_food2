import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Agenda } from "react-native-calendars";
import InfoTile from "./InfoTile";
import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator as MaterialAv, Button } from "react-native-paper";
import { FAB } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { db, auth } from "../firebase/config";
import AgendaItem from "./AgendaItem";
import {
  onLike,
  onUnlike,
  monitorUserLikes,
  addItemToAgenda,
  getAgendaItems,
  monitorAgendaItems,
  currentDay,
} from "../controllers/actions";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";

import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";

const Food = ({ route, navigation }) => {
  const userId = auth.currentUser.uid;
  const { id, title, img, summary, ingredients, steps, prepTime } =
    route.params;

  const [loading, setLoading] = useState(false);
  const [userLikes, setUserLikes] = useState([]);
  const [date, setDate] = useState(currentDay());
  const sheetRef = useRef(null);
  const fall = new Animated.Value(1);

  const [agendaItems, setAgendaItems] = useState([]);

  useEffect(() => {
    monitorUserLikes(db, userId, setUserLikes);
    monitorAgendaItems(db, userId, setAgendaItems, date);
  }, [date]);

  // console.log("agendaa items: ", agendaItems);
  const [fontsLoaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  const renderContent = () => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Add Meal to Plan</Text>
      <DateLine />

      {renderAgendaItems(agendaItems)}
    </View>
  );

  const incrementDate = (date, setter) => {
    var tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setter(tomorrow.toISOString().split("T")[0]);
  };

  const decrementDate = (date, setter) => {
    var yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    setter(yesterday.toISOString().split("T")[0]);
  };

  const DateLine = () => {
    return (
      <View style={styles.dateLine}>
        <TouchableOpacity onPress={() => decrementDate(date, setDate)}>
          <MaterialCommunityIcons size={30} name="arrow-left" />
        </TouchableOpacity>
        <Text style={styles.selectedDate}>{date}</Text>
        <TouchableOpacity onPress={() => incrementDate(date, setDate)}>
          <MaterialCommunityIcons size={30} name="arrow-right" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const renderAgendaItems = (list) => {
    console.log(" render agenda items: ", agendaItems);
    if (Object.values(list)[0] != null) {
      const keys = Object.keys(list);
      return keys.map((item) => {
        const foo = "meals." + item;
        return (
          <View>
            <Text style={styles.mealHead}>{item}</Text>
            {agendaItems[item] ? (
              <AgendaItem
                mealTitle={agendaItems[item].mealName}
                mealCalCount={agendaItems[item].calorieCount}
              />
            ) : (
              <Button
                mode="contained"
                dark={false}
                onPress={() =>
                  addItemToAgenda(
                    db,
                    {
                      mealType: foo,
                      mealName: title,
                      mealCalCount: "333",
                    },
                    userId,
                    date
                  )
                }
                style={{ backgroundColor: "#E05D5D" }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    color: "white",
                  }}
                >
                  Add Meal
                </Text>
              </Button>
            )}
          </View>
        );
      });
    } else if (Object.values(list)[0] === null) {
      const secondKeys = Object.keys(list);
      return secondKeys.map((item2) => {
        const foo2 = "meals." + item2;
        return (
          <View>
            <Text style={styles.mealHead}>{item2}</Text>
            <Button
              mode="contained"
              dark={false}
              onPress={() => {
                addItemToAgenda(
                  db,
                  {
                    mealType: foo2,
                    mealName: title,
                    mealCalCount: "333",
                  },
                  userId,
                  date
                );
                monitorAgendaItems(db, userId, setAgendaItems, date);
              }}
              style={{ backgroundColor: "#E05D5D" }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  color: "white",
                }}
              >
                New Agenda
              </Text>
            </Button>
          </View>
        );
      });
      // return (
      //   <MaterialAv
      //     animating={true}
      //     color="#E05D5D"
      //     size={30}
      //     style={{ padding: 60 }}
      //   />
      // );
    }
  };

  const renderIngredients = (arr) => {
    return arr.map((ingredient) => {
      var count = 0;
      return (
        <View style={styles.ingredientItem} key={ingredient.name}>
          {ingredient.metricMeasure.unit === "N/A" ? (
            <Text style={styles.itemText}>
              {ingredient.metricMeasure.amount} {ingredient.name}
            </Text>
          ) : (
            <Text style={styles.itemText}>
              {ingredient.metricMeasure.amount} {ingredient.metricMeasure.unit}{" "}
              of {ingredient.name}
            </Text>
          )}
        </View>
      );
      count += 1;
    });
  };

  const renderInstructions = (arr) => {
    return arr.map((instruction) => {
      return (
        <View style={styles.instructionItem} key={instruction.number}>
          <Text style={styles.itemIndex}>Step: {instruction.number}</Text>
          <Text style={styles.itemText}>{instruction.name}</Text>
        </View>
      );
    });
  };

  return (
    <>
      <SafeAreaView>
        <View>
          <View style={styles.top}>
            <Image
              source={{
                uri: img,
              }}
              style={styles.img}
            />
            <Text style={styles.title}>{title}</Text>
            <View style={styles.iconHolder}>
              {loading ? (
                <MaterialAv animating={true} color="#E05D5D" size={30} />
              ) : (
                userLikes && (
                  <MaterialCommunityIcons
                    name={userLikes.includes(id) ? "heart" : "heart-outline"}
                    size={30}
                    style={styles.heart}
                    onPress={
                      userLikes.includes(id)
                        ? () => onUnlike(db, userId, id, setLoading)
                        : () =>
                            onLike(
                              db,
                              userId,
                              {
                                id: id,
                                recipeIngredients: ingredients,
                                prepTime: prepTime,
                                steps: steps,
                                name: title,
                                imgSrc: img,
                              },
                              setLoading
                            )
                    }
                  />
                )
              )}
              <MaterialCommunityIcons
                size={30}
                // name="calendar-blank"
                name="calendar-plus"
                style={styles.heart}
                onPress={async () => {
                  try {
                    // const holder = await getAgendaItems(db, userId);
                    // setAgendaItems(holder);
                    sheetRef.current.snapTo(0);
                    console.log("date: ", Date().toString());
                  } catch (error) {
                    console.log(error);
                  }
                }}
              />
            </View>
          </View>

          <ScrollView
            style={styles.bottom}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.ingredientList}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {renderIngredients(ingredients)}
            </View>

            <View>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {renderInstructions(steps)}
            </View>
            <View style={styles.infoTiles}>
              <InfoTile title="Energy" value="554 KCal" />
              <InfoTile title="Prep Time" value={prepTime || "N/A"} />
            </View>
          </ScrollView>
          <BottomSheet
            ref={sheetRef}
            snapPoints={[300, 0]}
            // snapPoints={[450, 300, 30]}
            callbackNode={fall}
            initialSnap={1}
            renderContent={renderContent}
            renderHeader={renderHeader}
            enabledGestureInteraction={true}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Food;

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 15,
    width: 400,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  iconHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 50,
  },
  heart: {
    color: "#E05D5D",
  },
  titleHolder: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "blue",
  },
  top: {
    // marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
    // alignContent: "center",
  },
  bottom: {
    height: "60%",
    marginHorizontal: 20,

    // backgroundColor: "red",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#E5E5E5",
  },
  img: {
    width: 380,
    height: 200,
    borderRadius: 12,
    marginVertical: 8,
  },
  text: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  infoTiles: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 70,
    flex: 1,
    flexDirection: "row",
    // marginHorizontal: 20,
    justifyContent: "space-between",
  },
  ingredientList: {
    paddingTop: 20,
    marginBottom: 20,
  },
  ingredientItem: {
    // marginHorizontal: 100,
    // borderWidth: 1,
    marginVertical: 8,
    paddingLeft: 5,
    borderLeftWidth: 2,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderLeftColor: "#E05D5D",
    paddingVertical: 15,
  },

  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    marginBottom: 10,
  },
  mealHead: {
    fontSize: 17,
    paddingVertical: 5,
    fontFamily: "Poppins_400Regular",
  },
  itemText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
  itemIndex: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#E05D5D",
  },

  instructionItem: {
    paddingVertical: 10,
    textAlign: "left",
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
    marginBottom: 40,
    height: 400,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  dateLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedDate: {
    fontSize: 20,
  },
});
