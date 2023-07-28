import EventRepository from '../../application/repository/EventRepository';
import { connection } from '../../core/helper/connection-db';
import Event from '../../domain/entities/Event';

export default class EventRepositoryDatabase implements EventRepository {
  async get(eventId: string): Promise<Event> {
    const db = connection();
    const [eventData] = await db.query(
      `select * from tickect_broker.event where event_id = $1`,
      [eventId],
    );

    await db.$pool.end();
    return new Event(
      eventData.event_id,
      eventData.description,
      parseFloat(eventData.price),
      eventData.capacity,
    );
  }
}
