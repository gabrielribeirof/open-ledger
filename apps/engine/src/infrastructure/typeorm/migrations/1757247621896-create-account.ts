import { type MigrationInterface, type QueryRunner, Table } from 'typeorm'

export class CreateAccount1757247621896 implements MigrationInterface {
	private table = new Table({
		name: 'account',
		columns: [
			{
				name: 'id',
				type: 'uuid',
				isPrimary: true,
			},
			{
				name: 'amount',
				type: 'bigint',
			},
			{
				name: 'amount_scale',
				type: 'integer',
			},
			{
				name: 'asset_code',
				type: 'varchar',
			},
			{
				name: 'alias',
				type: 'varchar',
				isUnique: true,
			},
			{
				name: 'version',
				type: 'integer',
			},
		],
		foreignKeys: [
			{
				columnNames: ['asset_code'],
				referencedColumnNames: ['code'],
				referencedTableName: 'asset',
			},
		],
	})

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(this.table)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(this.table)
	}
}
