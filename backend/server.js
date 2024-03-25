import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import path from 'path';
import fs from 'fs';

// Main entry point for the backend. 
// Sets up the Express application, connects to MongoDB database, initializes data scraping from 'cloths.json' to populate the database, 
// configures middleware for parsing requests.
// defines routes for different components (products, users, orders), 
// serves static files for the frontend, provides an API endpoint for the PayPal client ID, and includes error handling. 



// Load environment variables from the .env file
dotenv.config();

// Create an Express application
const app = express();


//Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then ( () => {
    console.log('connected to db');

    // Data Scraping
    // Read data from the 'cloths.json' file and  and inserts it into 'products' collection in MongoDB
    fs.readFile('cloths.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
            // Parse the JSON data
      const products = JSON.parse(data);

            // Get a reference to the MongoDB database
      const db = mongoose.connection;
            // Access the 'products' collection in the database
      const collection = db.collection('products');


            // Insert each product into the 'products' collection
      products.forEach ( (product) => {
        collection.insertOne ( product, function (err) {
          if (err) {
            console.error(err);
            return;
          }
        });
      });


    });
  })
  .catch((err) => {
    console.log(err.message);
  });


/* SCRAPPING EXPLANATION:
1. Connect to MongoDB using the provided URI.
2. After the connection is established, read data from 'cloths.json' and store it in the 'products' collection in MongoDB.
3. Use fs.readFile to read the JSON data, parse it, and insert each product into the collection.
*/


// Express Setup
app.use (express.json ());
app.use (express.urlencoded ({ extended: true }));


// API endpoint to return clientID for PayPal
app.get ('/api/keys/paypal', (req, res) => {
  // Send PayPal client ID (from .env file)
  res.send (process.env.PAYPAL_CLIENT_ID || 'sb');
});


// Base path for each set of routes - uses separate routers for different components (seed, products, users, orders).
// app.use() is telling the Express application to use the 'orderRouter' for handling HTTP requests that start with "/api/orders".
// This means that any request to paths like "/api/orders", "/api/orders/somepath", etc., will be passed to the orderRouter for further handling.


// app.use is an Express method used to mount middleware or sub-applications at specified paths.
// here it's used to define the base paths for different components of the app.


app.use ('/api/seed', seedRouter);                 //seedRouter responds to api/seed
app.use ('/api/products', productRouter);         // http://localhost:5000/api/products gets all the products
app.use ('/api/users', userRouter);
app.use ('/api/orders', orderRouter);




// Serve static files from the 'frontend/build' directory
const __dirname = path.resolve ();
app.use (express.static (path.join(__dirname, '/frontend/build')));



// Catch-All Route for Client-Side Routing:
// '*' means any path not matched by previous routes; serve 'index.html'.
// commonly used for client-side routing in Single Page Applications (SPAs). To catch-all route ensures that the server returns the main HTML file for any URL
app.get ('*', (req, res) =>
  // res.sendFile is used to send the specified file (index.html) as the response.
  res.sendFile (path.join(__dirname, '/frontend/build/index.html'))
);



// Error handler for express
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({ message: err.message });
});



// Set the port to the environment variable PORT or default to 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});