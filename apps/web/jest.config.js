module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Assuming setupTests.ts exists or will be created
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
    '^.+\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^react-router-dom$': 'react-router-dom',
    '^@mui/(.*)$': '<rootDir>/node_modules/@mui/$1',
    '^@emotion/(.*)$': '<rootDir>/node_modules/@emotion/$1',
    '^shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|zustand)/)',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.(ts|tsx)',
    '<rootDir>/src/**/*.test.(ts|tsx)',
  ],
};