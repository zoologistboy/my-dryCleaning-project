// jest.setup.js


// jest.setup.js
// jest.setup.js
// import '@testing-library/jest-dom';

jest.mock('./src/config.js', () => ({
  VITE_BASE_URL: 'http://localhost:3550',
  VITE_FLW_PUBLIC_KEY: 'test-public-key',
}));

