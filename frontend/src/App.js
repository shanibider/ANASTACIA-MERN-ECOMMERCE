import React, { useContext, useState, useEffect } from 'react';
import {
  BrowserRouter,
  BrowserRouter as Router,
  Form,
  Route,
  Routes,
} from 'react-router-dom';
// Import of specific components/screens
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import { Button, Container, Navbar } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { getError } from './utils';
import axios from 'axios';
import { Toast } from 'react-bootstrap';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { toast, ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import AboutUs from './screens/AboutUsScreen';
import HowToScreen from './screens/HowToScreen';

// This App component serves as the main structure for ECommerce web app, managing state, user authentication, navigation, and screen rendering based on routes.
// Contains the structure of the application, including routing, navigation, and state management. 

export default function App() {
  
  // *Store context* - used to manage global state and dispatch actions to update the state.
  // The useContext hook is used to access the global state and dispatch function from the Store context.
  // Destructuring state and dispatch from the Store context.
  // The state object contains cart and userInfo properties, which are used to manage the cart and user information.
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;  


  // signoutHandler function is used to sign out the user by dispatching a 'USER_SIGNOUT' action and removing user-related data from local storage.
  const signoutHandler = () => {    
    ctxDispatch ({ type: 'USER_SIGNOUT' });      // the type of action we going to dispatch
    localStorage.removeItem ('userInfo');        // remove user info from local storage
    localStorage.removeItem ('shippingAddress');
    localStorage.removeItem ('paymentMethod');
    // window.location.href = '/signin';        // Optionally redirect to a sign-in page
  };

// useState initializes a state variable 'categories' with an initial value of an empty array,
// The purpose of this state is to store the product categories fetched from the server.
// and to track whether the sidebar in the app is open or closed.
  const [sidebarIsOpen, setSidebarIsOpen] = useState (false);
  const [categories, setCategories] = useState ([]);

// The useEffect hook is used to fetch product categories when the component mounts.
 /* http://localhost:5000/api/products/categories give:
  [
    "HM",
    "Pants",
    "Shirts"
  ] */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // The request is made to the '/api/products/categories' endpoint, which returns an array of product categories.
        const { data } = await axios.get (`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        Toast.error(getError(err));
      }
    };
    fetchCategories();  // Call the fetchCategories function when the component mounts.
  }, []); // The empty array as the second argument ensures that the effect runs only *once* when the component mounts.



  // The component contains a header, sidebar, main section, and footer.
  // The header includes navigation links, a search box, and conditional rendering based on user authentication and admin status.
  // The sidebar displays product categories as links, based on whether it is open or closed.
  // The main section handles routing using react-router-dom, defining routes for different screens such as Home, Product, Cart, About Us, etc.
  // The main component is wrapped in <BrowserRouter> for navigation handling.
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        {/* header includes navigation links, a search box, and conditional rendering based on user authentication and admin status. */}
        <header>
          <Navbar className="navbar-custom" variant="dark" expand="lg">
            <Container>
              <Button
                variant="light"
                className="me-3"
                onClick= {() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand className="brand-name">Anastacia</Navbar.Brand>
              </LinkContainer>

              {/*header menu*/}
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />

                <Nav className="ml-auto">
                  <LinkContainer to="/about" className="nav-link">
                    <Navbar.Brand>About Us</Navbar.Brand>
                  </LinkContainer>

                  <LinkContainer to="/howto" className="nav-link">
                    <Navbar.Brand>How To..</Navbar.Brand>
                  </LinkContainer>

                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {/*number of items in cart based on quantity and not id prevent multiply the same  product
                        'cart'- cart objec, 'cartItems'- array within the cart object, 'reduce'- iterate over each item in the cartItems array and accumulate their quantities.
                          a: Accumulator. accumulates the result of the reduction.
                          c: Current item in the array.
                          a + c.quantity: It adds the quantity of the current item to the accumulator.
                          , 0: The 0 is the initial value of the accumulator (a). The reduce function starts with this value.
                        */}
                        {cart.cartItems.reduce ( (a, c) => a + c.quantity, 0 )}
                      </Badge>
                    )}
                  </Link>                  

                  {/* Conditional rendering based on whether a user is authenticated. If yes, a NavDropdown with user-related links is displayed;
                  otherwise, "Sign In" link is shown. */}
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item> User Profile </NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item> Order History </NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown.Divider />

                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>

                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}

                  {/*****ADMIN*****/}
                  {/* if userInfo exist and userInfo.isAdmin is true -> we render a admin-related links navDropDown */}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {/**********/}

                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        {/* side bar - displays product categories as links, based on whether it is open or closed.. */}
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map ((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{
                    pathname: '/search',
                    search: `?category=${category}`,
                  }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        {/* Main Section (Routing): 
        The Routes component handles routing using react-router-dom, defining routes for different screens such as Home, Product, Cart, About Us, etc. */}   
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/howto" element={<HowToScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              {/* <ProtectedRoute> is used for routes that need authentication*/}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>


              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              {/****End of Admin routes****/}

              <Route path="/" element={<HomeScreen />} />

            </Routes>
          </Container>
        </main>

        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}