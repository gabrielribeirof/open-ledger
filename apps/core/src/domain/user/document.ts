import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Either, left, right } from '@/shared/lib/either';
import { InvalidFormatViolation } from '@/shared/domain/_errors/violations/invalid-format.violation';
import { Violation } from '@/shared/seedwork/violation';
import { ValueObject } from '@/shared/seedwork/value-object';

interface DocumentProperties {
	value: string;
}

export class Document extends ValueObject<DocumentProperties> {
	get value() {
		return this.props.value;
	}

	private constructor(props: DocumentProperties) {
		super(props);
	}

	public static create(props: DocumentProperties): Either<Violation, Document> {
		if (!cpf.isValid(props.value) && !cnpj.isValid(props.value)) {
			return left(new InvalidFormatViolation());
		}

		return right(new Document(props));
	}
}
