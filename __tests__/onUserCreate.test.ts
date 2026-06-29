const mockSet = jest.fn().mockResolvedValue(undefined);
const mockDoc = jest.fn(() => ({ set: mockSet }));
const mockCollection = jest.fn(() => ({ doc: mockDoc }));
const mockFirestore = jest.fn(() => ({ collection: mockCollection }));
(mockFirestore as any).FieldValue = { serverTimestamp: jest.fn(() => "MOCK_TS") };

const mockOnCreate = jest.fn((handler: Function) => handler);
const mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };

jest.mock("firebase-admin", () => ({
  firestore: mockFirestore,
  initializeApp: jest.fn(),
  apps: ["mock"],
}));

jest.mock("firebase-functions", () => ({
  auth: { user: jest.fn(() => ({ onCreate: mockOnCreate })) },
  logger: mockLogger,
}));

describe("onUserCreate trigger", () => {
  let handler: Function;

  beforeAll(async () => {
    const mod = await import("../src/triggers/onUserCreate");
    handler = mod.onUserCreate as unknown as Function;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSet.mockResolvedValue(undefined);
  });

  it("creates a user profile document with correct fields", async () => {
    await handler({
      uid: "test-uid-123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: "https://example.com/photo.jpg",
    });

    expect(mockCollection).toHaveBeenCalledWith("users");
    expect(mockDoc).toHaveBeenCalledWith("test-uid-123");
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        uid: "test-uid-123",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        isAdmin: false,
        isSuperAdmin: false,
        fcmTokens: [],
      })
    );
  });

  it("stores null for missing optional fields", async () => {
    await handler({ uid: "anon-uid" });

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({ email: null, displayName: null, photoURL: null })
    );
  });

  it("sets default notification preferences", async () => {
    await handler({ uid: "uid-1", email: "a@b.com" });

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        preferences: { emailNotifications: true, pushNotifications: true },
      })
    );
  });
});
