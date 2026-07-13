const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');

// Isolierte Mini-App nur zum Testen des Limiters selbst
const app = express();
app.use(express.json());
const testLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  message: { reply: 'Zu viele Anfragen.', isError: true },
});
app.post('/api/chat', testLimiter, (req, res) => res.json({ reply: 'ok' }));

describe('Rate Limiting Middleware', () => {
  it('lässt die ersten 12 Requests durch und blockt den 13.', async () => {
    for (let i = 0; i < 12; i++) {
      const res = await request(app).post('/api/chat').send({});
      expect(res.status).toBe(200);
    }
    const blocked = await request(app).post('/api/chat').send({});
    expect(blocked.status).toBe(429);
  });
});