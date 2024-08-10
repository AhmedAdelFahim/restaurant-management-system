import * as fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const seedFolder = './src/database/seed';

const seedFiles = fs.readdirSync(seedFolder);

dotenv.config();

async function start() {
  mongoose.connect(process.env.DB_URL, {
    authSource: 'admin',
  });
  for (let i = 0; i < seedFiles.length; ++i) {
    const { seed } = await import(`${seedFolder}/${seedFiles[i]}`);
    await seed(mongoose);
    console.log(`seeding ${seedFiles[i]} success`);
  }

  try {
    mongoose.connection.destroy();
  } catch (e) {
    console.log(e);
  }
}

start();
