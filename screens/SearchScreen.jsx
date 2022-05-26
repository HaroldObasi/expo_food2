import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  intolerances as iList,
  mealType as mList,
  cuisine as cList,
} from "../spoonacularApiConstants";
import {
  Searchbar,
  Button,
  Modal,
  Portal,
  TextInput,
  Switch,
  Chip,
} from "react-native-paper";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import {
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import SearchTile from "../components/SearchTile";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

import axios from "axios";

const SPOONACULAR_API_KEY = "fb5ce892b23346d280b3354db0d10d61";

import React, { useState } from "react";

const SearchScreen = () => {
  let [fontsLoaded, error] = useFonts({
    Pacifico_400Regular,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  const [cuisine, setCuisine] = useState([]);
  const [mealType, setMealType] = useState([]);
  const [intolerances, setIntolerances] = useState([]);
  const [vegetarian, setVegetarian] = useState(false);
  const [ingredient, setIngredient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [finalResults, setFinalResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredientsRequired, setIngredientsRequired] = useState([]);

  const [calorieRange, setCalorieRange] = useState([50, 800]);
  const [sugarRange, setSugarRange] = useState([0, 100]);

  const [sliderOneValue, setSliderOneValue] = useState([5]);

  const toggleVegetarian = () => setVegetarian(!vegetarian);

  const sliderOneValuesChangeStart = () => {
    setSliderOneChanging(true);
    console.log("Slider inital");
  };

  const sliderOneValuesChange = (values) => {
    setSliderOneValue(values);
    console.log("slider value: ", sliderOneValue);
  };
  const sliderOneValuesChangeFinish = () => {
    setSliderOneChanging(false);
    console.log("Slider done changing");
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const multiSliderValuesChange = (values) => setMultiSliderValue(values);

  const onCalorieSliderChange = (values) => {
    setCalorieRange(values);
  };

  const onSugarRangeChange = (values) => {
    setSugarRange(values);
  };

  const onChangeSearchField = async (field) => {
    try {
      setSearchQuery(field);
      console.log(searchQuery);
    } catch (err) {
      console.log(err);
    }
  };

  const genereteIngredients = (meal) => {
    var sol = [];
    for (let i of meal.missedIngredients) {
      var str = i.name;
      var arr = str.split(" ");
      for (var x = 0; x < arr.length; x++) {
        arr[x] = arr[x].charAt(0).toUpperCase() + arr[x].slice(1);
      }
      const str2 = arr.join(" ");
      // sol = sol + str2 + ", ";
      sol.push(str2);
    }
    return sol;
  };

  const generateQuery = () => {
    const [minCal, maxCal] = calorieRange;
    const [minSugar, maxSugar] = sugarRange;
    var query = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&number=5&query=${searchQuery}&fillIngredients=true&addRecipeInformation=true`;
    var mealTypeString = mealType.join(",");
    var intolerancesString = intolerances.join(",");
    var cuisineString = cuisine.join(",");
    var ingredientString = ingredientsRequired.join(",");

    if (mealTypeString) {
      query += `&type=${mealTypeString}`;
    }
    if (intolerancesString) {
      query += `&intolerances=${intolerancesString}`;
    }
    if (cuisineString) {
      query += `&cuisine=${cuisineString}`;
    }
    if (ingredientString) {
      query += `&includeIngredients=${ingredientString}`;
    }
    if (vegetarian) {
      query += `&diet=vegetarian`;
    }

    query += `&minCalories=${String(minCal)}&maxCalories=${String(
      maxCal
    )}&minSugar=${String(minSugar)}&maxSugar=${String(maxSugar)}`;

    return query;
  };

  console.log("results: ", searchResults);

  const search = async () => {
    setLoading(true);
    if (searchQuery.length <= 0) {
      Keyboard.dismiss;
      return;
    }
    try {
      var response = await axios.get(generateQuery());
      setSearchResults(response.data.results);
      setLoading(false);
    } catch (err) {
      console.log("error");
      setLoading(false);
    }
  };

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  return (
    <SafeAreaView>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalStyle}
        >
          <ScrollView>
            <MultiSlider
              values={[calorieRange[0], calorieRange[1]]}
              sliderLength={290}
              onValuesChange={onCalorieSliderChange}
              min={50}
              max={800}
              step={1}
              customLabel={() => (
                <Text style={styles.partLabel}>
                  Set Calorie Range: {calorieRange[0]} - {calorieRange[1]}
                </Text>
              )}
              enableLabel={true}
            />
            <MultiSlider
              values={[sugarRange[0], sugarRange[1]]}
              sliderLength={290}
              onValuesChange={onSugarRangeChange}
              min={0}
              max={100}
              step={1}
              customLabel={() => (
                <Text style={styles.partLabel}>
                  Set Sugar Range: {sugarRange[0] + "g"} - {sugarRange[1] + "g"}
                </Text>
              )}
              enableLabel={true}
            />

            <TextInput
              style={{ marginTop: 20 }}
              label="Add Ingredient"
              value={ingredient}
              onChangeText={(text) => setIngredient(text)}
              returnKeyType="done"
              onSubmitEditing={() => {
                setIngredientsRequired([
                  ...ingredientsRequired,
                  ingredient.trim().toLowerCase(),
                ]);
                setIngredient("");
                console.log("ingr list: ", ingredientsRequired);
              }}
            />
            {ingredientsRequired.length >= 1 ? (
              <FlatList
                data={ingredientsRequired}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginVertical: 20 }}
                renderItem={({ item }) => {
                  return (
                    <Chip
                      selectedColor="#FFFFFF"
                      mode="flat"
                      style={styles.chipDefault}
                      closeIcon="close-circle"
                      onClose={() => {
                        var newArr = arrayRemove(ingredientsRequired, item);
                        setIngredientsRequired(newArr);
                      }}
                    >
                      {item}
                    </Chip>
                  );
                }}
              />
            ) : (
              <></>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 20,
              }}
            >
              <Text style={styles.partLabel}>Vegetarian?</Text>

              <Switch
                value={vegetarian}
                color="#F14336"
                onValueChange={toggleVegetarian}
              />
            </View>

            <View style={styles.subpart}>
              <Text style={styles.partLabel}>Add Intolerances / Allergies</Text>
              <FlatList
                horizontal
                style={{ marginTop: 10, marginBottom: 20 }}
                showsHorizontalScrollIndicator={false}
                data={iList}
                renderItem={({ item }) => (
                  <Chip
                    selectedColor="#FFFFFF"
                    mode="flat"
                    style={styles.chip2}
                    textStyle={styles.chipText2}
                    selected={intolerances.includes(item)}
                    onPress={() => {
                      if (intolerances.includes(item)) {
                        var newArr = arrayRemove(intolerances, item);
                        setIntolerances(newArr);
                      } else {
                        setIntolerances([...intolerances, item]);
                      }
                    }}
                  >
                    {item}
                  </Chip>
                )}
              />
            </View>

            <View>
              <Text style={styles.partLabel}>Add Desired Meal Types</Text>
              <FlatList
                horizontal
                style={{ marginTop: 10, marginBottom: 20 }}
                showsHorizontalScrollIndicator={false}
                data={mList}
                renderItem={({ item }) => (
                  <Chip
                    selectedColor="#FFFFFF"
                    mode="flat"
                    style={styles.chip2}
                    textStyle={styles.chipText2}
                    selected={mealType.includes(item)}
                    onPress={() => {
                      if (mealType.includes(item)) {
                        var newArr = arrayRemove(mealType, item);
                        setMealType(newArr);
                      } else {
                        setMealType([...mealType, item]);
                      }
                    }}
                  >
                    {item}
                  </Chip>
                )}
              />
            </View>

            <View>
              <Text style={styles.partLabel}>Add Desired Cuisine Types</Text>
              <FlatList
                horizontal
                style={{ marginTop: 10, marginBottom: 20 }}
                showsHorizontalScrollIndicator={false}
                data={cList}
                renderItem={({ item }) => (
                  <Chip
                    selectedColor="#FFFFFF"
                    mode="flat"
                    style={styles.chip2}
                    textStyle={styles.chipText2}
                    selected={cuisine.includes(item)}
                    onPress={() => {
                      if (cuisine.includes(item)) {
                        var newArr = arrayRemove(cuisine, item);
                        setCuisine(newArr);
                      } else {
                        setCuisine([...cuisine, item]);
                      }
                    }}
                  >
                    {item}
                  </Chip>
                )}
              />
            </View>
          </ScrollView>
        </Modal>
      </Portal>
      <View style={styles.container}>
        <Text style={styles.title}>Search Recipes</Text>
      </View>
      <View style={styles.searchPlaceholder}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearchField}
          value={searchQuery}
          style={styles.searchBar}
          returnKeyType="search"
          onSubmitEditing={search}
        />
        <TouchableOpacity onPress={showModal}>
          <MaterialCommunityIcons name="tune" size={30} />
        </TouchableOpacity>
      </View>
      {loading && <Text style={styles.subtitle}>Loading</Text>}

      {searchResults.length > 0 && !loading && (
        <>
          <Text style={styles.subtitle}>Search Results</Text>
          <ScrollView>
            <View style={styles.results}>
              {searchResults.map((item) => {
                return (
                  <SearchTile
                    id={String(item.id)}
                    title={item.title}
                    imgSrc={item.image}
                    ingredients={genereteIngredients(item)}
                    rawIngredients={item.extendedIngredients}
                    rawSteps={item.analyzedInstructions[0].steps}
                    prepTime={item.readyInMinutes}
                  />
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  searchBar: {
    width: 330,
  },
  subtitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    marginVertical: 30,
    marginLeft: 15,
  },
  title: {
    fontFamily: "Pacifico_400Regular",
    fontSize: 32,
    color: "#E05D5D",
  },
  searchPlaceholder: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    marginTop: 15,
    // alignItems: "center",
    // marginHorizontal: 15,
  },
  tileHolder: {
    marginTop: 40,
    // paddingHorizontal: 20,
    flex: 1,
  },
  results: {
    alignItems: "center",
    marginBottom: 270,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  modalStyle: {
    backgroundColor: "white",
    padding: 20,
    width: 350,
    alignSelf: "center",
    borderRadius: 10,
  },
  chipDefault: {
    marginHorizontal: 7,
    backgroundColor: "#F14336",
  },
  chipTextDefault: {
    color: "#F14336",
    fontFamily: "Poppins_400Regular",
  },
  chip2: {
    marginHorizontal: 7,
    paddingVertical: 3,
  },
  chipText2: {
    color: "gray",
    fontFamily: "Poppins_400Regular",
  },
  chipTextSelected: {
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  partLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
});
