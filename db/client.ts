import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGO_URI!);
export async function connectDB() {
  try {
    await client.connect();

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to connect: ${error.message}`);
    }
  }
}
