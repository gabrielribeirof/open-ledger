import { type MigrationInterface, type QueryRunner, Table } from 'typeorm'

export class CreateTransaction1757247890124 implements MigrationInterface {
	private table = new Table({
		name: 'transaction',
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
				name: 'asset_id',
				type: 'uuid',
			},
			{
				name: 'created_at',
				type: 'timestamp',
				default: 'now()',
			},
		],
		foreignKeys: [
			{
				columnNames: ['asset_id'],
				referencedColumnNames: ['id'],
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
