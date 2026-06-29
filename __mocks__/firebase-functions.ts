const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const auth = {
  user: jest.fn(() => ({
    onCreate: jest.fn((handler: Function) => handler),
  })),
};

const firestore = {
  document: jest.fn(() => ({
    onCreate: jest.fn((handler: Function) => handler),
  })),
};

export { logger, auth, firestore };
