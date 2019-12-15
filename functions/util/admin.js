const admin = require('firebase-admin');
const db = admin.firestore();

admin.initializeApp();
module.exports = { admin, db };