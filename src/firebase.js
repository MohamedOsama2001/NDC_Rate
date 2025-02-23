import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCsZD96fWpsNYPpdwMw2zfkGLAM7Gy5y1U",
    authDomain: "rate-499bf.firebaseapp.com",
    databaseURL: "https://rate-499bf-default-rtdb.firebaseio.com",
    projectId: "rate-499bf",
    storageBucket: "rate-499bf.firebasestorage.app",
    messagingSenderId: "1045576082511",
    appId: "1:1045576082511:web:6e755d7706854ac41ef63a",
    measurementId: "G-J9JRRD3JFM"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {db};
