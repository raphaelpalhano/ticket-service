import express, { Request, Response } from 'express';
import http from 'http';
import Registry from './infra/registry/Registry';
import TicketRepositoryDatabase from './infra/repository/TicketRepositoryDatabase';
import PurchaseTicket from './application/usecase/PurchaseTicket';
import EventRepositoryDatabase from './infra/repository/EventRepositoryDatabase';
import PagarmePaymentGateway from './infra/gateway/PagarmePaymentGateway';
import TransactionRepositoryDatabase from './infra/repository/TransactionRepositoryDatabase';
import ProcessPayment from './application/usecase/ProcessPayment';
import RabbitMQAdapter from './infra/queue/RabbitMQAdapter';
import { PORT } from './core/constants/server.constants';

export async function main() {
  const app = express();

  app.use(express.json());

  const queue = new RabbitMQAdapter();

  await queue.connect();

  const registry = new Registry();
  registry.provide('ticketRepository', new TicketRepositoryDatabase());
  registry.provide('eventRepository', new EventRepositoryDatabase());
  registry.provide('paymentGateway', new PagarmePaymentGateway());
  registry.provide(
    'transactionRepository',
    new TransactionRepositoryDatabase(),
  );
  registry.provide('processPayment', new ProcessPayment(registry));
  registry.provide('queue', queue);

  app.post('/ticket/purchase_ticket', async (req: Request, res: Response) => {
    const purchaseTicket = new PurchaseTicket(registry);
    const output = await purchaseTicket.execute(req.body);
    res.status(201).json(output);
  });

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server up in PORT: ${PORT}`);
  });
}

main().catch((error) => console.error(error));
