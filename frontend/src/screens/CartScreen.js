import React from 'react';
import { useContext } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';    // for managing the document head.
import { Store } from '../Store';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// CartScreen mainly deals with updating the cart, removing items, and providing a clear interface for the user to see and manage their shopping cart.
export default function CartScreen() {

  const navigate = useNavigate();  // sets up a navigation function using the useNavigate hook from React Router. Helps the component navigate to different pages.

  // useContext allows to use the context in a functional component.
  // Store is the context that we want to use. It is the context that we created in Store.js.
  // Store has two properties: state and dispatch. We are interested in the state and dispatch properties.
  // state has all the data that we want to share across the application. dispatch is a function that we use to send actions to the reducer.
  const { state, dispatch: ctxDispatch } = useContext (Store);
  const { cart: { cartItems }, } = state;

  // updateCartHandler is an async function that takes two arguments: item and quantity.
  // item is the product that the user wants to update, and quantity is the new quantity of the product.
  const updateCartHandler = async (item, quantity) => {
   // send an axois request to the server, to check if the product is in stock.
   // If the product is available, it dispatches an action (CART_ADD_ITEM) to update the cart with the new quantity.
   const { data } = await axios.get(`/api/products/${item._id}`, { quantity });
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',      //for + button on cart
      payload: { ...item, quantity }, //item beacuse we want to keep the same item and just change the quantity
    });
  };

  // called when the user wants to remove an item from the cart.
  const removeItemHandler = (item) => {
    // dispatches an action (CART_REMOVE_ITEM) to update the cart by removing the specified item.
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item }); //implement in Store.js
  };

  // called when the user wants to proceed to checkout.
  const checkoutHandler = () => {
    // go to the signin page, with a redirect to the shipping screen (passing a redirect query string parameter to the URL).
    // If the user is already authenticated, they'll be redirected directly; otherwise, they'll be prompted to sign in.
    navigate('/signin?redirect=/shipping');     //after ? is the query string. "redirect=/shipping" is the query string
  };

  return (
    <div>
      <Helmet>        {/* renders a title */}
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>      
      <Row>
      {/* sets the column size using the Bootstrap grid. Column should take up 8 out of 12 available grid columns on medium-sized screens. */}
        <Col md={8}>
          {/*if the cart is empty, show a message with a link to "/" to go shopping.
          if not, maps over the cartItems array and displays each item along with buttons to update the quantity, remove the item, and show the price. */}
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map ( (item) => (
                <ListGroup.Item key={item._id} className="my-3">
                  <Row className="align-items-center justify-content-between">
                  
                    {/* displays a summary of the cart in a Card */}
                    <Col md={4}>      
                      <img
                        src= {item.image}
                        alt= {item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>

                    {/*button to decrese + increase number of items in the cart*/}
                    <Col md={3} className="d-flex align-items-center">
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="primary"
                        size="sm"
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}

                      <span className="mx-2">{item.quantity}</span>{' '}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>

                    {/* item price */}
                    <Col md={3} className="d-flex align-items-center">
                      ${item.price}
                    </Col>


                    {/* remove item button */}
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="danger"
                        size="sm"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>

                  </Row>  {/* end of one item */}
                </ListGroup.Item>
              ))}       {/* end of map */}
            </ListGroup>
          )}
        </Col>

        {/*  displays a summary of the cart in a Card. Shows the subtotal (total quantity and price),
        and a button to proceed to checkout, which is disabled if the cart is empty. */}
        <Col md={4}>          {/* Column take up 4 out of 12 available grid columns on medium-sized screens. */}
          <Card>
            <Card.Body>            
              <ListGroup variant="flush"> {/* removes the default borders and rounded corners, giving cleaner look. */}
                <ListGroup.Item>        
                  <h3>
                  {/* reduce applied to the cartItems array, calculate the total quantity of items in the cart. 
                  (a, c)=>a+c.quantity: callback function provided to reduce. Takes two parameters 
                  (a for accumulator and c for each element in the array) and sums up the quantities of each item in the cart.
                  0: This is the initial value of the accumulator (a). */}
                    Subtotal 
                    ( {cartItems.reduce ( (a, c) => a + c.quantity, 0) } {' '}
                    items ) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(3)}    {/* multiplies the price of each item by its quantity before summing them up. */}
                  </h3>
                </ListGroup.Item>

                <ListGroup.Item>
                 {/* disabled is property of the button component that determines whether the button is disabled. */}
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}  
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>


              </ListGroup>
            </Card.Body>
          </Card>
        </Col> {/* end of the right col */}
      </Row>    {/* end of row from begining */}
    </div>
  );
}

/*
Using Context in `CartScreen`:
   - The `CartScreen` component wants to know what's in the global state (like the shopping cart items) and wants the ability to change it.
   - So it uses `useContext` to grab this information and the ability to make changes.

By using context and `useContext`, `CartScreen` can easily get information from the big container (global state) and use the messenger (dispatcher) to make changes when needed.
It's a convenient way to share and manage important data across different parts of the app.
*/