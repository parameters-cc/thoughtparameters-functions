import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Fires when a new Firebase Auth user is created.
 * - Initializes the user's Firestore profile document
 * - Sets default role and preferences
 */
export const onUserCreate = functions.auth.onUserCreated(async (event) => {
  const { uid, email, displayName, photoURL } = event.data;

  const userRef = db.collection("users").doc(uid);

  await userRef.set({
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    role: "user",
    isAdmin: false,
    isSuperAdmin: false,
    fcmTokens: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
    },
  });

  functions.logger.info(`User profile created for ${uid} (${email})`);
});
