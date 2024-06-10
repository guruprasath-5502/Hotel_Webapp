import bcryptjs from 'bcryptjs';

export const generateSalt = (): Promise<string> => {
  return bcryptjs.genSalt(10);
};

export const hashPassword = (
  strPassword: string,
  strSalt: string
): Promise<string> => {
  return bcryptjs.hash(strPassword, strSalt);
};

export const verifyPassword = (
  strPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcryptjs.compare(strPassword, hashedPassword);
};

export const generateVerificationToken = (): Promise<string> => {
  const randomValue = Math.random().toString(36).substring(2);

  const saltRounds = 10;
  return bcryptjs.hash(randomValue, saltRounds);
};

const bcryptLib = {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateVerificationToken,
};

export default bcryptLib;
