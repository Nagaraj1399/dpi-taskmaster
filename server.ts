import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createApp } from './src/server/app.js';
import { loadConfig } from './src/server/config.js';
import { createLogger } from './src/server/logger.js';
import { createGlobalErrorHandler } from './src/server/middleware/errorHandler.js';

/**
 * Bootstraps configuration, Express API routes, frontend serving (Vite in dev, static `dist/` in production),
 * and binds the HTTP server to the configured port.
 */
async function startServer(): Promise<void> {
  const config = loadConfig();
  const logger = createLogger(config.logLevel);

  if (!config.geminiApiKey) {
    logger.warn(
      'GEMINI_API_KEY is not configured; AI fusion and vision endpoints will return HTTP 503 until configured.'
    );
  }

  const { app } = createApp(config, { logger });

  if (config.nodeEnv !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use(createGlobalErrorHandler(logger));

  app.listen(config.port, '0.0.0.0', () => {
    logger.info('CivicPulse BRICS server started', {
      port: config.port,
      nodeEnv: config.nodeEnv,
    });
  });
}

startServer().catch((err: unknown) => {
  const logger = createLogger('error');
  logger.error('Fatal server startup failure', {
    errorMessage: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  process.exit(1);
});
