import bcryptjs from 'bcryptjs';

/**
 * Hash password
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
};

/**
 * Compare password with hashed password
 */
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcryptjs.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords: ' + error.message);
  }
};

export default {
  hashPassword,
  comparePassword
};
