import app from 'main';
import request from 'supertest';

describe('dos ingressos', () => {
  it('necessary buy ticket', async () => {
    const input = {
      eventId: 'bf6a9b3d-4d5c-4c9d-bf3b-4a091b05dc76',
      email: 'rafa123@gmail.com',
      creditCardToken: '331467855',
    };

    const response = await request(app)
      .post('/purchase_ticket')
      .send(input)
      .set('Accept', 'application/json');

    const output = response.body;
    console.log(output);
    expect(output.ticketId).toBeDefined();
    expect(output.tid).toBeDefined();
    expect(output.status).toBe('approved');
    expect(output.price).toBe(300);
  });
});
