
export const CONTENT_TYPE = {
  PRIVACY_POLICY: "privacy-policy",
  TERMS_CONDITION: "terms-condition",
  ABOUT_US: "about-us"
} as const;

export const CONTENT_TYPE_VALUES = Object.values(CONTENT_TYPE);

export const CONTENT_VALID_FIELDS: string[] = [
  "type"
];