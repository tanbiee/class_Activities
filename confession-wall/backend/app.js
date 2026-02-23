import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import confessions from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes); // auth routescome first
app.use('/', confessions); // general routes

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/confessions')
  .then(() => {
    console.log('MongoDB connection successful');
  })
  .catch(err => {
    console.log(`MongoDB connection error: ${err}`);
  });





export default app;