export const RESIDENT_TABS = {
  QR: "qr",
  PROFILE: "profile",
} as const;

export type ResidentTab = (typeof RESIDENT_TABS)[keyof typeof RESIDENT_TABS];
