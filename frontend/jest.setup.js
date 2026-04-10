import { loadEnvConfig } from '@next/env'
loadEnvConfig(__dirname)

import '@testing-library/jest-dom';

// Mock matchMedia globally for Jest
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: true, // default to dark mode for tests
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Fail tests on console.error
// This catches React 'prop' warnings and other critical errors that aren't explicit test failures
const originalError = console.error;
console.error = (...args) => {
  const message = args[0];
  // Filter out any known-safe errors if necessary, otherwise throw for everything
  if (typeof message === 'string' && (
      message.includes('React does not recognize the') || 
      message.includes('Warning: React.jsx: type is invalid') ||
      message.includes('Failed prop type')
  )) {
    throw new Error(`Console error detected during test: ${message}`);
  }
  originalError.apply(console, args);
};

// Polyfill for postgres.js driver in Jest environment
if (typeof global.setImmediate === 'undefined') {
  // @ts-ignore
  global.setImmediate = (callback, ...args) => setTimeout(callback, 0, ...args);
}
if (typeof global.clearImmediate === 'undefined') {
  // @ts-ignore
  global.clearImmediate = (id) => clearTimeout(id);
}
