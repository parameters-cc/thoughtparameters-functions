# thoughtparameters-functions

Firebase Cloud Functions (TypeScript) for Thought Parameters LLC.

## Stack

- Node.js 20, TypeScript 5
- firebase-functions v5 (2nd gen)
- firebase-admin v12

## Structure

```
src/
  index.ts                    # exports all functions
  triggers/
    onUserCreate.ts           # Auth trigger: init Firestore user profile
    onFindingCreated.ts       # Firestore trigger: push notify admins on new critical/high findings
```

## Local development

```bash
npm install
npm run build
firebase emulators:start --only functions,firestore,auth
```

## Deploy

```bash
npm run deploy
```
Requires `firebase login` and the correct project set in `.firebaserc`.

## Key conventions

- Use firebase-functions v2 API (`firebase-functions/v2`)
- All Firestore writes use `serverTimestamp()` for created/updated fields
- FCM sends in batches of 500 (FCM multicast limit)
- Only `critical` and `high` severity findings trigger push notifications

## Related

- thoughtparameters-security: writes findings to Firestore that trigger `onFindingCreated`
- thoughtparameters-api: reads user profiles initialized by `onUserCreate`
