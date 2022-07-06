import {
  addDoc,
  collection,
  setDoc,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  arrayRemove,
  arrayUnion,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { API_KEY } from "../spoonacularApiConstants";
import axios from "axios";

export const getLikes = async (db) => {
  const likesRef = collection(db, "likes");
  const results = [];
  try {
    const likesSnapshot = await getDocs(likesRef);
    likesSnapshot.forEach((like) => {
      results.push(like.data());
    });
    return results;
  } catch (error) {
    console.log(error);
  }
};

export const currentDay = () => {
  var date = new Date();
  date = date.toISOString().split("T")[0];
  return date;
};

export const getUserLikes = async (db, userId) => {
  const userRef = doc(db, "users", userId);
  try {
    const userDataSnapshot = await getDoc(userRef);
    return userDataSnapshot.data().likes;
    // return data;
  } catch (error) {
    console.log(error);
  }
};

export const onLike = async (db, userId, foodData, setter) => {
  setter(true);
  const likesRef = collection(db, "likes");
  const userRef = doc(db, "users", userId);
  try {
    const newLikeRef = await addDoc(likesRef, {
      userId: userId,
      recipeId: foodData.id,
      recipeIngredients: foodData.recipeIngredients,
      recipePrepTime: foodData.prepTime,
      recipeSteps: foodData.steps,
      recipeName: foodData.name,
      recipeImgSrc: foodData.imgSrc,
      recipeCalCount: foodData.calCount,
    });
    try {
      const newUserLikeRef = await updateDoc(userRef, {
        likes: arrayUnion(foodData.id),
      });
    } catch (error) {
      console.log(error);
    }
    console.log(newLikeRef.id);
    setter(false);
  } catch (error) {
    setter(false);
    console.log(error);
  }
};

export const onUnlike = async (db, userId, recipeId, setter) => {
  setter(true);
  const likesRef = collection(db, "likes");
  const userRef = doc(db, "users", userId);

  console.log("deletedddd");
  try {
    const q = query(
      likesRef,
      where("recipeId", "==", recipeId),
      where("userId", "==", userId)
    );
    const snapShot = await getDocs(q);
    const snapShotId = snapShot.docs[0].id;

    const likeToDeleteRef = doc(db, "likes", snapShotId);
    await deleteDoc(likeToDeleteRef);
    try {
      const newUserUnlikeRef = await updateDoc(userRef, {
        likes: arrayRemove(recipeId),
      });
    } catch (error) {
      console.log(error);
    }
    console.log(snapShotId, " like deleted");
    setter(false);
  } catch (error) {
    setter(false);
    console.log(error);
  }
};

export const monitorUserLikes = (db, userId, setter) => {
  onSnapshot(doc(db, "users", userId), (doc) => {
    //   console.log("current data: ", doc.data())
    const data = doc.data();

    if (data.likes) {
      setter(data.likes);
    }
  });
};

export const getOthersLikedFeed = async (db, userId, setter) => {
  var results = [];
  const likesCollectionRef = collection(db, "likes");
  try {
    const q = query(likesCollectionRef, where("userId", "!=", userId));
    const snapShot = await getDocs(q);
    snapShot.docs.map((doc) => {
      results.push(doc.data());
    });
    setter(results);
    // return results;
  } catch (error) {
    console.log(error);
  }
};

export const addItemToAgenda = async (db, data, userId, myDate) => {
  const plansCollectionRef = collection(db, "plans");
  const q = query(
    plansCollectionRef,
    where("date", "==", myDate),
    where("userId", "==", userId)
  );
  try {
    const snapShot = await getDocs(q);
    const snapShotId = snapShot.docs[0]?.id;

    if (snapShotId) {
      const existingPlanRef = doc(plansCollectionRef, snapShotId);
      try {
        const dataToAdd = {};
        dataToAdd[data.mealType] = {
          mealName: data.mealName,
          calorieCount: data.mealCalCount,
          recipeId: data.recipeId,
        };

        await updateDoc(existingPlanRef, dataToAdd);

        // await updateDoc(existingPlanRef, {
        //   // [data.mealType]: "sample",
        //   "meals.dinner": {
        //     mealName: data.mealName,
        //     calorieCount: data.mealCalCount,
        //   },
        // });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const toAdd = {};
        toAdd[data.mealType];
        const newRecipe = await addDoc(plansCollectionRef, {
          date: myDate,
          meals: {
            breakfast: "",
            lunch: "",
            dinner: "",
          },
          userId: userId,
        });

        try {
          const newPlanRef = doc(plansCollectionRef, newRecipe.id);
          toAdd[data.mealType] = {
            mealName: data.mealName,
            calorieCount: data.mealCalCount,
          };

          await updateDoc(newPlanRef, toAdd);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAgendaItems = async (db, userId, myDate) => {
  var results = [];
  const plansCollectionRef = collection(db, "plans");
  const q = query(
    plansCollectionRef,
    where("date", "==", myDate),
    where("userId", "==", userId)
  );

  try {
    const snapShot = await getDocs(q);
    const snapShotId = snapShot.docs[0]?.id;
    if (snapShotId) {
      const existingPlanRef = doc(plansCollectionRef, snapShotId);
    }
    snapShot.docs.map((doc) => {
      results.push(doc.data());
    });
    return results;
  } catch (error) {
    console.log(error);
  }
};

export const monitorAgendaItems = async (
  db,
  userId,
  setter,
  myDate,
  option = null,
  setter2 = null,
  func = null
) => {
  const plansCollectionRef = collection(db, "plans");
  const q = query(
    plansCollectionRef,
    where("date", "==", myDate),
    where("userId", "==", userId)
  );
  try {
    const snapShot = await getDocs(q);
    const snapShotId = snapShot.docs[0]?.id;
    if (snapShotId) {
      const existingPlanRef = doc(plansCollectionRef, snapShotId);

      onSnapshot(existingPlanRef, (doc) => {
        const data = doc.data();
        if (option === 2) {
          setter(data);
          setter2(func(data));
          return;
        } else {
          setter(data.meals);
          return;
        }
      });
    } else {
      console.log("false");
      setter({
        breakfast: null,
        lunch: null,
        dinner: null,
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export const monitorAgendaItems2 = async (db, userId, myDate) => {
  const plansCollectionRef = collection(db, "plans");
  const q = query(
    plansCollectionRef,
    where("date", "==", myDate),
    where("userId", "==", userId)
  );

  try {
    const snapShot = await getDocs(q);
    const snapShotId = snapShot.docs[0]?.id;

    if (snapShotId) {
      const existingPlanRef = doc(plansCollectionRef, snapShotId);
    } else {
      //if there is no data for tht particular date
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAgendasMultiple = async (
  db,
  userId,
  myDate,
  func,
  setter,
  state
) => {
  const plansCollectionRef = collection(db, "plans");

  const generateDays = () => {
    var count = 1;
    var results = [myDate];
    while (count <= 7) {
      var next = new Date(myDate);
      next.setDate(next.getDate() + count);
      results.push(next.toISOString().split("T")[0]);
      count++;
    }
    while (count > 0) {
      var prev = new Date(myDate);
      prev.setDate(prev.getDate() - count);
      results.push(prev.toISOString().split("T")[0]);
      count--;
    }
    return results;
  };

  const getAgendaForDay = async (dateItem) => {
    const q = query(
      plansCollectionRef,
      where("date", "==", dateItem),
      where("userId", "==", userId)
    );

    try {
      const snapShot = await getDocs(q);
      if (snapShot.docs[0]) {
        const data = snapShot.docs[0]?.data();
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  var final = [];
  const validDays = generateDays();
  for (let i of validDays) {
    var toAdd = await getAgendaForDay(i);
    if (toAdd !== null) {
      final.push(toAdd);
    }
  }

  for (let y of final) {
    var holder = Object.assign(state, func(y));
    setter(holder);
  }
  // return final;
};

export const getUserLikedRecipeIds = async (userId, db, setter) => {
  const usersCollectionRef = collection(db, "users");
  const userDoc = doc(usersCollectionRef, userId);
  const results = [];

  try {
    const response = await getDocs();
  } catch (error) {
    console.log(error);
  }
};

export const setLikedRecipesInfo = async (list, setter) => {
  const results = [];
  var idString = "";
  // OG KEY const SPOONACULAR_API_KEY = "fb5ce892b23346d280b3354db0d10d61";
  const SPOONACULAR_API_KEY = "fbbde4668a8849148fadd3ba8dd69449"; // REPLICA

  console.log("input: ", list);
  for (let x of list) {
    idString += x + ",";
  }

  const response = await axios.get(
    `https://api.spoonacular.com/recipes/informationBulk?ids=${idString}&apiKey=${API_KEY}&includeNutrition=true`
  );

  setter(response.data);
};

export const setRandomMealsFromTag = async (
  selectedTag,
  randomMeals,
  setter
) => {
  //og const SPOONACULAR_API_KEY = "fb5ce892b23346d280b3354db0d10d61";
  const SPOONACULAR_API_KEY = "fbbde4668a8849148fadd3ba8dd69449"; // REPLICA
  if (randomMeals[selectedTag].length === 0) {
    console.log("not nullll");

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&tags=${selectedTag}&number=5`
      );
      const newObj = { ...randomMeals };
      newObj[selectedTag] = response.data.recipes;
      setter(newObj);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("nulllllll");
    return;
  }
};

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

export const setRecipeCalorieValue = async (id, setter) => {
  //og const SPOONACULAR_API_KEY = "fb5ce892b23346d280b3354db0d10d61";
  const SPOONACULAR_API_KEY = "fbbde4668a8849148fadd3ba8dd69449"; // REPLICA
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
    );
    const calCount = response.data.nutrition.nutrients[0];
    console.log("caloriesss: ", calCount);
    setter(Math.round(Number(calCount.amount)));
  } catch (error) {
    console.log(error);
  }
};

export const getSimilarRecipes = async (db, userId, setter) => {
  const recCollection = collection(db, "recommendations");
  const userRecRef = doc(recCollection, userId);
  const recIds = [];
  const results = [];
  // OG KEY const SPOONACULAR_API_KEY = "fb5ce892b23346d280b3354db0d10d61";
  const SPOONACULAR_API_KEY = "fbbde4668a8849148fadd3ba8dd69449"; // REPLICA

  try {
    onSnapshot(userRecRef, async (doc) => {
      const data = doc.data();
      if (data.recommendedRecipes) {
        const recList = data.recommendedRecipes;
        var idString = recList.join(",");

        try {
          const response = await axios.get(
            `https://api.spoonacular.com/recipes/informationBulk?ids=${idString}&apiKey=${API_KEY}&includeNutrition=true`
          );
          console.log("NUTRITION: ", response.data[0].nutrition.nutrients[0]);

          setter(response.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("No recommended");
      }

      // console.log("recipes snapshot 2: ", data);
    });
  } catch (error) {
    console.log(error);
  }
};
