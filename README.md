#  MERN E-commerce React Shopping Website 👜🛍

[![React](https://img.shields.io/badge/React-★★★★★-blue)](https://react.dev/)
[![node](https://img.shields.io/badge/node-★★★★★-yellow)]()
[![express](https://img.shields.io/badge/Express-★★★★★-green)]()
[![mongoDB](https://img.shields.io/badge/mongoDB-★★★★★-pink)]()
[![Firebase](https://img.shields.io/badge/Firebase-★★★★★-brown)]()
[![Javascript](https://img.shields.io/badge/JavaScript-★★★★★-orange)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<div align="center"><img width=auto height="150px" src="https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE/assets/72359805/f7ca753d-2874-48c9-a7a2-f3fe8fc25811"></div>

#### **Live Demo:** [Explore the live website. 🖥](https://anastacia-mern-ecommerce-website.onrender.com/)

A comprehensive feature-rich e-commerce website developed as a server-client React application, powered by the **MERN (MongoDB, Express.js, React.js, Node.js) stack**. 
<img height=20px src="https://skillicons.dev/icons?i=react">
<img height=20px src="https://skillicons.dev/icons?i=nodejs">
<img height=20px src="https://skillicons.dev/icons?i=express">
<img height=20px src="https://skillicons.dev/icons?i=mongodb">
<img height=20px src="https://skillicons.dev/icons?i=firebase">
<img height=20px src="https://skillicons.dev/icons?i=js">
This project showcases proficiency in full-stack development, including frontend UI/UX design, backend API development, database management, and integration with external services. <br>

> Please try to experience full purchase on the website:) Register, choose products, pay with this demo PayPal user, and review your order. <br> Demo PayPal User: <br>
◽ Username: sb-gt6zp25024137@personal.example.com <br>
◽ Password: W=Flx8z1

### 🛒 Key Features:
- **dynamic shopping cart**
- 🖊 **Interactive review system**
- 🗂️ **Organized product listings**
- 💳**Paypal payment process**
- 🔒 **User authentication and authorization**
- 🛠️ **User functionalities**, such as order history, and **admin functionalities** such as real-time metrics (registered users, order count, total money orders), creation, editing, and deletion of products.
<br>


## 🌟 Frontend Implementation 
The frontend is built using **React.js**, using React features such as hooks (`useState`, `useEffect`), and state management using **Redux**. It includes components and routing to create an interactive user experience.

### Key React features:
1. **React Components**: Utilizes functional components and hooks to manage state and side effects, promoting code reusability and simplification.
2. **Redux State Management**: Manages the global state of the application, including user authentication, product listing, and shopping cart state. Redux Thunk is used for asynchronous operations.
3. **Routing with React Router**: Implements dynamic routing for different parts of the application, including product pages, user login, and the shopping cart.
4. **State Management with useState and useEffect**: Manages local component state and side effects, ensuring components respond to changes in application state efficiently.
5. **Asynchronous Operations with Redux Thunk**: Handles asynchronous logic such as fetching data from the backend.


## Backend Implementation 🧱
The backend of this e-commerce website is built using **Node.js** and **Express.js**, connecting to **MongoDB Atlas** for database management. It includes secure user authentication with **Firebase** and implements API endpoints to handle various functionalities such as product management, user management, and order processing.

### Key Components of the Backend:
1. **Database Management with MongoDB Atlas**: 🌐
   `MongoDB Atlas` is a cloud-based NoSQL database used to manage the application's data efficiently. The database is designed to handle collections for `products, and orders`.

   - **Orders Collection**: Stores order details including items, shipping address, payment method, and user information.
   - **Products Collection**: Contains product information such as name, category, price, stock status, and reviews.

   **Example Order Document (MongoDB)**
   ```json
   {
     "_id": {"$oid": "666020f1c3dfea5c9ceef0e5"},
     "orderItems": [
       {
         "slug": "adidas-fit-pant",
         "name": "Adidas Fit Pant",
         "quantity": {"$numberInt": "1"},
         "image": "/images/p4.jpg",
         "price": {"$numberInt": "65"},
         "product": {"$oid": "63e3a5730d4c13163688a505"},
         "_id": {"$oid": "63e3a5730d4c13163688a505"}
       }
     ],
     "shippingAddress": {
       "fullName": "Shani Bider",
       "address": "Hapardes Harishon 1",
       "city": "Rishon LeZion",
       "postalCode": "7520901",
       "country": "Israel"
     },
     "paymentMethod": "PayPal",
     "itemsPrice": {"$numberInt": "65"},
     "shippingPrice": {"$numberInt": "10"},
     "taxPrice": {"$numberDouble": "9.75"},
     "totalPrice": {"$numberDouble": "84.75"},
     "user": {"$oid": "63e3a5730d4c13163688a508"},
     "isPaid": false,
     "isDelivered": false,
     "createdAt": {"$date": {"$numberLong": "1675865100712"}},
     "updatedAt": {"$date": {"$numberLong": "1675865100712"}},
     "__v": {"$numberInt": "0"}
   }
   ```

   **Example Product Document (MongoDB)**
```json
   {
     "_id": {"$oid": "66602124c3dfea5c9ceef0e6"},
     "name": "Gray T-shirt",
     "slug": "T-shirt",
     "image": "/images/i1.jpg",
     "brand": "H&M",
     "category": "Shirts",
     "description": "High-quality T-shirt made from organic cotton.",
     "price": {"$numberInt": "20"},
     "countInStock": {"$numberInt": "50"},
     "rating": {"$numberDouble": "4.5"},
     "numReviews": {"$numberInt": "12"}
   }

```

<br>

![mongodb](https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE/assets/72359805/6e7a4d25-359f-4a7d-9fc6-142608eb803c)
<br>


2. **Express.js for API Development**: 🚀
   `Express.js` is used to create a RESTful API to handle `HTTP requests` and responses, ensuring efficient communication between the frontend and the backend. The API endpoints are designed to perform CRUD operations on user, product, and order data.

**Example API Route (orderRoutes.js)**
```javascript
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //create an order 
    const newOrder = new Order({
      //for each order item we need to get the product id (for OrderModel). By map function we convert _id to product
      orderItems: req.body.orderItems.map ( (x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id, //in the end of isAuth we have req.user
    });
    //save the order in db
    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);
```

3. **User Authentication with Firebase**: 🔐
   `Firebase` Authentication is integrated to manage user `sign-up, login, and secure sessions`.

**Example Firebase Authentication (auth.js)**
```javascript
  import { initializeApp } from "firebase/app";
  import { getAuth } from 'firebase/auth';
  import { getFirestore } from '@firebase/firestore';

    const firebaseConfig = {
    apiKey: "AIzaSyDzdc6B_R5qfZ0sxsphZVYsx3wbIzqBJwQ",
    authDomain: "fir-final-project-9a40c.firebaseapp.com",
    databaseURL: "https://fir-final-project-9a40c-default-rtdb.firebaseio.com",
    projectId: "fir-final-project-9a40c",
    storageBucket: "fir-final-project-9a40c.appspot.com",
    messagingSenderId: "980757971098",
    appId: "1:980757971098:web:0da87ecab4ab961d98df23"
  };
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
```

<br>

##### Firebase Authentication:
![firebase](https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE/assets/72359805/230b5448-2181-4406-ad86-a6ea80d71d6c)

##### Firebase Firestore DB:
![firebase - firestore db](https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE/assets/72359805/9a613763-0769-4ffb-8401-ecf1637f487b)

<br>

4. **Hosting on Render**: ☁️
   The website is hosted on **Render**, including connection to environment variables such as JWT_SECRET and MONGODB_URI. Render offers a deployment process, automatic SSL, and global CDN, ensuring high availability and performance.
<br>

![mern-render](https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE/assets/72359805/e3cf22eb-b31f-453e-92f1-ef8a10a68b9c)

<br>

5. **Paypal API** <img align="center" height="40px" src="https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE-WEBSITE/assets/72359805/1cf2f26b-937f-4eff-950d-a940409e14a9"> -
Using Demo Payment via <img height="20px" align="center" src="https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE-WEBSITE/assets/72359805/acfd6955-7866-467e-8e13-d168da6bfc00">. To experience the payment process with PayPal, you can use the demo feature. Follow these steps to make a demo payment💰:
  - [x] **Visit the Demo Payment Page**: Navigate to the payment page.
  - [x] **Login with Demo Credentials**: Use the provided demo username and password to access the demo environment.
  - [x] **Initiate Payment**: Enter the demo payment section and select PayPal as the payment method.
  - [x] **Complete Payment**: Follow the instructions to proceed with the demo payment through PayPal.

##### **Demo Credentials <img height="50px" align="center" src="https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE-WEBSITE/assets/72359805/04120fb3-c483-41dc-8710-f4cd74f11771">:**
- [ ] Username: `sb-gt6zp25024137@personal.example.com`
- [ ] Password: `W=Flx8z1`

#### Paypal Sandbox test accounts -
![paypal demo](https://github.com/shanibider/ANASTACIA-MERN-ECOMMERCE/assets/72359805/3f5b4240-98c0-405f-8a4d-8967cbd2bbea)

<br>
 
   
---

# Technologies Used 🏆
[![My Skills](https://skillicons.dev/icons?i=js,react,html,css,bootstrap,mongodb,nodejs)](https://skillicons.dev)

### **MERN Stack:**
- [x] **MongoDB:** Efficient and scalable NoSQL database, ensuring robust data storage and retrieval capabilities.
- [x] **Express.js:** Fast and minimalist web framework for Node.js, facilitating the creation of powerful APIs and web applications.
- [x] **React.js:** Dynamic and responsive JavaScript library for building modern and engaging user interfaces, utilizing:
  - [ ] **useState:** React hook for managing state in functional components, enhancing component interactivity and reactivity. ⚛️
  - [ ] **useContext:** React hook for accessing and consuming context values across components, facilitating efficient data sharing. 🔄
  - [ ] **useReducer:** React hook for managing complex state logic with reducer functions, offering a more organized approach to state management. 🔴
- [x] **Node.js:** Lightweight and efficient JavaScript runtime environment, enabling scalable and high-performance server-side execution.

### **Firebase:**
- [x] **Authentication:** Firebase authentication services for secure user authentication and authorization management.
- [x] **Real-time Database:** Firebase real-time database for seamless and synchronized data updates across clients in real-time.

### **HTTP/S Protocols:**
- [x] **Axios:** Promise-based HTTP client for making asynchronous requests to the server, enhancing data fetching and manipulation.
- [x] **AJAX:** Asynchronous JavaScript and XML for making seamless requests to the server without refreshing the entire page.
- [x] **Fetch API:** Modern browser API for fetching resources asynchronously across the network, improving data retrieval efficiency.

### **Payment Processing:**
- [x] **PayPal API:** Integration of PayPal API for secure and reliable payment processing, ensuring seamless transactions for users.

### **Frontend Development:**
- [x] **HTML, CSS, JavaScript:** Foundational technologies for building the frontend interface, providing structure, style, and interactivity to web applications.
- [x] **Bootstrap:** Frontend framework for developing responsive and mobile-first web projects, streamlining the design and layout process and ensuring compatibility across various devices. 🌐
<br>



# Key Features 🎯
- [x] 🏠 **Home Page:** 
  - Lists products to browse and explore.

- [x] 🔍 **Detailed Product View:** 
  - Provides in-depth information about a selected product.

- [x] 📂 **Product Categories:** 
  - Categorizes products for easy navigation.

- [x] 🛒 **Shopping Cart:** 
  - Allows users to add and manage items in their cart.

- [x] 💳 **Order Processing with PayPal:** 
  - Securely handles payment processing using the PayPal API for demo purposes.

- [x] 🔐 **Secure User Registration and Login:** 
  - Ensures a safe and secure user authentication system.

- [x] 👩‍💼👨‍💼 **Admin Functionalities:** 
  - Manages 'Products' and 'Orders' lists
  - Features a dashboard displaying real-time metrics: registered users, order count, and financial performance through total money orders.
  - Enables the creation, editing, and deletion of products.

- [x] 👩‍💼 **User Functionalities:** 
  - Accesses order history.
  - Edits user profile.

- [x] 👩🏻‍🤝‍🧑🏻 **About The Team Page:** 
  - Provides information about the development team.   
<br>



# MERN Project Architecture 📁

This repository contains the main files and folder structure for the MERN (MongoDB, Express.js, React.js, Node.js) project.
The app follows a typical MERN architecture where React is used for the front-end, Node.js and Express for the back-end, MongoDB for the database, and JWT for authentication.
These components work together to provide a seamless shopping experience for users while allowing for easy management of products, orders, and user accounts.

## Folder Structure 📁

```
MERN-project/
├── frontend/
│   ├── components/
│   │   ├── AdminRoute.js
│   │   ├── CheckoutSteps.js
│   │   ├── LoadingBox.js
│   │   ├── MessageBox.js
│   │   ├── Product.js
│   │   ├── ProtectedRoute.js
│   │   ├── Rating.js
│   │   └── SearchBox.js
│   ├── screens/
│   │   ├── AboutUsScreen.js
│   │   ├── CartScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── HomeScreen.js
│   │   ├── HowToScreen.js
│   │   ├── OrderHistoryScreen.js
│   │   ├── OrderListScreen.js
│   │   ├── OrderScreen.js
│   │   ├── PaymentMethodScreen.js
│   │   ├── PlaceOrderScreen.js
│   │   ├── ProductEditScreen.js
│   │   ├── ProductListScreen.js
│   │   ├── ProductScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── SearchScreen.js
│   │   ├── ShippingAddressScreen.js
│   │   ├── SigninScreen.js
│   │   └── SignupScreen.js
│   ├── App.js
│   ├── Store.js
│   ├── index.js
│   └── utils.js
├── Backend/
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── seedRoutes.js
│   │   └── userRoutes.js
│   ├── models/
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── server.js
│   ├── firebase.js
│   ├── utils.js
│   ├── data.js
│   └── cloths.json
└── ...
```

- [x] **backend**: Contains the backend files and resources, following a RESTful architecture.
- [x] **frontend**: Houses the frontend files and components developed with React.js.
- [x] **config**: Stores configuration files for the project, such as database configurations or environment variables.
- [x] **models**: Defines the database models and schemas used in the application.
- [x] **routes**: Contains the route definitions for the API endpoints.
- [x] **controllers**: Includes the controller functions responsible for handling requests and responses.
- [x] **middlewares**: Houses custom middleware functions used in the API.
- [x] **utils**: Stores utility functions and helper modules used throughout the project.
- [x] **public**: Stores any static assets or files served by the backend.
- [x] **views**: Contains server-side views if any, typically used in server-side rendering applications.


## Backend Structure 🧱🔨-

### Server -

- [ ] **`server.js`:** This is the main entry point for the Node.js backend. It initializes Express, connects to MongoDB using Mongoose, defines API routes, and serves the React frontend. It also includes logic for seeding initial data and serving static files.

### Routes -

- [ ] **`orderRoutes.js`,** `productRoutes.js`, `seedRoutes.js`, `userRoutes.js`: These files define the API endpoints and route handlers for managing orders, products, user authentication, and seeding initial data.

### Models -

- [ ] `Order.js`, `Product.js`, `User.js`: These files define the data models using Mongoose, which allow you to interact with MongoDB collections.

### firebase.js -

- [ ] **`firebase.js`:** This file sets up Firebase for authentication and database management in the application. It ensures that the Firebase app is properly configured and ready to use authentication and Firestore services.

### utils.js -

- [ ] **`utils.js`:** This file provides essential utility functions and middleware for user authentication and authorization in the application. It ensures that only authenticated users with the appropriate permissions can access certain routes or perform specific actions.



## Frontend Structure 🖼 -

### Components

- [ ] **`AdminRoute.js`, `CheckoutSteps.js`, `LoadingBox.js`, `MessageBox.js`, `Product.js`, `ProtectedRoute.js`, `Rating.js`, `SearchBox.js`**.

### Screens -

- [ ] **`CartScreen.js`, `DashboardScreen.js`, `HomeScreen.js`, `HowToScreen.js`, `OrderHistoryScreen.js`, `OrderListScreen.js`, `OrderScreen.js`, `PaymentMethodScreen.js`, `PlaceOrderScreen.js`, `ProductEditScreen.js`, `ProductListScreen.js`, `ProductScreen.js`, `ProfileScreen.js`, `SearchScreen.js`, `ShippingAddressScreen.js`, `SigninScreen.js`, `SignupScreen.js`, `AboutUsScreen.js`**.

### app.js -

- `App.js`: This file is the entry point for your React frontend application- controls the frontend structure and behavior. It defines routes using `react-router-dom` for different pages/screens of the application and orchestrates the structure and behavior of your frontend application.

### store.js

- [ ] **`store.js`:** This file defines and manages the application's global state management using React context and reducers. It essentially manages the global state of the application, handling user authentication, cart management, and related operations.

### index.js

- [ ] **`index.js`:** This file serves as the entry point for the React application. It wraps the `<App />` component with providers such as `StoreProvider`, `HelmetProvider`, and `PayPalScriptProvider`.

Here's an example of how HelmetProvider and react-helmet might be use in the app:
```
// Import necessary dependencies
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Wrap your entire application with HelmetProvider in index.js
ReactDOM.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
  document.getElementById('root')
);

// In any component where you want to dynamically change document head elements, use Helmet component
const MyComponent = () => {
  return (
    <div>
      {/* Use Helmet component to set document title */}
      <Helmet>
        <title>My Page Title</title>
        {/* Add other head elements like meta tags */}
        <meta name="description" content="This is my page description" />
      </Helmet>
      {/* Your component JSX */}
      <h1>Hello, World!</h1>
    </div>
  );
};
```

 
## Components vs Screens 🥇 -

### 🗂 Components -

Components are reusable building blocks that encapsulate a piece of UI functionality. They promote code reusability and maintainability by allowing you to create modular pieces of code that can be used across different parts of your application.

### 📁 Screens -

Screens are typically higher-level components that represent entire pages or views within your application. They often contain multiple components and handle more complex logic related to rendering and managing UI state.



<br>


## The application follows these key patterns 🏆 -
THe architecture focuses on structured state management, components, and effective handling of side effects and navigation in a React app.

1. 🚀**State Management:**
   - Uses `useReducer` for organized state management.

2. 🚀**Global State:**
   - Manages global state for properties like `cart`, `userInfo`, `loading`, and `error`.

3. 🚀**Side Effects:**
   - Handles side effects, such as data fetching, with `useEffect`.

4. 🚀**Component Structure:**
   - Organizes the app into modular components, promoting a component-based architecture.

5. 🚀**React Router:**
   - Implements React Router for navigation.

6. 🚀**Conditional Rendering:**
   - Conditionally displays UI elements based on the application's state.

7. 🚀**Authentication Handling:**
   - Manages user authentication through global state.

8. 🚀**Middleware (`logger`):**
   - Uses a middleware function (`logger`) for state change logging.

9. 🚀**RESTful API Calls:**
   - Utilizes Axios for making API calls to a backend server.




<br>

## Ecommerce Website Preview :
### Demo Website

👉 Demo : 

<img src="https://user-images.githubusercontent.com/72359805/230923394-09e38358-b620-4bc1-a3f0-f2620eb510c0.mp4" alt=" Click here for Demo" width="300">



###### Home Page
![home](https://user-images.githubusercontent.com/72359805/230922135-b29b6c60-afd5-48ec-9fc4-d5e2e44a085a.PNG)

###### Product out of stock alert

![out of stock alert](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/58f0ea96-a220-47e3-a682-9e683fd04557)

###### Detailed Product View
![product](https://user-images.githubusercontent.com/72359805/230922485-2206ef84-98bf-42fa-8365-c2e0c192ade0.PNG)

###### Shopping Cart 
![cart](https://user-images.githubusercontent.com/72359805/230922510-57753e47-0df0-4e5e-8fe4-a7bbb61e810b.PNG)

###### Preview order  
![place order](https://user-images.githubusercontent.com/72359805/230922503-9a7df6f3-7203-43ac-87a8-a6453476bcde.PNG)


<br>

### Place an order via PayPal API:  

###### Place order  
![place order paypal](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/37f789f4-a0e5-4870-b250-89228553b3dc)

###### Checkout steps - shipping
![shipping](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/7986aa25-75fd-4cfa-b234-3e7e0858f897)

###### Checkout steps - payment method
![payment method](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/6207865a-b308-41b7-bb26-7ca75bcbe39c)

###### Place an order with demo user via PayPal
![place order paypal  demo 2](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/e98e741a-9e6a-44fb-bc25-02ff4215987b)

###### Paid order
![place order paypal  demo 3](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/86d4ae07-2cd3-474f-a51d-7e77d8c11cff)


<br>

## User functionality:

###### User order history
![order history](https://user-images.githubusercontent.com/72359805/230922850-bf35dce7-eaea-4ff2-9d95-741a9b0edb77.PNG)

###### User edit profile
![edit profile](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/422c48d0-a035-4e0c-91b0-711b9918a2b0)

<br>

## Admin functionality:

###### Admin dashboard displaying real-time metrics: registered users, order count, and financial performance through total money orders
![Admin info](https://user-images.githubusercontent.com/72359805/230922856-8218eadd-3c44-4689-8710-5757060e9177.PNG)

###### Products list
![proudcts list](https://user-images.githubusercontent.com/72359805/230922896-699796f4-1268-441f-b5c1-417273d1aec9.PNG)

######  Edit product 
![edit product](https://user-images.githubusercontent.com/72359805/230922907-bb0abeb0-6cad-42d3-9629-238447091dbd.PNG)

######  All users orders list
![orders list](https://user-images.githubusercontent.com/72359805/230922948-31ea760e-cccf-4d6c-b4ce-9b9b5d964419.PNG)

<br> 

###### Search bar
![search](https://user-images.githubusercontent.com/72359805/230922982-83d66ae1-cc6d-4cca-b5be-b21c1f7c7628.PNG)


###### about us page
![about us](https://user-images.githubusercontent.com/72359805/230923017-44b75026-def1-40bf-af5f-7d8f2d76ee1b.PNG)

![about us2](https://user-images.githubusercontent.com/72359805/230923021-ee53f35c-7676-485a-93a7-5f53cb9eaec9.PNG)

###### Spinner Component showing the loading state

![loadingBox component](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/51546c31-6154-4802-9eed-ea4128915cd9)





<br>

## Setup Instructions
1. Clone the repository: `git clone [repository_url]`
2. Set up the MongoDB database and Firebase authentication.
3. Configure environment variables.
4. Run Backend-
```
$ cd our-website
$ cd backend
$ npm i
$ npm start
```

5. Run Frontend-
   
open new terminal
```
$ cd our-website
$ cd frontend
$ npm i
$ npm start
```

Seed Users and Products (backend)-
Run this on browser: http://localhost:5000/api/seed
(Will returns admin email, password and sample products).

Admin Login-
Run http://localhost:3000/signin

<br>

## 🔗 Connect with me 👩‍💻😊
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shani-bider/)
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://shanibider.github.io/Portfolio/)
[![gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shanibider@gmail.com)


<footer>
<p style="float:left; width: 20%;">
Copyright © Shani Bider, 2024
</p>
</footer>

## License

This project is licensed under the MIT License.
