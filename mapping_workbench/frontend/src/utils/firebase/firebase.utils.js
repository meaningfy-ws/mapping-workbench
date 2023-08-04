import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    } from 'firebase/auth';
import {  
    getFirestore,
    doc,
    getDoc,
    setDoc     
} from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAEMfAuUv9KOGeRGUoTJyxXjT-Kp8rqzaY",
    authDomain: "mapping-workbench-db.firebaseapp.com",
    projectId: "mapping-workbench-db",
    storageBucket: "mapping-workbench-db.appspot.com",
    messagingSenderId: "580323942675",
    appId: "1:580323942675:web:9cd594d09d36d8b29bbae6"
};


  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    promt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const singInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
    userAuth, 
    additionalInformation
) => {
    if (!userAuth) return;

    const userDocRef = doc(db, 'users', userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);

    //check if user data does not exist

    if(!userSnapshot.exists()) {
        const {displayName, email} = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            });
        }catch (error) {
            console.log('Error creating the user:', error.message);
        }
    }

    //if user data exists

    return userDocRef;
};

  export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
  }

  export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
  }

  export const signOutUser = async () => await signOut(auth);   

  export const onAuthStateChangedListener = (callback) => 
    onAuthStateChanged(auth, callback);