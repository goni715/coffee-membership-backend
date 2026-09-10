import encrypt from "./encrypt";

export const generateResetToken = (email: string, expiresInMinutes = 10): string => {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    return encrypt(`${email}:${expiresAt}`);
};
