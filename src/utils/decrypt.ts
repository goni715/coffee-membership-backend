import config from '@/config';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY_BUFFER = crypto
  .createHash('sha256')
  .update(config.encryption_key)
  .digest();

const decrypt = (encryptedToken: string): string => {
  const buffer = Buffer.from(encryptedToken, 'base64url');
  if (buffer.length < 17) {
    throw new Error('Invalid encrypted token format.');
  }
  const iv = buffer.subarray(0, 16);
  const encryptedData = buffer.subarray(16);
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
};

export default decrypt;
