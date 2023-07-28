import Transaction from '../../domain/entities/Transaction';
import PaymentApproved from '../../domain/event/PaymentApproved';
import Queue from '../../infra/queue/Queue';
import Registry from '../../infra/registry/Registry';
import PaymentGateway from '../gateway/PaymentGateway';
import TransactionRepository from '../repository/TransictionRepository';

export default class ProcessPayment {
  paymentGateway: PaymentGateway;
  transactionRepository: TransactionRepository;
  queue: Queue;

  constructor(readonly registry: Registry) {
    this.paymentGateway = registry.inject('paymentGateway');
    this.transactionRepository = registry.inject('transactionRepository');
    this.queue = registry.inject('queue');
  }

  async execute(input: input): Promise<void> {
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

    if (output.status === 'approved') {
      const paymentApproved = new PaymentApproved(input.ticketId);
      this.queue.publish('paymentApproved', paymentApproved);
    }
  }
}

type input = {
  ticketId: string;
  price: number;
  eventId: string;
  email?: string;
  creditCardToken: string;
};
