/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.spec.ts"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@api/(.*)$": "<rootDir>/api/$1",
  },
  forceExit: true,
};
