import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebaseInit';
import {
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isProvider, setIsProvider] = useState(false); // You can set this based on user role from Firestore later
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set persistence to local storage so that the user (or provider) stays logged in until logout.
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                onAuthStateChanged(auth, (user) => {
                    setCurrentUser(user);
                    // Optionally, check for the user's role in your Firestore to update isProvider
                    setLoading(false);
                });
            })
            .catch((error) => {
                console.error("Error setting persistence:", error);
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isProvider, setIsProvider }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
