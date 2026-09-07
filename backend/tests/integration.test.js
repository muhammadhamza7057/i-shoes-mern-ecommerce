import request from 'supertest';
import app from '../src/app.js';

describe('Backend health', () => {
  it('reports that the API is running', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { status: 'ok' },
      message: 'Healthy',
    });
  });
});
