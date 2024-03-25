import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Toast } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../Store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect'); //'/shipping'
  const redirect = redirectInUrl ? redirectInUrl : '/'; //if redirectInUrl exist, redirect is redirectInUrl, else redirect is '/'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //for userInfo-
  //we bring it from useContext, and extract state from it
  //than from state we extract userInfo
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault(); //prevent refreshing the page when user click on sign in button
    //send ajax request backend
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      //save user info in local storage
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  //useEffect for send an ajax request to get the dashboard data
  //try and catch beacuse we have to catch any error on ajax requests to backend
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email"></Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <Form.Group className="mb-3" controlId="password"></Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mb-3">
          <Button type="submit" className="sign-in-button">
            Sign In
          </Button>
        </div>
        <div className="mb-3">
          New customer? {''}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
