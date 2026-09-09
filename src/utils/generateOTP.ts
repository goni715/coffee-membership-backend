import crypto from "crypto";

function generateOTP() {
    const length = 6;
    const digits = '0123456789';
    let otp = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const random = randomBytes[i] ?? 0;
        otp += digits[random % digits.length];
    }
    return otp;
}

export default generateOTP;