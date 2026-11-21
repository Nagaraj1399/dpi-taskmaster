// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BRICS_COUNTRIES } from '../../../shared/bricsData';
import { useApiVerification } from '../hooks/useApiVerification';

describe('useApiVerification hook', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('transitions idle -> verifying -> passed when verification succeeds', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          verificationResult: {
            verified: true,
            timestamp: '2026-08-18T12:00:00Z',
            checksPassed: 4,
            checksTotal: 4,
            sha256Digest: 'sha256:abc123',
            checks: [],
            appliedToState: true,
          },
          updatedDataset: BRICS_COUNTRIES.IN,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useApiVerification());
    expect(result.current.status).toBe('idle');

    let passed = false;
    await act(async () => {
      passed = await result.current.verify(BRICS_COUNTRIES.IN);
    });

    expect(passed).toBe(true);
    expect(result.current.status).toBe('passed');
    expect(result.current.result?.sha256Digest).toBe('sha256:abc123');
    expect(result.current.verifiedDataset?.code).toBe('IN');
    expect(result.current.errorMessage).toBeNull();

    act(() => {
      result.current.reset();
    });
    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
  });

  it('transitions to failed and never fabricates passing proof on HTTP 422 or network error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: false,
            error: { code: 'VERIFICATION_FAILED', message: 'Rural + Urban exceeds 100%.' },
            verificationResult: {
              verified: false,
              timestamp: '2026-08-18T12:00:00Z',
              checksPassed: 2,
              checksTotal: 4,
              sha256Digest: 'sha256:bad',
              checks: [],
              appliedToState: false,
            },
          }),
          { status: 422, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );

    const { result } = renderHook(() => useApiVerification());

    let passed = true;
    await act(async () => {
      passed = await result.current.verify(BRICS_COUNTRIES.IN);
    });

    expect(passed).toBe(false);
    expect(result.current.status).toBe('failed');
    expect(result.current.verifiedDataset).toBeNull();
    expect(result.current.errorMessage).toContain('Rural + Urban exceeds 100%');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));
    await act(async () => {
      passed = await result.current.verify(BRICS_COUNTRIES.IN);
    });

    expect(passed).toBe(false);
    expect(result.current.status).toBe('failed');
    expect(result.current.result).toBeNull();
    expect(result.current.errorMessage).toContain('ECONNREFUSED');
  });
});
