# CivicPulse BRICS — API Reference

All API routes are served under `/api` by the Express backend (`server.ts` / `src/server/app.ts`).
Security middleware enforces Helmet headers, explicit CORS origin checks, prototype-pollution key rejection (`__proto__`, `constructor`, `prototype`), per-route body size limits (`100kb` default, `5mb` for photo vision payloads), and sliding-window rate limiting on AI endpoints (`20` requests per `60s` window).

---

## Standard Error Format

Every `4xx` and `5xx` API response uses a consistent JSON structure (`ApiErrorResponse`):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "fieldErrors": {
      "countryCode": ["Invalid option: expected one of \"BR\"|\"RU\"|..."]
    }
  }
}
```

### Error Codes

| HTTP Status | `error.code`             | Cause                                                                         |
| :---------- | :----------------------- | :---------------------------------------------------------------------------- |
| `400`       | `VALIDATION_ERROR`       | Request body failed Zod schema validation (`fieldErrors` included).           |
| `400`       | `FORBIDDEN_KEYS`         | Payload contains `__proto__`, `constructor`, or `prototype` keys.             |
| `400`       | `INVALID_JSON`           | Request body could not be parsed as valid JSON.                               |
| `400`       | `CORS_DENIED`            | Browser `Origin` header is not permitted by `CORS_ORIGIN`.                    |
| `404`       | `NOT_FOUND`              | Unknown `/api/*` endpoint.                                                    |
| `413`       | `PAYLOAD_TOO_LARGE`      | Request exceeded route body size limit (`100kb` or `5mb`).                    |
| `422`       | `VERIFICATION_FAILED`    | Dataset schema or external REST API probe failed; changes were not persisted. |
| `429`       | `RATE_LIMIT_EXCEEDED`    | Too many requests to AI endpoints within the 60s window.                      |
| `500`       | `INTERNAL_SERVER_ERROR`  | Unexpected server error (internal details logged server-side only).           |
| `502`       | `UPSTREAM_AI_ERROR`      | Gemini API or allowlisted photo fetch failed or returned invalid output.      |
| `503`       | `AI_SERVICE_UNAVAILABLE` | `GEMINI_API_KEY` is not configured on the server.                             |

---

## Endpoints

### 1. Health Check

`GET /api/health`

**Response (`200 OK`)**

```json
{
  "status": "ok",
  "service": "CivicPulse BRICS AI Data Fusion Engine",
  "dpg_compliant": true,
  "timestamp": "2026-08-18T12:00:00.000Z"
}
```

---

### 2. List BRICS+ Country Baseline Datasets

`GET /api/brics/countries`

Returns the current in-memory baseline datasets for all 11 allowlisted BRICS+ nations (`BR`, `RU`, `IN`, `CN`, `ZA`, `EG`, `ET`, `IR`, `SA`, `AE`, `ID`).

**Response (`200 OK`)**

```json
{
  "success": true,
  "countries": [{ "code": "IN", "name": "India", "...": "..." }],
  "telemetry": {
    "source_type": "Official Government Open Data Registry",
    "dataset_categories": [
      "National Demographic Data",
      "Infrastructure Indices",
      "Public Investment Plans",
      "Public Health & Agriculture Feeds"
    ],
    "verification_status": "Schema validated against BRICS baseline contracts",
    "dpg_compliance": true
  }
}
```

---

### 3. Verify and Sync Country Dataset

`POST /api/datasets/verify-and-sync`

- **Body Limit**: `100kb`
- **Behavior**: Runs table-driven Zod integrity checks (demographics sum <= 100%, infrastructure bounds, public investment programs >= 1). If `customApiConfig.endpointUrl` is provided, performs an SSRF-checked HTTP probe (blocking loopback, private RFC1918, and link-local IP ranges). Computes a reproducible canonical SHA-256 digest (`sha256:...`). **Persists to server state only when all checks pass (`verified === true`).**

**Request Body**

```json
{
  "countryCode": "IN",
  "dataset": { "...BricsCountry..." },
  "customApiConfig": {
    "endpointUrl": "https://api.data.gov.in/resource/sample",
    "authHeaderType": "Bearer",
    "apiKey": "optional-token",
    "syncIntervalMinutes": 60,
    "lastSyncStatus": "Idle"
  }
}
```

**Response (`200 OK` when verified)**

```json
{
  "success": true,
  "verificationResult": {
    "verified": true,
    "timestamp": "2026-08-18T12:00:00.000Z",
    "checksPassed": 4,
    "checksTotal": 4,
    "sha256Digest": "sha256:...",
    "checks": [
      {
        "id": "demographics_schema",
        "name": "Demographic Census Integrity",
        "passed": true,
        "message": "Census metrics valid: ...",
        "severity": "success"
      }
    ],
    "endpointStatus": {
      "probed": true,
      "url": "https://api.data.gov.in/resource/sample",
      "httpStatus": 200,
      "responseTimeMs": 142
    },
    "appliedToState": true
  },
  "updatedDataset": { "...BricsCountry with sha256Digest and lastVerifiedTimestamp..." }
}
```

**Response (`422 Unprocessable Entity` when checks fail)**

```json
{
  "success": false,
  "error": {
    "code": "VERIFICATION_FAILED",
    "message": "Dataset verification failed. Changes were not persisted."
  },
  "verificationResult": { "verified": false, "appliedToState": false, "...": "..." },
  "updatedDataset": null
}
```

---

### 4. AI Data Fusion Analysis

`POST /api/fusion/analyze`

- **Rate Limit**: AI rate limiter (`20 req / 60s`)
- **Body Limit**: `100kb`
- **Behavior**: Fuses a citizen grievance with the server-stored official baseline dataset for `countryCode`, computes deterministic sector baseline and infrastructure gap scores (`src/shared/scoring.ts`), invokes Gemini with structured JSON validation (`FusionAiOutputSchema`) and model fallback ladder, and seals the payload with a canonical SHA-256 digest.

**Request Body**

```json
{
  "countryCode": "IN",
  "grievance": {
    "id": "GRV-IN-1001",
    "region": "Tamil Nadu (Madurai)",
    "channel": "Voice IVR",
    "originalText": "Main drinking water pipeline ruptured in Melur.",
    "originalLanguage": "Tamil",
    "sector": "Water & Sanitation",
    "urgency": "Emergency"
  }
}
```

**Response (`200 OK`)**

```json
{
  "success": true,
  "result": {
    "grievanceId": "GRV-IN-1001",
    "timestamp": "2026-08-18T12:00:00.000Z",
    "countryCode": "IN",
    "region": "Tamil Nadu (Madurai)",
    "sector": "Water & Sanitation",
    "summaryAnalysis": "...",
    "demographicContext": {
      "affectedPopulationEst": 84000,
      "vulnerabilityWeight": 42.8,
      "censusSource": "..."
    },
    "infrastructureGapAnalysis": {
      "baselineIndex": 74,
      "reportedDeficiency": "...",
      "gapSeverityScore": 86,
      "officialDatasetReference": "..."
    },
    "publicInvestmentAlignment": {
      "allocatedBudgetFound": true,
      "matchingProgramName": "...",
      "allocatedAmountUSD": "...",
      "disbursementStatus": "...",
      "fiscalVarianceNote": "..."
    },
    "environmentalPublicDataOverlay": {
      "whoHealthContext": "...",
      "faoAgriContext": "...",
      "copernicusSatelliteContext": "..."
    },
    "actionableRecommendations": ["..."],
    "telemetry": {
      "brics_data_fusion_telemetry": { "...": "..." },
      "citizen_grievance_integration": { "...": "..." }
    },
    "provenance": {
      "authorizedPortalsConsulted": ["https://data.gov.in"],
      "payloadSha256": "sha256:...",
      "aiModelUsed": "gemini-4-hydrogen",
      "dataTimestamp": "2026-08-18T12:00:00.000Z"
    }
  }
}
```

**Error Responses**: `400`, `429`, `502` (`UPSTREAM_AI_ERROR`), `503` (`AI_SERVICE_UNAVAILABLE`).

---

### 5. Multimodal Infrastructure Photo Analysis

`POST /api/vision/analyze-photo`

- **Rate Limit**: AI rate limiter (`20 req / 60s`)
- **Body Limit**: `5mb`
- **Behavior**: Accepts either `imageBase64` (data URI or raw base64) or an allowlisted HTTPS `photoUrl` (`images.unsplash.com`), sends the image to Gemini Vision, and validates the structured response with `VisionAiOutputSchema`.

**Request Body**

```json
{
  "countryCode": "IN",
  "sector": "Roads & Highways",
  "region": "Madurai",
  "imageBase64": "data:image/jpeg;base64,..."
}
```

_(Provide either `imageBase64` or `photoUrl`.)_

**Response (`200 OK`)**

```json
{
  "success": true,
  "result": {
    "detectedIssue": "Collapsed asphalt road shoulder",
    "severityScore": 82,
    "infrastructureCategory": "Roads & Highways",
    "estimatedRepairUrgency": "High (Within 72 Hours)",
    "featuresIdentified": ["Surface fracture", "Drainage erosion"],
    "aiModelUsed": "gemini-4-hydrogen"
  }
}
```

**Error Responses**: `400`, `413`, `429`, `502` (`UPSTREAM_AI_ERROR`), `503` (`AI_SERVICE_UNAVAILABLE`).

---

### 6. Process IVR Telephony Telemetry

`POST /api/voice/process-ivr`

- **Body Limit**: `100kb`

**Request Body**

```json
{
  "countryCode": "IN",
  "callerPhone": "+91-XXXX-8910",
  "keypadSelection": "1 (Water & Sanitation)",
  "speechTranscript": "Pipe burst near primary school."
}
```

**Response (`200 OK`)**

```json
{
  "success": true,
  "telemetry": {
    "caller": "+91-XXXX-8910",
    "keypadOption": "1 (Water & Sanitation)",
    "speechLanguageDetected": "ta-IN / hi-IN",
    "ivrNode": "BRICS-IVR-IN",
    "processedAt": "2026-08-18T12:00:00.000Z",
    "dpgCompliance": true,
    "extractedText": "Pipe burst near primary school."
  },
  "sampleExtractedText": "Pipe burst near primary school."
}
```
