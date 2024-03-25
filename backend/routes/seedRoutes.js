import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
//scrapping imports
import axios from 'axios';
import cheerio from 'cheerio';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import fs from 'fs';

// Server-side route handle request; seeding data into the database. Seeding typically involves adding initial data to the database.

// This line is using the express.Router() function to create a new instance of an Express router.
// An Express router is a middleware and routing system that allows you to define routes for specific paths in the application.
// userRouter: This variable is now an instance of the Express router, and it can be used to define routes, middleware, and handle HTTP requests related to seeding functionality.
// seedRouter is a dedicated router that you can use to organize and manage routes related to seeding functionality.
const seedRouter = express.Router();

// Define a route to handle seeding of initial data.
// route with endpoint '/' handles the seeding process when a GET request is made to '/api/seed'.
seedRouter.get('/', async (req, res) => {
  // Remove all existing products from the Product collection
  await Product.remove({});

  // Insert many products into the 'Product' collection using data from the 'data' module
  const createdProducts = await Product.insertMany (data.products);
  await User.remove({});

  // Insert many users into the 'User' collection using data from the 'data' module
  const createdUsers = await User.insertMany (data.users);

  // Send a response to the client with information about the created products and users.
  res.send({ createdProducts, createdUsers });
});

export default seedRouter;
