import { AggregateRoot } from '@/shared/seedwork/aggregate-root';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';
import { WalletType } from './wallet-type';
import { Monetary } from '@/shared/domain/monetary';

interface WalletProperties {
	type: WalletType;
	userId: UniqueIdentifier;
	balance: Monetary;
	version: number;
}

export class Wallet extends AggregateRoot<WalletProperties> {
	get type() {
		return this.props.type;
	}

	get userId() {
		return this.props.userId;
	}

	get balance() {
		return this.props.balance;
	}

	get version() {
		return this.props.version;
	}

	public deposit(amount: Monetary): void {
		this.props.balance.add(amount);
	}

	public withdraw(amount: Monetary): void {
		this.props.balance.subtract(amount);
	}

	private constructor(props: WalletProperties, id?: UniqueIdentifier) {
		super(props, id);
	}

	public static create(props: WalletProperties, id?: UniqueIdentifier): Wallet {
		return new Wallet(props, id);
	}
}
