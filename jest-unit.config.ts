import type { Config } from 'jest';

import defaultConfig from './jest.config';

const config: Config = {
  ...defaultConfig,
  roots: ['<rootDir>/test/unit'],
  testPathIgnorePatterns: ['/e2e/'],
};

export default config;
