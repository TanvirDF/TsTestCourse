import type { Config } from '@jest/types';

const baseDir = '<rootDir>/src/app/server_app';
const baseDirTest = '<rootDir>/src/test/server_app';
const baseDirTest2 = '<rootDir>/src/test/server_app_2';
const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`,
    ],
    testMatch: [
        `${baseDirTest}/**/*.test.ts`,
        `${baseDirTest2}/**/*.test.ts`,
    ],
    setupFiles: [
        '<rootDir>/src/test/server_app_integrationTesting/utils/config.ts'
    ],
}

export default config;
