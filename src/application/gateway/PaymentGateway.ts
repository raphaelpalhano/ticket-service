export default interface PaymentGateway {
  createTransaction(input: Input): Promise<Output>;
}

export type Input = {
  email: string;
  price: number;
  creditCardToken: string;
};

export type Output = {
  tid: string;
  status: string;
};
