// FILE: test/locations_api.test.js

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from './app.js';

let token;
let warehouseId;
let locationId;

beforeAll(async () => {
  // Create a user
  await request(app)
    .post('/users')
    .send({ username: 'testuser@example.com', name: 'Test locations User', password: 'password' });

  // Log in to get a token
  const loginResponse = await request(app)
    .post('/login')
    .send({ username: 'testuser@example.com', password: 'password' });

  token = loginResponse.body.token;

  // Create a warehouse for the user
  const warehouseResponse = await request(app)
    .post('/user_warehouses')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test locations Warehouse', description: 'A test warehouse' });


  warehouseId = warehouseResponse.body.warehouse.id;

});


describe('Locations API', () => {
  describe('POST /locations', () => {
    it('should create a new location', async () => {
      const response = await request(app)
        .post('/locations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Location',
          description: 'A test location',
          warehouseId: warehouseId,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Location');

      locationId = response.body.id;
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/locations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'No name provided',
          warehouseId: warehouseId,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Location name and warehouse Id is required');
    });

    it('should return 403 if user does not have access to the warehouse', async () => {
      const response = await request(app)
        .post('/locations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Invalid Warehouse Location',
          warehouseId: 9999,
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden: User does not own this warehouse or warehouse not found');
    });
  });

  describe('GET /locations', () => {
    it('should get all locations for the user', async () => {
      const response = await request(app)
        .get('/locations')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /locations/:id', () => {
    it('should update the location', async () => {
      const response = await request(app)
        .put(`/locations/${locationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Updated location description' });

      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Updated location description');
    });

    it('should return 403 if user does not own the location', async () => {
      const response = await request(app)
        .put('/locations/9999')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Should not update' });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden: User does not own this location or location not found');
    });
  });

  describe('DELETE /locations/:id', () => {
    it('should delete the location', async () => {
      const response = await request(app)
        .delete(`/locations/${locationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('should return 403 if location already deleted or not owned', async () => {
      const response = await request(app)
        .delete(`/locations/${locationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden: User does not own this location or location not found');
    });
  });
});