import Transaction from '../../domain/entities/Transaction';
import Registry from '../../infra/registry/Registry';
import PaymentGateway from '../gateway/PaymentGateway';
import TransactionRepository from '../repository/TransictionRepository';

export default class ProcessPayment {
  paymentGateway: PaymentGateway;
  transactionRepository: TransactionRepository;

  constructor(readonly registry: Registry) {
    this.paymentGateway = registry.inject('paymentGateway');
    this.transactionRepository = registry.inject('transactionRepository');
  }

  async execute(input: input): Promise<Output> {
    const output = await this.paymentGateway.createTransaction({
      email: input.email,
      price: input.price,
      creditCardToken: input.creditCardToken,
    });
    const transaction = Transaction.create(
      input.ticketId,
      input.eventId,
      output.tid,
      input.price,
      output.status,
    );

    await this.transactionRepository.save(transaction);

    return {
      tid: transaction.tid,
      price: transaction.price,
      status: output.status,
    };
  }
}

type input = {
  ticketId: string;
  price: number;
  eventId: string;
  email: string;
  creditCardToken: string;
};

type Output = {
  tid: string;
  price: number;
  status: string;
};
