import admin from "firebase-admin";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
dotenv.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export async function sendNotification(deviceToken , complaintId) {
    const message = {
        token: deviceToken,
        notification: {
            title: "New Update on Your Complaint",
            body: `An agent has responded to your complaint ${complaintId}. Tap to view details.`,
            image: 'https://dxwkpt4djlxwl.cloudfront.net/SUD_JV_Logo_cdce13ed61.svg'
        }
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}
