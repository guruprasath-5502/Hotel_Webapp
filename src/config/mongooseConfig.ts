import mongoose from 'mongoose';
import 'dotenv/config';

const options = {
  socketTimeoutMS: process.env.MONGO_SOCKET_TIMEOUT
    ? parseInt(process.env.MONGO_SOCKET_TIMEOUT)
    : 30000,
  maxPoolSize: process.env.MONGO_POOL_SIZE
    ? parseInt(process.env.MONGO_POOL_SIZE)
    : 5,
  dbName: 'booking',
};

const mongooseConn = () => {
  if (mongoose.connection.readyState !== 1)
    return mongoose.connect(<string>process.env.MONGO_URI, options);
  else return Promise.resolve(mongoose);
};

export default mongooseConn;
