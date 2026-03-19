// Load test environment variables before any test runs
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.NODE_ENV = 'test';
// MONGO_URI intentionally not set here — integration tests use a separate in-memory setup
