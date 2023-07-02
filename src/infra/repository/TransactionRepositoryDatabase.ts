import TransactionRepository from '../../application/repository/TransictionRepository';
import { connection } from '../../core/helper/connection-db';
import Transaction from '../../domain/entities/Transaction';

export default class TransactionRepositoryDatabase
  implements TransactionRepository
{
  async save(transaction: Transaction): Promise<void> {
    const db = connection();

    await db.query(
      'insert into tickect_broker.transaction (transaction_id, ticket_id, event_id, tid, price, status) values ($1, $2, $3, $4, $5, $6)',
      [
        transaction.transactionId,
        transaction.ticketId,
        transaction.eventId,
        transaction.tid,
        transaction.price,
        transaction.status,
      ],
    );

    await db.$pool.end();
  }
}
