import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGO_URI!);

let connectionPromise: Promise<MongoClient> | null = null;
export async function connectDB() {
  if (!connectionPromise) {
    connectionPromise = client
      .connect()
      .then(c => {
        console.log('Connected to MongoDB');
        return c;
      })
      .catch(error => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}
