// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { authService } from '../services/authService';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCC26_n0M1x2nd2QFBxWTkAoF9ndi08-Tk",
    authDomain: "sudinc.firebaseapp.com",
    projectId: "sudinc",
    storageBucket: "sudinc.firebasestorage.app",
    messagingSenderId: "753714604122",
    appId: "1:753714604122:web:bb64b2cd048cc815de5063",
    measurementId: "G-BFVHSKKY54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

export const generateToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);

        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: "BGW7j_7FpVotWcjTwV5VeZtYkXO9JZ93LmeF0NkuIxfsUl73PmNCPYkTXMDUjo8VKmBjAbSrSi97e68Lpn02B94"
            });

            console.log('FCM Token generated:', token);

            // Save token to user model via API
            if (token) {
                try {
                    const response = await authService.updateNotificationToken(token);
                    console.log('Token saved successfully to backend:', response);
                    return token;
                } catch (error) {
                    console.error('Error saving token to backend:', error);
                    // Still return the token even if saving fails
                    return token;
                }
            }
        } else {
            console.log('Notification permission denied');
            return null;
        }
    } catch (error) {
        console.error('Error generating FCM token:', error);
        return null;
    }
};

// Function to refresh FCM token (useful for token rotation)
export const refreshToken = async () => {
    try {
        console.log('Refreshing FCM token...');
        return await generateToken();
    } catch (error) {
        console.error('Error refreshing FCM token:', error);
        return null;
    }
};

// Function to check if notifications are supported
export const isNotificationSupported = () => {
    return 'Notification' in window && 'serviceWorker' in navigator;
};

// Function to get current notification permission status
export const getNotificationPermission = () => {
    if (!isNotificationSupported()) {
        return 'unsupported';
    }
    return Notification.permission;
};
