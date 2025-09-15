import { type MigrationInterface, type QueryRunner, Table } from 'typeorm'

export class CreateOperation1757247964410 implements MigrationInterface {
	private table = new Table({
		name: 'operation',
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
				name: 'type',
				type: 'enum',
				enum: ['DEBIT', 'CREDIT'],
			},
			{
				name: 'account_id',
				type: 'uuid',
			},
			{
				name: 'transaction_id',
				type: 'uuid',
			},
		],
		foreignKeys: [
			{
				columnNames: ['account_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'account',
			},
			{
				columnNames: ['transaction_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'transaction',
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
