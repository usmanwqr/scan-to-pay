import * as bcrypt from 'bcrypt';
import { PASS_ENCRYPT_SALT } from './constants';

export const encryptPassword = async (password: string) => {
  const saltOrRounds = PASS_ENCRYPT_SALT;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};

export const decryptPassword = async (hash: string, password: string) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
