import { EntityManager } from '@mikro-orm/postgresql';
import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroOrmUnitOfWork implements IUnitOfWork {
	constructor(private em: EntityManager) {
		this.em = em;
	}

	async begin() {
		this.em.begin();
	}

	async commit() {
		await this.em.commit();
	}

	async rollback() {
		await this.em.rollback();
	}
}
