import bcrypt from 'bcrypt';
import { env } from '../src/config/env.js';
import connectDB from '../src/config/db.js';
import { users as User } from '../src/repositories/index.js';
import logger from '../src/utils/logger.js';

const run = async () => {
  await connectDB();

  const email = env.admin.email.toLowerCase();
  const passwordHash = await bcrypt.hash(env.admin.password, 12);

  const existing = await User.findByEmail(email);

  if (existing) {
    await User.update(existing._id, { name: env.admin.name, passwordHash, role: 'admin', isActive: true });
    logger.info({ email }, 'Admin user updated (idempotent seed)');
  } else {
    await User.create({
      name: env.admin.name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    logger.info({ email }, 'Admin user created');
  }

};

run().catch((err) => {
  logger.error(err, 'seedAdmin failed');
  process.exit(1);
});
