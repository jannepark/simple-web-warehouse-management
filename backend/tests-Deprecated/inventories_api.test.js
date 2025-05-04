// FILE: test/inventories_api.test.js

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from './app.js';


let token;
let warehouseId;
let locationId;
let inventoryId;

beforeAll(async () => {
  // Create a user
  await request(app)
    .post('/users')
    .send({ username: 'testInventoryUser@example.com', name: 'Test Inventories User', password: 'password' });

  // Log in to get a token
  const loginResponse = await request(app)
    .post('/login')
    .send({ username: 'testInventoryUser@example.com', password: 'password' });

  token = loginResponse.body.token;

  // Create a warehouse for the user
  const warehouseResponse = await request(app)
    .post('/user_warehouses')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Inventories Warehouse', description: 'A test warehouse' });

  warehouseId = warehouseResponse.body.warehouse.id;

  // Create a location for the warehouse
  const locationResponse = await request(app)
    .post('/locations')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Inventory Location', description: 'A test location', warehouseId: warehouseId });

  locationId = locationResponse.body.id;
});

describe('Inventories API', () => {
  describe('POST /inventories', () => {
    it('should create a new inventory entry with item data', async () => {
      const response = await request(app)
        .post('/inventories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Item',
          description: 'A test item',
          locationId: locationId,
          quantity: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.item.name).toBe('Test Item');
      expect(response.body.inventory.locationId).toBe(locationId);
      console.log('response.body perkl', response.body);
      inventoryId = response.body.inventory.id;
    });

    it('should return 400 if item data is missing', async () => {
      const response = await request(app)
        .post('/inventories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          locationId: locationId,
          quantity: 10
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Item name is required');
    });
  });

  describe('GET /inventories', () => {
    it('should get all inventories for the user', async () => {
      const response = await request(app)
        .get('/inventories')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      // expect(response.body[0].locationId).toBe(locationId);
    });

    it('should return error messsage if no inventories found for user', async () => {
      // Delete the inventory entry to simulate no inventories
      const response = await request(app)
        .delete(`/inventories/inventory/${inventoryId}`)
        .set('Authorization', `Bearer ${token}`)

      console.log('response prkl', response);
      expect(response.status).toBe(204)

      const response2 = await request(app)
        .get(`/inventories/${locationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response2.status).toBe(200);
      // { locationName: location.name, message: 'no inventories found for user' }
      expect(response2.body[0].message).toBe('no inventories found for user');
    });
  });

});