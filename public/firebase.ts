// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAtWdapVlo7_EUHwl7S6v7oa34qfSi_Fqg',
  authDomain: 'harvest-io.firebaseapp.com',
  databaseURL: 'https://harvest-io.firebaseio.com',
  projectId: 'harvest-io',
  storageBucket: 'harvest-io.appspot.com',
  messagingSenderId: '143700399185',
  appId: '1:143700399185:web:6f300560fa456911b45470',
  measurementId: 'G-0FC05JPFL5'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
