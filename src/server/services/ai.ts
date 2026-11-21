import { GoogleGenAI, type GenerateContentParameters, type Schema } from '@google/genai';
import type { z } from 'zod';
import type { ServerConfig } from '../config.js';
import { ServiceUnavailableError, UpstreamAiError } from '../errors.js';
import type { Logger } from '../logger.js';

/** Minimal interface matching `GoogleGenAI.models.generateContent` for testability. */
export interface GenAiModelsClient {
  generateContent(params: GenerateContentParameters): Promise<{ text?: string }>;
}

/** Parameters passed to `AiService.generateStructuredJson`. */
export interface GenerateStructuredJsonParams<T> {
  modelNames: string[];
  contents: GenerateContentParameters['contents'];
  systemInstruction?: string;
  responseSchema: Schema;
  outputSchema: z.ZodType<T>;
}

/** Result returned from a successful structured Gemini invocation. */
export interface StructuredJsonResult<T> {
  data: T;
  modelUsed: string;
}

/** Service wrapper managing Gemini model invocation, fallback ladder, and Zod output parsing. */
export interface AiService {
  isConfigured(): boolean;
  generateStructuredJson<T>(
    params: GenerateStructuredJsonParams<T>
  ): Promise<StructuredJsonResult<T>>;
}

/**
 * Creates an `AiService` instance using the configured `GEMINI_API_KEY` or an injected client for tests.
 */
export function createAiService(
  config: ServerConfig,
  logger: Logger,
  clientOverride?: GenAiModelsClient | null
): AiService {
  const modelsClient: GenAiModelsClient | null =
    clientOverride !== undefined
      ? clientOverride
      : config.geminiApiKey
        ? new GoogleGenAI({
            apiKey: config.geminiApiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          }).models
        : null;

  return {
    isConfigured(): boolean {
      return modelsClient !== null;
    },

    async generateStructuredJson<T>(
      params: GenerateStructuredJsonParams<T>
    ): Promise<StructuredJsonResult<T>> {
      if (!modelsClient) {
        throw new ServiceUnavailableError(
          'Gemini AI service is not configured. Set GEMINI_API_KEY on the server.'
        );
      }

      const uniqueModels = Array.from(
        new Set(params.modelNames.filter((m) => m.trim().length > 0))
      );
      let lastErrorMessage = 'No models configured';

      for (const modelName of uniqueModels) {
        try {
          const response = await modelsClient.generateContent({
            model: modelName,
            contents: params.contents,
            config: {
              ...(params.systemInstruction ? { systemInstruction: params.systemInstruction } : {}),
              responseMimeType: 'application/json',
              responseSchema: params.responseSchema,
            },
          });

          const rawText = response.text?.trim();
          if (!rawText) {
            lastErrorMessage = `Model ${modelName} returned an empty response`;
            logger.warn('Gemini returned empty response', { modelName });
            continue;
          }

          const parsedJson: unknown = JSON.parse(rawText);
          const validated = params.outputSchema.safeParse(parsedJson);
          if (!validated.success) {
            lastErrorMessage = `Model ${modelName} output failed schema validation`;
            logger.warn('Gemini JSON output failed Zod schema validation', {
              modelName,
              issues: validated.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
            });
            continue;
          }

          return {
            data: validated.data,
            modelUsed: modelName,
          };
        } catch (err: unknown) {
          lastErrorMessage = err instanceof Error ? err.message : String(err);
          logger.warn('Gemini model attempt failed', {
            modelName,
            errorMessage: lastErrorMessage,
          });
        }
      }

      throw new UpstreamAiError(
        'AI analysis failed across all configured Gemini models.',
        lastErrorMessage
      );
    },
  };
}
