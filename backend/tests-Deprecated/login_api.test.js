// FILE: test/login_api.test.js

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { User, Session } from '../models/index.js';
import app from './app.js';

beforeAll(async () => {

  await request(app)
    .post('/users')
    .send({ username: 'validLoginUser@example.com', name: 'Valid User', password: 'password' });
  console.log('User created!');

});


describe('POST /login', () => {
  it('should return 401 for invalid username', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'invalid@example.com', password: 'password' });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('invalid username or password');
  });

  it('should return 401 for invalid password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'validLoginUser@example.com', password: 'invalid' });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('invalid username or password');
  });

  it('should return 200 for successful login', async () => {
    const users = await User.findAll();
    console.log(users.map(user => user.toJSON()));
    const response = await request(app)
      .post('/login')
      .send({ username: 'validLoginUser@example.com', password: 'password' });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('validLoginUser@example.com');
  });

  it('should return 400 for missing username', async () => {
    const response = await request(app)
      .post('/login')
      .send({ password: 'password' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('username and password required');
  });

  it('should return 400 for missing password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'validLoginUser@example.com' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('username and password required');
  });

  it('should return 401 for disabled account', async () => {
    await User.update({ disabled: true }, { where: { username: 'validLoginUser@example.com' } });
    const response = await request(app)
      .post('/login')
      .send({ username: 'validLoginUser@example.com', password: 'password' });
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('account disabled');
    await User.update({ disabled: false }, { where: { username: 'validLoginUser@example.com' } });
  });
  // test logout
  it('should return 200 for successful logout', async () => {
    // creat a new user
    await request(app)
      .post('/users')
      .send({ username: 'testLogOutUser@example.com', name: 'Test LogOut User', password: 'password' });
    const response = await request(app)
      .post('/login')
      .send({ username: 'testLogOutUser@example.com', password: 'password' });
    const token = response.body.token;
    const logoutResponse = await request(app)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(logoutResponse.status).toBe(200);
    // check that the session was deleted
    const session = await Session.findOne({ where: { token } });
    expect(session).toBeNull();
  });
});