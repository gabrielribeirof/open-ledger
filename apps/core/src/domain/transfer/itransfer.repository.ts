import { Transfer } from './transfer'

export interface ITransferRepository {
	save(transfer: Transfer): Promise<void>
}

export const TRANSFER_REPOSITORY = 'ITransferRepository'
