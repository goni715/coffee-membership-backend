
export const FAQ_SEARCHABLE_FIELDS = [
    "question"
]

export const FAQ_VALID_FIELDS: string[] = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "isActive",
    "category"
];

export const FAQ_CATEGORY = {
    GENERAL: "general", //General Questions
    ACCOUNT_PROFILE: "account_profile",//Account & Profile
    MEMBERSHIP_REDEMPTION: "membership_redemption",//Membership & Drink Redemption
    CAFE_MANAGEMENT: "cafe_management",//Cafe & Shop Management
    BILLING_SUBSCRIPTION: "billing_subscription",//Billing & Subscriptions
    SECURITY_PRIVACY: "security_privacy",//Security & Privacy
    TECHNICAL_SUPPORT: "technical_support"//Technical & Support
} as const;

export const FAQ_CATEGORY_VALUES = Object.values(FAQ_CATEGORY)
