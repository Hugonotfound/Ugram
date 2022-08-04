import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Hash a string with SHA512 algorithm
 * @param data String to hash
 * @returns Hashed string
 */
const encryptSHA512 = (data:string) => {
    const withSalt = process.env.SALT_BEFORE+data+process.env.SALT_AFTER;
    return CryptoJS.SHA512(withSalt).toString(CryptoJS.enc.Hex);
};

export default { encryptSHA512 };