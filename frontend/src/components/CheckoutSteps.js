import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// This functional component represents the checkout steps in the shopping cart process.
// It takes a props object, which includes step1, step2, step3, and step4 properties to indicate the current step's status.

export default function CheckoutSteps(props) {
  return (
        // Row arrange the checkout steps horizontally.
    <Row className="checkout-steps">
     {/* Each Col represents a step in the checkout process.
          The className is conditionally set to 'active' based on the corresponding step's status from props. (active defines in index.css)
          If the step is completed, it is marked as 'active'. */}
      <Col className= {props.step1 ? 'active' : ''} >Sign-In</Col>
      <Col className= {props.step2 ? 'active' : ''} >Shipping</Col>
      <Col className= {props.step3 ? 'active' : ''} >Payment</Col>
      <Col className= {props.step4 ? 'active' : ''} >Place Order</Col>
    </Row>
  );
}
