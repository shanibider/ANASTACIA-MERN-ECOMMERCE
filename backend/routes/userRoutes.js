import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import { auth, db } from '../firebase.js';
import {
  addDoc,
  collection,
  limit,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { isAuth, isAdmin, generateToken } from '../utils.js';


// userRouter is a dedicated router that you can use to organize and manage routes related to user functionality.
const userRouter = express.Router();


// handle GET requests to the protected /api/users route.  
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // The find() method is used to retrieve all documents from the 'users' collection in MongoDB.       
    const users = await User.find({});
    res.send(users);
  })
);


// The route handler is an async function that: signs in a user with email and password using Firebase authentication.
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
      // signInWithEmailAndPassword is a function from Firebase SDK that signs in a user with email and password.
      signInWithEmailAndPassword(auth, req.body.email, req.body.password)
      .then((userCredential) => {
        console.log(userCredential.user.uid);
        // collection() is a function from Firebase SDK that creates a reference to a Firestore collection.
        const usersRef = collection(db, 'users');

        // query is function from Firebase SDK that creates a query: a request for data from a Firestore database.
        //  where..: adds a query constraint to filter documents where the 'userId' field is equal to the UID (User ID) obtained from the authentication credentials (userCredential.user.uid).
        const q = query(
          usersRef,
          limit(1),                   // limits the query to return only one document.
          where('userId', '==', userCredential.user.uid)  
        );


        // Retrieves user data from Firestore based on the user's UID obtained from Firebase authentication (userCredential.user.uid).
        // The query ensures that only one document is retrieved, and the retrieved data is then used to construct a user object.

        // syntax in deatils:
        // getDocs is function from Firebase SDK that retrieves documents from Firestore based on the provided query.
        // q is the query object specifying the conditions.
        // then((querySnapshot) => ...: It's a Promise-based approach. When the getDocs operation is completed, it returns a 'querySnapshot' containing the results.
        getDocs(q).then((querySnapshot) =>
          querySnapshot.forEach ( (doc) => {        // iterates through each document in the querySnapshot.
            const refUser = doc.data();            // retrieves the data of the current document
            const user = {                         // creates a new user object using data from Firestore.
              _id: refUser.userId,
              name: refUser.FullName,
              email: req.body.email,
              isAdmin: refUser.is_admin,
              password: req.body.password,
            };
            console.log(user);
            console.log('Login Success');

            // Send user details with token as a response.
            res.send({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              password: user.password,
              token: generateToken(user), 
            });
          })
        );
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send({ message: 'Invalid email or password' });
      });
  })
);




// The route handler is an async function that: creates a new user with email and password using Firebase authentication.
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    // Create user with email and password using Firebase authentication
    createUserWithEmailAndPassword (auth, req.body.email, req.body.password)
      .then(async (userCredential) => {
        try {
          // Adding a new user document to the 'users' collection in Firestore
          const FullName = req.body.name;
          const docRef = await addDoc (collection(db, 'users'), {
            // Object passed to addDoc:
            // full name extracted from req.body.
            // userId property is assigned the unique identifier (uid) of the authenticated user, converted to a string.
            // initial value for is_admin, by default, new user isn't admin.
            FullName,
            userId: `${userCredential.user.uid}`,
            is_admin: false,
          });
          console.log('Document written with ID: ', docRef.id);   //docRef.id represents the unique identifier assigned to the newly created document.


        // Retrieving User Details from Firestore - queries the 'users' collection in Firestore to retrieve the user document with a matching userId (the unique identifier generated during user creation). It extracts user details from the Firestore document and constructs a user object.
        // The user object is then used to generate a token, which is sent back to the client as a response.  
        const usersRef = collection (db, 'users');
          const q = query(
            usersRef,
            limit(1),
            where('userId', '==', userCredential.user.uid)
          );

          getDocs(q).then((querySnapshot) =>
            querySnapshot.forEach((doc) => {
              const refUser = doc.data();
              const user = {
                _id: refUser.userId,
                name: refUser.FullName,
                email: req.body.email,
                isAdmin: refUser.is_admin,
                password: req.body.password,
              };

              // After extracting the user details, the code constructs a response object containing user information and a token generated. This response is then sent back to client.
              res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                password: user.password,
                token: generateToken(user),   //  token generated using the generateToken function.
              });
            })
          );
        } catch (e) {
          console.log('Error adding document: ', e);
          res.status(401).send({ message: e });
        }
      })
      .catch((err) => {
        // Handle errors, e.g., user already exists
        console.log('Error:', err);
        res.status(401).send({ message: err });
      });
  })
);



// The route handler is an async function that: updates the user's password in Firebase authentication and Firestore.
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // Sign in with email and old password using Firebase authentication
    signInWithEmailAndPassword(auth, req.body.email, req.body.oldPassword)
      .then((userCredential) => {
        // Update password in Firebase authentication
        updatePassword(auth.currentUser, req.body.password).then(() => {
          // Update successful. Retrieve updated user details from Firestore based on userId
          const usersRef = collection(db, 'users');
          
          const q = query(
            usersRef,
            limit(1),
            where('userId', '==', req.user._id)
          );
          getDocs(q).then((querySnapshot) =>
            querySnapshot.forEach((doc) => {
              const refUser = doc.data();
              const user = {
                _id: refUser.userId,
                name: refUser.FullName,
                email: req.body.email,
                isAdmin: refUser.is_admin,
                password: req.body.password,
              };
              // Send updated user details along with a token as a response
              res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                password: user.password,
                token: generateToken(user),
              });
            })
          );
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send({ message: error });
      });
  })
);

export default userRouter;