module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests',
  ],
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node',
  ],
  transform: {
    '^.+\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  moduleNameMapper: {
    '^@aws-sdk/lib-dynamodb$': '<rootDir>/node_modules/@aws-sdk/lib-dynamodb',
    '^@aws-sdk/client-dynamodb$': '<rootDir>/node_modules/@aws-sdk/client-dynamodb',
    '^uuid$': '<rootDir>/node_modules/uuid',
    '^express$': '<rootDir>/node_modules/express',
    '^jsonwebtoken$': '<rootDir>/node_modules/jsonwebtoken',
    '^aws-sdk-client-mock$': '<rootDir>/node_modules/aws-sdk-client-mock',
    '^@types/jest$': '<rootDir>/node_modules/@types/jest',
  },
};