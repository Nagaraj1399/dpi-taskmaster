import React from 'react';
import { Key, ShieldCheck } from 'lucide-react';
import type { CustomApiEndpointConfig } from '../../../shared/types';
import { SUBTLE_PANEL_CLASS } from '../../ui/styles';
import { SelectField, TextField } from '../fields/SharedFields';

const AUTH_SCHEME_OPTIONS: ReadonlyArray<{
  value: CustomApiEndpointConfig['authHeaderType'];
  label: string;
}> = [
  { value: 'None', label: 'No Authentication (Public Endpoint)' },
  { value: 'ApiKey', label: 'api-key: [key] (Data.gov standard)' },
  { value: 'Bearer', label: 'Authorization: Bearer [token]' },
  { value: 'Custom', label: 'Custom Header' },
];

interface ApiConfigTabProps {
  apiConfig: CustomApiEndpointConfig;
  onUpdateApiConfig: <K extends keyof CustomApiEndpointConfig>(
    field: K,
    value: CustomApiEndpointConfig[K]
  ) => void;
}

/** External government REST API connector configuration tab. */
export const ApiConfigTab: React.FC<ApiConfigTabProps> = ({ apiConfig, onUpdateApiConfig }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-2">
      <div>
        <h3 className="text-sm font-bold text-slate-900">
          Live Government REST API Integration &amp; Endpoint
        </h3>
        <p className="text-xs text-slate-600">
          Optionally configure an open-data API URL for live HTTP reachability verification.
        </p>
      </div>
      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono font-bold">
        REST API Connector
      </span>
    </div>

    <div className="space-y-3">
      <TextField
        id="api-endpoint-url"
        label="Live API Endpoint URL (Optional)"
        type="url"
        value={apiConfig.endpointUrl}
        onChange={(val) => onUpdateApiConfig('endpointUrl', val)}
        placeholder="https://api.data.gov.in/resource/..."
        helperText="Leave blank for direct schema validation, or enter a public https:// endpoint to probe."
        mono
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          id="api-key-input"
          label="API Key / Token (Optional)"
          type="password"
          value={apiConfig.apiKey ?? ''}
          onChange={(val) => onUpdateApiConfig('apiKey', val)}
          placeholder="Optional endpoint credential"
          mono
          rightAdornment={
            <Key
              aria-hidden="true"
              className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none"
            />
          }
        />

        <SelectField
          id="api-auth-scheme"
          label="Auth Header Scheme"
          value={apiConfig.authHeaderType}
          onChange={(val) => onUpdateApiConfig('authHeaderType', val)}
          options={AUTH_SCHEME_OPTIONS}
        />
      </div>

      <div
        className={`${SUBTLE_PANEL_CLASS} p-3.5 text-xs text-slate-700 flex items-start space-x-2.5`}
      >
        <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-bold text-slate-900">Verification Behavior: </span>
          <span>
            Clicking &ldquo;Verify with API&rdquo; validates all baseline schemas, computes a
            canonical SHA-256 payload digest, and probes the configured public URL if provided.
          </span>
        </div>
      </div>
    </div>
  </div>
);
