const firebase = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
    });
}

module.exports = firebase;