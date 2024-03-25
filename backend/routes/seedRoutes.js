import express from 'express'; 
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import axios from 'axios';
import cheerio from 'cheerio';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import fs from 'fs';


// An Express router is a middleware and routing system that allows to define routes for specific paths in the app.
// seedRouter is a dedicated router that you can use to organize and manage routes related to seeding functionality.
// Seeding (adding) initial data to DB - a common practice in development to populate the database with initial data for testing and development purposes.
const seedRouter = express.Router();

// The route handler is an async function that removes all existing products/users from the Product collection and inserts many products/users into the collection using data from the 'data' module.
seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany (data.products);
  await User.remove({});
  const createdUsers = await User.insertMany (data.users);  
  res.send({ createdProducts, createdUsers });  // response to client with info about the created products and users.
});

export default seedRouter;