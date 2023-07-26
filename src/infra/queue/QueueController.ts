import ApproveTicket from '../../application/usecase/ApproveTicket';
import ProcessPayment from '../../application/usecase/ProcessPayment';
import PaymentApproved from '../../domain/event/PaymentApproved';
import TicketReserved from '../../domain/event/TicketReserved';
import Registry from '../registry/Registry';
import Queue from './Queue';

export default class QueueController {
  private queue: Queue;
  private processPayment: ProcessPayment;
  private approveTicket: ApproveTicket;

  constructor(readonly registry: Registry) {
    this.queue = registry.inject('queue');
    this.processPayment = registry.inject('processPayment');
    this.approveTicket = registry.inject('approveTicket');

    this.queue.on('ticketReserved', async (event: TicketReserved) => {
      await this.processPayment.execute(event);
    });

    this.queue.on('paymentApproved', async (event: PaymentApproved) => {
      await this.approveTicket.execute(event);
    });
  }
}
