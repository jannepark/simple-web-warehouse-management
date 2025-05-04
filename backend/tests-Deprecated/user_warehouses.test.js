// FILE: test/user_warehouses_api.test.js

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

import app from './app.js';


let token;
let warehouseId;
let warehouseIdtoDelete;

beforeAll(async () => {

  // Create a user
  await request(app)
    .post('/users')
    .send({ username: 'testWarehouseUser@example.com', name: 'Test warehouse user', password: 'password' });

  // Log in to get a token
  const loginResponse = await request(app)
    .post('/login')
    .send({ username: 'testWarehouseUser@example.com', password: 'password' });

  token = loginResponse.body.token;
});


describe('User Warehouses API', () => {
  describe('POST /user_warehouses', () => {
    it('should create a new user warehouse', async () => {
      const response = await request(app)
        .post('/user_warehouses')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Warehouse', description: 'A test warehouse' });

      expect(response.status).toBe(201);
      expect(response.body.warehouse.name).toBe('Test Warehouse');

      warehouseId = response.body.warehouse.id;
      console.log('!!!!!!!!!!!!!!', warehouseId)
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/user_warehouses')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'No name provided' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Warehouse name is required');
    });
  });

  describe('GET /user_warehouses', () => {
    it('should get all warehouses for the user', async () => {
      const response = await request(app)
        .get('/user_warehouses')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /user_warehouses/:warehouseId', () => {
    it('should get a specific warehouse by ID', async () => {
      const response = await request(app)
        .get(`/user_warehouses/${warehouseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(warehouseId);
    });


    it('should return 404 if warehouse not found', async () => {
      const response = await request(app)
        .get('/user_warehouses/9999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('user warehouse not found');
    });
  });

  describe('PUT /user_warehouses/:warehouseId', () => {
    it('should update the warehouse', async () => {
      const response = await request(app)
        .put(`/user_warehouses/${warehouseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Updated description' });

      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Updated description');
    });

    it('should return 404 if warehouse not found', async () => {
      const response = await request(app)
        .put('/user_warehouses/9999')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Should not update' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Warehouse not found or you do not have access');
    });
  });

  describe('DELETE /user_warehouses/:warehouseId', () => {
    it('should delete the warehouse', async () => {
      // Create a new warehouse to delete
      const createResponse = await request(app)
        .post('/user_warehouses')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Delete Warehouse', description: 'A test warehouse' });

      warehouseIdtoDelete = createResponse.body.warehouse.id;
      const response = await request(app)
        .delete(`/user_warehouses/${warehouseIdtoDelete}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 if warehouse already deleted', async () => {
      const response = await request(app)
        .delete(`/user_warehouses/${warehouseIdtoDelete}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Warehouse not found or you do not have access');
    });
  });
});