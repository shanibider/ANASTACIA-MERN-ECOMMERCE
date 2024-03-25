import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';


// Reducer function to handle state changes based on dispatched actions.
// responds to: 'FETCH_REQUEST', 'FETCH_SUCCESS', and 'FETCH_FAIL'.
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};





export default function OrderListScreen() {

  // useNavigate hook from React Router for programmatic navigation
  const navigate = useNavigate();

  // uses useContext hook to access global state (userInfo) from the Store context.
  const { state } = useContext(Store);
  const { userInfo } = state;

  // useReducer hook manages state (loading, error, orders) and dispatches actions using the reducer function.
  // Destructuring to extract values from the array returned by useReducer. { loading, error, orders } represents the state properties, and dispatch represents the dispatch function.
  // useReducer is used to manage state and actions with the reducer function.
  // The initial state is set with loading: true and error: ''.
  const [{ loading, error, orders }, dispatch] = useReducer (reducer, {
    loading: true,
    error: '',
  });


  // useEffect hook for asynchronous data fetching when the component mounts or userInfo changes.
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });        //dispatch PAY_REQUEST to show loading box
        // Fetch data from the /api/orders endpoint
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };

    fetchData();
  }, [userInfo]);




    // Component rendering
  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>USER ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              
              <tr key={order._id}>
                <td>{order._id.substring(0, 10)}</td>
                <td>{order.user.substring(0, 10)}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  {/* Utilizes the navigate function to create a button for navigating to the details page of each order. */}
                  <Button
                    type="button"
                    variant="light"
                    onClick = { () => {
                      navigate (`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
