import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
	type: 'postgres',
	host: 'database',
	port: 5432,
	username: 'open-ledger',
	password: 'open-ledger',
	database: 'engine',
	migrations: ['src/infrastructure/typeorm/migrations/*.ts'],
})
