const path = require("path");
const admin = require("firebase-admin");

const serviceAccount = require(path.join(__dirname, "../../firebaseKey.json")); // keep your filename here

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "flavormind-b025f.appspot.com" // if you use storage
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage(); // optional if using storage

module.exports = { db, auth, storage };
