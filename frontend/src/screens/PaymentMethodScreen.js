import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';   // Import the global store context



// Define the PaymentMethodScreen functional component - This screen allows the user to select a payment method for the order
export default function PaymentMethodScreen() {
    // Access the navigation functionality from React Router
  const navigate = useNavigate();


  // Extracting shippingAddress and paymentMethod from the global state.
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { shippingAddress, paymentMethod },  } = state;


  // Using useState hook to manage the local state of 'paymentMethodName'.
  const [paymentMethodName, setPaymentMethod] = useState (paymentMethod || 'PayPal');


   // useEffect to check if shippingAddress is available; if not, redirect to the shipping screen
  useEffect ( () => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);    // The effect runs when shippingAddress changes.
  


  // Event handler for form submission
  const submitHandler = (e) => {
    e.preventDefault ();    // used to stop this default behavior, allowing you to handle the form submission manually.
    // Dispatching an action to the global state using the ctxDispatch function. The action has a type of 'SAVE_PAYMENT_METHOD' and a payload containing the selected payment method (paymentMethodName).
    // This action handled by a reducer in the global state to update the state accordingly.
    ctxDispatch ({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    // storing the selected payment method in the browser's local storage. This is done for persistence, so that even if the user refreshes the page or comes back later, their selected payment method is remembered.
    localStorage.setItem ('paymentMethod', paymentMethodName);
    // Navigating to the place order screen
    navigate ('/placeorder');
  };





  // Rendering the PaymentMethodScreen component
  return (
    <div>
      {/* Displaying checkout steps for navigation */}
      <CheckoutSteps step1 step2 step3></CheckoutSteps>

      {/* Container for the payment method selection */}
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        {/* Form for selecting the payment method */}
        <Form onSubmit={submitHandler}>
          {/* PayPal radio button */}
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Google Pay"
              label="Google Pay"
              value="Google Pay"
              checked={paymentMethodName === 'Google Pay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>

    </div>
  );
}
