import mongoose from 'mongoose';
import {
  mongoDbName,
  mongoDbPass,
  mongoDbUrl,
  mongoDbUser,
} from '../constants';

export const connectToMongoDb = async () => {
  await mongoose.connect(mongoDbUrl, {
    dbName: mongoDbName,
    auth: { username: mongoDbUser, password: mongoDbPass },
  });
  console.log('connected to mongo db');
};
