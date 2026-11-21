import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock ResizeObserver for Radix Slider in jsdom tests
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

// Provide safe clipboard mock in jsdom
if (typeof navigator !== 'undefined' && !navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
    configurable: true,
  });
}
