import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore, getDocs, query, where, Timestamp, updateDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNs0dmj_xnh1BTd7F-31nZVH385mIYAK4",
  authDomain: "nus-shopback-hackathon.firebaseapp.com",
  projectId: "nus-shopback-hackathon",
  storageBucket: "nus-shopback-hackathon.firebasestorage.app",
  messagingSenderId: "342825868584",
  appId: "1:342825868584:web:605359965b201836ea041d"
};

export const app = initializeApp(firebaseConfig)
export const database = getFirestore(app)
export const auth = getAuth(app);

export async function newUserSignUp(email : string, password : string) {
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.error("Error: ", error)
    }
}

export async function createUserData(
    successful_login : number, quest_login : number, successful_purchase : number,
    quest_purchase : number, visited_rewards : boolean, quest_expiry : Timestamp, points : number
) {
    try {

        const response = await addDoc(collection(database, "userData"), {
            "userEmail" : auth.currentUser?.email, //ignore error: user must be signed in for this function to be called
            "streak" : [],
            
            // quest related
            "successful_logins": successful_login, //curr number of successful logins
            "quest_logins" : quest_login, //number of logins needed to complete current quest
            "successful_purchases" : successful_purchase, //curr number of successful purchases
            "quest_purchases" : quest_purchase, //number of purchases needed to complete current quest
            "quest_has_visited_rewards" : visited_rewards, //has the user visited rewards page
            "quest_expiry" : quest_expiry, //time that the quest expires

            "points" : points //number of points the user has from doing quests/streaks
        })
    } catch (error) {
        console.log("Error: ", error)
    }
}

export async function updateUserData(
    successful_login : number, quest_login : number, successful_purchase : number,
    quest_purchase : number, visited_rewards : boolean, quest_expiry : Timestamp, points : number
) {
    try {
        const doc = await getDocs(query(collection(database, "userData"), where("userEmail", "==", auth.currentUser.email)))
        const docRef = doc.docs[0].ref
        const response = await updateDoc(docRef, {
            "userEmail" : auth.currentUser.email, //ignore error: user must be signed in for this function to be called
            "streak" : [],
            
            // quest related
            "successful_logins": successful_login, //curr number of successful logins
            "quest_logins" : quest_login, //number of logins needed to complete current quest
            "successful_purchases" : successful_purchase, //curr number of successful purchases
            "quest_purchases" : quest_purchase, //number of purchases needed to complete current quest
            "quest_has_visited_rewards" : visited_rewards, //has the user visited rewards page
            "quest_expiry" : quest_expiry, //time that the quest expires

            "points" : points //number of points the user has from doing quests/streaks
        })
    } catch (error) {
        console.log("Error: ", error)
    }
}

export async function getUserData() {
    try {
        //ignore error: user must be signed in for this function to be called
        const response = await getDocs(query(collection(database, "userData"), where("userEmail", "==", auth.currentUser.email)))
        return response.docs[0].data()
    } catch (error) {
        console.log("Error:", error)
    }
}