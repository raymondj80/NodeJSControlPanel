import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {collection, query, where, getDocs, doc, deleteDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: "njscontrolp.firebaseapp.com",
    projectId: "njscontrolp",
    storageBucket: "njscontrolp.appspot.com",
    messagingSenderId: process.env.VUE_APP_MSG_ID,
    appId: process.env.VUE_APP_APP_ID,
    measurementId: process.env.VUE_APP_MEAS_ID
  };


// initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

class FireBase {
  static auth = firebase.auth();
  static firebase = firebase;
  static db = firebaseApp.firestore();

  static async saveScript(script_name, script) {
    // Query to check if script already exists under user
    const q = query(collection(this.db, "scripts"), 
                    where("user_id", "==", this.auth.currentUser.uid), 
                    where("name", "==", script_name));
  
    getDocs(q).then((querySnapshot) => {
        // If exists, update
        if (!querySnapshot.empty) {
            const id = querySnapshot.docs[0].id;
            this.db.collection('scripts').doc(id).update({
                script: script
            });   
        } else {
            this.db.collection('scripts').add({
            user_id: this.auth.currentUser.uid,
            name: script_name,
            script: script
            }, err => {
            console.log(err.message);
            })
        }
    });
  }

  static async getFileNames(filetype) {
    let filenames = [];
    const q = query(collection(this.db, filetype), 
                    where("user_id", "==", this.auth.currentUser.uid));
    return new Promise((resolve) => {
        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                filenames.push(doc.data().name);
            });
            resolve(filenames);
        })
    })
  }

  static async getScript(script_name) {
    const q = query(collection(this.db, "scripts"), 
                    where("user_id", "==", this.auth.currentUser.uid), 
                    where("name", "==", script_name));

    return new Promise((resolve) => {
        getDocs(q).then((querySnapshot) => {
            resolve(querySnapshot.docs[0].data().script);
        })
    })
}

static async getFileData(filename) {
    const q = query(collection(this.db, "record_data"), 
                    where("user_id", "==", this.auth.currentUser.uid), 
                    where("name", "==", filename));

    return new Promise((resolve) => {
        getDocs(q).then((querySnapshot) => {
            resolve(querySnapshot.docs[0].data().data);
        })
    })
}

  static async deleteScript(script_name) {
    const q = query(collection(this.db, "scripts"), 
                    where("user_id", "==", this.auth.currentUser.uid), 
                    where("name", "==", script_name));

    return new Promise((resolve) => {
        getDocs(q).then((querySnapshot) => {
            return deleteDoc(doc(this.db, "scripts", querySnapshot.docs[0].id));
        }).then(() => {
            resolve(this.getFileNames("scripts"));
        })
    })
    }

    static async sendRequest(client) {
        if (this.auth.currentUser) {
            this.auth.currentUser.getIdToken(true)
            .then((idToken) => {
                console.log(idToken);
                client({
                    method: 'get',
                    url: '/',
                    headers: {
                        'AuthToken': idToken
                    }
                }).then((res) => {
                    return res.data.message;
                }).catch((error) => {
                    return error;
                })
            }).catch(() => {
                return "error getting auth token";
            })
        } else {
            client({
            method: 'get',
            url: '/'
            }).then((res) => {
           return res.data.message;
            }).catch((error) => {
            return error;
            })
        }
    }
}

export default FireBase;