import type { MigrationInterface, QueryRunner } from 'typeorm'
import { Table } from 'typeorm'

export class CreateAsset1757026142389 implements MigrationInterface {
	private table = new Table({
		name: 'asset',
		columns: [
			{
				name: 'id',
				type: 'uuid',
				isPrimary: true,
			},
			{
				name: 'name',
				type: 'varchar',
			},
			{
				name: 'code',
				type: 'varchar',
				isUnique: true,
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
