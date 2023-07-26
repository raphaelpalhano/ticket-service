import TicketRepository from '../repository/TicketRepository';
import Registry from '../../infra/registry/Registry';

export default class ApproveTicket {
  ticketRepository: TicketRepository;

  constructor(readonly registry: Registry) {
    this.ticketRepository = registry.inject('ticketRepository');
  }

  async execute(input: input): Promise<void> {
    const ticket = await this.ticketRepository.get(input.ticketId);
    ticket.approved();
    this.ticketRepository.update(ticket);
  }
}

type input = {
  ticketId: string;
};
