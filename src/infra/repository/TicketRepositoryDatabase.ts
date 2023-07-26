import TicketRepository from '../../application/repository/TicketRepository';
import { connection } from '../../core/helper/connection-db';
import Ticket from '../../domain/entities/Ticket';

export default class TicketRepositoryDatabase implements TicketRepository {
  async save(ticket: Ticket): Promise<void> {
    const db = connection();

    await db.query(
      'insert into tickect_broker.ticket (ticket_id, event_id, email, status) values ($1, $2, $3, $4)',
      [ticket.ticketId, ticket.eventId, ticket.email, ticket.getStatus],
    );

    await db.$pool.end();
  }

  async update(ticket: Ticket): Promise<void> {
    const db = connection();

    await db.query(
      'update tickect_broker.ticket set status = $1 where ticket_id = $2',
      [ticket.getStatus, ticket.ticketId],
    );

    await db.$pool.end();
  }

  async get(ticketId: string): Promise<Ticket> {
    const db = connection();

    const [ticketData] = await db.query(
      'select * from tickect_broker.ticket where ticket_id = $1',
      [ticketId],
    );

    await db.$pool.end();

    return new Ticket(
      ticketData.ticket_id,
      ticketData.event_id,
      ticketData.email,
      ticketData.status,
    );
  }
}
