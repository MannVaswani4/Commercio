const { generateAccessToken } = require('../../server/utils/generateToken');
const jwt = require('jsonwebtoken');

describe('generateAccessToken', () => {
    it('returns a valid JWT string', () => {
        const token = generateAccessToken('user123');
        expect(typeof token).toBe('string');
        expect(token.split('.').length).toBe(3); // header.payload.signature
    });

    it('embeds the userId in the payload', () => {
        const userId = 'abc123';
        const token = generateAccessToken(userId);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toBe(userId);
    });

    it('expires in 15 minutes', () => {
        const token = generateAccessToken('user123');
        const decoded = jwt.decode(token);
        const expiresIn = decoded.exp - decoded.iat;
        expect(expiresIn).toBe(15 * 60);
    });
});

// ─── Cart price calculation helpers ──────────────────────
describe('Cart price calculations', () => {
    const addDecimals = (num) => Math.round(num * 100) / 100;

    it('calculates item price correctly', () => {
        const qty = 3;
        const price = 19.99;
        expect(addDecimals(qty * price)).toBe(59.97);
    });

    it('applies shipping cost of 0 when items price > 100', () => {
        const itemsPrice = 150;
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        expect(shippingPrice).toBe(0);
    });

    it('applies $10 shipping when items price <= 100', () => {
        const itemsPrice = 40;
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        expect(shippingPrice).toBe(10);
    });

    it('calculates tax as 15% of items price', () => {
        const itemsPrice = 100;
        const taxPrice = addDecimals(0.15 * itemsPrice);
        expect(taxPrice).toBe(15);
    });

    it('calculates total price correctly', () => {
        const itemsPrice = 100;
        const shippingPrice = 0;
        const taxPrice = 15;
        const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);
        expect(totalPrice).toBe(115);
    });
});
