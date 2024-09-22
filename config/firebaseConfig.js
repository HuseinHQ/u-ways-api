const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://uways-chat.appspot.com',
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { bucket, db };
