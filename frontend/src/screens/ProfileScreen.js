import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';


// Reducer function to manage the state related to profile updates
const reducer = (state, action) => {
  switch (action.type) {
   // When a profile update request is initiated
   case 'UPDATE_REQUEST':
    return { ...state, loadingUpdate: true };
  // When a profile update is successful
  case 'UPDATE_SUCCESS':
    return { ...state, loadingUpdate: false };
  // When a profile update fails
  case 'UPDATE_FAIL':
    return { ...state, loadingUpdate: false };
  // Default case returns the current state
  default:
    return state;
}
};



// ProfileScreen functional component
export default function ProfileScreen() {

  // Access the user information from the global state using useContext
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // State variables to manage form input values
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [oldPassword] = useState(userInfo.password);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  // UseReducer to manage state related to profile updates
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });


  // Event handler for form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        // Send a PUT request to update the user profile
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
          oldPassword,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      // Dispatch an action for a successful profile update
      dispatch({
        type: 'UPDATE_SUCCESS',
      });

      // Update the user information in the global state
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      // Update user information in local storage for persistence
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');

    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };



  // Rendering the ProfileScreen component
  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>

            {/* Form for updating user profile */}
      <form onSubmit={submitHandler}>
              {/* Input for the user's name */}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Update</Button>
          
        </div>
      </form>
    </div>
  );
}
