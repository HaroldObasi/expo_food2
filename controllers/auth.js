import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { addDoc, collection, setDoc, doc, getDoc } from "firebase/firestore";

export const handleSignup = async (
  auth,
  db,
  email,
  password,
  firstName = ""
) => {
  /**
   * Takes, auth object, email and password as args
   */
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log(response.email);

    try {
      await setDoc(doc(db, "users", response.user.uid), {
        firstName: firstName,
        email: email,
        likes: [],
        dietPlan: [],
      });
    } catch (error) {
      alert(error.message);
      console.log(error);
    }

    console.log("account created");
    alert("Account Created!");
  } catch (error) {
    alert(error.message);
  }
};

export const handleLogin = async (auth, email, password) => {
  /**
   * Takes, auth object, email and password as args
   */
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    console.log("log in boolin");
    alert("Logged in");
  } catch (error) {
    alert(error.message);
  }
};

export const handleLogout = async (auth) => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(error);
  }
};

export const getUserInfo = async (auth, db, setter) => {
  const userId = auth.currentUser.uid;
  const docRef = doc(db, "users", userId);
  console.log("testinggg");
  try {
    const docSnap = await getDoc(docRef);
    console.log("doc snap: ", docSnap.data());
    setter(docSnap.data());
    // setter2(docSnap.data().likes);
  } catch (error) {
    console.log(error);
  }
  // return docSnap.data();
};
