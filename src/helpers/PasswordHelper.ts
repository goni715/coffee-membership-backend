import bcrypt from "bcryptjs";
import config from "@/config";

class PasswordHelper {
  async checkPassword(plainTextPass: string, hashPassword: string) {
    return await bcrypt.compare(plainTextPass, hashPassword);
  }

  async hashedPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(config.bcrypt_salt_rounds));
    return await bcrypt.hash(password, salt); //hashedPassword
  }
}

export const { checkPassword, hashedPassword } = new PasswordHelper();
