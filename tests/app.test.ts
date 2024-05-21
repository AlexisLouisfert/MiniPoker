import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { createApp } from '../src/createApp';

describe('Test de l\'application Express', () => {
  let app: express.Application;
  let server: any;

  beforeEach(() => {
    app = createApp();
    server = app.listen(4000);
  });

  afterEach(() => {
    server.close();
  });

  it('devrait démarrer un nouveau jeu à la route GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<title>PokerMini</title>'); 
    expect(response.text).toContain('<h1>Poker Mini</h1>');
  });

  it('devrait démarrer un nouveau jeu à la route POST /new-game', async () => {
    const response = await request(app).post('/new-game');
    expect(response.status).toBe(302);
    expect(response.header['location']).toBe('/');
  });

  it('devrait retourner l\'état du jeu à la route GET /game-status', async () => {
    await request(app).post('/new-game'); // Démarrer un nouveau jeu pour initialiser la session
    const response = await request(app).get('/game-status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('hand');
    expect(response.body).toHaveProperty('balances');
  });

  // it('devrait retourner la main de l\'adversaire à la route GET /opponent-hand', async () => {
  //   await request(app).get('/');
  //   await request(app).post('/new-game'); // Démarrer un nouveau jeu pour initialiser la session
  //   const response = await request(app).get('/opponent-hand');
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('human');
  //   expect(response.body).toHaveProperty('bot');
  // });

  it('devrait gérer l\'action "play" à la route POST /play', async () => {
    await request(app).post('/new-game'); // Démarrer un nouveau jeu pour initialiser la session

    const response = await request(app)
      .post('/play')
      .send({ action: 'bet', amount: '10' });

    // Assurez-vous que l'action a été traitée correctement
    expect(response.status).toBe(302);
    expect(response.header['location']).toBe('/');
  });
});