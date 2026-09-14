import { TQrCodePrefix } from '@/modules/shop/shop.interface';
import crypto from 'crypto';

const generateQrCode = (
  prefix: TQrCodePrefix,
): string => {
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `HH-${prefix}-${randomHex}`; //HH-SHOP-A9F82B
};

export default generateQrCode;