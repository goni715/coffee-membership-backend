import config from '@/config';
import crypto from 'crypto';
const ALGORITHM = 'aes-256-cbc';

const KEY_BUFFER = crypto
  .createHash('sha256')
  .update(config.encryption_key)
  .digest();


const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
  const encrypted = Buffer.concat([
    iv,
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  return encrypted.toString('base64url');
};

export default encrypt;
