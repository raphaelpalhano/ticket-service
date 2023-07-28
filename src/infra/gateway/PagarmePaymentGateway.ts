import PaymentGateway, {
  Input,
  Output,
} from '../../application/gateway/PaymentGateway';

export default class PagarmePaymentGateway implements PaymentGateway {
  async createTransaction(input: Input): Promise<Output> {
    return {
      tid: '124456789',
      status: 'approved',
    };
  }
}
