// var name = sessionStorage.getItem("name");

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import {
//   getDatabase,
//   set,
//   get,
//   update,
//   remove,
//   ref,
//   child,
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// const firebaseConfig = {
//   apiKey: "AIzaSyAEUlVvqRpBgQZE0MES9s1UWW2FNsdiIWo",
//   authDomain: "picklebutt-arcade.firebaseapp.com",
//   projectId: "picklebutt-arcade",
//   storageBucket: "picklebutt-arcade.appspot.com",
//   messagingSenderId: "796801287786",
//   appId: "1:796801287786:web:493f3203017be7cbb96c13",
// };

// const app = initializeApp(firebaseConfig);

// console.log(app);

// const db = getDatabase();

// window.db = db;
// window.dataRef = ref(db, "pickleFrogger/" + name);
// window.set = set;
// window.updateFrogger = function updateData(name, newData) {
//   const db = getDatabase();
//   const dataRef = ref(db, "pickleFrogger/" + name);
//   console.log("reanwefwefwefwe")
//   get(dataRef)
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const userData = snapshot.val();
//         console.log("User data:", userData);
//         if (userData.Score < newData.Score) {

//           console.log("succsessfully updating the score");
//           update(dataRef, newData)
//             .then(() => {
//               console.log("Data updated successfully!");
//               fetchDataAndAssignTop10();
//             })
//             .catch((error) => {
//               console.error("Error updating data:", error);
//             });

            
//         }
//         // updateScoress(userData);
//       } else {
//         console.log("Usuccsessfully updating the score ewrwerwer rooror");
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching user data:", error);
//     });
// }
// window.updateData = updateData;
// async function updateDatas(name, newData) {
//   const db = getDatabase();
//   const dataRef = ref(db, "pickleFrogger/" + name);

//   try {
//     await update(dataRef, newData);
//     console.log("newData", newData);
//     console.log("Data updated successfully!");
//     await fetchDataAndAssignTop10();
//   } catch (error) {
//     console.error("Error updating data:", error);
//   }
// }
// window.updateDatas = updateDatas;

// let top10;

// async function fetchData() {
//   const dataRef = ref(db, "pickleFrogger/");

//   const snapshot = await get(dataRef);
//   const data = snapshot.val();

//   if (data && typeof data === "object") {
//     const dataArrayAsArray = Object.values(data);
//     dataArrayAsArray.sort((a, b) => b.Score - a.Score);
//     const top10Array = dataArrayAsArray.slice(0, 10);
//     console.log(top10Array);
//     top10 = top10Array;
//     console.log("top10", top10);
//     return top10Array;
//   } else {
//     console.error("Data is not in the expected format");
//     return null; // or handle the error appropriately
//   }
// }
// async function fetchDataAndAssignTop10() {
//   await fetchData();
//   window.fetchData = top10;
//   console.log("tiopppp", top10);
//   console.log(window.fetchData); 
// }


// window.fetchDataAndAssignTop10 = fetchDataAndAssignTop10;
var name = sessionStorage.getItem("name");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  update,
  remove,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEUlVvqRpBgQZE0MES9s1UWW2FNsdiIWo",
  authDomain: "picklebutt-arcade.firebaseapp.com",
  projectId: "picklebutt-arcade",
  storageBucket: "picklebutt-arcade.appspot.com",
  messagingSenderId: "796801287786",
  appId: "1:796801287786:web:493f3203017be7cbb96c13",
};

const app = initializeApp(firebaseConfig);

console.log(app);

const db = getDatabase();

window.db = db;
window.dataRef = ref(db, "pickleFrogger/" + name);
window.set = set;
window.updateFrogger = function updateFrogger(name, newData) {
  const db = getDatabase();
  const dataRef = ref(db, "pickleFrogger/" + name);
  console.log("reanwefwefwefwe");
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("User data:", userData);
        if (userData.Score < newData.Score) {
          console.log("Successfully updating the score");
          update(dataRef, newData)
            .then(() => {
              console.log("Data updated successfully!");
              fetchDataAndAssignTop10();
            })
            .catch((error) => {
              console.error("Error updating data:", error);
            });
        }
      } else {
        console.log("Successfully updating the score ewrwerwer rooror");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

let top10;

async function fetchData() {
  const dataRef = ref(db, "pickleFrogger/");

  const snapshot = await get(dataRef);
  const data = snapshot.val();

  if (data && typeof data === "object") {
    const dataArrayAsArray = Object.values(data);
    dataArrayAsArray.sort((a, b) => b.Score - a.Score);
    const top10Array = dataArrayAsArray.slice(0, 10);
    console.log(top10Array);
    top10 = top10Array;
    console.log("top10", top10);
    return top10Array;
  } else {
    console.error("Data is not in the expected format");
    return null; // or handle the error appropriately
  }
}

async function fetchDataAndAssignTop10() {
  await fetchData();
  window.fetchData = top10;
  console.log("tiopppp", top10);
  console.log(window.fetchData);
}

window.fetchDataAndAssignTop10 = fetchDataAndAssignTop10;
