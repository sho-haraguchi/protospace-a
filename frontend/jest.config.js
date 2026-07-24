const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js アプリのパスを指定して next.config.js と .env を自動読み込み
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // @/ 形式のパスエイリアスを解釈できるようにする
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);