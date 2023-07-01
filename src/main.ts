import express, { Request, Response } from 'express';
import http from 'http';
import Registry from './infra/registry/Registry';
import TicketRepositoryDatabase from './infra/repository/TicketRepositoryDatabase';
import PurchaseTicket from './application/usecase/PurchaseTicket';
import EventRepositoryDatabase from 'infra/repository/EventRepositoryDatabase';
import PagarmePaymentGateway from 'infra/gateway/PagarmePaymentGateway';
import TransactionRepositoryDatabase from 'infra/repository/TransactionRepositoryDatabase';

const app = express();

const PORT = 3000;

app.use(express.json());

app.post('/purchase_ticket', async (req: Request, res: Response) => {
  const registry = new Registry();
  registry.provide('ticketRepository', new TicketRepositoryDatabase());
  registry.provide('eventRepository', new EventRepositoryDatabase());
  registry.provide('paymentGateway', new PagarmePaymentGateway());
  registry.provide(
    'transactionRepository',
    new TransactionRepositoryDatabase(),
  );

  const purchaseTicket = new PurchaseTicket(registry);
  const output = await purchaseTicket.execute(req.body);
  res.status(201).json(output);
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server up in PORT: ${PORT}`);
});

export default app;
