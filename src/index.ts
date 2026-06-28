import * as admin from "firebase-admin";

admin.initializeApp();

export { onUserCreate } from "./triggers/onUserCreate";
export { onFindingCreated } from "./triggers/onFindingCreated";
