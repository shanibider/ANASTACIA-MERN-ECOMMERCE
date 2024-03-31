import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import path from 'path';
import fs from 'fs';

// Main entry point for the backend -
// Sets up the Express application, connects to MongoDB, initializes data scraping from 'cloths.json' to populate the database, 
// defines routes for different components (products, users, orders), 
// serves static files for the frontend, provides an API endpoint for the PayPal client ID, and includes error handling. 

dotenv.config();

const app = express();


// Database Connection:
// Connect to a MongoDB Atlas cluster, a cloud-based MongoDB service provided by MongoDB.
// Commonly used in production environments for its scalability, reliability, and managed features.
// Syntax of: MONGODB_URI = "mongodb+srv://<username>:<password>@<clusterName>.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(process.env.MONGODB_URI)
  .then ( () => {
    console.log('connected to db');
    // Data Scraping - Read data from 'cloths.json' and inserts it into 'products' collection in MongoDB
    // Use fs.readFile to read the JSON data, parse it, and insert each product into the collection.
    fs.readFile('cloths.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const products = JSON.parse(data);
      const db = mongoose.connection;
      const collection = db.collection('products');
      products.forEach ( (product) => {
        collection.insertOne ( product, function (err) {
          if (err) {
            console.error(err);
            return;
          } });
      });
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

  
app.use (express.json ());
app.use (express.urlencoded ({ extended: true }));


// API endpoint to return clientID for PayPal
app.get ('/api/keys/paypal', (req, res) => {  
  res.send (process.env.PAYPAL_CLIENT_ID || 'sb'); // Send PayPal client ID (from .env file)
});

app.use ('/api/seed', seedRouter);                
app.use ('/api/products', productRouter);       
app.use ('/api/users', userRouter);
app.use ('/api/orders', orderRouter);

const __dirname = path.resolve ();
app.use (express.static (path.join(__dirname, '/frontend/build')));

// '*' means any path not matched by previous routes
// commonly used for routing, To catch-all route ensures that the server returns the main file for any URL
app.get ('*', (req, res) =>
  res.sendFile (path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({ message: err.message });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});