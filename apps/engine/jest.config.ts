import type { Config } from '@jest/types'
import * as fs from 'fs'
import * as path from 'path'
import { pathsToModuleNameMapper } from 'ts-jest'

const tsconfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'tsconfig.json'), 'utf8'))
const { compilerOptions } = tsconfig

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
	collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!**/domain/**/i*repository.ts', '!**/*.module.ts'],
	coveragePathIgnorePatterns: ['src/infrastructure/mikro-orm/migrations', 'src/shared/errors/violations'],
	coverageReporters: ['html', 'text'],
}

export default config
