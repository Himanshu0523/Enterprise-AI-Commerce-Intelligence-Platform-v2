const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const request = require('supertest');

const provider = new PactV3({
  consumer: 'APIGatewayConsumer',
  provider: 'CouponServiceProvider',
  dir: './pacts',
});

describe('API Gateway to Coupon Service Contract', () => {
  it('validates a discount coupon code', async () => {
    provider
      .given('Coupon SAVE20 exists and is active')
      .uponReceiving('a request to validate coupon SAVE20')
      .withRequest({
        method: 'POST',
        path: '/api/coupons/validate',
        headers: { 'Content-Type': 'application/json' },
        body: { code: 'SAVE20', orderAmount: 100 },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: {
          valid: MatchersV3.boolean(true),
          code: MatchersV3.string('SAVE20'),
          discountAmount: MatchersV3.number(20),
          finalAmount: MatchersV3.number(80),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const response = await request(mockServer.url)
        .post('/api/coupons/validate')
        .send({ code: 'SAVE20', orderAmount: 100 });

      expect(response.status).toEqual(200);
      expect(response.body.valid).toEqual(true);
      expect(response.body.discountAmount).toEqual(20);
    });
  });
});
