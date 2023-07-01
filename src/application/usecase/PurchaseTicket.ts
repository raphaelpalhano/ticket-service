import TicketRepository from '../repository/TicketRepository';
import Ticket from '../../domain/entities/Ticket';
import Registry from 'infra/registry/Registry';
import EventRepository from 'application/repository/EventRepository';
import PaymentGateway from 'application/gateway/PaymentGateway';
import Transaction from 'domain/entities/Transaction';
import TransactionRepository from 'application/repository/TransictionRepository';

export default class PurchaseTicket {
  ticketRepository: TicketRepository;
  eventRepository: EventRepository;
  paymentGateway: PaymentGateway;
  transactionRepository: TransactionRepository;

  constructor(readonly registry: Registry) {
    this.ticketRepository = registry.inject('ticketRepository');
    this.eventRepository = registry.inject('eventRepository');
    this.paymentGateway = registry.inject('paymentGateway');
    this.transactionRepository = registry.inject('transactionRepository');
  }

  async execute(input: input): Promise<Output> {
    const event = await this.eventRepository.get(input.eventId);
    const ticket = Ticket.create(input.eventId, input.email);
    await this.ticketRepository.save(ticket);
    const output = await this.paymentGateway.createTransaction({
      email: input.email,
      price: event.price,
      creditCardToken: input.creditCardToken,
    });
    const transaction = Transaction.create(
      ticket.ticketId,
      event.eventId,
      output.tid,
      event.price,
      output.status,
    );

    await this.transactionRepository.save(transaction);

    // processar o cartao de credito, criar e salvar transação mandar email com ticket
    if (output.status === 'approved') {
      ticket.approved();
    } else {
      ticket.cancel();
    }

    await this.ticketRepository.update(ticket);

    return {
      ticketId: ticket.ticketId,
      status: ticket.getStatus,
      tid: transaction.tid,
      price: transaction.price,
    };
  }
}

type input = {
  eventId: string;
  email: string;
  creditCardToken: string;
};

type Output = {
  ticketId: string;
  status: string;
  tid: string;
  price: number;
};
