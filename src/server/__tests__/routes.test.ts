import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { BRICS_COUNTRIES } from '../../shared/bricsData';
import { createApp } from '../app';
import type { ServerConfig } from '../config';
import type { Logger } from '../logger';
import type { GenAiModelsClient } from '../services/ai';

const baseConfig: ServerConfig = {
  port: 3000,
  nodeEnv: 'test',
  logLevel: 'error',
  geminiApiKey: 'test-key',
  geminiModelPrimary: 'gemini-4-hydrogen',
  geminiModelFallbacks: ['gemini-3.1-flash-lite'],
  geminiVisionModel: 'gemini-4-hydrogen',
  corsOrigins: [],
};

const silentLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: vi.fn(),
};

describe('Express API routes and global error handling', () => {
  it('returns health status and 11 BRICS datasets', async () => {
    const { app } = createApp(baseConfig, { logger: silentLogger, aiClient: null });

    const healthRes = await request(app).get('/api/health');
    expect(healthRes.status).toBe(200);
    expect(healthRes.body.status).toBe('ok');

    const datasetsRes = await request(app).get('/api/brics/countries');
    expect(datasetsRes.status).toBe(200);
    expect(datasetsRes.body.countries).toHaveLength(11);
  });

  it('returns JSON 404 on unknown /api/* endpoints', async () => {
    const { app } = createApp(baseConfig, { logger: silentLogger, aiClient: null });
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('rejects unknown country codes and __proto__ keys with 400 validation error', async () => {
    const { app } = createApp(baseConfig, { logger: silentLogger, aiClient: null });

    const badCountry = await request(app)
      .post('/api/datasets/verify-and-sync')
      .send({ countryCode: 'US', dataset: BRICS_COUNTRIES.IN });
    expect(badCountry.status).toBe(400);
    expect(badCountry.body.error.code).toBe('VALIDATION_ERROR');

    const protoRes = await request(app)
      .post('/api/datasets/verify-and-sync')
      .set('Content-Type', 'application/json')
      .send('{"countryCode":"IN","__proto__":{"admin":true},"dataset":{}}');
    expect(protoRes.status).toBe(400);
    expect(protoRes.body.error.code).toBe('FORBIDDEN_KEYS');
  });

  it('returns 503 when Gemini client is unconfigured and 502 when Gemini fails upstream', async () => {
    const unconfigured = createApp(baseConfig, { logger: silentLogger, aiClient: null });
    const res503 = await request(unconfigured.app)
      .post('/api/fusion/analyze')
      .send({
        countryCode: 'IN',
        grievance: {
          region: 'Madurai',
          channel: 'Voice IVR',
          originalText: 'Main water pipeline burst near village square.',
          originalLanguage: 'Tamil',
          sector: 'Water & Sanitation',
          urgency: 'Emergency',
        },
      });
    expect(res503.status).toBe(503);
    expect(res503.body.error.code).toBe('AI_SERVICE_UNAVAILABLE');

    const failingAiClient: GenAiModelsClient = {
      generateContent: vi
        .fn()
        .mockRejectedValue(new Error('secret upstream API failure token-xyz')),
    };
    const upstreamFail = createApp(baseConfig, {
      logger: silentLogger,
      aiClient: failingAiClient,
    });
    const res502 = await request(upstreamFail.app)
      .post('/api/fusion/analyze')
      .send({
        countryCode: 'IN',
        grievance: {
          region: 'Madurai',
          channel: 'Voice IVR',
          originalText: 'Main water pipeline burst near village square.',
          originalLanguage: 'Tamil',
          sector: 'Water & Sanitation',
          urgency: 'Emergency',
        },
      });
    expect(res502.status).toBe(502);
    expect(res502.body.error.code).toBe('UPSTREAM_AI_ERROR');
    expect(JSON.stringify(res502.body)).not.toContain('token-xyz');
  });

  it('returns grounded AI fusion result with canonical SHA-256 and without fake zero-hallucination claims', async () => {
    const mockAiClient: GenAiModelsClient = {
      generateContent: vi.fn().mockResolvedValue({
        text: JSON.stringify({
          summaryAnalysis: 'Urgent water pipeline breach affecting Melur residents.',
          affectedPopulationEst: 84000,
          reportedDeficiency: 'Main rural drinking water pipe severed.',
          gapSeverityScore: 86,
          matchingProgramName: 'Jal Jeevan Mission (Har Ghar Jal)',
          fiscalVarianceNote: 'Funding allocated; district repair dispatch delayed.',
          actionableRecommendations: [
            'Deploy district water engineering unit within 48 hours.',
            'Authorize emergency repair tranche from Jal Jeevan reserve.',
            'Send bilingual IVR repair updates to registered callers.',
          ],
        }),
      }),
    };

    const { app } = createApp(baseConfig, { logger: silentLogger, aiClient: mockAiClient });
    const res = await request(app)
      .post('/api/fusion/analyze')
      .send({
        countryCode: 'BR',
        grievance: {
          region: 'Bahia',
          channel: 'Messaging Apps',
          originalText: 'Pipeline leaking in Bahia rural community.',
          originalLanguage: 'Portuguese',
          sector: 'Water & Sanitation',
          urgency: 'High',
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.countryCode).toBe('BR');
    expect(res.body.result.provenance.payloadSha256).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(res.body.result.provenance.aiModelUsed).toBe('gemini-4-hydrogen');
    expect(res.body.result.zeroHallucinationProof).toBeUndefined();
  });

  it('analyzes base64 photos via /api/vision/analyze-photo and blocks non-allowlisted photoUrl hosts', async () => {
    const mockAiClient: GenAiModelsClient = {
      generateContent: vi.fn().mockResolvedValue({
        text: JSON.stringify({
          detectedIssue: 'Collapsed road shoulder',
          severityScore: 81,
          infrastructureCategory: 'Roads & Highways',
          estimatedRepairUrgency: 'High (Within 72 Hours)',
          featuresIdentified: ['Eroded embankment', 'Cracked asphalt'],
        }),
      }),
    };
    const { app } = createApp(baseConfig, { logger: silentLogger, aiClient: mockAiClient });

    const blockedRes = await request(app).post('/api/vision/analyze-photo').send({
      countryCode: 'IN',
      photoUrl: 'https://evil.example.com/photo.jpg',
    });
    expect(blockedRes.status).toBe(400);
    expect(blockedRes.body.error.code).toBe('VALIDATION_ERROR');

    const okRes = await request(app).post('/api/vision/analyze-photo').send({
      countryCode: 'IN',
      sector: 'Roads & Highways',
      region: 'Madurai',
      imageBase64: 'data:image/jpeg;base64,aGVsbG8td29ybGQtaW1hZ2UtZGF0YQ==',
    });
    expect(okRes.status).toBe(200);
    expect(okRes.body.result.severityScore).toBe(81);
    expect(okRes.body.result.aiModelUsed).toBe('gemini-4-hydrogen');
  });

  it('does not leak raw error.message on unexpected 500 errors and checks voice route', async () => {
    const explodingService = {
      getAllCountries: () => {
        throw new Error('sensitive database connection string exposed');
      },
      getCountry: () => BRICS_COUNTRIES.IN,
      verifyAndSync: vi.fn(),
    };

    const { app } = createApp(baseConfig, {
      logger: silentLogger,
      verificationService: explodingService,
      aiClient: null,
    });

    const errRes = await request(app).get('/api/brics/countries');
    expect(errRes.status).toBe(500);
    expect(errRes.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(errRes.body.error.message).not.toContain('sensitive database');

    const voiceApp = createApp(baseConfig, { logger: silentLogger, aiClient: null }).app;
    const voiceRes = await request(voiceApp)
      .post('/api/voice/process-ivr')
      .send({ countryCode: 'IN', keypadSelection: '1' });
    expect(voiceRes.status).toBe(200);
    expect(voiceRes.body.telemetry.ivrNode).toBe('BRICS-IVR-IN');
  });

  it('allows same-origin Host/APP_URL and non-API Vite paths while rejecting untrusted CORS origins on /api', async () => {
    const { app } = createApp(
      { ...baseConfig, appUrl: 'https://ais-dev-example.run.app' },
      { logger: silentLogger, aiClient: null }
    );

    // Non-API Vite module asset requests must not trigger CORS_DENIED
    const viteModuleRes = await request(app)
      .get('/src/main.tsx')
      .set('Origin', 'https://ais-dev-example.run.app');
    expect(viteModuleRes.status).not.toBe(400);

    // Same-origin Host or APP_URL on /api/* is allowed
    const sameHostRes = await request(app)
      .get('/api/health')
      .set('Host', 'ais-pre-example.run.app')
      .set('Origin', 'https://ais-pre-example.run.app');
    expect(sameHostRes.status).toBe(200);

    const appUrlRes = await request(app)
      .get('/api/health')
      .set('Origin', 'https://ais-dev-example.run.app');
    expect(appUrlRes.status).toBe(200);

    // Untrusted third-party origin on /api/* is rejected with 400 CORS_DENIED
    const deniedRes = await request(app)
      .get('/api/health')
      .set('Host', 'ais-dev-example.run.app')
      .set('Origin', 'https://evil.example.com');
    expect(deniedRes.status).toBe(400);
    expect(deniedRes.body.error.code).toBe('CORS_DENIED');
  });
});
