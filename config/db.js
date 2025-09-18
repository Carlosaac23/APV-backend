import mongoose from 'mongoose';

const connectDB = async () => {
  const { MONGO_URI } = process.env;

  try {
    const db = await mongoose.connect(MONGO_URI);

    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
