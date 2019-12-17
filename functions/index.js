const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express()

admin.initializeApp();

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

// https://baseurl.com/api

exports.api = functions.https.onRequest(app)