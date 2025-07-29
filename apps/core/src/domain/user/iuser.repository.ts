import { UniqueIdentifier } from '../../shared/seedwork/unique-identifier'
import { User } from './user'

export interface IUserRepository {
	findById(id: UniqueIdentifier): Promise<User | null>
	save(user: User): Promise<void>
}

export const USER_REPOSITORY = 'IUserRepository'
