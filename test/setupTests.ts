// setupTests.ts
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

beforeAll(async () => {
  const URI: string = process.env.DATABASE!.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD!
  );
  await mongoose.connect(URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});
