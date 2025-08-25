// Jest setup file for backend tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'postgres';

// Increase timeout for database operations
jest.setTimeout(10000);
