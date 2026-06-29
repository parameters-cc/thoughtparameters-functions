# thoughtparameters-functions

Firebase Cloud Functions for Thought Parameters LLC, written in TypeScript.

## Functions

| Function | Trigger | Description |
|---|---|---|
| `onUserCreate` | `auth.user().onCreate` | Creates a Firestore user profile when a new Firebase Auth account is created |
| `onFindingCreated` | `firestore.document("findings/{id}").onCreate` | Sends FCM push notifications to admins when a critical or high severity security finding is created |

## Stack

- Node.js 20, TypeScript 5
- firebase-functions v5
- firebase-admin v12
- Jest for unit tests

## Local development

```bash
npm install
npm run build
firebase emulators:start --only functions,firestore,auth
```

## Testing

```bash
npm test
```

Tests use Jest with manual mocks for `firebase-admin` and `firebase-functions`.

## Deploy

```bash
npm run deploy
```

Requires `firebase login` and the correct project configured in `.firebaserc`.

## Related repos

- `thoughtparameters-security` — writes findings to Firestore (triggers `onFindingCreated`)
- `thoughtparameters-api` — reads user profiles created by `onUserCreate`
