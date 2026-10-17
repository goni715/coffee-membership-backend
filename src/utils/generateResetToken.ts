import encrypt from "./encrypt";

export const generateResetToken = (email: string, expiresInMinutes = 10): string => {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    return encrypt(`${email}:${expiresAt}:${issuedAt}`);
};
