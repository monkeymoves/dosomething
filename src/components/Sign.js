import React, { useState, useEffect } from "react";
import { signInWithGoogle } from "../firebase";
import { logout } from "../firebase";
import './Sign.css'
import Hitt from '../components/hitt';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const SignIn = ({ setIsLoggedIn }) => {

  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setIsLoggedIn(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signin__container signin mt-8">
      <div className="border border-blue-400 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        {error !== null && <div className="py-4 bg-red-600 w-full text-white text-center mb-3">{error}</div>}
        <button 
          className="myGoogleBTN" 
          onClick={handleSignIn}
        >
          Sign in with Google
        </button>
        {/* <button className="myGoogleBTN" onClick={logout}>Logout</button> */}
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="app">
      {isLoggedIn ? <Hitt />  : <SignIn setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
};

export default App;
