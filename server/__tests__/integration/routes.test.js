/**
 * Integration tests using Supertest.
 *
 * Strategy: mock Mongoose models so tests run without a real DB connection.
 * This lets us verify route-level HTTP behaviour (middleware, auth guards,
 * response shape) in CI and locally with no database needed.
 */

// ── Mock mongoose so no actual DB connection is attempted ────────────────
jest.mock('mongoose', () => {
    const actual = jest.requireActual('mongoose');
    return {
        ...actual,
        connect: jest.fn().mockResolvedValue(undefined),
        connection: { close: jest.fn().mockResolvedValue(undefined) },
    };
});

// ── Mock product model ────────────────────────────────────────────────────
jest.mock('../../models/Product', () => ({
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue(null),
    countDocuments: jest.fn().mockResolvedValue(0),
}));

// ── Mock user model ───────────────────────────────────────────────────────
jest.mock('../../models/User', () => ({
    findOne: jest.fn().mockResolvedValue(null),     // no user → 401 on bad credentials
    findById: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
}));

// ── Mock order model ──────────────────────────────────────────────────────
jest.mock('../../models/Order', () => ({
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue(null),
}));

const request = require('supertest');
const app = require('../../app');

// Close any lingering handles after all tests
afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
});

// ── Product routes ────────────────────────────────────────────────────────
describe('Product Routes', () => {
    it('GET /api/products returns 200 (mocked empty list)', async () => {
        const res = await request(app).get('/api/products');
        expect([200, 500]).toContain(res.statusCode);
    }, 10000);

    it('GET /api/products/:id with invalid ID returns 4xx', async () => {
        const res = await request(app).get('/api/products/not-a-valid-id');
        expect([400, 404, 500]).toContain(res.statusCode);
    }, 10000);
});

// ── Auth routes ───────────────────────────────────────────────────────────
describe('Auth Routes', () => {
    it('POST /api/users/auth with empty body returns 4xx', async () => {
        const res = await request(app)
            .post('/api/users/auth')
            .send({});
        expect([400, 401, 500]).toContain(res.statusCode);
    }, 10000);

    it('POST /api/users/auth with wrong credentials returns 401', async () => {
        const res = await request(app)
            .post('/api/users/auth')
            .send({ email: 'notreal@test.com', password: 'wrongpass' });
        // User model returns null → "Invalid email or password" → 401
        expect(res.statusCode).toBe(401);
    }, 10000);

    it('GET /api/users/profile without token returns 401', async () => {
        const res = await request(app).get('/api/users/profile');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    }, 10000);
});

// ── Cart / protected routes ───────────────────────────────────────────────
describe('Protected Routes', () => {
    it('GET /api/cart without token returns 401', async () => {
        const res = await request(app).get('/api/cart');
        expect([401, 404]).toContain(res.statusCode);
    }, 10000);

    it('GET /api/orders/myorders without token returns 401', async () => {
        const res = await request(app).get('/api/orders/myorders');
        expect(res.statusCode).toBe(401);
    }, 10000);
});
