const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express')();
const firebase = require('firebase');
const app = express();

const config = require('./util/config');

admin.initializeApp();
firebase.initializeApp(config)

app.get(`/screams`, (request, response) => {
    admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt', `desc`)
    .get()
    .then((data) => {
        let screams = []
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                bdoy: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAts
            })
        });
        return response.json(screams);
    })
    .catch(err => console.error(err));
});

app.post(`/scream`, (request, response) => {
    const newScream = {
        body: request.body,
        user: request.body.userHandle,
        createdAt: new Date().toISOString()
    }

    admin
        .firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            response.json({ message: `${doc.id}: Created!` })
        })
        .catch(err => {
            response.status(500).json({message: 'Something went wrong'  });
            console.error(err);
        });
});

// Sign Up

app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }

  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
  .then(data => {
    return res.status(200).json({ message: `user ${data.user.uid} signed up` });
  })
  .catch(err => {
    console.err(err);
    return res.status(500).json({ error: err.code });
  })
})

exports.api = functions.region('us-central1').https.onRequest(app)