import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';
import { db } from '../firebase.js';
import { collection, query, getCountFromServer } from 'firebase/firestore';

// Server-side route handles requests/ functionalities related to orders. Include routes for placing orders, viewing order history, and managing order status.


//api for post
//expressAsyncHandler to catch all errors
const orderRouter = express.Router();

//For ajax call from Product List Screen (for Admin)
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

//For ajax call from Create order
orderRouter.post(
  '/',
  //isAuth is a middleware to fill the user field in the request (implement in utils.js)
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //create an order and fill the informaiton for the order
    const newOrder = new Order({
      //for each order item we need to get the product id (for OrderModel)
      //by map function we convert _id to product
      orderItems: req.body.orderItems.map ( (x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id, //in the end of isAuth we have req.user
    });

    //save the order in the database
    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);

//For ajax call from Dashboard screen
//that is for authenticated and admin users
//this is the request from frontend: const {data}=await axios.get('/api/orders/summary')
orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  //implement this api
  expressAsyncHandler(async (req, res) => {
    /*using aggregate function on the 'orderModel' to get the total price and number of orders.
    aggregation is operation (in mongoose) that process multiple documents and return computed (calculate) results.
    aggregate accept array, inside we define objects, and each object is a pipeline
    and for this pipline we use group-
    group all data (without id) and calculate some of all items
    $sum:1 => means: it counts number of elements/documents in the Order collection and set it to numOrders
    */
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' }, //to pass a field we use $ sign
          //it calculate sum of total price field in the orderModel
        },
      },
    ]);

    const usersRef = collection(db, 'users');
    const q = query(usersRef);

    const querySnapshot = await getCountFromServer(q);
    const users = [{ numUsers: querySnapshot.data().count }];

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    //send {users, orders, dailyOrders, productCategories} to frontend
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

//For ajax call from History screen (For user to see his orders)
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

//For ajax call from Order Screen
orderRouter.get(
  '/:id',
  //isAuth is a middleware to fill the user field in the request (implement in utils.js)
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

//For ajax call from Order Screen (paypal payment)
//in this body of this api we find the order, check if exist, set isPaid to true, set paidAt to current data time, and update payment result from the body of this request(req.body). finally save order
orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

export default orderRouter;
