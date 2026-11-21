import { useCallback, useState, type ChangeEvent } from 'react';
import { BricsCountrySchema, hasForbiddenObjectKeys } from '../../../shared/schemas';
import type { BricsCountry } from '../../../shared/types';

/**
 * Provides Zod-validated JSON import/export helpers and raw JSON parsing
 * with accessible error state (no `window.alert`).
 */
export function useJsonIO(onImportSuccess: (country: BricsCountry) => void) {
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setJsonError(null);
    setJsonSuccess(null);
  }, []);

  const parseAndValidateJson = useCallback((rawText: string): BricsCountry | null => {
    setJsonError(null);
    setJsonSuccess(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      setJsonError('Invalid JSON syntax. Please check brackets, quotes, and commas.');
      return null;
    }

    if (hasForbiddenObjectKeys(parsed)) {
      setJsonError('JSON contains forbidden prototype keys (__proto__, constructor, prototype).');
      return null;
    }

    const validated = BricsCountrySchema.safeParse(parsed);
    if (!validated.success) {
      const firstIssues = validated.error.issues
        .slice(0, 3)
        .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
        .join('; ');
      setJsonError(`Dataset schema validation failed: ${firstIssues}`);
      return null;
    }

    return validated.data;
  }, []);

  const applyRawJson = useCallback(
    (rawText: string): boolean => {
      const validCountry = parseAndValidateJson(rawText);
      if (!validCountry) {
        return false;
      }
      onImportSuccess(validCountry);
      setJsonSuccess('Raw JSON specification validated and applied to draft.');
      return true;
    },
    [onImportSuccess, parseAndValidateJson]
  );

  const exportJson = useCallback((country: BricsCountry) => {
    const serialized = JSON.stringify(country, null, 2);
    const blob = new Blob([serialized], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${country.code}_baseline_${Date.now()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, []);

  const importJsonFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputEl = event.target;
      const file = inputEl.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const content = typeof loadEvent.target?.result === 'string' ? loadEvent.target.result : '';
        const validCountry = parseAndValidateJson(content);
        if (validCountry) {
          onImportSuccess(validCountry);
          setJsonSuccess(`Imported "${file.name}" into draft. Run Verify with API before saving.`);
        }
        // Reset file input so selecting the same file again still triggers onChange.
        inputEl.value = '';
      };
      reader.onerror = () => {
        setJsonError('Failed to read the selected JSON file.');
        inputEl.value = '';
      };
      reader.readAsText(file, 'UTF-8');
    },
    [onImportSuccess, parseAndValidateJson]
  );

  return {
    jsonError,
    jsonSuccess,
    clearMessages,
    applyRawJson,
    exportJson,
    importJsonFile,
  };
}
