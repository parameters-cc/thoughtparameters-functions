const mockSet = jest.fn().mockResolvedValue(undefined);
const mockGet = jest.fn();
const mockSend = jest.fn().mockResolvedValue({ successCount: 1, failureCount: 0, responses: [] });

const mockDoc = jest.fn(() => ({ set: mockSet, get: mockGet }));
const mockCollection = jest.fn(() => ({
  doc: mockDoc,
  where: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({ docs: [] }),
}));

const mockMessaging = jest.fn(() => ({ sendEachForMulticast: mockSend }));

const firestore = jest.fn(() => ({ collection: mockCollection }));
(firestore as any).FieldValue = {
  serverTimestamp: jest.fn(() => "MOCK_TIMESTAMP"),
};

const auth = jest.fn();

const initializeApp = jest.fn();
const apps: unknown[] = ["mock-app"];

export { initializeApp, apps, firestore, auth, mockCollection, mockDoc, mockSet, mockGet, mockSend, mockMessaging };
export const messaging = mockMessaging;
