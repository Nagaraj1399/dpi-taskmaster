import { Type } from '@google/genai';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { ServerConfig } from '../config';
import { ServiceUnavailableError, UpstreamAiError } from '../errors';
import type { Logger } from '../logger';
import { createAiService, type GenAiModelsClient } from '../services/ai';

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
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

const SimpleSchema = z.object({
  summary: z.string().min(1),
  score: z.number().int().min(0).max(100),
});

describe('AiService structured generation and fallback ladder', () => {
  it('throws ServiceUnavailableError when no API key or client is configured', async () => {
    const service = createAiService({ ...baseConfig, geminiApiKey: null }, silentLogger, null);
    expect(service.isConfigured()).toBe(false);

    await expect(
      service.generateStructuredJson({
        modelNames: ['gemini-4-hydrogen'],
        contents: 'hello',
        responseSchema: { type: Type.OBJECT, properties: {} },
        outputSchema: SimpleSchema,
      })
    ).rejects.toBeInstanceOf(ServiceUnavailableError);
  });

  it('falls back to secondary model when primary fails or emits invalid schema', async () => {
    const generateContent = vi
      .fn()
      .mockResolvedValueOnce({ text: '' })
      .mockResolvedValueOnce({ text: JSON.stringify({ summary: 'bad', score: 999 }) })
      .mockResolvedValueOnce({ text: JSON.stringify({ summary: 'ok', score: 42 }) });

    const mockClient: GenAiModelsClient = { generateContent };
    const service = createAiService(baseConfig, silentLogger, mockClient);
    expect(service.isConfigured()).toBe(true);

    const res = await service.generateStructuredJson({
      modelNames: ['model-1', 'model-2', 'model-2', 'model-3'],
      contents: 'test prompt',
      systemInstruction: 'strict system instruction',
      responseSchema: { type: Type.OBJECT, properties: {} },
      outputSchema: SimpleSchema,
    });

    expect(generateContent).toHaveBeenCalledTimes(3);
    expect(res.modelUsed).toBe('model-3');
    expect(res.data).toEqual({ summary: 'ok', score: 42 });
  });

  it('throws UpstreamAiError when all models emit malformed JSON or reject', async () => {
    const generateContent = vi
      .fn()
      .mockResolvedValueOnce({ text: '{not-valid-json' })
      .mockRejectedValueOnce(new Error('network timeout'));

    const service = createAiService(baseConfig, silentLogger, { generateContent });

    await expect(
      service.generateStructuredJson({
        modelNames: ['m1', 'm2'],
        contents: 'test',
        responseSchema: { type: Type.OBJECT, properties: {} },
        outputSchema: SimpleSchema,
      })
    ).rejects.toBeInstanceOf(UpstreamAiError);
  });
});
