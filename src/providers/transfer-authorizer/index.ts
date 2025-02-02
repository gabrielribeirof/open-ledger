import { ProviderNotFoundError } from '@/shared/errors/provider-not-found.error';
import { DevitoolsTransferAuthorizerProvider } from './implementations/devitools-transfer-authorizer.provider';
import { InMemoryTransferAuthorizerProvider } from './implementations/in-memory-transfer-authorizer.provider';

export function findTransferAuthorizerProviders(
	type: 'in-memory' | 'devitools',
) {
	switch (type) {
		case 'in-memory':
			return InMemoryTransferAuthorizerProvider;
		case 'devitools':
			return DevitoolsTransferAuthorizerProvider;
		default:
			throw new ProviderNotFoundError();
	}
}
