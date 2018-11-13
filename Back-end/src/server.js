import "@babel/polyfill";
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import * as Routes from './routes';
import { getHash } from "./util";
const app = express();
dotenv.load();

// Setup CORS and parsing for handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Initialize all the routes dynamically
Object.keys(Routes).forEach(key => {
  const { path, router } = Routes[key];
  app.use(path, router);
});

// 404 Route
app.use((req, res) => 
  res.status(404).json({ status: "error", err: "Invalid endpoint/method" })
);

// Start server
export const server = app.listen(process.env.PORT, () =>
  console.log(`you are server is running on ${process.env.PORT}`)
);