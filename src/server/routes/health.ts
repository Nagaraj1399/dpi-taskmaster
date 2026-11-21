import { Router } from 'express';

/**
 * Creates the health check router exposing `GET /api/health`.
 */
export function createHealthRouter(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'CivicPulse BRICS AI Data Fusion Engine',
      dpg_compliant: true,
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
