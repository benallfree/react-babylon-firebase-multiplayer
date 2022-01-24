// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref, remove, set, Unsubscribe, update } from 'firebase/database'
import { PartialDeep } from 'type-fest'
import { Unsafe } from '../types'

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
const _db = getDatabase(app)

export const db = {
  getOnce: <TData>(path: string) =>
    new Promise<Unsafe<TData>>((resolve, reject) => {
      const unsub = db.onValue<TData>(path, (data) => {
        unsub()
        resolve(data)
      })
    }),
  update: (updates: { [path: string]: any }) => update(ref(_db), updates),
  set: <TData>(path: string, value: TData) => set(ref(_db, path), value),
  onValue: <TResult>(path: string, cb: (data: PartialDeep<TResult>) => void): Unsubscribe =>
    onValue(ref(_db, path), (snapshot) => {
      const data = snapshot.val() as PartialDeep<TResult>
      cb(data)
    }),
  remove: (path: string) => remove(ref(_db, path))
}
