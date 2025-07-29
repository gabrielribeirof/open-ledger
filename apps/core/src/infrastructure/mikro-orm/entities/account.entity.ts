import {
	BigIntType,
	DecimalType,
	Entity,
	Enum,
	OneToOne,
	Opt,
	PrimaryKey,
	Property,
} from '@mikro-orm/core'

import { UserEntity } from './user.entity'

export enum AccountEntityType {
	COMMON = 'COMMON',
	MERCHANT = 'MERCHANT',
}

@Entity({ tableName: 'accounts' })
export class AccountEntity {
	@PrimaryKey({ type: 'uuid' })
	id!: string

	@Enum(() => AccountEntityType)
	type!: AccountEntityType

	// Max value = 999999999999999 OR 9 999 999 999 999.99
	@Property({ type: new DecimalType('number'), precision: 15, scale: 2 })
	balance!: number

	@Property({ type: new BigIntType('number'), defaultRaw: '1', version: true })
	version!: number & Opt

	@Property({ onUpdate: () => new Date() })
	updated_at: Date & Opt = new Date()

	@OneToOne(() => UserEntity, (user) => user.account, {
		owner: true,
		fieldName: 'user_id',
	})
	user!: UserEntity
}
