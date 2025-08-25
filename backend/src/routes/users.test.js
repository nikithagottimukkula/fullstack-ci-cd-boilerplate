const request = require('supertest');
const express = require('express');
const userRoutes = require('./users');

// Mock the database module
jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const { query } = require('../config/database');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', created_at: new Date() },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: new Date() },
      ];

      query.mockResolvedValue({ rows: mockUsers });

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(query).toHaveBeenCalledWith(
        'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
      );
    });

    it('should handle database errors', async () => {
      query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch users' });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = { id: 1, ...newUser, created_at: new Date(), updated_at: new Date() };

      // Mock email check (no existing user)
      query.mockResolvedValueOnce({ rows: [] });
      // Mock user creation
      query.mockResolvedValueOnce({ rows: [createdUser] });

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
    });

    it('should return 400 for invalid data', async () => {
      const invalidUser = { name: '', email: 'invalid-email' };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 409 for duplicate email', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com' };

      // Mock email check (existing user found)
      query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'Email already exists' });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', created_at: new Date() };

      query.mockResolvedValue({ rows: [mockUser] });

      const response = await request(app).get('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 for non-existent user', async () => {
      query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/api/users/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid user ID' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      query.mockResolvedValue({ rows: [{ id: 1 }] });

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted successfully', id: 1 });
    });

    it('should return 404 for non-existent user', async () => {
      query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });
});
