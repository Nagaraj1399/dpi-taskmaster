# CivicPulse BRICS — AI for Digital Public Infrastructure & Governance

CivicPulse BRICS is an open Digital Public Good (DPG) and multi-jurisdictional AI governance platform engineered for BRICS member nations. It aggregates citizen development requests across multimodal channels (voice notes, IVR telephony, messaging apps, physical damage photo triage) and fuses them with official demographic, infrastructure, and capital outlay datasets to surface geographic demand hotspots and deliver explainable, prioritized policy interventions.

---

## 1. Architecture Overview

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI Primitives (`Tabs`, `Dialog`, `DropdownMenu`, `Tooltip`, `Slider`), Lucide Icons.
- **Backend Service Layer**: Node.js & Express REST API running server-side with strict parameterization and input validation.
- **AI & Multimodal Triage**: Google GenAI SDK (`@google/genai`) with automated resilient model fallback ladder (`gemini-3.6-flash` -> `gemini-3.1-flash-lite` -> `gemini-flash-latest` -> `gemini-3.7-flash`).
- **Data Integrity & Cryptography**: SHA-256 telemetry seals for live REST API verification and baseline synchronization.

---

## 2. Threat Modeling & Countermeasures

| Threat Zone | Threat Scenario | Countermeasure Implemented |
| :--- | :--- | :--- |
| **Input Surfaces** | Untrusted citizen inputs, malformed payload injections | Strict schema validation, parameterization, and null-safe body destructuring |
| **Planning & Reasoning** | Prompt injection via citizen grievance descriptions | Plain-data boundaries with strict system prompt isolation and output sanitization |
| **Tool & Execution** | SSRF or unauthorized API endpoint probing | Domain allowlisting, URL parsing validation, and zero dynamic code evaluation |
| **Memory & State** | Cross-tenant data tampering or unauthorized document writes | Owner-bound access rules and strict schema compliance |
| **Inter-System Communication**| API key exposure in client bundles | Zero client-side API keys; all secret credentials proxied through server-side routes |

---

## 3. Prerequisites & Environment Setup

1. **Google Cloud SDK (`gcloud`)**: Install and initialize the gcloud CLI.
   ```bash
   gcloud init
   gcloud config set project YOUR_PROJECT_ID
   ```
2. **Enable Required Google Cloud APIs**:
   ```bash
   gcloud services enable \
     run.googleapis.com \
     secretmanager.googleapis.com \
     firestore.googleapis.com \
     cloudbuild.googleapis.com
   ```

---

## 4. Secret Management Setup

Store all operational credentials in Google Cloud Secret Manager to prevent hardcoded credentials:

```bash
# Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant the default Cloud Run service account access to read the secret
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 5. Firestore Security Rules

Deploy the following security rules to enforce owner-bound data isolation and prevent unauthorized cross-user modifications:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 6. Cloud Run Deployment Flow

Deploy the application to Google Cloud Run with the Secret Manager binding and container ingress configuration:

```bash
gcloud run deploy civicpulse-brics \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --port 3000
```

---

## 7. Required Campaign Verification Labeling

To register the service for automated challenge verification, apply the required campaign label:

```bash
gcloud run services update civicpulse-brics \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 8. Functional Walkthrough & Test Guide

1. **Country & Linguistic Context Switching**: Select between BRICS nations (India, Brazil, Egypt, South Africa, UAE). Verify that demographic indices, regional infrastructure scores, and sample citizen grievances update dynamically.
2. **Citizen Multimodal Ingestion**:
   - **Voice/IVR**: Toggle microphone recording or test regional IVR dialpad DTMF inputs.
   - **Photo Damage Triage**: Select or upload an infrastructure defect photograph to trigger Gemini Vision analysis and compute severity ratings (0–100).
   - **Messaging Apps**: Submit citizen grievance forms with automated Sector and Urgency categorization.
3. **Data Fusion & Spatial Demand Hotspots**:
   - Run AI Data Fusion to cross-reference citizen requests with national budget lines.
   - Review the Priority Score Breakdown, Infrastructure Deficit Weighting, and Gemini Explainability Narrative.
4. **Live Government Dataset & API Studio**:
   - Open the Dataset Studio Modal.
   - Edit demographic indicators or load official presets (e.g., MoSPI, Jal Jeevan Mission, Tamil Nadu Registry).
   - Trigger "Verify with API" to validate schemas, verify HTTP response, and generate a SHA-256 cryptographic proof.
5. **Policymaker Dashboard & GIS Heatmap**:
   - Filter prioritized projects by sector and urgency.
   - Inspect GIS district clusters and export standardized policy briefs.
6. **Executive Submission Package**:
   - Switch to the Submission Package view to inspect the project briefing, architecture, and deployment readiness.
