import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/modules/users/application/use-cases/**/*.ts',
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/**/*.module.ts',
    '!<rootDir>/**/index.ts',
    '!<rootDir>/**/*.consumer.ts',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/**/*.mock.ts',
    '!<rootDir>/**/*.interface.ts',
    '!<rootDir>/**/*.dto.ts',
    '!<rootDir>/**/*.constants.ts',
  ],
  coverageDirectory: './coverage',
  rootDir: './',
  coverageThreshold: {
    global: {
      branches: 78,
      functions: 90,
      lines: 80,
      statements: 90,
    },
  },
  roots: ['<rootDir>', 'src'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  preset: 'ts-jest',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test|e2e-spec).[t]s?(x)'],
  verbose: false,
  watchPlugins: [],
  bail: 0,
  testPathIgnorePatterns: ['/node_modules/'],
};

export default config;
