module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^firebase-admin$": "<rootDir>/__mocks__/firebase-admin.ts",
    "^firebase-functions$": "<rootDir>/__mocks__/firebase-functions.ts",
  },
};
