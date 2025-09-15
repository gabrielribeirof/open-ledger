import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('asset')
export class AssetEntity {
	@PrimaryColumn({ type: 'uuid' })
	id!: string

	@Column()
	name!: string

	@Column()
	code!: string
}
