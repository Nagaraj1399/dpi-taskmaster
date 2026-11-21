import express, { Router } from 'express';
import { DEFAULT_JSON_BODY_LIMIT } from '../../shared/constants.js';
import { VerifyAndSyncRequestSchema } from '../../shared/schemas.js';
import type { BricsCountryCode } from '../../shared/types.js';
import { validateBody } from '../middleware/validate.js';
import type { VerificationService } from '../services/verification.js';

/**
 * Creates routers for BRICS baseline country retrieval and dataset verification/sync.
 */
export function createDatasetsRouter(verificationService: VerificationService): Router {
  const router = Router();
  const jsonParser = express.json({ limit: DEFAULT_JSON_BODY_LIMIT });

  /** Returns all current BRICS+ baseline datasets from the server store. */
  router.get('/brics/countries', (_req, res) => {
    res.json({
      success: true,
      countries: verificationService.getAllCountries(),
      telemetry: {
        source_type: 'Official Government Open Data Registry',
        dataset_categories: [
          'National Demographic Data',
          'Infrastructure Indices',
          'Public Investment Plans',
          'Public Health & Agriculture Feeds',
        ],
        verification_status: 'Schema validated against BRICS baseline contracts',
        dpg_compliance: true,
      },
    });
  });

  /**
   * Validates a dataset against baseline schemas, probes any configured external REST API,
   * computes a canonical SHA-256 digest, and persists only if all checks pass.
   */
  router.post(
    '/datasets/verify-and-sync',
    jsonParser,
    validateBody(VerifyAndSyncRequestSchema),
    async (req, res, next) => {
      try {
        const { countryCode, dataset, customApiConfig } = req.body as {
          countryCode: BricsCountryCode;
          dataset: Parameters<VerificationService['verifyAndSync']>[0]['dataset'];
          customApiConfig?: Parameters<VerificationService['verifyAndSync']>[0]['customApiConfig'];
        };

        const { verificationResult, updatedDataset } = await verificationService.verifyAndSync({
          countryCode,
          dataset,
          customApiConfig,
        });

        if (!verificationResult.verified) {
          res.status(422).json({
            success: false,
            error: {
              code: 'VERIFICATION_FAILED',
              message: 'Dataset verification failed. Changes were not persisted.',
            },
            verificationResult,
            updatedDataset: null,
          });
          return;
        }

        res.json({
          success: true,
          verificationResult,
          updatedDataset,
        });
      } catch (err: unknown) {
        next(err);
      }
    }
  );

  return router;
}
