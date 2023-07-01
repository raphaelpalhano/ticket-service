import TicketRepository from '../repository/TicketRepository';
import Ticket from '../../domain/entities/Ticket';
import Registry from 'infra/registry/Registry';
import EventRepository from 'application/repository/EventRepository';
import ProcessPayment from './ProcessPayment';

export default class PurchaseTicket {
  ticketRepository: TicketRepository;
  eventRepository: EventRepository;
  processPayment: ProcessPayment;

  constructor(readonly registry: Registry) {
    this.ticketRepository = registry.inject('ticketRepository');
    this.eventRepository = registry.inject('eventRepository');
    this.processPayment = registry.inject('processPayment');
  }

  async execute(input: input): Promise<Output> {
    const event = await this.eventRepository.get(input.eventId);
    const ticket = Ticket.create(input.eventId, input.email);
    await this.ticketRepository.save(ticket);
    const inputProcess = {
      ticketId: ticket.ticketId,
      eventId: event.eventId,
      email: ticket.email,
      price: event.price,
      creditCardToken: input.creditCardToken,
    };
    const output = await this.processPayment.execute(inputProcess);
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
      tid: output.tid,
      price: output.price,
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
