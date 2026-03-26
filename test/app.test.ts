import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app';

describe('buildApp', () => {
  const originalCorsOrigins = process.env.CORS_ALLOWED_ORIGINS;
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    process.env.CORS_ALLOWED_ORIGINS =
      'https://allowed.example https://backup.example';
    app = await buildApp({ logger: false });
  });

  afterEach(async () => {
    await app.close();
    process.env.CORS_ALLOWED_ORIGINS = originalCorsOrigins;
  });

  it('returns the hello payload from the root route', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ hello: 'hello' });
  });

  it('applies the configured CORS headers to allowed origins', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: {
        origin: 'https://allowed.example',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(
      'https://allowed.example',
    );
    expect(response.headers['access-control-expose-headers']).toContain(
      'Content-Type',
    );
    expect(response.headers['access-control-expose-headers']).toContain(
      'Content-Disposition',
    );
  });

  it('enforces the global rate limit after two requests', async () => {
    const request = {
      method: 'GET' as const,
      url: '/',
    };

    const firstResponse = await app.inject(request);
    const secondResponse = await app.inject(request);
    const thirdResponse = await app.inject(request);

    expect(firstResponse.statusCode).toBe(200);
    expect(secondResponse.statusCode).toBe(200);
    expect(thirdResponse.statusCode).toBe(429);
    expect(thirdResponse.json()).toMatchObject({
      statusCode: 429,
      error: 'Too Many Requests',
    });
  });
});
