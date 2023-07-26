import crypto from 'node:crypto';

export default class Ticket {
  constructor(
    readonly ticketId: string,
    readonly eventId: string,
    readonly email: string,
    private status: string,
  ) {}

  static create(eventId: string, email: string) {
    const ticketId = crypto.randomUUID();
    const initialStatus = 'reversed';
    return new Ticket(ticketId, eventId, email, initialStatus);
  }

  get getStatus() {
    return this.status;
  }

  approved() {
    this.status = 'approved';
  }

  cancel() {
    this.status = 'cancelled';
  }
}
