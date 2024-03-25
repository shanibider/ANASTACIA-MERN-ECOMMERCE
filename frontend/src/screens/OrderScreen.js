import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

// This component manages the process of fetching order details, handling payments with PayPal, and updating the order status to paid in the backend.

// This is a reducer function that manages the state for fetching and paying orders. It updates the state based on different action types.
// "dispatch ({ type: 'PAY_REQUEST' })" triggers the reducer function to update the state with loadingPay: true.
function reducer (state, action) {

  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    // Paypal payment related actions
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }

}



// OrderScreen component
export default function OrderScreen () {

  // Destructure values from the global state using useContext
  const { state } = useContext(Store);
  const { userInfo } = state;

    // Destructure values from the route parameters using useParams
  const params = useParams();
  const { id: orderId } = params; //destructuring orderId from params (and rename it to "id") (like: const id = params.orderId;)
  const navigate = useNavigate();

  // Define a reducer using useReducer to handle state updates (like state machine that transitions between different states based on actions).
  // Destructure state and dispatch. dispatch is a function that triggers state updates.
  const [{ loading, error, order, successPay, loadingPay }, dispatch] = useReducer (reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });






  // usePayPalScriptReducer to get the paypal script from paypal- that return the state of loading script ({isPending}) and function that load the script (PayPalDispatch)
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();


  // callback used in the PayPal integration to create a new order with the specified total price. 
  // call 'create' on actions.order and pass the amount based on the total price of the order (when we click on paypal button the price should be- order.totalPrice)
  function createOrder (data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;   // This step is essential for further processing or handling after the order has been created successfully.
      });
  }


  // Function to handle successful payment approval
  function onApprove (data, actions) {
    // uses the actions.order.capture() method provided by PayPal to finalize the payment.
    // After capturing the payment, it sends an asynchronous request to the backend to update the order status to "paid."
    return actions.order.capture().then(async function (details) {
      try {
        // dispatches a PAY_REQUEST action to indicate that the payment process is in progress. This used to show a loading box.
        dispatch({ type: 'PAY_REQUEST' });    // this is 'action.type' in reducer()

        // Call API to update order status to paid, it pass the 'deatils' that contain the user information and payment information in the paypal site, and third it pass the authorization (because its an authorization api)
        const { data } = await axios.put(`/api/orders/${order._id}/pay`, details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );

      // If the API call is successful, dispatches a PAY_SUCCESS action with the received data, indicating a successful payment. Also displays a success toast message.
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  // Function to handle payment error
  function onError(err) {
    toast.error(getError(err));
  }



  // useEffect to handling handling order-related logic and manage PayPal script loading
  useEffect(() => {
    // Function to fetch order details from the backend
    const fetchOrder = async () => {
      try {
        // Dispatch FETCH_REQUEST to show loading box.
        // (dispatch is a function that triggers state updates, in the reducer function).
        dispatch({ type: 'FETCH_REQUEST' });
        // Fetch order details from the backend
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        // Update state on successful response (dispatch FETCH_SUCCESS), and pass the data (order data) from backend for this action and pass it to reducer
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

  
    // Redirect to login if userInfo is null
    if (!userInfo) {
      return navigate('/login');
    }
    

    // This conditions check whether to fetch order details or load the PayPal script based on the current state.
    // If the order ID is not present or the payment is successful or the order ID is present but does not match the current order ID (This situation may occur after a successful payment, and the order details for the newly paid order need to be fetched), it calls the fetchOrder function.   
     if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();       // calls the fetchOrder function to send an AJAX request to get order details from the backend.
      
      // If successPay is true, it dispatches a PAY_RESET action to reset the payment status.
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    }

    // Load PayPal script if order is present and IDs match
    else {
      // If the conditions for loading the PayPal script are met, it defines an async function loadPaypalScript.
      // sends an AJAX request to the backend to get the PayPal client ID.
      // After receiving the client ID, it dispatches configuration options for the PayPal script using paypalDispatch.
      // sets the loading status of the PayPal script to 'pending'.
      // The loadPaypalScript function is then invoked, loading the PayPal script.

      // responsible for fetching the PayPal client ID from the backend and dispatching actions to configure the PayPal script. (crucial function).
      const loadPaypalScript = async () => {

        // Fetch PayPal client ID from the backend. 
        // The received data is destructured to extract the clientId.
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        // Dispatches an action to the PayPal script reducer (paypalDispatch) to reset the options with the new PayPal configuration.
        // The action type is 'resetOptions', and it includes the client-id and currency as part of the configuration.
        paypalDispatch ({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });

        // Dispatches another action to the PayPal script reducer to set the loading status.
       // The action type is 'setLoadingStatus', and it sets the value to 'pending'.
        paypalDispatch ({ type: 'setLoadingStatus', value: 'pending' });
      };

      // Load PayPal script 
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]); //dependencies array, useEffect will run when one of these dependencies change.



/*
    UseEffect in simple:
    When visit the order page, the component starts in a loading state (loading: true).
    The useEffect runs and triggers the fetchOrder function, which tries to get order details from the server.
    While fetching, it sets the state to indicate loading (loading: true).
    If successful, it updates the state with the fetched order data (loading: false, order: fetchedData).
    If there's an error during fetching, it updates the state to show the error (loading: false, error: errorMessage).
    The reducer function helps manage these state changes.
    */




    

  // JSX to render loading, error, or order details
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    // render order details
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {/*render each item in the ListGroup.Item */}
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      {/*new column*/}
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      {/*new column*/}
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      {/*new column*/}
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        {/*new column*/}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/*conditional rendering-
                if order is not paid show the paypal button- so create a ListItem and check isPending
                //isPending (coming from reactPayPal.js)- if its true show loadingBox,
                otherwise show the paypal button from reactPayPal.js and pass 3 props
                */}
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder} //run when you click on the paypal button
                          onApprove={onApprove} //run when you have a succedful payment
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {/*if loadingPay is true show LoadingBox*/}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
