import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@functions/(.*)$": "<rootDir>/src/functions/$1",
    "^@libs/(.*)$": "<rootDir>/src/libs/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@foundation/lib$": "<rootDir>/lib/foundation/index.ts",
  },
};

export default config;
