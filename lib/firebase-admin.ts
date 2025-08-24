import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let serviceAccount: any = undefined;
if (process.env.FIREBASE_ADMIN_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY as string);
  } catch (e) {
    throw new Error('FIREBASE_ADMIN_KEY env variable is not valid JSON');
  }
} else {
  throw new Error('FIREBASE_ADMIN_KEY env variable is not set');
}

const adminApp = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

export { adminApp, getAuth };
