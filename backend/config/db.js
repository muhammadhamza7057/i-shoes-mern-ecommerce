import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const mongooseInstance = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ishoes_db',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`
╔════════════════════════════════════════╗
║       MONGODB CONNECTION SUCCESS       ║
╠════════════════════════════════════════╣
║ 🔌 Host: ${mongooseInstance.connection.host.padEnd(28)} ║
║ 📊 Database: ${mongooseInstance.connection.name.padEnd(24)} ║
║ 🌐 Port: ${mongooseInstance.connection.port}${' '.repeat(32 - mongooseInstance.connection.port.toString().length)}║
╚════════════════════════════════════════╝
    `);

    return mongooseInstance;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Attempted URI:', process.env.MONGODB_URI);
    process.exit(1);
  }
};

export default connectDB;
