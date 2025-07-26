import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { IWalletRepository } from '@/domain/wallet/iwallet.repository';
import { Wallet } from '@/domain/wallet/wallet';
import { WalletMapper } from '@/infrastructure/http/mappers/wallet.mapper';
import { WalletEntity } from '@/infrastructure/mikro-orm/entities/wallet.entity';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '@/infrastructure/mikro-orm/entities/user.entity';

@Injectable()
export class MikroOrmWalletRepository implements IWalletRepository {
	private readonly logger = new Logger(MikroOrmWalletRepository.name);

	private readonly repository: EntityRepository<WalletEntity>;

	constructor(private em: EntityManager) {
		this.repository = em.getRepository(WalletEntity);
	}

	async findById(id: UniqueIdentifier): Promise<Wallet | null> {
		const wallet = await this.repository.findOne({
			id: id.value,
		});

		return wallet ? WalletMapper.toDomain(wallet) : null;
	}

	async save(wallet: Wallet): Promise<void> {
		const userRef = this.em.getReference(UserEntity, wallet.userId.value);
		const walletRef = this.em.getReference(WalletEntity, wallet.id.value);

		WalletMapper.toPersistence(wallet, userRef, walletRef);
	}
}
