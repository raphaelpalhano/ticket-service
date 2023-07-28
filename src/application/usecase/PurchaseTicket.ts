import TicketRepository from '../repository/TicketRepository';
import Ticket from '../../domain/entities/Ticket';
import ProcessPayment from './ProcessPayment';
import EventRepository from '../repository/EventRepository';
import Registry from '../../infra/registry/Registry';
import TicketReserved from '../../domain/event/TicketReserved';
import Queue from '../../infra/queue/Queue';

export default class PurchaseTicket {
  ticketRepository: TicketRepository;
  eventRepository: EventRepository;
  processPayment: ProcessPayment;
  queue: Queue;

  constructor(readonly registry: Registry) {
    this.ticketRepository = registry.inject('ticketRepository');
    this.eventRepository = registry.inject('eventRepository');
    this.processPayment = registry.inject('processPayment');
    this.queue = registry.inject('queue');
  }

  async execute(input: input): Promise<Output> {
    const event = await this.eventRepository.get(input.eventId);
    const ticket = Ticket.create(input.eventId, input.email);
    await this.ticketRepository.save(ticket);
    const ticketReserved = new TicketReserved(
      ticket.ticketId,
      event.eventId,
      input.creditCardToken,
      event.price,
    );
    await this.queue.publish('ticketReserved', ticketReserved);
    return {
      ticketId: ticket.ticketId,
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
};
