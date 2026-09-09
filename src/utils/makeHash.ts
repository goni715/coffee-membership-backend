import crypto from 'crypto';

const makeHash = (str: string) => {
    return crypto.createHash("sha256").update(str).digest("hex");
}

export default makeHash;