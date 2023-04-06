import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from './typeorm.config';

const connectDB = async () => {
  createConnection(config)
    .then(() => {
      console.log('Database connected');
    })
    .catch(err => console.log(err));
}

export default connectDB;