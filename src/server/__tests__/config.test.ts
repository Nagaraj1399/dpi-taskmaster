import { describe, expect, it } from 'vitest';
import { ConfigError, parseConfig } from '../config';

describe('Server configuration validation (fail-fast)', () => {
  it('throws ConfigError on invalid PORT values', () => {
    expect(() => parseConfig({ PORT: '0' })).toThrow(ConfigError);
    expect(() => parseConfig({ PORT: '70000' })).toThrow(ConfigError);
    expect(() => parseConfig({ PORT: 'not-a-port' })).toThrow(ConfigError);
  });

  it('requires GEMINI_API_KEY in production or when explicitly enforced', () => {
    expect(() => parseConfig({ NODE_ENV: 'production' })).toThrow(ConfigError);
    expect(() =>
      parseConfig({ NODE_ENV: 'production', GEMINI_API_KEY: 'MY_GEMINI_API_KEY' })
    ).toThrow(ConfigError);
    expect(() => parseConfig({ REQUIRE_GEMINI_API_KEY: 'true' })).toThrow(ConfigError);
  });

  it('parses valid development configuration with default model names', () => {
    const cfg = parseConfig({
      NODE_ENV: 'development',
      PORT: '3000',
      GEMINI_API_KEY: 'test-key-1234',
      CORS_ORIGIN: 'https://example.org, https://civicpulse.test',
    });

    expect(cfg.port).toBe(3000);
    expect(cfg.geminiApiKey).toBe('test-key-1234');
    expect(cfg.geminiModelPrimary).toBe('gemini-4-hydrogen');
    expect(cfg.geminiModelFallbacks).toEqual(['gemini-3.1-flash-lite']);
    expect(cfg.corsOrigins).toEqual(['https://example.org', 'https://civicpulse.test']);
  });

  it('replaces deprecated or unsupported Gemini model aliases with active supported models', () => {
    const cfg = parseConfig({
      GEMINI_MODEL_PRIMARY: 'gemini-flash-latest',
      GEMINI_MODEL_FALLBACKS: 'gemini-flash-lite-latest, gemini-2.0-flash',
      GEMINI_VISION_MODEL: 'gemini-1.5-flash',
    });

    expect(cfg.geminiModelPrimary).toBe('gemini-4-hydrogen');
    expect(cfg.geminiModelFallbacks).toEqual(['gemini-3.1-flash-lite']);
    expect(cfg.geminiVisionModel).toBe('gemini-4-hydrogen');
  });
});
