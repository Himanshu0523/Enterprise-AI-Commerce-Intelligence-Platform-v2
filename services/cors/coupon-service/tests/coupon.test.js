const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Coupon = require('../src/models/Coupon');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Coupon.deleteMany({});
});

describe('Coupon Service Integration Tests', () => {
  test('POST /api/coupons/create - should create a new coupon', async () => {
    const res = await request(app)
      .post('/api/coupons/create')
      .send({
        code: 'SAVE20',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderAmount: 50,
        usageLimit: 1,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 86400000),
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.code).toEqual('SAVE20');
  });

  test('POST /api/coupons/validate - should validate eligible coupon', async () => {
    await Coupon.create({
      code: 'SAVE20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderAmount: 50,
      usageLimit: 1,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 86400000),
    });

    const res = await request(app)
      .post('/api/coupons/validate')
      .send({ code: 'SAVE20', orderAmount: 100 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.valid).toEqual(true);
    expect(res.body.discountAmount).toEqual(20);
    expect(res.body.finalAmount).toEqual(80);
  });

  test('POST /api/coupons/redeem - should atomically redeem and prevent over-usage', async () => {
    await Coupon.create({
      code: 'LIMITED1',
      discountType: 'FIXED',
      discountValue: 10,
      minOrderAmount: 10,
      usageLimit: 1,
      usedCount: 0,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 86400000),
    });

    // First redemption succeeds
    const res1 = await request(app)
      .post('/api/coupons/redeem')
      .send({ code: 'LIMITED1' });

    expect(res1.statusCode).toEqual(200);
    expect(res1.body.success).toEqual(true);

    // Second redemption fails because usageLimit (1) is reached
    const res2 = await request(app)
      .post('/api/coupons/redeem')
      .send({ code: 'LIMITED1' });

    expect(res2.statusCode).toEqual(400);
    expect(res2.body.success).toEqual(false);
  });
});
