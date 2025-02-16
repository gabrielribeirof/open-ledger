import { pathsToModuleNameMapper } from 'ts-jest';
import { Config } from '@jest/types';
import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
	roots: ['src', 'test'],
	testEnvironment: 'node',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	moduleFileExtensions: ['js', 'json', 'ts'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
	collectCoverageFrom: [
		'src/**/*.ts',
		'!**/domain/**/i*repository.ts',
		'!**/*.module.ts',
	],
	coveragePathIgnorePatterns: ['src/infrastructure/mikro-orm/migrations'],
	coverageReporters: ['html', 'text'],
};

export default config;
