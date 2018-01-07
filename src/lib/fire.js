// import firebase from 'firebase'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyCXX4w6VCP_shoPgXm1r1twDwYjJQyrXjY',
    authDomain: 'moon-market-cap.firebaseapp.com',
    databaseURL: 'https://moon-market-cap.firebaseio.com',
    projectId: 'moon-market-cap',
  })
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()

export const handleSignIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  auth.signInWithRedirect(provider).catch(err => {
    console.error(err)
  })
}

export const handleSignOut = () => {
  auth.signOut().then(result => {
    console.log('signed out')
  })
}

export default firebase
