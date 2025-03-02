import { ProviderNotFoundError } from '@/shared/domain/errors/provider-not-found.error';
import { DevitoolsTransferAuthorizerProvider } from './devitools/devitools-transfer-authorizer.provider';
import { InMemoryTransferAuthorizerProvider } from './in-memory/in-memory-transfer-authorizer.provider';

export function findTransferAuthorizerProviders(type: string) {
	switch (type) {
		case 'in-memory':
			return InMemoryTransferAuthorizerProvider;
		case 'devitools':
			return DevitoolsTransferAuthorizerProvider;
		default:
			throw new ProviderNotFoundError();
	}
}
